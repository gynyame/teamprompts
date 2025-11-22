import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PromptCard } from '@/components/prompts/PromptCard'

export default async function PromptsPage({
    params,
    searchParams,
}: {
    params: Promise<{ teamSlug: string }>
    searchParams: Promise<{ search?: string }>
}) {
    const { teamSlug } = await params
    const { search } = await searchParams
    const supabase = await createClient()

    // Get team ID
    const { data: team } = await supabase
        .from('teams')
        .select('id')
        .eq('slug', teamSlug)
        .single()

    if (!team) {
        return <div>Team not found</div>
    }

    // Build query
    let query = supabase
        .from('prompts')
        .select(`
      *,
      profiles(full_name),
      tags(name, color)
    `)
        .eq('team_id', team.id)
        .order('created_at', { ascending: false })

    if (search) {
        query = query.textSearch('search_vector', search)
    }

    const { data: prompts } = await query

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Prompts</h2>
                    <p className="text-muted-foreground">
                        Manage and discover prompts for your team.
                    </p>
                </div>
                <Button asChild>
                    <Link href={`/${teamSlug}/prompts/new`}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Prompt
                    </Link>
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <form className="flex-1">
                    <Input
                        name="search"
                        placeholder="Search prompts..."
                        defaultValue={search}
                        className="max-w-sm"
                    />
                </form>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {prompts?.map((prompt) => (
                    // @ts-ignore
                    <PromptCard key={prompt.id} prompt={prompt} teamSlug={teamSlug} />
                ))}
                {prompts?.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-12">
                        No prompts found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
