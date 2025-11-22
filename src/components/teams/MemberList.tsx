'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Shield, User, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { updateMemberRole, removeMember } from '@/app/(dashboard)/[teamSlug]/settings/members/actions'

interface Member {
    user_id: string
    role: string
    profiles: {
        full_name: string | null
        email: string | null // Assuming we might join this or it's in profile
        avatar_url: string | null
    }
}

interface MemberListProps {
    members: Member[]
    teamSlug: string
    currentUserId: string
}

export function MemberList({ members, teamSlug, currentUserId }: MemberListProps) {
    const handleRoleChange = async (userId: string, newRole: string) => {
        const result = await updateMemberRole(teamSlug, userId, newRole)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Role updated')
        }
    }

    const handleRemove = async (userId: string) => {
        if (confirm('Are you sure you want to remove this member?')) {
            const result = await removeMember(teamSlug, userId)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Member removed')
            }
        }
    }

    return (
        <div className="border rounded-lg divide-y">
            {members.map((member) => (
                <div key={member.user_id} className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src={member.profiles?.avatar_url || ''} />
                            <AvatarFallback>{member.profiles?.full_name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium leading-none">{member.profiles?.full_name || 'Unknown User'}</p>
                            {/* Email might not be directly available in profiles depending on schema, assuming it is or we fetch it */}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Badge variant={member.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                            {member.role}
                        </Badge>

                        {/* Only show actions if not the current user (can't remove self here usually) */}
                        {member.user_id !== currentUserId && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleRoleChange(member.user_id, 'admin')}>
                                        <Shield className="mr-2 h-4 w-4" /> Make Admin
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRoleChange(member.user_id, 'member')}>
                                        <User className="mr-2 h-4 w-4" /> Make Member
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRoleChange(member.user_id, 'viewer')}>
                                        <Eye className="mr-2 h-4 w-4" /> Make Viewer
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onClick={() => handleRemove(member.user_id)}>
                                        Remove Member
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
