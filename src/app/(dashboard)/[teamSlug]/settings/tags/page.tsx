import { createClient } from '@/lib/supabase/server'
import { TagManager } from '@/components/tags/TagManager'

export default async function TagsPage({ params }: { params: Promise<{ teamSlug: string }> }) {
    const { teamSlug } = await params
    const supabase = await createClient()

    const { data: team } = await supabase
        .from('teams')
        .select('id')
        .eq('slug', teamSlug)
        .single()

    if (!team) return <div>Team not found</div>

    const { data: tags } = await supabase
        .from('tags')
        .select('*')
        .eq('team_id', team.id)
        .order('name')

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Tags</h2>
                <p className="text-muted-foreground">
                    Manage tags for your team's prompts.
                </p>
            </div>
            <TagManager tags={tags || []} teamSlug={teamSlug} />
        </div>
    )
}
