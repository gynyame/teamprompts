import { CreatePromptForm } from '@/components/prompts/CreatePromptForm'

export default async function CreatePromptPage({ params }: { params: Promise<{ teamSlug: string }> }) {
    const { teamSlug } = await params
    return <CreatePromptForm teamSlug={teamSlug} />
}
