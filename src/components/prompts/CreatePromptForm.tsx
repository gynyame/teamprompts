'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { promptSchema, PromptFormValues } from '@/lib/validations/prompt'
import { createPrompt } from '@/app/(dashboard)/[teamSlug]/prompts/actions'
import { PromptEditor } from '@/components/prompts/PromptEditor'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function CreatePromptForm({ teamSlug, folders }: { teamSlug: string; folders: any[] }) {
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(promptSchema),
        defaultValues: {
            title: '',
            content: '',
            description: '',
            visibility: 'team',
            variables: [],
        },
    })

    async function onSubmit(data: any) {
        const result = await createPrompt(teamSlug, data)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Prompt created successfully')
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Create Prompt</h3>
                <p className="text-sm text-muted-foreground">
                    Add a new prompt to your team's library.
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
                            {form.formState.isSubmitting ? 'Creating...' : 'Create Prompt'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
