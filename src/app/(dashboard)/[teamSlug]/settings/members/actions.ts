'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateMemberRole(teamSlug: string, userId: string, newRole: string) {
    const supabase = await createClient()

    // Check if current user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data: team } = await supabase
        .from('teams')
        .select('id')
        .eq('slug', teamSlug)
        .single()

    if (!team) return { error: 'Team not found' }

    // Verify requester is admin
    const { data: requesterRole } = await supabase
        .from('team_members')
        .select('role')
        .eq('team_id', team.id)
        .eq('user_id', user.id)
        .single()

    if (requesterRole?.role !== 'admin') {
        return { error: 'Unauthorized: Only admins can change roles' }
    }

    const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('team_id', team.id)
        .eq('user_id', userId)

    if (error) return { error: error.message }

    revalidatePath(`/${teamSlug}/settings/members`)
    return { success: true }
}

export async function removeMember(teamSlug: string, userId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data: team } = await supabase
        .from('teams')
        .select('id')
        .eq('slug', teamSlug)
        .single()

    if (!team) return { error: 'Team not found' }

    // Verify requester is admin
    const { data: requesterRole } = await supabase
        .from('team_members')
        .select('role')
        .eq('team_id', team.id)
        .eq('user_id', user.id)
        .single()

    if (requesterRole?.role !== 'admin') {
        return { error: 'Unauthorized: Only admins can remove members' }
    }

    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', team.id)
        .eq('user_id', userId)

    if (error) return { error: error.message }

    revalidatePath(`/${teamSlug}/settings/members`)
    return { success: true }
}
