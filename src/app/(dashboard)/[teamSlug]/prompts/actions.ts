'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { promptSchema } from '@/lib/validations/prompt'

export async function createPrompt(teamSlug: string, formData: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Get team ID from slug
    const { data: team } = await supabase
        .from('teams')
        .select('id')
        .eq('slug', teamSlug)
        .single()

    if (!team) {
        return { error: 'Team not found' }
    }

    // Validate input
    const validated = promptSchema.safeParse(formData)

    if (!validated.success) {
        return { error: 'Invalid input', details: validated.error.flatten() }
    }

    const { title, content, description, visibility, variables, folder_id } = validated.data

    // Create prompt
    const { data: prompt, error: promptError } = await supabase
        .from('prompts')
        .insert({
            team_id: team.id,
            created_by: user.id,
            title,
            content,
            description,
            visibility,
            folder_id,
        })
        .select()
        .single()

    if (promptError) {
        return { error: promptError.message }
    }

    // Create variables if any
    if (variables && variables.length > 0) {
        const { error: varError } = await supabase
            .from('prompt_variables')
            .insert(
                variables.map(v => ({
                    prompt_id: prompt.id,
                    name: v.name,
                    default_value: v.default_value,
                    description: v.description,
                }))
            )

        if (varError) {
            // Don't fail the whole request, just log error (or return warning)
            console.error('Error creating variables:', varError)
        }
    }

    revalidatePath(`/${teamSlug}/prompts`)
    redirect(`/${teamSlug}/prompts`)
}

export async function trackUsage(promptId: string, action: 'view' | 'copy' | 'use') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    // Get prompt to find team_id
    const { data: prompt } = await supabase
        .from('prompts')
        .select('team_id')
        .eq('id', promptId)
        .single()

    if (!prompt) return

    await supabase
        .from('prompt_usage')
        .insert({
            prompt_id: promptId,
            user_id: user.id,
            team_id: prompt.team_id,
            action,
        })
}

export async function updatePrompt(teamSlug: string, promptId: string, formData: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Validate input
    const validated = promptSchema.safeParse(formData)

    if (!validated.success) {
        return { error: 'Invalid input', details: validated.error.flatten() }
    }

    const { title, content, description, visibility, variables, folder_id } = validated.data

    // Update prompt
    const { error: promptError } = await supabase
        .from('prompts')
        .update({
            title,
            content,
            description,
            visibility,
            folder_id,
            updated_at: new Date().toISOString(),
        })
        .eq('id', promptId)

    if (promptError) {
        return { error: promptError.message }
    }

    // Update variables
    // First delete existing ones (simple approach)
    await supabase.from('prompt_variables').delete().eq('prompt_id', promptId)

    // Then insert new ones
    if (variables && variables.length > 0) {
        const { error: varError } = await supabase
            .from('prompt_variables')
            .insert(
                variables.map(v => ({
                    prompt_id: promptId,
                    name: v.name,
                    default_value: v.default_value,
                    description: v.description,
                }))
            )

        if (varError) {
            console.error('Error updating variables:', varError)
        }
    }

    revalidatePath(`/${teamSlug}/prompts/${promptId}`)
    revalidatePath(`/${teamSlug}/prompts`)
    redirect(`/${teamSlug}/prompts/${promptId}`)
}

export async function deletePrompt(teamSlug: string, promptId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId)

    if (error) return { error: error.message }

    revalidatePath(`/${teamSlug}/prompts`)
    redirect(`/${teamSlug}/prompts`)
}
