import os
import json
import uvicorn
import cv2
import numpy as np
import easyocr
import google.generativeai as genai
from fastapi import FastAPI, File, UploadFile, HTTPException

# ---------------- CONFIGURATION ----------------
# On récupère la clé API depuis les variables d'environnement Docker
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    print("⚠️ WARNING: GOOGLE_API_KEY non définie !")
else:
    genai.configure(api_key=GOOGLE_API_KEY)

# Initialisation des modèles (Au démarrage pour éviter de recharger à chaque requête)
print("⏳ Chargement du modèle OCR...")
reader = easyocr.Reader(['en', 'fr'], gpu=False) # Mettre gpu=True si vous avez configuré NVIDIA Docker
print("✅ Modèle OCR chargé.")

print("🤖 Chargement du modèle Gemini...")
model = genai.GenerativeModel('gemini-2.5-flash-lite')
print("✅ Modèle Gemini prêt.")

app = FastAPI()

# ---------------- LOGIQUE METIER ----------------
def clean_json_text(text):
    text = text.replace("```json", "").replace("```", "").strip()
    return text

def process_image(img_cv):
    # 1. OCR
    result_ocr = reader.readtext(img_cv, detail=0)
    raw_text = " ".join(result_ocr)
    
    # 2. Gemini Prompt
    prompt = f"""
    Tu es un assistant expert en extraction de données.
    Analyse ce texte brut OCR : "{raw_text}"
    
    Détermine si c'est 'Facture' ou 'Vin'.
    
    Si FACTURE, extrais (JSON) :
    - type: "Facture"
    - date (JJ/MM/AAAA)
    - vendeur
    - montant_total
    - numero_facture
    
    Si VIN, extrais (JSON) :
    - type: "Vin"
    - nom
    - millesime
    - appellation
    - degre_alcool
    
    Réponds UNIQUEMENT en JSON valide.
    """
    
    try:
        response = model.generate_content(prompt)
        parsed_json = json.loads(clean_json_text(response.text))
        return parsed_json
    except Exception as e:
        print(f"Erreur Gemini/Parsing: {e}")
        return {"error": "Echec de l'analyse IA", "details": str(e)}

# ---------------- API ENDPOINTS ----------------
@app.get("/")
def home():
    return {"status": "API OCR Gemini Dockerisée en ligne !"}

@app.post("/analyze")
async def analyze_endpoint(file: UploadFile = File(...)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Le fichier doit être une image.")

    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img_cv = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        result = process_image(img_cv)
        return result

    except Exception as e:
        return {"error": str(e)}

# Le bloc suivant permet de lancer via "python main.py" en local si besoin
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)