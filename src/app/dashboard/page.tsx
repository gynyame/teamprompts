import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user's teams
    const { data: members } = await supabase
        .from('team_members')
        .select('team_id, teams(slug)')
        .eq('user_id', user.id)
        .limit(1)

    if (members && members.length > 0) {
        const team = members[0].teams
        // @ts-ignore
        redirect(`/${team.slug}/prompts`)
    } else {
        redirect('/teams/new')
    }
}
