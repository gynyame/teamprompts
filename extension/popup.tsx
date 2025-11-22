import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Search, Copy, ExternalLink } from 'lucide-react'

interface Prompt {
    id: string
    title: string
    content: string
}

function Popup() {
    const [prompts, setPrompts] = useState<Prompt[]>([])
    const [search, setSearch] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check authentication by calling the API
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            // In a real extension, we'd use chrome.cookies or a token stored in storage
            // For MVP, we'll assume localhost cookie sharing if possible, or just manual token input
            // Since we can't easily share cookies with localhost in dev without host permissions
            // We'll try to fetch from the API.

            // Note: Fetching from extension to localhost might have CORS issues unless configured.
            // We added host_permissions for localhost.

            const API_BASE = process.env.NODE_ENV === 'production' ? 'https://teamprompts.io' : 'http://localhost:3000'
            const res = await fetch(`${API_BASE}/api/prompts`) // We need to create this API route
            if (res.ok) {
                const data = await res.json()
                setPrompts(data)
                setIsAuthenticated(true)
            } else {
                setIsAuthenticated(false)
            }
        } catch (error) {
            console.error(error)
            setIsAuthenticated(false)
        } finally {
            setLoading(false)
        }
    }

    const filteredPrompts = prompts.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase())
    )

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content)
        // visual feedback could be added here
    }

    if (loading) return <div className="p-4">Loading...</div>

    if (!isAuthenticated) {
        return (
            <div className="p-4 w-80 flex flex-col items-center justify-center space-y-4">
                <h2 className="text-lg font-bold">TeamPrompts</h2>
                <p className="text-sm text-center text-gray-500">Please log in to access your prompts.</p>
                <a
                    href="https://teamprompts.io/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black text-white px-4 py-2 rounded text-sm"
                >
                    Log In
                </a>
            </div>
        )
    }

    return (
        <div className="w-80 h-96 flex flex-col bg-white">
            <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search prompts..."
                        className="w-full pl-8 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {filteredPrompts.map(prompt => (
                    <div key={prompt.id} className="p-3 border rounded-md hover:bg-gray-50 group">
                        <div className="flex items-start justify-between">
                            <h3 className="font-medium text-sm">{prompt.title}</h3>
                            <button
                                onClick={() => handleCopy(prompt.content)}
                                className="text-gray-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{prompt.content}</p>
                    </div>
                ))}
                {filteredPrompts.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No prompts found.
                    </div>
                )}
            </div>
        </div>
    )
}

const root = createRoot(document.getElementById('root')!)
root.render(<Popup />)
