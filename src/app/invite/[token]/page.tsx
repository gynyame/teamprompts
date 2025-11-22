import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: invitation } = await supabase
        .from('invitations')
        .select(`
      *,
      teams (name, slug),
      profiles:invited_by (full_name)
    `)
        .eq('token', token)
        .single()

    if (!invitation) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Invalid Invitation</h1>
                    <p className="text-muted-foreground mt-2">This invitation link is invalid or has expired.</p>
                    <Button asChild className="mt-4">
                        <Link href="/">Go Home</Link>
                    </Button>
                </div>
            </div>
        )
    }

    async function acceptInvitation() {
        'use server'
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        // Add to team
        const { error: memberError } = await supabase
            .from('team_members')
            .insert({
                team_id: invitation.team_id,
                user_id: user.id,
                role: invitation.role,
            })

        if (memberError) {
            console.error(memberError)
            return
        }

        // Delete invitation
        await supabase
            .from('invitations')
            .delete()
            .eq('token', token)

        redirect(`/${invitation.teams.slug}`)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8 text-center bg-white p-8 rounded-lg shadow">
                <div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Join {invitation.teams.name}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {invitation.profiles?.full_name} has invited you to join their team on TeamPrompts.
                    </p>
                </div>

                {user ? (
                    <div className="space-y-4">
                        <p className="text-sm">Logged in as {user.email}</p>
                        <form action={acceptInvitation}>
                            <Button className="w-full" type="submit">
                                Accept Invitation
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">You need to log in to accept this invitation.</p>
                        <div className="flex gap-4 justify-center">
                            <Button asChild variant="outline">
                                <Link href={`/login?next=/invite/${token}`}>Log in</Link>
                            </Button>
                            <Button asChild>
                                <Link href={`/signup?next=/invite/${token}`}>Sign up</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
