import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Récupérer le FormData du frontend
    const formData = await request.formData()
    const image = formData.get("image")

    if (!image || !(image instanceof File)) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Récupérer l'URL de l'API depuis le header (envoyé par le frontend)
    const apiUrl = request.headers.get("x-api-url")

    if (!apiUrl) {
      return NextResponse.json(
        { error: "API endpoint not configured" },
        { status: 400 }
      )
    }

    // Créer un nouveau FormData pour le backend Python
    const pythonFormData = new FormData()
    pythonFormData.append("file", image) // L'API Python attend "file" pas "image"

    // Faire l'appel vers l'API Python
    const response = await fetch(apiUrl, {
      method: "POST",
      body: pythonFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Backend API error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    // Retourner la réponse du backend Python
    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}