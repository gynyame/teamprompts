'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LayoutGrid, FileText, Folder, Users, Settings, BarChart } from 'lucide-react'

interface DashboardNavProps {
    teamSlug: string
}

export function DashboardNav({ teamSlug }: DashboardNavProps) {
    const pathname = usePathname()

    const items = [
        {
            title: 'Prompts',
            href: `/${teamSlug}/prompts`,
            icon: FileText,
        },
        {
            title: 'Folders',
            href: `/${teamSlug}/folders`,
            icon: Folder,
        },
        {
            title: 'Analytics',
            href: `/${teamSlug}/analytics`,
            icon: BarChart,
        },
        {
            title: 'Team',
            href: `/${teamSlug}/settings/members`,
            icon: Users,
        },
        {
            title: 'Settings',
            href: `/${teamSlug}/settings`,
            icon: Settings,
        },
    ]

    return (
        <nav className="grid items-start gap-2">
            {items.map((item, index) => {
                const Icon = item.icon
                return (
                    <Button
                        key={index}
                        variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
                        className={cn(
                            'justify-start',
                            pathname.startsWith(item.href) && 'bg-muted'
                        )}
                        asChild
                    >
                        <Link href={item.href}>
                            <Icon className="mr-2 h-4 w-4" />
                            {item.title}
                        </Link>
                    </Button>
                )
            })}
        </nav>
    )
}
