import { createClient } from '@/lib/supabase/server'
import { InviteMemberDialog } from '@/components/teams/InviteMemberDialog'
import { MemberList } from '@/components/teams/MemberList'

export default async function MembersPage({ params }: { params: Promise<{ teamSlug: string }> }) {
    const { teamSlug } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: team } = await supabase
        .from('teams')
        .select('id')
        .eq('slug', teamSlug)
        .single()

    if (!team) return <div>Team not found</div>

    const { data: members } = await supabase
        .from('team_members')
        .select(`
      user_id,
      role,
      profiles (
        full_name,
        avatar_url
      )
    `)
        .eq('team_id', team.id)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Team Members</h2>
                    <p className="text-muted-foreground">
                        Manage who has access to this team.
                    </p>
                </div>
                <InviteMemberDialog teamSlug={teamSlug} />
            </div>

            <MemberList
                // @ts-ignore
                members={members || []}
                teamSlug={teamSlug}
                currentUserId={user?.id || ''}
            />
        </div>
    )
}
