import { NextRequest, NextResponse } from "next/server";

const AI_API_KEY = process.env.AI_API_KEY;
const AI_API_URL = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";
const AI_MODEL = process.env.AI_MODEL || "gpt-4o-mini";

const SYSTEM_PROMPT = `You are EcoSphere AI, an ESG (Environmental, Social, Governance) analytics assistant.
You help sustainability professionals understand their ESG data, carbon emissions, compliance requirements, and reporting frameworks.
Answer concisely and use data when possible. Available context:
- ESG frameworks: GRI, TCFD, CDP, SASB, UN SDGs, ISO 14001, EU CSRD
- Carbon scopes: Scope 1 (direct), Scope 2 (purchased energy), Scope 3 (supply chain)
- Typical metrics tracked: carbon footprint (tCO₂e), renewable energy %, compliance rate, DEI metrics, social score, governance score`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    if (!AI_API_KEY) {
      return NextResponse.json({
        choices: [{
          message: {
            role: "assistant",
            content: "AI is not configured yet. To enable real AI responses, add `AI_API_KEY` to your `.env` file. You can use any OpenAI-compatible API key (OpenAI, Azure, Groq, etc.).\n\nFor now, here are your ESG highlights:\n\n• **ESG Score**: 87.4 (+3.2 pts)\n• **Carbon Footprint**: 3,124 tCO₂e (−18.4%)\n• **Compliance Rate**: 94.2%\n• **Top Improvement**: Supply chain Scope 3 emissions need attention — 49% of total footprint."
          }
        }]
      }, { status: 200 });
    }

    const body = {
      model: AI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1024,
    };

    const response = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
        "HTTP-Referer": "https://ecosphere-esg.vercel.app",
        "X-Title": "EcoSphere ESG",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI API error:", response.status, errText);
      return NextResponse.json({ error: `AI API error: ${response.status}` }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("AI chat error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
