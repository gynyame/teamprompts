import { UserNav } from './UserNav'
import Link from 'next/link'

export function Header({ user }: { user: any }) {
    return (
        <header className="border-b">
            <div className="flex h-16 items-center px-4">
                <Link href="/" className="font-bold text-xl">
                    TeamPrompts
                </Link>
                <div className="ml-auto flex items-center space-x-4">
                    <UserNav user={user} />
                </div>
            </div>
        </header>
    )
}
