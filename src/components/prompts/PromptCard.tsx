import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Copy, Eye, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PromptCardProps {
    prompt: {
        id: string
        title: string
        description: string | null
        content: string
        visibility: string
        created_at: string
        usage_count?: number
        tags?: { name: string; color: string }[]
        profiles?: { full_name: string | null } | null
    }
    teamSlug: string
}

export function PromptCard({ prompt, teamSlug }: PromptCardProps) {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-medium leading-none">
                        <Link href={`/${teamSlug}/prompts/${prompt.id}`} className="hover:underline">
                            {prompt.title}
                        </Link>
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        by {prompt.profiles?.full_name || 'Unknown'} • {formatDistanceToNow(new Date(prompt.created_at), { addSuffix: true })}
                    </p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {prompt.description || prompt.content}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {prompt.tags?.map((tag) => (
                        <Badge key={tag.name} variant="secondary" style={{ backgroundColor: tag.color + '20', color: tag.color }}>
                            {tag.name}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="border-t p-4">
                <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <Eye className="mr-1 h-3 w-3" />
                            {prompt.usage_count || 0}
                        </div>
                        <Badge variant="outline" className="capitalize">{prompt.visibility}</Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
