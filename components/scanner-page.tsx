"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, Sparkles, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import ScanResults from "@/components/scan-results"

interface ScanData {
  data: unknown
}

export default function ScannerPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [scanData, setScanData] = useState<ScanData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

  const performScan = useCallback(async (file: File) => {
    setIsScanning(true)
    setScanComplete(false)
    setError(null)
    
    // Créer une URL pour prévisualiser l'image
    const imageUrl = URL.createObjectURL(file)
    setUploadedImageUrl(imageUrl)

    try {
      // Récupérer l'URL de l'API depuis localStorage
      const apiUrl = localStorage.getItem("pythonApiUrl")
      
      if (!apiUrl) {
        throw new Error("API endpoint not configured. Please set it in Settings.")
      }

      // Créer FormData pour envoyer l'image
      const formData = new FormData()
      formData.append("image", file)

      // Appel POST vers notre proxy API qui gère CORS
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "x-api-url": apiUrl, // Passer l'URL au proxy
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      setScanData({ data: result })
      setScanComplete(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during scanning")
      console.error("Scan error:", err)
    } finally {
      setIsScanning(false)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) {
        performScan(file)
      }
    },
    [performScan],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        performScan(e.target.files[0])
      }
    },
    [performScan],
  )

  const handleReset = () => {
    setScanComplete(false)
    setScanData(null)
    setError(null)
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl)
      setUploadedImageUrl(null)
    }
  }

  return (
    <div className="container mx-auto px-6 py-12 pb-24 md:pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Image Scanner</h1>
          <p className="text-xl text-muted-foreground">Upload an invoice or wine label to extract structured data</p>
        </div>

        {!scanComplete ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "glass rounded-3xl p-12 md:p-20 text-center transition-all duration-300",
              "border-2 border-dashed cursor-pointer group",
              isDragging && "border-primary bg-primary/5 scale-[1.02]",
              !isDragging && "border-border/50 hover:border-primary/50 hover:bg-primary/5",
              isScanning && "pointer-events-none",
            )}
          >
            {isScanning ? (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse-glow">
                  <Sparkles className="w-10 h-10 text-primary animate-spin" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Scanning with AI...</h3>
                  <p className="text-muted-foreground">Analyzing your image and extracting data</p>
                </div>
                <div className="max-w-md mx-auto h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-[progress_2s_ease-in-out]" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  className={cn(
                    "w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300",
                    "bg-primary/20 border border-primary/30 group-hover:shadow-[0_0_30px_var(--glow-primary)]",
                  )}
                >
                  <Upload className="w-10 h-10 text-primary" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {isDragging ? "Drop your image here" : "Drop your image here"}
                  </h3>
                  <p className="text-muted-foreground mb-6">or click to browse your files</p>

                  <label className="inline-block">
                    <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                    <span className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium cursor-pointer hover:bg-primary/90 transition-all duration-300 shadow-[0_0_20px_var(--glow-primary)] hover:shadow-[0_0_40px_var(--glow-primary)]">
                      Choose File
                    </span>
                  </label>
                </div>

                <div className="text-sm text-muted-foreground">Supports: JPG, PNG, WEBP</div>
              </div>
            )}
          </div>
        ) : error ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="glass rounded-2xl p-8 mb-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-500 mb-2">Error</h3>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="glass rounded-2xl p-8 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Scan Complete</h3>
                  <p className="text-sm text-muted-foreground">Data extracted successfully</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-all duration-300"
              >
                Scan Another
              </button>
            </div>

            {scanData && <ScanResults data={scanData.data} imageUrl={uploadedImageUrl} />}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}
