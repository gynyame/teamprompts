import { createClient } from '@/lib/supabase/server'
import { UsageChart } from '@/components/analytics/UsageChart'
import { TopPrompts } from '@/components/analytics/TopPrompts'
import { subDays, format } from 'date-fns'

export default async function AnalyticsPage({ params }: { params: Promise<{ teamSlug: string }> }) {
    const { teamSlug } = await params
    const supabase = await createClient()

    const { data: team } = await supabase
        .from('teams')
        .select('id')
        .eq('slug', teamSlug)
        .single()

    if (!team) return <div>Team not found</div>

    // Fetch usage data for chart (mock aggregation for now as Supabase doesn't support complex aggregation easily in client without RPC or views)
    // In a real app, we'd use a view or an RPC function. For MVP, we'll fetch last 30 days usage and aggregate in JS (not efficient for large scale but fine for MVP)
    const thirtyDaysAgo = subDays(new Date(), 30).toISOString()

    const { data: usage } = await supabase
        .from('prompt_usage')
        .select('created_at, prompt_id')
        .eq('team_id', team.id)
        .gte('created_at', thirtyDaysAgo)

    // Aggregate by date
    const usageMap = new Map<string, number>()
    for (let i = 0; i < 30; i++) {
        const date = format(subDays(new Date(), i), 'MMM dd')
        usageMap.set(date, 0)
    }

    usage?.forEach(u => {
        const date = format(new Date(u.created_at), 'MMM dd')
        if (usageMap.has(date)) {
            usageMap.set(date, (usageMap.get(date) || 0) + 1)
        }
    })

    // Convert map to array and reverse to show oldest to newest
    const chartData = Array.from(usageMap.entries())
        .map(([date, count]) => ({ date, count }))
        .reverse()

    // Fetch top prompts
    // Again, ideally a view. We'll fetch prompts and sort by usage_count (which we should be incrementing or calculating)
    // We added usage_count to prompt card but didn't implement incrementing it on the prompt table itself, 
    // we only tracked in prompt_usage table.
    // Let's fetch prompts and join with usage count or just use the usage table to count.
    // For MVP simplicity, let's assume we want to show prompts with most usage entries.

    const { data: topPromptsData } = await supabase
        .from('prompts')
        .select('id, title, visibility')
        .eq('team_id', team.id)

    // Count usage per prompt from the usage data we already fetched (approximate as it's only last 30 days)
    // Or better, fetch all usage counts grouped by prompt_id via RPC if possible.
    // Let's stick to client side aggregation of the 30 day window for "Trending Prompts"

    const promptUsageCounts: Record<string, number> = {}
    usage?.forEach(u => {
        // @ts-ignore - we need to select prompt_id in the usage query above
        const pid = u.prompt_id
        promptUsageCounts[pid] = (promptUsageCounts[pid] || 0) + 1
    })

    // @ts-ignore
    const topPrompts = topPromptsData?.map(p => ({
        ...p,
        usage_count: promptUsageCounts[p.id] || 0
    }))
        .sort((a, b) => b.usage_count - a.usage_count)
        .slice(0, 5)

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                <p className="text-muted-foreground">
                    Overview of your team's prompt usage.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <UsageChart data={chartData} />
                </div>
                <div className="col-span-3">
                    {/* @ts-ignore */}
                    <TopPrompts prompts={topPrompts || []} />
                </div>
            </div>
        </div>
    )
}
