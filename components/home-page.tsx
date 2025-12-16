"use client"

import { ArrowRight, Upload, Sparkles, Database } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <div className="inline-block mb-6 px-4 py-2 glass rounded-full border border-primary/30">
          <span className="text-sm text-primary font-medium">✨ Powered by Gemini AI</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
          <span className="text-glow">Unlock the Data</span>
          <br />
          <span className="text-foreground">in Your Images</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty leading-relaxed">
          Transform invoices and wine labels into structured, actionable data with the power of AI vision technology
        </p>

        <Button
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_var(--glow-primary)] hover:shadow-[0_0_50px_var(--glow-primary)] transition-all duration-300 px-8 py-6 text-lg"
        >
          Get Started <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>

      {/* Process Flow */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="glass glass-hover rounded-2xl p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse-glow">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">1. Upload Image</h3>
            <p className="text-muted-foreground leading-relaxed">
              Drag and drop your invoice or wine label image into our scanner
            </p>
          </div>

          {/* Step 2 */}
          <div
            className="glass glass-hover rounded-2xl p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "200ms" }}
          >
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center animate-pulse-glow"
              style={{ animationDelay: "1s" }}
            >
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-3">2. AI Analysis</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our AI processes and extracts all relevant information instantly
            </p>
          </div>

          {/* Step 3 */}
          <div
            className="glass glass-hover rounded-2xl p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "400ms" }}
          >
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse-glow"
              style={{ animationDelay: "2s" }}
            >
              <Database className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">3. Structured Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get beautifully formatted, ready-to-use structured data output
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-5xl mx-auto mt-20">
        <div className="glass rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-8">Supported Document Types</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <span className="text-2xl">🧾</span>
              </div>
              <div>
                <h3 className="font-bold mb-2">Invoices & Receipts</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Extract merchant names, dates, amounts, line items, and totals
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <span className="text-2xl">🍷</span>
              </div>
              <div>
                <h3 className="font-bold mb-2">Wine Labels</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Identify winery, vintage, region, varietal, and tasting notes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
