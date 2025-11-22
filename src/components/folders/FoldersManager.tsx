'use client'

import { useState } from 'react'
import { FolderTree } from '@/components/folders/FolderTree'
import { createFolder, deleteFolder } from '@/app/(dashboard)/[teamSlug]/folders/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface FoldersManagerProps {
    folders: any[]
    teamSlug: string
}

export function FoldersManager({ folders, teamSlug }: FoldersManagerProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newFolderName, setNewFolderName] = useState('')
    const [parentId, setParentId] = useState<string | null>(null)

    // Transform flat list to tree
    const buildTree = (items: any[], parentId: string | null = null): any[] => {
        return items
            .filter(item => item.parent_id === parentId)
            .map(item => ({
                ...item,
                children: buildTree(items, item.id)
            }))
    }

    const folderTree = buildTree(folders)

    const handleCreate = async () => {
        if (!newFolderName.trim()) return

        const result = await createFolder(teamSlug, newFolderName, parentId)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Folder created')
            setIsCreateOpen(false)
            setNewFolderName('')
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure? This will delete all subfolders and prompts inside.')) {
            const result = await deleteFolder(teamSlug, id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Folder deleted')
            }
        }
    }

    return (
        <div className="grid gap-6">
            <div className="border rounded-lg p-4 min-h-[400px]">
                <FolderTree
                    folders={folderTree}
                    onCreate={(pid) => {
                        setParentId(pid)
                        setIsCreateOpen(true)
                    }}
                    onDelete={handleDelete}
                />
                {folders.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No folders yet. Click + to create one.
                    </div>
                )}
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Folder</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            placeholder="Folder Name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
