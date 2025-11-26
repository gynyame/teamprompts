import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyButton } from '@/components/prompts/CopyButton'
import { DeletePromptButton } from '@/components/prompts/DeletePromptButton'

import { CommentSection } from '@/components/prompts/CommentSection'

export default async function PromptDetailPage({
    params,
}: {
    params: Promise<{ teamSlug: string; id: string }>
}) {
    const { teamSlug, id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: prompt } = await supabase
        .from('prompts')
        .select(`
      *,
      profiles(full_name),
      tags(name, color),
      prompt_variables(*)
    `)
        .eq('id', id)
        .single()

    if (!prompt) {
        notFound()
    }

    const { data: comments } = await supabase
        .from('comments')
        .select(`
      *,
      profiles(full_name, avatar_url)
    `)
        .eq('prompt_id', id)
        .order('created_at', { ascending: true })

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">{prompt.title}</h1>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>by {prompt.profiles?.full_name || 'Unknown'}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(prompt.created_at), { addSuffix: true })}</span>
                        <span>•</span>
                        <Badge variant="outline" className="capitalize">{prompt.visibility}</Badge>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Link href={`/${teamSlug}/prompts/${prompt.id}/edit`}>
                        <Button variant="outline">Edit</Button>
                    </Link>
                    <CopyButton content={prompt.content} promptId={prompt.id} />
                    <DeletePromptButton teamSlug={teamSlug} promptId={prompt.id} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
                                {prompt.content}
                            </pre>
                        </CardContent>
                    </Card>

                    {prompt.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{prompt.description}</p>
                            </CardContent>
                        </Card>
                    )}

                    <div className="pt-6 border-t">
                        <CommentSection
                            // @ts-ignore
                            comments={comments || []}
                            promptId={prompt.id}
                            teamSlug={teamSlug}
                            currentUserId={user?.id || ''}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Variables</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {prompt.prompt_variables && prompt.prompt_variables.length > 0 ? (
                                <ul className="space-y-2">
                                    {prompt.prompt_variables.map((v: any) => (
                                        <li key={v.id} className="text-sm">
                                            <span className="font-mono font-bold">{v.name}</span>
                                            {v.description && <span className="text-muted-foreground"> - {v.description}</span>}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">No variables defined.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {prompt.tags?.map((tag: any) => (
                                    <Badge key={tag.name} variant="secondary" style={{ backgroundColor: tag.color + '20', color: tag.color }}>
                                        {tag.name}
                                    </Badge>
                                ))}
                                {(!prompt.tags || prompt.tags.length === 0) && (
                                    <p className="text-sm text-muted-foreground">No tags.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
