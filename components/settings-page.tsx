"use client"

import { useState, useEffect } from "react"
import { SettingsIcon, Save, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState("")
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    // Load saved URL from localStorage on mount
    const savedUrl = localStorage.getItem("pythonApiUrl")
    if (savedUrl) {
      setApiUrl(savedUrl)
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("pythonApiUrl", apiUrl)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="container mx-auto px-6 py-12 pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Settings</h1>
          <p className="text-xl text-muted-foreground">Configure your AI Scanner preferences</p>
        </div>

        <div className="glass rounded-2xl p-8 md:p-12 space-y-8">
          {/* Header Section */}
          <div className="flex items-center gap-4 pb-6 border-b border-border/30">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">API Configuration</h2>
              <p className="text-sm text-muted-foreground">Connect to your Python backend service</p>
            </div>
          </div>

          {/* API Endpoint Input */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-url" className="text-base font-medium mb-2 block">
                Python API Endpoint URL
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                Enter the base URL of your Python API endpoint. This will be used to process image scans.
              </p>
              <Input
                id="api-url"
                type="url"
                placeholder="https://api.example.com/scan"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="glass h-12 text-base"
              />
            </div>

            {/* Example Section */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <div className="text-sm font-medium mb-2">Example:</div>
              <code className="text-sm text-primary break-all">https://your-api.herokuapp.com/v1/analyze</code>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4 pt-6 border-t border-border/30">
            <Button
              onClick={handleSave}
              disabled={!apiUrl.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_var(--glow-primary)] hover:shadow-[0_0_40px_var(--glow-primary)] transition-all duration-300 px-8 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Saved Successfully
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>

            {isSaved && (
              <div className="text-sm text-green-500 animate-in fade-in duration-300">
                Your settings have been saved to local storage
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="p-6 rounded-xl bg-accent/10 border border-accent/30">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <span className="text-accent">ℹ️</span> Storage Information
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your API endpoint URL is stored locally in your browser using localStorage. This means your settings will
              persist between sessions without requiring authentication.
            </p>
          </div>
        </div>

        {/* Additional Settings Card */}
        <div className="glass rounded-2xl p-8 mt-6">
          <h2 className="text-xl font-bold mb-4">About AI Scanner</h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p className="leading-relaxed">
              AI Image Scanner uses advanced computer vision and natural language processing to extract structured data
              from invoices and wine labels. The application is powered by Google&apos;s Gemini AI for accurate and reliable
              data extraction.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-medium">
                Next.js
              </span>
              <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-medium">
                Gemini AI
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-medium">
                Tailwind CSS
              </span>
              <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-medium">
                TypeScript
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
