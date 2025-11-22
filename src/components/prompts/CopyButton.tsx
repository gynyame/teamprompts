'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { trackUsage } from '@/app/(dashboard)/[teamSlug]/prompts/actions'

export function CopyButton({ content, promptId }: { content: string, promptId: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content)
        setCopied(true)
        toast.success('Copied to clipboard')

        // Track usage
        await trackUsage(promptId, 'copy')

        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Button onClick={handleCopy}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? 'Copied' : 'Copy Prompt'}
        </Button>
    )
}
