'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addComment(teamSlug: string, promptId: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    if (!content.trim()) return { error: 'Comment cannot be empty' }

    const { error } = await supabase
        .from('comments')
        .insert({
            prompt_id: promptId,
            user_id: user.id,
            content,
        })

    if (error) return { error: error.message }

    revalidatePath(`/${teamSlug}/prompts/${promptId}`)
    return { success: true }
}

export async function deleteComment(teamSlug: string, promptId: string, commentId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id) // Only allow deleting own comments for now

    if (error) return { error: error.message }

    revalidatePath(`/${teamSlug}/prompts/${promptId}`)
    return { success: true }
}
