'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { formatDistanceToNow } from 'date-fns'
import { addComment, deleteComment } from '@/app/(dashboard)/[teamSlug]/prompts/[id]/comments/actions'
import { toast } from 'sonner'
import { Trash } from 'lucide-react'

interface Comment {
    id: string
    content: string
    created_at: string
    user_id: string
    profiles: {
        full_name: string | null
        avatar_url: string | null
    }
}

interface CommentSectionProps {
    comments: Comment[]
    promptId: string
    teamSlug: string
    currentUserId: string
}

export function CommentSection({ comments, promptId, teamSlug, currentUserId }: CommentSectionProps) {
    const [newComment, setNewComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!newComment.trim()) return

        setIsSubmitting(true)
        const result = await addComment(teamSlug, promptId, newComment)
        setIsSubmitting(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            setNewComment('')
            toast.success('Comment added')
        }
    }

    const handleDelete = async (commentId: string) => {
        if (confirm('Delete this comment?')) {
            const result = await deleteComment(teamSlug, promptId, commentId)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Comment deleted')
            }
        }
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Comments</h3>

            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-4">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.profiles?.avatar_url || ''} />
                            <AvatarFallback>{comment.profiles?.full_name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">{comment.profiles?.full_name || 'Unknown User'}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                                {comment.user_id === currentUserId && (
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-600" onClick={() => handleDelete(comment.id)}>
                                        <Trash className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{comment.content}</p>
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <p className="text-sm text-muted-foreground">No comments yet.</p>
                )}
            </div>

            <div className="space-y-2">
                <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={isSubmitting || !newComment.trim()}>
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
