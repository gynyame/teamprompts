import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TopPromptsProps {
    prompts: { title: string; usage_count: number; visibility: string }[]
}

export function TopPrompts({ prompts }: TopPromptsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Prompts</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {prompts.map((prompt, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{prompt.title}</p>
                                <Badge variant="outline" className="text-xs capitalize">{prompt.visibility}</Badge>
                            </div>
                            <div className="font-medium">{prompt.usage_count} uses</div>
                        </div>
                    ))}
                    {prompts.length === 0 && (
                        <p className="text-sm text-muted-foreground">No data available.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
