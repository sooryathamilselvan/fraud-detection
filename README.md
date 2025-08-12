# Gemini API Frontend - Credit Card Fraud Detection

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/sooryathamilselvan-8664s-projects/v0-gemini-api-frontend)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/10PhvEjUFK9)

## Overview

A professional credit card fraud detection system powered by Google's Gemini AI API. This application provides an immersive frontend interface for analyzing credit card transactions and determining their validity using advanced AI analysis.

## Features

- **Interactive Form Interface**: Professional, responsive form for collecting transaction data
- **Real-time AI Analysis**: Integration with Google Gemini API for fraud detection
- **Comprehensive Data Collection**: Captures all relevant transaction details including merchant info, location, timing, and customer data
- **Visual Results Display**: Clean, intuitive display of analysis results with confidence scores
- **Secure API Key Management**: Environment-based configuration for API credentials

## Setup Instructions

### 1. Get Your Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key for the Gemini API
3. Copy your API key

### 2. Configure Environment Variables
Create a `.env.local` file in your project root:

\`\`\`env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

Replace `your_gemini_api_key_here` with your actual Gemini API key.

### 3. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 4. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## How It Works

1. **Data Collection**: Users fill out a comprehensive form with transaction details
2. **AI Analysis**: Transaction data is sent to Google's Gemini API with a structured prompt
3. **Result Processing**: The AI response is parsed and displayed with confidence scores
4. **Visual Feedback**: Results are presented in an intuitive interface with color-coded status indicators

## Technology Stack

- **Frontend**: Next.js 14 with React
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Integration**: Google Gemini API
- **Deployment**: Vercel

## Deployment

Your project is live at:

**[https://vercel.com/sooryathamilselvan-8664s-projects/v0-gemini-api-frontend](https://vercel.com/sooryathamilselvan-8664s-projects/v0-gemini-api-frontend)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/10PhvEjUFK9](https://v0.app/chat/projects/10PhvEjUFK9)**

## Auto-Sync

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).
