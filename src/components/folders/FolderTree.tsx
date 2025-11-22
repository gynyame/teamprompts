'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, Folder, FolderOpen, MoreHorizontal, Plus, Trash, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface FolderNode {
    id: string
    name: string
    children?: FolderNode[]
}

interface FolderTreeProps {
    folders: FolderNode[]
    onSelect?: (folderId: string) => void
    onCreate?: (parentId: string | null) => void
    onRename?: (folderId: string, newName: string) => void
    onDelete?: (folderId: string) => void
}

export function FolderTree({ folders, onSelect, onCreate, onRename, onDelete }: FolderTreeProps) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-1">
                <span className="text-sm font-medium text-muted-foreground">Folders</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onCreate?.(null)}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            {folders.map(folder => (
                <FolderItem key={folder.id} folder={folder} level={0} onSelect={onSelect} onCreate={onCreate} onRename={onRename} onDelete={onDelete} />
            ))}
        </div>
    )
}

function FolderItem({ folder, level, onSelect, onCreate, onRename, onDelete }: { folder: FolderNode, level: number } & Omit<FolderTreeProps, 'folders'>) {
    const [isOpen, setIsOpen] = useState(false)
    const hasChildren = folder.children && folder.children.length > 0

    return (
        <div>
            <div
                className={cn(
                    "flex items-center justify-between py-1 px-2 rounded-md hover:bg-accent group cursor-pointer",
                    level > 0 && "ml-4"
                )}
                onClick={() => {
                    setIsOpen(!isOpen)
                    onSelect?.(folder.id)
                }}
            >
                <div className="flex items-center space-x-2 overflow-hidden">
                    <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                        {hasChildren ? (
                            isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
                        ) : <div className="w-3" />}
                    </div>
                    {isOpen ? <FolderOpen className="h-4 w-4 text-blue-500" /> : <Folder className="h-4 w-4 text-blue-500" />}
                    <span className="text-sm truncate">{folder.name}</span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCreate?.(folder.id) }}>
                            <Plus className="mr-2 h-3 w-3" /> New Subfolder
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); /* Implement rename dialog */ }}>
                            <Edit className="mr-2 h-3 w-3" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); onDelete?.(folder.id) }}>
                            <Trash className="mr-2 h-3 w-3" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {isOpen && hasChildren && (
                <div>
                    {folder.children!.map(child => (
                        <FolderItem key={child.id} folder={child} level={level + 1} onSelect={onSelect} onCreate={onCreate} onRename={onRename} onDelete={onDelete} />
                    ))}
                </div>
            )}
        </div>
    )
}
