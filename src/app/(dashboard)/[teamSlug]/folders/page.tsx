import { createClient } from '@/lib/supabase/server'
import { FoldersManager } from '@/components/folders/FoldersManager'

export default async function FoldersPage({ params }: { params: Promise<{ teamSlug: string }> }) {
    const { teamSlug } = await params
    const supabase = await createClient()

    const { data: team } = await supabase
        .from('teams')
        .select('id')
        .eq('slug', teamSlug)
        .single()

    if (!team) return <div>Team not found</div>

    const { data: folders } = await supabase
        .from('folders')
        .select('*')
        .eq('team_id', team.id)
        .order('name')

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Folders</h2>
                <p className="text-muted-foreground">
                    Organize your prompts into folders.
                </p>
            </div>
            <FoldersManager folders={folders || []} teamSlug={teamSlug} />
        </div>
    )
}
