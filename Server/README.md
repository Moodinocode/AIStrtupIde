# Venture Mind Forge Server

Backend server for the Venture Mind Forge startup idea evaluator.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview  # Optional, defaults to gpt-4-turbo-preview
```

## Running the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### POST /api/evaluate-idea

Evaluates a startup idea and returns detailed feedback using OpenAI's GPT model.

Request body:

```json
{
  "description": "string",
  "location": "string",
  "audience": "string",
  "pricingModel": "string",
  "industry": "string"
}
```

Response:

```json
{
  "successScore": number,
  "strengths": string[],
  "weaknesses": string[],
  "marketPotential": string,
  "competition": string,
  "locationInsights": string,
  "improvements": string[],
  "monetization": string[],
  "mvpSuggestion": string
}
```

### GET /health

Health check endpoint to verify server status.
