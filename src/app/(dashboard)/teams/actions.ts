'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const createTeamSchema = z.object({
    name: z.string().min(3).max(50),
})

export async function createTeam(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const name = formData.get('name') as string
    const validated = createTeamSchema.safeParse({ name })

    if (!validated.success) {
        return { error: 'Invalid input' }
    }

    // Generate slug
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    if (slug.startsWith('-')) slug = slug.slice(1)
    if (slug.endsWith('-')) slug = slug.slice(0, -1)

    // Check uniqueness (simple version, append random string if exists)
    const { data: existing } = await supabase
        .from('teams')
        .select('id')
        .eq('slug', slug)
        .single()

    if (existing) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`
    }

    // Create team
    const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
            name,
            slug,
            created_by: user.id,
        })
        .select()
        .single()

    if (teamError) {
        return { error: teamError.message }
    }

    // Add user as admin
    const { error: memberError } = await supabase
        .from('team_members')
        .insert({
            team_id: team.id,
            user_id: user.id,
            role: 'admin',
        })

    if (memberError) {
        // Cleanup team if member creation fails
        await supabase.from('teams').delete().eq('id', team.id)
        return { error: memberError.message }
    }

    revalidatePath('/', 'layout')
    redirect(`/${team.slug}/prompts`)
}
