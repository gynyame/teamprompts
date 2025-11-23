import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ExternalLink, Settings, Play } from 'lucide-react'

function Popup() {
    const [status, setStatus] = useState<{ text: string; type: 'idle' | 'success' | 'error' }>({
        text: 'Click "Activate" to use TeamPrompts on this page',
        type: 'idle'
    })

    const handleActivate = async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab.id) throw new Error('No active tab');

            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });

            setStatus({ text: '✓ TeamPrompts activated!', type: 'success' });
        } catch (error) {
            console.error(error);
            setStatus({ text: '✗ Cannot activate on this page', type: 'error' });
        }
    }

    const openDashboard = () => {
        chrome.tabs.create({ url: 'https://teamprompts.io/dashboard' });
    }

    const openSettings = () => {
        chrome.tabs.create({ url: 'https://teamprompts.io/settings' });
    }

    return (
        <div className="w-[350px] p-4 font-sans">
            <h1 className="text-lg font-bold mb-3 text-gray-800">TeamPrompts</h1>

            <div className={`p-3 rounded-lg mb-4 text-sm ${status.type === 'success' ? 'bg-green-100 text-green-800' :
                status.type === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-600'
                }`}>
                {status.text}
            </div>

            <button
                onClick={handleActivate}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg mb-2 flex items-center justify-center gap-2 transition-colors"
            >
                <Play className="w-4 h-4" />
                Activate on This Page
            </button>

            <button
                onClick={openDashboard}
                className="w-full py-3 px-4 bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-lg mb-2 flex items-center justify-center gap-2 transition-colors"
            >
                <ExternalLink className="w-4 h-4" />
                Manage Prompts
            </button>

            <button
                onClick={openSettings}
                className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
                <Settings className="w-4 h-4" />
                Settings
            </button>
        </div>
    )
}

const root = createRoot(document.getElementById('root')!)
root.render(<Popup />)
