import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default async function BillingPage({ params }: { params: Promise<{ teamSlug: string }> }) {
    const { teamSlug } = await params
    const supabase = await createClient()

    const { data: team } = await supabase
        .from('teams')
        .select('*')
        .eq('slug', teamSlug)
        .single()

    if (!team) return <div>Team not found</div>

    const isPro = team.stripe_price_id && new Date(team.stripe_current_period_end!) > new Date()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
                <p className="text-muted-foreground">
                    Manage your team's subscription and billing information.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Subscription Plan</CardTitle>
                    <CardDescription>
                        You are currently on the <strong>{isPro ? 'Pro' : 'Free'}</strong> plan.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Unlimited Prompts</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Unlimited Team Members</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Advanced Analytics</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    {isPro ? (
                        <Button variant="outline">Manage Subscription</Button>
                    ) : (
                        <Button>Upgrade to Pro</Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
