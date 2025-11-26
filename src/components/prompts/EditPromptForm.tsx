'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { promptSchema } from '@/lib/validations/prompt'
import { updatePrompt } from '@/app/(dashboard)/[teamSlug]/prompts/actions'
import { PromptEditor } from '@/components/prompts/PromptEditor'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface EditPromptFormProps {
    teamSlug: string
    prompt: any
    folders: any[]
}

export function EditPromptForm({ teamSlug, prompt, folders }: EditPromptFormProps) {
    const router = useRouter()

    // Transform variables to match schema if needed
    const variables = prompt.prompt_variables?.map((v: any) => ({
        name: v.name,
        default_value: v.default_value || '',
        description: v.description || ''
    })) || []

    const form = useForm({
        resolver: zodResolver(promptSchema),
        defaultValues: {
            title: prompt.title,
            content: prompt.content,
            description: prompt.description || '',
            visibility: prompt.visibility,
            folder_id: prompt.folder_id || 'none', // Handle null as 'none' or undefined
            variables: variables,
        },
    })

    async function onSubmit(data: any) {
        // Handle 'none' for folder_id
        if (data.folder_id === 'none') {
            data.folder_id = null
        }

        const result = await updatePrompt(teamSlug, prompt.id, data)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Prompt updated successfully')
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Edit Prompt</h3>
                <p className="text-sm text-muted-foreground">
                    Update your prompt details.
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* @ts-ignore */}
                    <PromptEditor form={form} folders={folders} />
                    <div className="flex justify-end space-x-4">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
