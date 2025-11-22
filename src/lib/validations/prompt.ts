import { z } from 'zod'

export const promptSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
    content: z.string().min(1, 'Content is required').max(10000, 'Content must be less than 10000 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
    folder_id: z.string().uuid().optional().nullable(),
    tags: z.array(z.string()).optional(),
    visibility: z.enum(['private', 'team', 'public']),
    variables: z.array(z.object({
        name: z.string(),
        default_value: z.string().optional(),
        description: z.string().optional()
    })).optional()
})

export type PromptFormValues = z.infer<typeof promptSchema>
