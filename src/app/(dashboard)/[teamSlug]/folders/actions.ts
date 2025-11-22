'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createFolder(teamSlug: string, name: string, parentId: string | null) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { data: team } = await supabase
        .from('teams')
        .select('id')
        .eq('slug', teamSlug)
        .single()

    if (!team) return { error: 'Team not found' }

    const { error } = await supabase
        .from('folders')
        .insert({
            name,
            team_id: team.id,
            parent_id: parentId,
            created_by: user.id,
        })

    if (error) return { error: error.message }

    revalidatePath(`/${teamSlug}/folders`)
    return { success: true }
}

export async function deleteFolder(teamSlug: string, folderId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId)

    if (error) return { error: error.message }

    revalidatePath(`/${teamSlug}/folders`)
    return { success: true }
}
