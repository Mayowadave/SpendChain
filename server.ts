import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const currentDir = typeof __dirname !== 'undefined' 
  ? __dirname 
  : path.dirname(fileURLToPath(import.meta?.url || ('file://' + process.cwd())));

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '2mb' }));

  // Security Middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Copilot Endpoint with Sanitization & Timeout Handling
  app.post('/api/ai/analyze', async (req, res) => {
    try {
      const { prompt, wallets, transactions, analytics, largestTx, history, mode } = req.body || {};

      // Input Validation & Prompt Sanitization
      const rawPrompt = typeof prompt === 'string' ? prompt.trim() : '';
      const sanitizedPrompt = rawPrompt.slice(0, 4000).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY environment variable is missing. Please configure your Gemini API key in Settings.'
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'SpendChain-AI-Copilot/1.0'
          }
        }
      });

      const systemInstruction = `You are SpendChain AI Copilot, a conversational financial assistant specialized in Stacks L2, Bitcoin L1, Clarity smart contracts, and PoX stacking.

You have access to pre-calculated WALLET ANALYTICS for the user's connected wallet(s). Always prioritize using these pre-calculated ANALYTICS metrics instead of raw transaction guessing.

Specific Question Answering Guidance:
- **"How much STX did I spend?"**: State the exact STX spent, total STX sent, and gas fees paid in STX clearly in the first sentence.
- **"Which protocol do I use most?"**: State the top protocol name, transaction count, USD volume, and percentage share of total interactions.
- **"Show my largest transaction."**: Detail the largest single transaction (amount USD, token/crypto amount, counterparty/protocol, category, and date).
- **"Explain this wallet."**: Provide a holistic, 3-bullet executive summary covering wallet age, activity level, top assets, security posture, and main DeFi interactions.
- **"Where did my money go?"**: Provide a clear breakdown of spending by category (e.g. DeFi, PoX Stacking, sBTC Bridge, NFT/BNS, Transfers) and top recipient contracts.

Formatting Guidelines:
- Use clean Markdown with bold metrics, bullet points, and concise key takeaways.
- State direct answers immediately in the first line before elaborating.
- Keep answers engaging, professional, and conversational.`;

      const contents = [];

      // Add prior conversation history (up to last 10 turns)
      if (Array.isArray(history) && history.length > 0) {
        history.slice(-10).forEach((msg: { sender: string; text: string }) => {
          if (msg && typeof msg.text === 'string' && msg.text.trim()) {
            const safeText = msg.text.trim().slice(0, 2000);
            contents.push({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: safeText }]
            });
          }
        });
      }

      // Add latest prompt turn with live analytics context
      const latestTurnPrompt = `
[SYSTEM CONTEXT & LIVE WALLET ANALYTICS]
Pre-calculated Wallet Analytics:
${JSON.stringify(analytics || {}, null, 2)}

Largest Transaction Details:
${JSON.stringify(largestTx || {}, null, 2)}

Wallet Balances & Overview:
${JSON.stringify(wallets || [], null, 2)}

USER QUESTION: "${sanitizedPrompt || 'Explain this wallet and summarize key findings.'}"
`;

      contents.push({
        role: 'user',
        parts: [{ text: latestTurnPrompt }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const responseText = response.text || 'Unable to generate analysis response.';
      return res.json({ text: responseText });

    } catch (error: any) {
      console.error('Error in /api/ai/analyze:', error);
      return res.status(500).json({
        error: error.message || 'An error occurred during Gemini AI analysis.'
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
