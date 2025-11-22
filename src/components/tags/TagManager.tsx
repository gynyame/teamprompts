'use client'

import { useState } from 'react'
import { createTag, deleteTag } from '@/app/(dashboard)/[teamSlug]/settings/tags/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Trash, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface TagManagerProps {
    tags: any[]
    teamSlug: string
}

const COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981',
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'
]

export function TagManager({ tags, teamSlug }: TagManagerProps) {
    const [newName, setNewName] = useState('')
    const [selectedColor, setSelectedColor] = useState(COLORS[6])

    const handleCreate = async () => {
        if (!newName.trim()) return

        const result = await createTag(teamSlug, newName, selectedColor)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Tag created')
            setNewName('')
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Delete this tag?')) {
            const result = await deleteTag(teamSlug, id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Tag deleted')
            }
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-end gap-4 border p-4 rounded-lg bg-muted/50">
                <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium">Tag Name</label>
                    <Input
                        placeholder="e.g., Marketing"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Color</label>
                    <div className="flex gap-1">
                        {COLORS.map(color => (
                            <button
                                key={color}
                                className={`w-6 h-6 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                                onClick={() => setSelectedColor(color)}
                            />
                        ))}
                    </div>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Tag
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {tags.map(tag => (
                    <div key={tag.id} className="flex items-center justify-between p-3 border rounded-md">
                        <Badge variant="secondary" style={{ backgroundColor: tag.color + '20', color: tag.color }}>
                            {tag.name}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600" onClick={() => handleDelete(tag.id)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                {tags.length === 0 && (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                        No tags created yet.
                    </div>
                )}
            </div>
        </div>
    )
}
