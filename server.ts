import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // AI Copilot Endpoint
  app.post('/api/ai/analyze', async (req, res) => {
    try {
      const { prompt, wallets, transactions, mode } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY environment variable is missing. Please configure your Gemini API key.'
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const systemInstruction = `You are SpendChain AI Copilot, an expert Stacks and Bitcoin L2 financial analyst.
Analyze the user's Stacks wallets and recent Clarity smart contract transactions carefully.
Provide clear, actionable, executive financial advice in clear Markdown format.
Highlight key takeaways like PoX Stacking yield, sBTC bridge holdings, gas fee efficiency, and transaction activity.
Keep responses concise, direct, professional, and well-structured with bold key metrics.`;

      const contextPrompt = `
User Prompt: ${prompt || 'Perform a general financial audit of my Stacks wallet.'}
Audit Mode: ${mode || 'Stacks Financial Intelligence'}

Connected Wallets Data:
${JSON.stringify(wallets || [], null, 2)}

Recent Transactions Data:
${JSON.stringify(transactions || [], null, 2)}

Provide a helpful, precise analysis based on this context.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: contextPrompt,
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
