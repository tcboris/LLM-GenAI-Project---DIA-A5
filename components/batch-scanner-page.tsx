'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2, FileText, Wine, CheckCircle, XCircle } from 'lucide-react';

interface ScanResult {
  fileName: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  data?: unknown;
  error?: string;
}

export default function BatchScannerPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      await processFiles(files);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFiles(Array.from(files));
    }
  };

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);
    
    // Initialize results with pending status
    const initialResults: ScanResult[] = files.map((file) => ({
      fileName: file.name,
      status: 'pending',
    }));
    setResults(initialResults);

    // Process each file sequentially
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Update status to processing
      setResults((prev) =>
        prev.map((result, index) =>
          index === i ? { ...result, status: 'processing' } : result
        )
      );

      try {
        // Call the same endpoint as the scanner page
        const apiUrl = localStorage.getItem('pythonApiUrl') || 'http://localhost:8000/analyze';
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/scan', {
          method: 'POST',
          headers: {
            'x-api-url': apiUrl,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Update status to success with data
        setResults((prev) =>
          prev.map((result, index) =>
            index === i
              ? { ...result, status: 'success', data }
              : result
          )
        );
      } catch (error) {
        // Update status to error
        setResults((prev) =>
          prev.map((result, index) =>
            index === i
              ? {
                  ...result,
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Unknown error',
                }
              : result
          )
        );
      }
    }

    setIsProcessing(false);
  };

  const renderCellContent = (result: ScanResult) => {
    if (result.status === 'pending') {
      return <span className="text-muted-foreground">En attente...</span>;
    }

    if (result.status === 'processing') {
      return (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Traitement en cours...</span>
        </div>
      );
    }

    if (result.status === 'error') {
      return (
        <div className="flex items-center gap-2 text-destructive">
          <XCircle className="h-4 w-4" />
          <span>{result.error}</span>
        </div>
      );
    }

    if (result.status === 'success' && result.data) {
      const data = result.data as Record<string, unknown>;
      const type = (data.type as string)?.toLowerCase();

      if (type === 'facture') {
        const vendorInfo = typeof data.vendeur === 'object' && data.vendeur !== null ? data.vendeur as Record<string, unknown> : null;
        const vendorName = vendorInfo?.nom ? String(vendorInfo.nom) : (typeof data.vendeur === 'string' ? data.vendeur : '-');
        
        const numeroFacture: string | null = typeof data.numero_facture === 'string' ? data.numero_facture : typeof data.numero === 'string' ? data.numero : null;
        const montantTotal: string | null = typeof data.montant_total === 'string' ? data.montant_total : typeof data.montant_ttc === 'string' ? data.montant_ttc : null;
        
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">Facture</span>
            </div>
            
            {/* Informations principales */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
              <span className="text-muted-foreground font-medium">Numéro:</span>
              <span className="font-semibold">{(numeroFacture as string | null) ?? '-'}</span>
              {typeof data.date === 'string' && (
                <>
                  <span className="text-muted-foreground font-medium">Date:</span>
                  <span>{data.date}</span>
                </>
              )}
              <span className="text-muted-foreground font-medium">Vendeur:</span>
              <span>{vendorName}</span>
              <span className="text-muted-foreground font-medium">Montant Total:</span>
              <span className="font-bold text-primary">{(montantTotal as string | null) ?? '-'}</span>
              {typeof data.montant_ht === 'string' && (
                <>
                  <span className="text-muted-foreground font-medium">Montant HT:</span>
                  <span>{data.montant_ht}</span>
                </>
              )}
              {typeof data.tva === 'string' && (
                <>
                  <span className="text-muted-foreground font-medium">TVA:</span>
                  <span>{data.tva}</span>
                </>
              )}
            </div>
            
            {/* Informations vendeur détaillées */}
            {vendorInfo && (typeof vendorInfo.siret === 'string' || typeof vendorInfo.tva_intra === 'string' || typeof vendorInfo.adresse === 'string') && (
              <div className="border-t border-border/30 pt-2 mt-2">
                <div className="text-xs font-semibold text-muted-foreground mb-1.5">Vendeur</div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                  {typeof vendorInfo.siret === 'string' && (
                    <>
                      <span className="text-muted-foreground">SIRET:</span>
                      <span className="font-mono">{String(vendorInfo.siret)}</span>
                    </>
                  )}
                  {typeof vendorInfo.tva_intra === 'string' && (
                    <>
                      <span className="text-muted-foreground">TVA Intra:</span>
                      <span className="font-mono">{String(vendorInfo.tva_intra)}</span>
                    </>
                  )}
                  {typeof vendorInfo.adresse === 'string' && (
                    <>
                      <span className="text-muted-foreground">Adresse:</span>
                      <span className="col-span-1">{String(vendorInfo.adresse)}</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      }

      if (type === 'vin') {
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Wine className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">Vin</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {typeof data.nom === 'string' && (
                <>
                  <span className="text-muted-foreground">Nom:</span>
                  <span className="font-medium">{data.nom}</span>
                </>
              )}
              {typeof data.appellation === 'string' && (
                <>
                  <span className="text-muted-foreground">Appellation:</span>
                  <span>{data.appellation}</span>
                </>
              )}
              {typeof data.millesime === 'string' && (
                <>
                  <span className="text-muted-foreground">Millésime:</span>
                  <span>{data.millesime}</span>
                </>
              )}
              {typeof data.cepage === 'string' && (
                <>
                  <span className="text-muted-foreground">Cépage:</span>
                  <span>{data.cepage}</span>
                </>
              )}
              {typeof data.pays === 'string' && (
                <>
                  <span className="text-muted-foreground">Pays:</span>
                  <span>{data.pays}</span>
                </>
              )}
              {typeof data.degre_alcool === 'string' && (
                <>
                  <span className="text-muted-foreground">Degré:</span>
                  <span>{data.degre_alcool}</span>
                </>
              )}
            </div>
          </div>
        );
      }

      return <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>;
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Traitement par lots</h1>
        <p className="text-muted-foreground">
          Déposez plusieurs fichiers images pour les traiter en une seule fois
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-colors duration-200
          ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={isProcessing}
        />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg mb-2">
          {isProcessing
            ? 'Traitement en cours...'
            : 'Déposez vos fichiers ici ou cliquez pour sélectionner'}
        </p>
        <p className="text-sm text-muted-foreground">
          Formats supportés: PNG, JPG, JPEG, WebP
        </p>
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold w-1/4">Nom du fichier</th>
                <th className="px-4 py-3 text-left font-semibold">Résultat</th>
                <th className="px-4 py-3 text-center font-semibold w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {results.map((result, index) => (
                <tr key={index} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center gap-2">
                      {result.status === 'success' && (
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      )}
                      {result.status === 'error' && (
                        <XCircle className="h-4 w-4 text-destructive shrink-0" />
                      )}
                      {result.status === 'processing' && (
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                      )}
                      <span className="font-mono text-sm break-all">{result.fileName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">{renderCellContent(result)}</td>
                  <td className="px-4 py-4 text-center">
                    {result.status === 'success' && result.data !== undefined && (
                      <button
                        onClick={() => {
                          const jsonString = JSON.stringify(result.data as Record<string, unknown>, null, 2);
                          const blob = new Blob([jsonString], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `${result.fileName.replace(/\.[^/.]+$/, '')}-result.json`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          URL.revokeObjectURL(url);
                        }}
                        className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        JSON
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {results.length > 0 && !isProcessing && (
        <div className="flex items-center gap-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="font-semibold">{results.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Réussis:</span>
            <span className="font-semibold">
              {results.filter((r) => r.status === 'success').length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-muted-foreground">Erreurs:</span>
            <span className="font-semibold">
              {results.filter((r) => r.status === 'error').length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
