import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI client with standard telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Route: /api/company/lookup
 * Searches authentic BSE/NSE/Screener audited financial data for any Indian company
 */
app.post('/api/company/lookup', async (req: Request, res: Response) => {
  try {
    const { companyName } = req.body;
    if (!companyName || typeof companyName !== 'string') {
      return res.status(400).json({ error: 'Company name is required' });
    }

    const query = companyName.trim();
    if (query.length < 2) {
      return res.status(400).json({ error: 'Company name too short' });
    }

    const prompt = `Search and retrieve the real, official, audited financial statement numbers for the Indian company "${query}".
Fetch the latest available annual audited consolidated numbers (preferably FY24 or FY23) from BSE/NSE filings, Moneycontrol, or Screener.in.

CRITICAL INSTRUCTION: You must provide original, verified data in Indian Crores (₹ Cr). Do not hallucinate or use sample placeholder data.
Search specifically for:
1. Exact registered Company Name
2. NSE Ticker / BSE Scrip Code
3. Sector and Industry
4. Fiscal Year (e.g. FY 2023-24 Audited Consolidated)
5. Revenue from operations (in ₹ Crores)
6. Operating Profit / EBITDA (in ₹ Crores)
7. Net Profit / PAT (in ₹ Crores)
8. Current Assets (in ₹ Crores)
9. Current Liabilities (in ₹ Crores)
10. Total Debt (Long term + Short term borrowings) (in ₹ Crores)
11. Total Equity / Net Worth (in ₹ Crores)
12. Statutory Auditor name
13. Brief 2-sentence description of the company and business model

Return your answer strictly as a raw JSON object with NO markdown formatting, no backticks, just valid JSON matching this schema:
{
  "name": string,
  "tickerNSE": string,
  "tickerBSE": string,
  "sector": string,
  "industry": string,
  "fiscalYear": string,
  "revenue": number,
  "operatingProfit": number,
  "netProfit": number,
  "currentAssets": number,
  "currentLiabilities": number,
  "totalDebt": number,
  "totalEquity": number,
  "auditor": string,
  "summary": string,
  "sourceUrl": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = response.text || '';
    
    // Clean response text to parse JSON
    let jsonText = rawText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.substring(7);
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.substring(3);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.substring(0, jsonText.length - 3);
    }
    jsonText = jsonText.trim();

    // Find JSON block if extra text exists
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonText = jsonText.substring(firstBrace, lastBrace + 1);
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch {
      return res.status(502).json({
        error: 'Unable to parse verified financial figures for ' + query + '. Please try standard company name or select from directory.',
        raw: rawText,
      });
    }

    // Extract grounding URLs if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: Array<{ title: string; url: string }> = [];
    if (groundingChunks && Array.isArray(groundingChunks)) {
      for (const chunk of groundingChunks) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || 'Official Regulatory / Financial Source',
            url: chunk.web.uri,
          });
        }
      }
    }

    return res.json({
      success: true,
      data: parsedData,
      sources,
    });
  } catch (error: any) {
    console.error('Error fetching live financial data:', error);
    return res.status(500).json({
      error: 'Failed to look up official financial data. ' + (error?.message || ''),
    });
  }
});

// Setup Vite in Dev or serve static in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Financial Explorer Server running on port ${PORT}`);
  });
}

startServer();
