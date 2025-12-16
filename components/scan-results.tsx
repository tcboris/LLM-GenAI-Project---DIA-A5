"use client"

import Image from "next/image"
import { FileText, Calendar, CreditCard, Wine, Grape, MapPin, Droplet, AlertCircle, Download, Image as ImageIcon } from "lucide-react"

interface ScanResultsProps {
  data: unknown
  imageUrl: string | null
}

// Types pour les données
interface InvoiceData {
  type: "Facture"
  date?: string
  vendeur?: string | VendorInfo
  montant_total?: string
  numero_facture?: string
  [key: string]: unknown
}

interface VendorInfo {
  nom?: string
  siret?: string
  tva_intra?: string
  adresse?: string
  telephone?: string
  email?: string
  site_web?: string
  [key: string]: unknown
}

interface WineData {
  type: "Vin"
  nom?: string
  millesime?: string
  appellation?: string
  degre_alcool?: string
  [key: string]: unknown
}

export default function ScanResults({ data, imageUrl }: ScanResultsProps) {
  // Fonction pour télécharger le JSON
  const downloadJSON = () => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `scan-result-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  
  // Vérifier si c'est une erreur
  if (data && typeof data === "object" && "error" in data) {
    return (
      <div className="space-y-6">
        <div className="glass rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-500 mb-2">Erreur de traitement</h3>
              <p className="text-muted-foreground">{String((data as { error: unknown }).error)}</p>
              {"raw_ai" in (data as object) && (data as { raw_ai?: string }).raw_ai && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-primary hover:underline">Voir les détails</summary>
                  <pre className="mt-2 text-xs bg-muted/30 p-4 rounded-lg overflow-auto">
                    {(data as unknown as { raw_ai: string }).raw_ai}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Vérifier le type de données
  const isInvoice = data && typeof data === "object" && "type" in data && data.type === "Facture"
  const isWine = data && typeof data === "object" && "type" in data && data.type === "Vin"

  // Affichage Facture
  if (isInvoice) {
    const invoice = data as InvoiceData
    const vendorInfo = typeof invoice.vendeur === "object" ? invoice.vendeur as VendorInfo : null
    const vendorName = vendorInfo?.nom || (typeof invoice.vendeur === "string" ? invoice.vendeur : "Vendeur non identifié")
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Image et bouton téléchargement */}
        <div className="flex gap-4 items-start">
          {imageUrl && (
            <div className="glass rounded-2xl p-4 flex-1">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Image analysée</h3>
              </div>
              <Image 
                src={imageUrl} 
                alt="Image analysée" 
                width={800}
                height={600}
                className="w-full h-auto rounded-xl border border-border/30 shadow-lg"
                unoptimized
              />
            </div>
          )}
          
          <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center min-w-48">
            <Download className="w-8 h-8 text-primary mb-3" />
            <button
              onClick={downloadJSON}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 shadow-[0_0_20px_var(--glow-primary)] hover:shadow-[0_0_40px_var(--glow-primary)] w-full"
            >
              Télécharger JSON
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-8">
          {/* En-tête Facture */}
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-primary/30 to-primary/10 border-2 border-primary/50 flex items-center justify-center shrink-0 shadow-[0_0_40px_var(--glow-primary)] animate-pulse-glow relative">
              <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-xl"></div>
              <FileText className="w-12 h-12 text-primary relative z-10" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-4 py-2 rounded-full bg-linear-to-r from-primary/20 to-primary/30 border-2 border-primary/50 text-primary text-sm font-bold uppercase tracking-wider shadow-[0_0_20px_var(--glow-primary)]">
                  📄 Facture
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-4">{vendorName}</h2>
              
              {/* Informations vendeur détaillées */}
              {vendorInfo && (
                <div className="grid md:grid-cols-2 gap-3 mb-6 p-4 rounded-xl bg-muted/20 border border-border/20">
                  {vendorInfo.siret && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">SIRET: </span>
                      <span className="font-medium">{vendorInfo.siret}</span>
                    </div>
                  )}
                  {vendorInfo.tva_intra && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">TVA: </span>
                      <span className="font-medium">{vendorInfo.tva_intra}</span>
                    </div>
                  )}
                  {vendorInfo.adresse && (
                    <div className="text-sm md:col-span-2 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="font-medium">{vendorInfo.adresse}</span>
                    </div>
                  )}
                  {vendorInfo.telephone && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Tél: </span>
                      <span className="font-medium">{vendorInfo.telephone}</span>
                    </div>
                  )}
                  {vendorInfo.email && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Email: </span>
                      <a href={`mailto:${vendorInfo.email}`} className="font-medium text-primary hover:underline">
                        {vendorInfo.email}
                      </a>
                    </div>
                  )}
                  {vendorInfo.site_web && (
                    <div className="text-sm md:col-span-2">
                      <span className="text-muted-foreground">Site: </span>
                      <a 
                        href={vendorInfo.site_web.startsWith('http') ? vendorInfo.site_web : `https://${vendorInfo.site_web}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-medium text-primary hover:underline"
                      >
                        {vendorInfo.site_web}
                      </a>
                    </div>
                  )}
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                {invoice.numero_facture && (
                  <div className="glass-hover rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <CreditCard className="w-4 h-4" />
                      Numéro
                    </div>
                    <div className="font-semibold">{invoice.numero_facture}</div>
                  </div>
                )}
                
                {invoice.date && (
                  <div className="glass-hover rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      Date
                    </div>
                    <div className="font-semibold">{invoice.date}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Montant Total */}
          {invoice.montant_total && (
            <div className="border-t border-border/30 pt-6">
              <div className="flex justify-end">
                <div className="glass-hover rounded-2xl p-6 min-w-62.5">
                  <div className="text-sm text-muted-foreground mb-2">Montant Total</div>
                  <div className="text-4xl font-bold text-primary">{invoice.montant_total}</div>
                </div>
              </div>
            </div>
          )}

          {/* Données supplémentaires */}
          {Object.keys(invoice).filter(key => !["type", "date", "vendeur", "montant_total", "numero_facture"].includes(key)).length > 0 && (
            <div className="border-t border-border/30 mt-6 pt-6">
              <h3 className="font-bold mb-4">Informations supplémentaires</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {Object.entries(invoice)
                  .filter(([key]) => !["type", "date", "vendeur", "montant_total", "numero_facture"].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="glass-hover rounded-xl p-4">
                      <div className="text-sm text-muted-foreground mb-1 capitalize">
                        {key.replace(/_/g, " ")}
                      </div>
                      <div className="font-medium">
                        {typeof value === "object" && value !== null 
                          ? JSON.stringify(value, null, 2) 
                          : String(value)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Affichage Vin
  if (isWine) {
    const wine = data as WineData
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Image et bouton téléchargement */}
        <div className="flex gap-4 items-start">
          {imageUrl && (
            <div className="glass rounded-2xl p-4 flex-1">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Image analysée</h3>
              </div>
              <Image 
                src={imageUrl} 
                alt="Image analysée" 
                width={800}
                height={600}
                className="w-full h-auto rounded-xl border border-border/30 shadow-lg"
                unoptimized
              />
            </div>
          )}
          
          <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center min-w-48">
            <Download className="w-8 h-8 text-primary mb-3" />
            <button
              onClick={downloadJSON}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 shadow-[0_0_20px_var(--glow-primary)] hover:shadow-[0_0_40px_var(--glow-primary)] w-full"
            >
              Télécharger JSON
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-8">
          {/* En-tête Vin */}
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-primary/30 to-primary/10 border-2 border-primary/50 flex items-center justify-center shrink-0 shadow-[0_0_40px_var(--glow-primary)] animate-pulse-glow relative">
              <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-xl"></div>
              <Wine className="w-12 h-12 text-primary relative z-10" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-4 py-2 rounded-full bg-linear-to-r from-primary/20 to-primary/30 border-2 border-primary/50 text-primary text-sm font-bold uppercase tracking-wider shadow-[0_0_20px_var(--glow-primary)]">
                  🍷 Vin
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-2">{wine.nom || "Vin non identifié"}</h2>
              {wine.appellation && (
                <div className="text-xl text-primary/80 font-semibold mb-4">{wine.appellation}</div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                {wine.millesime && (
                  <div className="glass-hover rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      Millésime
                    </div>
                    <div className="font-semibold text-lg">{wine.millesime}</div>
                  </div>
                )}
                
                {wine.degre_alcool && (
                  <div className="glass-hover rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Droplet className="w-4 h-4" />
                      Degré d&apos;alcool
                    </div>
                    <div className="font-semibold text-lg">{wine.degre_alcool}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Données supplémentaires */}
          {Object.keys(wine).filter(key => !["type", "nom", "millesime", "appellation", "degre_alcool"].includes(key)).length > 0 && (
            <div className="border-t border-border/30 pt-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Grape className="w-5 h-5 text-primary" />
                Détails complémentaires
              </h3>
              <div className="space-y-3">
                {Object.entries(wine)
                  .filter(([key]) => !["type", "nom", "millesime", "appellation", "degre_alcool"].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="glass-hover rounded-xl p-4">
                      <div className="text-sm text-muted-foreground mb-1 capitalize">
                        {key.replace(/_/g, " ")}
                      </div>
                      <div className="font-medium leading-relaxed">
                        {typeof value === "object" && value !== null 
                          ? JSON.stringify(value, null, 2) 
                          : String(value)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Fallback : affichage JSON pour données non reconnues
  return (
    <div className="space-y-6">
      {/* Image et bouton téléchargement */}
      {imageUrl && (
        <div className="flex gap-4 items-start">
          <div className="glass rounded-2xl p-4 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Image analysée</h3>
            </div>
            <Image 
              src={imageUrl} 
              alt="Image analysée" 
              width={800}
              height={600}
              className="w-full h-auto rounded-xl border border-border/30 shadow-lg"
              unoptimized
            />
          </div>
          
          <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center min-w-48">
            <Download className="w-8 h-8 text-primary mb-3" />
            <button
              onClick={downloadJSON}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 shadow-[0_0_20px_var(--glow-primary)] hover:shadow-[0_0_40px_var(--glow-primary)] w-full"
            >
              Télécharger JSON
            </button>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-muted/30 border border-border/30 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold">Résultat de l&apos;analyse</h3>
        </div>
        <div className="bg-muted/30 border border-border/30 rounded-xl p-6 overflow-auto max-h-150">
          <pre className="text-sm whitespace-pre-wrap wrap-break-word">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
