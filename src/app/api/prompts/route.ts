import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get all teams user is part of
    const { data: memberships } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)

    if (!memberships || memberships.length === 0) {
        return NextResponse.json([])
    }

    const teamIds = memberships.map(m => m.team_id)

    // Fetch prompts from all teams
    const { data: prompts } = await supabase
        .from('prompts')
        .select('id, title, content, team_id')
        .in('team_id', teamIds)
        .order('created_at', { ascending: false })

    return NextResponse.json(prompts)
}
