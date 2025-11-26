import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditPromptForm } from '@/components/prompts/EditPromptForm'
import { getFolders } from '@/app/(dashboard)/[teamSlug]/folders/actions'

export default async function EditPromptPage({
    params,
}: {
    params: Promise<{ teamSlug: string; id: string }>
}) {
    const { teamSlug, id } = await params
    const supabase = await createClient()

    const { data: prompt } = await supabase
        .from('prompts')
        .select(`
      *,
      prompt_variables(*)
    `)
        .eq('id', id)
        .single()

    if (!prompt) {
        notFound()
    }

    const folders = await getFolders(teamSlug)

    return <EditPromptForm teamSlug={teamSlug} prompt={prompt} folders={folders} />
}
