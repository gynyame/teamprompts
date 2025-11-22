'use client'

import * as React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { UseFormReturn } from 'react-hook-form'
import { PromptFormValues } from '@/lib/validations/prompt'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

interface PromptEditorProps {
    form: UseFormReturn<PromptFormValues>
    className?: string
}

export function PromptEditor({ form, className }: PromptEditorProps) {
    const content = form.watch('content')

    // Simple variable detection
    const variables = React.useMemo(() => {
        const matches = content?.match(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g) || []
        return Array.from(new Set(matches.map(m => m.slice(1, -1))))
    }, [content])

    // Update variables in form when content changes
    React.useEffect(() => {
        const currentVars = form.getValues('variables') || []
        const newVars = variables.map(name => {
            const existing = currentVars.find(v => v.name === name)
            return existing || { name, default_value: '', description: '' }
        })
        // Only update if different to avoid infinite loops
        if (JSON.stringify(currentVars) !== JSON.stringify(newVars)) {
            form.setValue('variables', newVars)
        }
    }, [variables, form])

    return (
        <div className={cn("space-y-8", className)}>
            <div className="grid gap-4 md:grid-cols-2">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., SEO Blog Post Generator" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Visibility</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select visibility" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="private">Private</SelectItem>
                                        <SelectItem value="team">Team</SelectItem>
                                        <SelectItem value="public">Public</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Input placeholder="Brief description of what this prompt does..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Prompt Content</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <TextareaAutosize
                                    {...field}
                                    minRows={10}
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-none"
                                    placeholder="Write your prompt here. Use {variable} for dynamic inputs."
                                />
                            </div>
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                            Detected variables: {variables.length > 0 ? variables.join(', ') : 'None'}
                        </p>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
