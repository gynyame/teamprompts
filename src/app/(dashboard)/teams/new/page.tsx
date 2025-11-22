'use client'

import { useFormStatus } from 'react-dom'
import { createTeam } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full" type="submit" disabled={pending}>
            {pending ? 'Creating team...' : 'Create Team'}
        </Button>
    )
}

export default function CreateTeamPage() {
    async function clientAction(formData: FormData) {
        const result = await createTeam(formData)
        if (result?.error) {
            toast.error(result.error)
        }
    }

    return (
        <div className="flex items-center justify-center py-12">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create a Team</CardTitle>
                    <CardDescription>
                        Create a team to start sharing prompts with your colleagues.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={clientAction} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Team Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Acme Corp"
                                required
                                minLength={3}
                                maxLength={50}
                            />
                        </div>
                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
