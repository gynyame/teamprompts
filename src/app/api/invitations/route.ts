import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendInvitationEmail } from '@/lib/email'

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
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        // Send email using Resend
        const { error: emailError } = await sendInvitationEmail({
            email,
            teamName: team.name,
            inviterName: user.user_metadata.full_name || user.email || 'A team member',
            token: invitation.token,
        })

        if (emailError) {
            console.error('Failed to send email:', emailError)
            // We don't fail the request if email fails, but we log it.
            // Ideally we might want to return a warning or retry.
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
