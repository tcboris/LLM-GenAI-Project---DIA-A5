# AI Image Scanner - OCR & Document Analysis Platform

A modern web application that uses AI-powered OCR (Optical Character Recognition) and Google's Gemini AI to automatically extract and structure data from invoices and wine labels.

Made by Antoine RICHARD (Antoine-92) and Charles PERIER (tcboris) as final project for ESILV 5th year subject "LLM & Gen AI".

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
  - [Method 1: Using Docker (Recommended)](#method-1-using-docker-recommended)
  - [Method 2: Local Development](#method-2-local-development)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Tech Stack](#tech-stack)

---

## Overview

This application consists of two main components:

1. **Frontend (Next.js)**: A responsive web interface for uploading images and viewing extracted data
2. **Backend (Python + FastAPI)**: OCR processing and AI-powered data extraction using EasyOCR and Google Gemini

### Key Features

- **Automatic Document Classification**: Detects whether an image is an invoice or wine label
- **Structured Data Extraction**: Extracts relevant fields and organizes them in JSON format
- **Batch Processing**: Upload and process multiple documents simultaneously
- **Multi-language OCR Support**: Supports English and French text recognition
- **Real-time Processing**: Fast analysis with progress indicators
- **Export Functionality**: Download extracted data as JSON
- **Responsive Design**: Works seamlessly on desktop and mobile devices

---

## Architecture

```
┌─────────────────┐
│  Next.js App    │  (Frontend - Port 3000)
│  (localhost)    │
└────────┬────────┘
         │
         │ HTTP POST /api/scan
         │
         ↓
┌─────────────────┐
│  API Proxy      │  (Next.js API Route)
│  (Server-side)  │
└────────┬────────┘
         │
         │ HTTP POST /analyze
         │
         ↓
┌─────────────────┐
│  Python API     │  (FastAPI - Port 8000)
│  EasyOCR +      │
│  Gemini AI      │
└─────────────────┘
```

---

## Prerequisites

### For Docker Installation (Recommended)
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Google Gemini API Key

### For Local Development
- Node.js 18+ and npm
- Python 3.10+
- Google Gemini API Key

---

## Installation & Setup

### Method 1: Using Docker (Recommended)

This method containerizes the Python backend for consistent deployment.

#### Step 1: Clone the Repository

```bash
git clone https://github.com/tcboris/LLM-GenAI-Project---DIA-A5
cd llm_project_ocr
```

#### Step 2: Set Up the Python Backend with Docker

Navigate to the backend directory:

```bash
cd pipeline_ocr
```

Build the Docker image:

```bash
docker build -t ocr-pipeline .
```

Run the container with your Google API key:

```bash
docker run -d -p 8000:8000 -e GOOGLE_API_KEY="your-google-api-key-here" --name ocr-backend ocr-pipeline
```

**Note**: Replace `your-google-api-key-here` with your actual Google Gemini API key.

Verify the backend is running:

```bash
curl http://localhost:8000
```

You should receive: `{"status": "OCR+Gemini API is online!"}`

#### Step 3: Set Up the Frontend

Return to the root directory and install dependencies:

```bash
cd ..
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

#### Step 4: Configure the API Endpoint

1. Open your browser and navigate to `http://localhost:3000`
2. Click on the **Settings** icon in the navigation bar
3. Enter the API endpoint URL: `http://localhost:8000/analyze`
4. Click **Save Configuration**

---

### Method 2: Local Development

If you prefer to run the Python backend without Docker:

#### Step 1: Clone the Repository

```bash
git clone https://github.com/tcboris/LLM-GenAI-Project---DIA-A5
cd llm_project_ocr
```

#### Step 2: Set Up the Python Backend Locally

Navigate to the backend directory:

```bash
cd pipeline_ocr
```

Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Set your Google API key as an environment variable:

```bash
# Linux/Mac
export GOOGLE_API_KEY="your-google-api-key-here"

# Windows (PowerShell)
$env:GOOGLE_API_KEY="your-google-api-key-here"
```

Start the FastAPI server:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

#### Step 3: Set Up the Frontend

Open a new terminal, return to the root directory, and install dependencies:

```bash
cd ..
npm install
```

Start the development server:

```bash
npm run dev
```

#### Step 4: Configure the API Endpoint

Follow the same configuration steps as in Method 1, Step 4.

---

## Configuration

### Environment Variables

#### Backend (Python)

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Your Google Gemini API key | Yes |

#### Frontend (Next.js)

Configuration is stored in the browser's `localStorage`:

- **Python API Endpoint URL**: Set via the Settings page in the web interface

### Obtaining a Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and use it in your environment configuration

---

## Usage Guide

### Step 1: Start the Application

Ensure both the backend and frontend are running:

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

### Step 2: Configure the API Endpoint

1. Navigate to `http://localhost:3000`
2. Click the **Settings** (⚙️) icon
3. Enter your backend URL: `http://localhost:8000/analyze`
4. Click **Save Configuration**

### Step 3: Upload an Image

#### Single File Mode

1. Click the **Scanner** (🔍) icon
2. Either:
   - Drag and drop an image (invoice or wine label)
   - Click **Choose File** to browse your files
3. Supported formats: JPG, PNG, WEBP

#### Batch Processing Mode

For processing multiple documents at once:

1. Click the **Batch** (📁) icon in the navigation
2. Upload multiple files:
   - Drag and drop multiple images into the drop zone
   - Or click to select multiple files from your computer
3. The application will:
   - Process each file sequentially
   - Display real-time progress for each document
   - Show results in a table format
4. Each row in the results table displays:
   - ✅ **File name** with status indicator
   - 📊 **Formatted result** (invoice or wine data)
   - 💾 **Download JSON** button for individual file results
5. At the bottom, view a summary:
   - Total files processed
   - Number of successful extractions
   - Number of errors

**Batch Mode Benefits:**
- Process invoices from an entire month at once
- Bulk digitization of wine cellar inventory
- No need to wait for each file - upload all and let it run
- Individual JSON exports for integration with other systems

### Step 4: View Results

#### Single File Mode

After processing (typically 2-5 seconds), you'll see:

- The original uploaded image for comparison
- Extracted data in a clean, formatted layout
- A **Download JSON** button to export the raw data

#### Batch Mode

Processing time varies based on the number of files. The interface shows:

- **Real-time status** for each file (pending, processing, success, error)
- **Table view** with file names and formatted results
- **Individual download buttons** for each successfully processed file
- **Summary statistics** at the bottom

#### Invoice Data Display

For invoices, the application extracts:
- **Vendor information**:
  - Name
  - SIRET number
  - VAT identification (TVA Intra)
  - Full address
  - Phone number
  - Email
  - Website
- **Invoice details**:
  - Invoice number
  - Date
  - Total amount (TTC)
  - Amount excluding tax (HT)
  - VAT amount
- Any additional fields found in the document

#### Wine Label Data Display

For wine labels, the application extracts:
- Wine name and winery
- Vintage year
- Appellation/region
- Alcohol content
- Additional details

### Step 5: Download Results

Click the **Download JSON** button to save the structured data for further processing or record-keeping.

---

## API Documentation

### Backend Endpoints

#### `GET /`

Health check endpoint.

**Response:**
```json
{
  "status": "OCR+Gemini API is online!"
}
```

#### `POST /analyze`

Analyzes an uploaded image and extracts structured data.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Response (Invoice Example):**
```json
{
  "type": "Facture",
  "date": "25/09/2023",
  "vendeur": {
    "nom": "Alpha paysage",
    "siret": "86491910600089",
    "tva_intra": "FR79 814919108",
    "adresse": "12 rue Charles de Gaulle 69006 LYON",
    "telephone": "0987654321",
    "email": "alpha.paysage@gmail.com",
    "site_web": "www.alphapaysage.fr"
  },
  "montant_total": "6218.85",
  "numero_facture": "F2023-00044"
}
```

**Response (Wine Example):**
```json
{
  "type": "Vin",
  "nom": "Château Margaux",
  "millesime": "2015",
  "appellation": "Margaux, Bordeaux",
  "degre_alcool": "13.5%"
}
```

**Error Response:**
```json
{
  "error": "Error message description",
  "raw_ai": "Raw AI response if parsing failed"
}
```

---

## Troubleshooting

### Backend Issues

**Problem**: Docker container fails to start

**Solution**: 
- Check if port 8000 is already in use: `netstat -ano | findstr :8000`
- Verify your Google API key is correctly set
- Check Docker logs: `docker logs ocr-backend`

**Problem**: OCR model not loading

**Solution**:
- Ensure sufficient disk space (models require ~1GB)
- The first run may take longer as models are downloaded
- Check container logs for download progress

**Problem**: API returns "GOOGLE_API_KEY non définie"

**Solution**:
- Verify the environment variable is set correctly
- Restart the Docker container after setting the key
- Check for typos in the key

### Frontend Issues

**Problem**: CORS errors in browser console

**Solution**:
- The application uses an API proxy to avoid CORS issues
- Ensure you're accessing the frontend via `http://localhost:3000`
- Verify the backend URL is correctly configured in Settings

**Problem**: "API endpoint not configured" error

**Solution**:
- Navigate to Settings and enter the backend URL
- Use the full URL: `http://localhost:8000/analyze`
- Click Save Configuration

**Problem**: Image upload fails

**Solution**:
- Check image file size (recommended < 10MB)
- Verify image format is supported (JPG, PNG, WEBP)
- Ensure the backend is running and accessible

### Performance Issues

**Problem**: Slow processing times

**Solution**:
- Reduce image resolution before uploading
- Ensure sufficient RAM is available (recommended 4GB+)
- For Docker: allocate more resources in Docker Desktop settings

---

## Tech Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library

### Backend
- **Python 3.10**: Core programming language
- **FastAPI**: Modern API framework
- **EasyOCR**: OCR engine for text extraction
- **Google Gemini AI**: LLM for intelligent data structuring
- **OpenCV**: Image processing
- **Uvicorn**: ASGI server

### Infrastructure
- **Docker**: Containerization
- **Next.js API Routes**: CORS-free proxy layer

---

## Development

### Running Tests

```bash
# Frontend tests (if configured)
npm test

# Backend tests (if configured)
cd pipeline_ocr
pytest
```

### Building for Production

#### Frontend

```bash
npm run build
npm start
```

#### Backend

The Docker image is production-ready. For deployment:

1. Push the image to a container registry
2. Deploy to your hosting platform (AWS ECS, Google Cloud Run, etc.)
3. Set environment variables in your deployment configuration

---

## License

This project is private and proprietary.

---

## Support

For issues, questions, or contributions, please contact the development team or open an issue in the repository.
