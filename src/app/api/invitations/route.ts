import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const inviteSchema = z.object({
    teamSlug: z.string(),
    email: z.string().email(),
    role: z.enum(['admin', 'member', 'viewer']),
})

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const json = await request.json()
        const { teamSlug, email, role } = inviteSchema.parse(json)

        const { data: team } = await supabase
            .from('teams')
            .select('id, name')
            .eq('slug', teamSlug)
            .single()

        if (!team) {
            return NextResponse.json({ error: 'Team not found' }, { status: 404 })
        }

        // Check if user is admin
        const { data: member } = await supabase
            .from('team_members')
            .select('role')
            .eq('team_id', team.id)
            .eq('user_id', user.id)
            .single()

        if (member?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Create invitation
        const { data: invitation, error } = await supabase
            .from('invitations')
            .insert({
                team_id: team.id,
                email,
                role,
                token: crypto.randomUUID(), // Simple token generation
                invited_by: user.id,
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        // Mock email sending
        console.log(`[MOCK EMAIL] To: ${email}, Subject: Join ${team.name} on TeamPrompts`)
        console.log(`[MOCK EMAIL] Link: http://localhost:3000/invite/${invitation.token}`)

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
