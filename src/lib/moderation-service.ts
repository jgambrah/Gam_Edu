/**
 * Automated Toxicity & Keyword Moderation Shield for GAM Edu
 * Combining zero-cost local Regex filtering with Google Gemini AI Context Scanning.
 */

// Local high-speed blocked phrases and toxicity patterns ($0.00 cost)
const BLOCKED_PATTERNS = [
  /useless\s+(school|teacher|headmaster|principal|management|admin)/i,
  /worst\s+(school|teacher|headmaster|principal|management)/i,
  /stole|stealing|thief|scam|fraud/i,
  /refuse\s+to\s+pay|won't\s+pay|not\s+paying/i,
  /stupid|idiot|fool|nonsense|rubbish|dumb|lazy/i,
  /sue\s+the\s+school|lawyer|court|police/i,
  /fuck|shit|bitch|bastard|asshole|crap/i,
];

export interface ModerationResult {
  isPassed: boolean;
  flaggedBy: 'local_filter' | 'ai_shield' | 'none';
  reason?: string;
}

/**
 * Step 1: Local Zero-Cost Keyword & Pattern Moderation ($0.00)
 */
export function checkLocalToxicityFilter(text: string): ModerationResult {
  if (!text || !text.trim()) {
    return { isPassed: true, flaggedBy: 'none' };
  }

  const cleanText = text.trim();

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(cleanText)) {
      return {
        isPassed: false,
        flaggedBy: 'local_filter',
        reason: 'Flagged by Local Safety Filter: Contains sensitive, hostile, or inappropriate terminology. Please rephrase or contact the school office directly.'
      };
    }
  }

  return { isPassed: true, flaggedBy: 'none' };
}

/**
 * Step 2: Gemini AI Context & Sentiment Analysis
 * Evaluates subtle harassment or hostility (covered under Google's 1,500 daily free calls).
 */
export async function runGeminiAiContentCheck(text: string, title?: string): Promise<ModerationResult> {
  // Run zero-cost local check first
  const localCheck = checkLocalToxicityFilter(text);
  if (!localCheck.isPassed) {
    return localCheck;
  }

  const combinedContent = title ? `${title}\n${text}` : text;

  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback cleanly to local filter if AI API key is not configured
      return { isPassed: true, flaggedBy: 'none' };
    }

    const prompt = `You are a strict school community moderation AI for a K-12 school portal. Analyze the following parent text for hostility, harassment, profanity, attacks on teachers/staff, or defamatory claims.
    
Text to evaluate:
"${combinedContent}"

Respond strictly with a JSON object:
{"isPassed": true/false, "reason": "Short explanation if flagged or empty if clean"}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!res.ok) {
      return { isPassed: true, flaggedBy: 'none' };
    }

    const data = await res.json();
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) {
      return { isPassed: true, flaggedBy: 'none' };
    }

    const parsed = JSON.parse(resultText);
    return {
      isPassed: Boolean(parsed.isPassed),
      flaggedBy: parsed.isPassed ? 'none' : 'ai_shield',
      reason: parsed.reason || 'Flagged by AI Community Safety Shield.'
    };
  } catch (err) {
    console.warn('[AI MODERATION WARNING] Gemini AI check bypassed, fallback to local filter.', err);
    return { isPassed: true, flaggedBy: 'none' };
  }
}
