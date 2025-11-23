// Content script
console.log('TeamPrompts content script loaded');

// Check if already injected to prevent duplicate injections
if ((window as any).teamPromptsInjected) {
    console.log('TeamPrompts already active on this page');
} else {
    (window as any).teamPromptsInjected = true;

    console.log('TeamPrompts activated');

    // Initialize the extension UI on the page
    const initializeTeamPrompts = () => {
        // Create floating button or sidebar
        const button = document.createElement('div');
        button.id = 'teamprompts-trigger';
        button.innerHTML = '📝 Prompts';
        button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #4F46E5;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      z-index: 999999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', openPromptsPanel);
        document.body.appendChild(button);
    }

    const openPromptsPanel = () => {
        // Request prompts from background script
        chrome.runtime.sendMessage({ type: 'GET_PROMPTS' }, (response) => {
            showPromptsUI(response.prompts);
        });
    }

    const showPromptsUI = (prompts: any[]) => {
        // Create and show prompts panel
        const panel = document.createElement('div');
        panel.id = 'teamprompts-panel';
        panel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      max-height: 80vh;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      z-index: 1000000;
      overflow: hidden;
      font-family: system-ui, -apple-system, sans-serif;
    `;

        // Add prompts list UI
        panel.innerHTML = `
      <div style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 700;">Your Prompts</h2>
        <button id="close-panel" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
      </div>
      <div style="padding: 20px; max-height: 60vh; overflow-y: auto;">
        ${prompts.length === 0 ?
                '<p style="color: #6b7280; text-align: center;">No prompts yet. Create your first prompt!</p>' :
                prompts.map(prompt => `
            <div class="prompt-item" data-prompt-id="${prompt.id}" style="padding: 12px; margin-bottom: 8px; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: background 0.2s;">
              <div style="font-weight: 600; margin-bottom: 4px;">${prompt.title}</div>
              <div style="font-size: 14px; color: #6b7280;">${prompt.description || 'Click to insert'}</div>
            </div>
          `).join('')
            }
      </div>
    `;

        document.body.appendChild(panel);

        // Close button
        document.getElementById('close-panel')?.addEventListener('click', () => {
            panel.remove();
        });

        // Prompt click handlers
        document.querySelectorAll('.prompt-item').forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                (e.target as HTMLElement).style.background = '#f3f4f6';
            });
            item.addEventListener('mouseleave', (e) => {
                (e.target as HTMLElement).style.background = 'white';
            });
            item.addEventListener('click', (e) => {
                const promptId = (e.currentTarget as HTMLElement).dataset.promptId;
                const prompt = prompts.find(p => p.id === promptId);
                insertPrompt(prompt);
                panel.remove();
            });
        });

        // Close on outside click
        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                panel.remove();
            }
        });
    }

    const insertPrompt = (prompt: any) => {
        // Find the text input field on the page (varies by platform)
        const selectors = [
            'textarea[placeholder*="Message"]',
            'textarea[placeholder*="Ask"]',
            'textarea[placeholder*="Type"]',
            '[contenteditable="true"]',
            'textarea',
        ];

        let inputField: HTMLElement | null = null;
        for (const selector of selectors) {
            inputField = document.querySelector(selector);
            if (inputField) break;
        }

        if (inputField) {
            // Insert the prompt text
            if (inputField.tagName === 'TEXTAREA') {
                (inputField as HTMLTextAreaElement).value = prompt.content;
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
                inputField.focus();
            } else if (inputField.isContentEditable) {
                inputField.textContent = prompt.content;
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
                inputField.focus();
            }

            // Show success notification
            showNotification('Prompt inserted successfully!');
        } else {
            showNotification('Could not find input field', 'error');
        }
    }

    const showNotification = (message: string, type = 'success') => {
        const notification = document.createElement('div');
        notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10B981' : '#EF4444'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000001;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      animation: slideIn 0.3s ease-out;
    `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTeamPrompts);
    } else {
        initializeTeamPrompts();
    }
}
