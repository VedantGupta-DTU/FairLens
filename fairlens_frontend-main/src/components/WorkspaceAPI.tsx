import { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Key, Copy, Check, Activity, Webhook } from 'lucide-react'

export default function WorkspaceAPI() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial font-bold text-xl flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[var(--color-steel)]" />
          Developer & API
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">Integrate FairLens directly into your CI/CD pipelines and backend services.</p>
      </div>

      <div className="grid xl:grid-cols-[1fr_400px] gap-6">
        
        {/* Left Column: Keys & Webhooks */}
        <div className="space-y-6">
          {/* API Keys */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] flex justify-between items-center">
              <h3 className="font-semibold text-sm flex items-center gap-2"><Key className="w-4 h-4 text-amber-400" /> API Keys</h3>
              <button className="text-xs bg-white/10 px-3 py-1.5 rounded-lg cursor-hover">Generate New</button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { name: 'Production Key', key: 'fl_prod_8x92nd81m4k291nc', lastUsed: '2 hours ago' },
                { name: 'Staging CI/CD', key: 'fl_test_3m18vnz81ld092k1', lastUsed: 'Yesterday' }
              ].map(k => (
                <div key={k.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-white/[0.04] bg-white/[0.01]">
                  <div>
                    <p className="text-sm font-medium">{k.name}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">Last used: {k.lastUsed}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-md border border-white/[0.06]">
                    <code className="text-xs font-mono text-[var(--color-text-muted)]">{k.key.substring(0, 12)}••••••••</code>
                    <button onClick={() => copyToClipboard(k.key, k.name)} className="text-[var(--color-text-muted)] hover:text-white cursor-hover">
                      {copied === k.name ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Webhooks */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h3 className="font-semibold text-sm flex items-center gap-2"><Webhook className="w-4 h-4 text-emerald-400" /> Webhook Endpoints</h3>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] bg-white/[0.01]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-sm font-medium">Audit Completion Alerts</p>
                  </div>
                  <code className="text-[10px] text-[var(--color-text-muted)] mt-1 block">https://api.yourdomain.com/webhooks/fairlens</code>
                </div>
                <div className="w-10 h-5 bg-emerald-500/20 rounded-full flex items-center p-0.5 cursor-pointer border border-emerald-500/30">
                  <motion.div layout className="w-4 h-4 bg-emerald-400 rounded-full translate-x-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code & Usage */}
        <div className="space-y-6">
          
          {/* Quickstart Code */}
          <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-white/[0.06] flex gap-4 text-xs font-mono">
              <span className="text-[var(--color-coral)] border-b border-[var(--color-coral)] pb-2 -mb-3">cURL</span>
              <span className="text-[var(--color-text-muted)]">Python</span>
              <span className="text-[var(--color-text-muted)]">Node.js</span>
            </div>
            <div className="p-4 text-xs font-mono text-[var(--color-text-muted)] leading-relaxed overflow-x-auto">
              <span className="text-pink-400">curl</span> -X POST https://api.fairlens.ai/v1/audit \<br/>
              &nbsp;&nbsp;-H <span className="text-amber-300">"Authorization: Bearer fl_prod_..."</span> \<br/>
              &nbsp;&nbsp;-F <span className="text-amber-300">"dataset=@/path/to/data.csv"</span> \<br/>
              &nbsp;&nbsp;-F <span className="text-amber-300">"protected_classes=gender,caste"</span>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400" /> API Usage (This Month)</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--color-text-muted)]">Audit Requests</span>
                  <span><strong className="text-white">1,240</strong> / 5,000</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.05]">
                  <div className="h-full rounded-full bg-blue-400" style={{ width: '25%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--color-text-muted)]">Grok Chat Tokens</span>
                  <span><strong className="text-white">4.2M</strong> / 10M</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.05]">
                  <div className="h-full rounded-full bg-purple-400" style={{ width: '42%' }} />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
