import React, { useEffect, useState } from 'react';
import { FiArrowUpRight, FiCpu, FiExternalLink, FiMessageCircle, FiPlus, FiSend, FiSettings, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

type AssistantConfig = { url: string; enabled: boolean };
const defaultConfig: AssistantConfig = { url: '', enabled: true };
const configStorageKey = (userId: number) => `gg-strategy:ai-config:${userId}`;

const parseHttpUrl = (value: string): string | null => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : null;
  } catch {
    return null;
  }
};

const AIAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<AssistantConfig>(defaultConfig);
  const [urlDraft, setUrlDraft] = useState('');
  const [messageDraft, setMessageDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState('');
  const [chatError, setChatError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const saved = localStorage.getItem(configStorageKey(user.id));
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<AssistantConfig>;
        const restored = { ...defaultConfig, ...parsed };
        setConfig(restored);
        setUrlDraft(restored.url);
      }
    } catch {
      setConfigError('This browser could not restore the saved assistant settings.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const saveConfig = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfigError('');
    setNotice('');
    const value = urlDraft.trim();

    if (value && !parseHttpUrl(value)) {
      setConfigError('Enter a valid http or https URL.');
      return;
    }

    const nextConfig = { ...config, url: value };
    setConfig(nextConfig);
    if (user?.id) {
      try {
        localStorage.setItem(configStorageKey(user.id), JSON.stringify(nextConfig));
        setNotice('Assistant settings saved in this browser.');
      } catch {
        setConfigError('This browser could not save the assistant settings.');
      }
    }
  };

  const toggleAssistant = (enabled: boolean) => {
    const nextConfig = { ...config, enabled };
    setConfig(nextConfig);
    setChatError('');
    if (user?.id) {
      try {
        localStorage.setItem(configStorageKey(user.id), JSON.stringify(nextConfig));
      } catch {
        setConfigError('This browser could not save the assistant setting.');
      }
    }
  };

  const openChatGPT = () => {
    const validUrl = parseHttpUrl(config.url);
    if (validUrl) window.open(validUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setChatError('');
    setNotice('');

    if (!config.enabled) {
      setChatError('AI Assistant is turned off. Turn it on in AI Configuration to continue.');
      return;
    }
    if (!messageDraft.trim()) return;
    if (!config.url) {
      setChatError('Add a ChatGPT URL in AI Configuration. Your message has not been sent.');
      return;
    }

    setChatError('This page does not have an AI chat connection. Your message has not been sent. Use Open ChatGPT to continue in a new tab.');
  };

  const startNewChat = () => {
    setMessageDraft('');
    setChatError('');
    setNotice('Draft cleared. No messages were sent.');
  };

  const openableUrl = parseHttpUrl(config.url);

  return (
    <div className="feature-page ai-assistant-page px-4 py-7 sm:px-6 lg:px-8">
      <header className="feature-heading mb-7">
        <div>
          <p className="feature-eyebrow"><FiCpu /> AI Assistant</p>
          <h1>Your AI workspace</h1>
          <p className="feature-heading-copy">Configure a ChatGPT link for quick access. Direct chat needs a server-side AI integration.</p>
        </div>
        <button type="button" onClick={startNewChat} className="feature-button feature-button--quiet ai-new-chat"><FiPlus /> New Chat</button>
      </header>

      <div className="ai-assistant-layout">
        <section className="ai-chat-card" aria-label="AI conversation">
          <div className="ai-chat-header">
            <div className="ai-chat-avatar"><FiCpu /></div>
            <div className="ai-chat-title"><h2>Assistant workspace</h2><p><i /> External link mode</p></div>
            <button type="button" onClick={startNewChat} className="ai-chat-reset"><FiPlus /><span>New Chat</span></button>
          </div>

          <div className="ai-chat-messages" aria-live="polite">
            {loading ? (
              <div className="ai-chat-loading" role="status"><span className="ai-loading-dots"><i /><i /><i /></span><span>Loading your saved settings…</span></div>
            ) : config.enabled ? (
              <div className="ai-empty-state">
                <span className="ai-empty-icon"><FiMessageCircle /></span>
                <span className="ai-message-role">Workspace notice</span>
                <h3>Ready when you are</h3>
                <p>This screen does not send prompts to an AI or generate replies. Add your AI Assistant URL to open it in a separate tab.</p>
                {openableUrl ? <button type="button" onClick={openChatGPT} className="ai-open-link">Open AI Assistant <FiArrowUpRight /></button> : <span className="ai-setup-hint">Add a link in AI Configuration below.</span>}
              </div>
            ) : (
              <div className="ai-empty-state ai-empty-state--disabled">
                <span className="ai-empty-icon"><FiCpu /></span>
                <span className="ai-message-role">Assistant disabled</span>
                <h3>AI Assistant is turned off</h3>
                <p>Enable it in AI Configuration when you want to use the external AI Assistant link.</p>
              </div>
            )}
            {messageDraft.trim() && config.enabled && (
              <div className="ai-draft-preview">
                <span>You · unsent draft</span>
                <p>{messageDraft}</p>
              </div>
            )}
          </div>

          {chatError && <p className="ai-chat-error" role="alert">{chatError}</p>}
          {notice && <p className="ai-chat-notice" aria-live="polite">{notice}</p>}

          <form className="ai-chat-composer" onSubmit={handleSend}>
            <label className="sr-only" htmlFor="ai-message">Write a message</label>
            <textarea id="ai-message" value={messageDraft} onChange={(event) => { setMessageDraft(event.target.value); setChatError(''); }} placeholder={config.enabled ? 'Write a message…' : 'Turn on AI Assistant to use this composer'} disabled={loading || !config.enabled} rows={2} />
            <button type="submit" aria-label="Send message" disabled={loading || !config.enabled || !messageDraft.trim()}><FiSend /><span>Send</span></button>
          </form>
          <p className="ai-chat-footnote"><FiShield /> Messages typed here are not sent or saved.</p>
        </section>

        <aside className="ai-config-card" aria-labelledby="ai-config-title">
          <div className="ai-config-header">
            <span className="ai-config-icon"><FiSettings /></span>
            <div><p className="feature-eyebrow">Preferences</p><h2 id="ai-config-title">AI Configuration</h2></div>
          </div>

          <form onSubmit={saveConfig} className="ai-config-form">
            <label className="ai-config-label" htmlFor="ai-url">AI Assistant URL</label>
            <input id="ai-url" type="url" value={urlDraft} onChange={(event) => { setUrlDraft(event.target.value); setConfigError(''); }} placeholder="https://your-ai-assistant.com" className="feature-input" />
            <p className="ai-config-help">Use the link you want to open. A regular AI Assistant URL cannot power chat inside this page.</p>

            <label className="ai-enabled-toggle">
              <span><strong>AI Assistant</strong><small>{config.enabled ? 'Enabled for this account' : 'Currently disabled'}</small></span>
              <input type="checkbox" checked={config.enabled} onChange={(event) => toggleAssistant(event.target.checked)} />
              <i aria-hidden="true" />
            </label>

            {configError && <p className="ai-config-error" role="alert">{configError}</p>}
            {notice && <p className="ai-config-notice" aria-live="polite">{notice}</p>}

            <div className="ai-config-actions">
              <button type="submit" className="feature-button" disabled={loading}>Save configuration</button>
              <button type="button" onClick={openChatGPT} className="feature-button feature-button--quiet" disabled={!openableUrl || !config.enabled}><FiExternalLink /> Open AI Assistant</button>
            </div>
          </form>

          {!config.url && <div className="ai-config-empty"><FiArrowUpRight /><span>Add an AI Assistant URL to enable the external shortcut.</span></div>}
          <div className="ai-config-storage"><FiShield /><span>Settings are saved in this browser for your signed-in account. No API keys are stored.</span></div>
        </aside>
      </div>
    </div>
  );
};

export default AIAssistantPage;
