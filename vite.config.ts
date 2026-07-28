import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function geminiServerPlugin(): Plugin {
  return {
    name: 'gemini-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/ai/analyze' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { prompt, transactions, wallets, mode } = JSON.parse(body || '{}');
              const apiKey = process.env.GEMINI_API_KEY;
              
              if (!apiKey) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'GEMINI_API_KEY process environment variable is not configured.' }));
                return;
              }

              const ai = new GoogleGenAI({
                apiKey: apiKey,
                httpOptions: {
                  headers: { 'User-Agent': 'aistudio-build' }
                }
              });

              const systemInstruction = `You are SpendChain AI, an elite Stacks & Bitcoin L2 Web3 financial analyst and AI CFO.
Tagline: "Stacks-Native Analytics & Bitcoin L2 Wallet Intelligence."

Your task:
Analyze Stacks (STX) wallet activity, sBTC peg-in/peg-out bridge operations, Proof of Transfer (PoX-4) stacking yields, SIP-010 token holdings (ALEX, WELSH, stSTX, USDA), SIP-009 NFT collections, Clarity smart contract executions, and gas fee optimization across Nakamoto fast blocks.
Provide concise, authoritative, data-driven financial advice.
Format your response using structured Markdown:
- High-level Executive Summary / Stacks Portfolio Takeaways
- Breakdown & Clarity Anomalies (e.g., PoX unlock cycles, unrevoked contract permissions, sBTC peg health, gas micro-fee leaks)
- Strategic Recommendations (e.g. StackingDAO liquid stacking optimization, ALEX DEX arbitrage, BNS domain treasury management)

Be professional, trustworthy, and precise. Focus on USD, STX, and BTC values, Clarity execution safety, and Stacks ecosystem financial clarity.`;

              const response = await ai.models.generateContent({
                model: 'gemini-3.6-flash',
                contents: `Mode/Focus: ${mode || 'General Financial Analysis'}\n\nMonitored Wallets:\n${JSON.stringify(wallets || [], null, 2)}\n\nRecent Wallet Transactions:\n${JSON.stringify(transactions || [], null, 2)}\n\nUser Question/Prompt:\n${prompt}`,
                config: {
                  systemInstruction,
                }
              });

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ text: response.text }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Gemini API Error' }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
