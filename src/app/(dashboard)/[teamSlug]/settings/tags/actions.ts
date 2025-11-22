'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createTag(teamSlug: string, name: string, color: string) {
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
        .from('tags')
        .insert({
            name,
            color,
            team_id: team.id,
        })

    if (error) return { error: error.message }

    revalidatePath(`/${teamSlug}/settings/tags`)
    return { success: true }
}

export async function deleteTag(teamSlug: string, tagId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)

    if (error) return { error: error.message }

    revalidatePath(`/${teamSlug}/settings/tags`)
    return { success: true }
}
