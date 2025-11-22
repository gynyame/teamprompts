import { DashboardNav } from '@/components/layout/DashboardNav'

export default async function TeamLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ teamSlug: string }>
}) {
    const { teamSlug } = await params
    return (
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
                <DashboardNav teamSlug={teamSlug} />
            </aside>
            <div className="flex-1 lg:max-w-4xl">{children}</div>
        </div>
    )
}
