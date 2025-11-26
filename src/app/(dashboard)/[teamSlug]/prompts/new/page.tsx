import { CreatePromptForm } from '@/components/prompts/CreatePromptForm'
import { getFolders } from '@/app/(dashboard)/[teamSlug]/folders/actions'

export default async function CreatePromptPage({ params }: { params: Promise<{ teamSlug: string }> }) {
    const { teamSlug } = await params
    const folders = await getFolders(teamSlug)
    return <CreatePromptForm teamSlug={teamSlug} folders={folders} />
}
