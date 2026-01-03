

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- EXISTING PARADOX CODE (Keep this) ---
const ParadoxSchema = z.object({
  question: z.string(),
  answer: z.string(),
  explanation: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  targetGroup: z.string().optional(),
});

export async function generateDailyParadox(input: { targetGroup: string }) {
  try {
    let complexityInstruction = "";
    switch (input.targetGroup) {
        case 'Novice (Basic 1-3)': complexityInstruction = "Target audience: Kids 6-8. Simple, fun logic. E.g. Patterns, animals."; break;
        case 'Apprentice (Basic 4-6)': complexityInstruction = "Target audience: Kids 9-11. Wordplay, math logic."; break;
        case 'Scholar (JHS)': complexityInstruction = "Target audience: Teens 12-15. Lateral thinking, detective riddles."; break;
        case 'Master (SHS)': complexityInstruction = "Target audience: Young Adults 16+. Complex paradoxes, philosophy."; break;
        default: complexityInstruction = "General audience.";
    }

    const { output } = await ai.generate({
      prompt: `Generate a logic puzzle/riddle. ${complexityInstruction} Output JSON.`,
      output: { schema: ParadoxSchema },
    });
    if (!output) throw new Error("AI returned no data.");
    return { ...output, targetGroup: input.targetGroup };
  } catch (e: any) { throw new Error(e.message); }
}

// --- DEBATE ACTION ---
const DebateSchema = z.object({
    topic: z.string(),
    context: z.string(),
});

export async function generateDebateTopic(input: { targetGroup: string }) {
  try {
    let instruction = "";
    switch (input.targetGroup) {
        case 'Novice (Basic 1-3)':
            instruction = "Target: Ages 6-8. Topics: Fun preferences (e.g., 'Is Summer better than Winter?', 'Cats vs Dogs'). Simple explanations.";
            break;
        case 'Apprentice (Basic 4-6)':
            instruction = "Target: Ages 9-11. Topics: School/Home rules (e.g., 'Should homework be banned?', 'Uniforms').";
            break;
        case 'Scholar (JHS)':
            instruction = "Target: Ages 12-15. Topics: Social issues, Technology (e.g., 'Social Media age limits', 'AI in schools').";
            break;
        case 'Master (SHS)':
            instruction = "Target: Ages 16-19. Topics: Global policy, Ethics, Philosophy (e.g., 'Universal Basic Income', 'Genetic Engineering').";
            break;
        default:
            instruction = "General topics.";
    }

    const prompt = `
      Generate a debate topic.
      ${instruction}
      Output strictly JSON with 'topic' (the question) and 'context' (a 1-sentence background).
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: { schema: DebateSchema },
    });

    if (!output) throw new Error("No data returned");
    
    return { ...output, targetGroup: input.targetGroup };
    
  } catch (error: any) {
    console.error("AI Error:", error);
    throw new Error(error.message);
  }
}

// --- DEBATE ARENA LOGIC ---

const DebateHistorySchema = z.array(z.object({
    role: z.enum(['user', 'ai']),
    content: z.string(),
}));

const DebateTurnInputSchema = z.object({
    topic: z.string(),
    history: DebateHistorySchema,
    userArgument: z.string(),
});

const DebateTurnOutputSchema = z.object({
    rebuttal: z.string().describe("The AI's counter-argument. It should be polite, challenging, and directly address the user's point."),
    critique: z.string().optional().describe("A brief, constructive critique of the user's argument, pointing out logical fallacies or suggesting improvements. Keep it encouraging."),
});


export async function runDebateTurn(input: z.infer<typeof DebateTurnInputSchema>): Promise<z.infer<typeof DebateTurnOutputSchema>> {
    const prompt = `
        You are a polite but skilled debater. 
        The topic is: "${input.topic}".
        
        This is the conversation so far:
        ${input.history.map(m => `${m.role}: ${m.content}`).join('\n')}
        
        The user has just argued: "${input.userArgument}"

        Your task:
        1. Acknowledge their point briefly.
        2. Provide a thoughtful counter-argument or point out a potential logical fallacy in their reasoning to make them think deeper.
        3. Keep your tone encouraging and educational, not confrontational.
        4. Provide a short, constructive critique of their argument.
        
        IMPORTANT: Your response MUST be a direct rebuttal or counter-point to the user's last argument. Do not get stuck on one point. Move the conversation forward.

        Output strictly JSON.
    `;

    try {
        const { output } = await ai.generate({
            prompt,
            output: { schema: DebateTurnOutputSchema },
        });

        if (!output) throw new Error("Debate AI returned no data.");
        return output;

    } catch (error: any) {
        console.error("Debate AI Error:", error);
        throw new Error(error.message);
    }
}

// --- DETECTIVE DESK ACTION ---
const DetectiveSchema = z.object({
  scenario: z.string().describe("The text, headline, or statement to analyze."),
  question: z.string().describe("The specific question to ask the student."),
  caseType: z.enum(['Fact/Opinion', 'Bias Hunter', 'Fallacy Spotter', 'Fake News']),
  options: z.array(z.string()).describe("Options for the student to choose from."),
  correctAnswer: z.string(),
  explanation: z.string().describe("Why is this the correct answer?"),
});

export async function generateDetectiveCase(input: { targetGroup: string }) {
  try {
    let instruction = "";
    switch (input.targetGroup) {
        case 'Novice (Basic 1-3)':
            instruction = "Target: Ages 6-8. Activity: 'Fact vs Opinion'. Generate a simple statement about animals, food, or school. Options: ['Fact', 'Opinion'].";
            break;
        case 'Apprentice (Basic 4-6)':
            instruction = "Target: Ages 9-11. Activity: 'Bias Hunter'. Generate a sentence with emotional/loaded language. Ask which word shows bias. Options: [Word A, Word B, Word C].";
            break;
        case 'Scholar (JHS)':
            instruction = "Target: Ages 12-15. Activity: 'Fake News Spotter'. Generate a sensationalized headline. Ask if it is Reliable or Suspicious. Options: ['Reliable', 'Suspicious'].";
            break;
        case 'Master (SHS)':
            instruction = "Target: Ages 16-19. Activity: 'Fallacy Spotter'. Generate a short argument containing a logical fallacy (Ad Hominem, Strawman, Slippery Slope). Ask to identify the fallacy.";
            break;
        default:
            instruction = "General critical thinking exercise.";
    }

    const prompt = `
      Generate a Critical Thinking 'Detective Case'.
      ${instruction}
      Output strictly JSON.
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: { schema: DetectiveSchema },
    });

    if (!output) throw new Error("No data returned");
    
    return { ...output, targetGroup: input.targetGroup };
    
  } catch (error: any) {
    console.error("AI Error:", error);
    throw new Error(error.message);
  }
}

export async function generateCrosswordAction(topic: string) {
    const prompt = `
    You are a crossword puzzle generator. Create a crossword puzzle about "${topic}".

    STRICT REQUIREMENTS - YOU MUST FOLLOW EXACTLY:

    1. Return ONLY a JSON object, no other text
    2. EVERY clue must have ALL 5 properties: number, clue, answer, row, col
    3. Example of ONE COMPLETE clue:
    {
      "number": 1,
      "clue": "Basic unit of life",
      "answer": "CELL",
      "row": 0,
      "col": 0
    }

    4. Complete example response:
    {
      "title": "Science Puzzle",
      "grid": [
        ["C", "E", "L", "L"],
        ["", "A", "", ""],
        ["", "T", "", ""],
        ["", "O", "", ""],
        ["", "M", "", ""]
      ],
      "clues": {
        "across": [
          {
            "number": 1,
            "clue": "Basic unit of life",
            "answer": "CELL",
            "row": 0,
            "col": 0
          }
        ],
        "down": [
          {
            "number": 2,
            "clue": "Smallest unit of matter",
            "answer": "ATOM",
            "row": 1,
            "col": 1
          }
        ]
      }
    }

    CREATE THE PUZZLE NOW with 4-6 words. Each clue MUST have: number, clue, answer, row, col.
    `;
    
      try {
        const { text } = await ai.generate({
          model: 'googleai/gemini-1.5-flash-latest',
          prompt,
          config: { temperature: 0.7, maxOutputTokens: 4096 },
        });
      
        console.log('Raw AI response:', text);
      
        // Advanced JSON extraction and cleaning
        let jsonText = text
          .replace(/```json\n?/gi, '')
          .replace(/```\n?/g, '')
          .replace(/\/\/.*$/gm, '') // Remove comments
          .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
          .trim();
      
        // Try to extract JSON object
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonText = jsonMatch[0];
        }
      
        console.log('Cleaned JSON:', jsonText);
      
        let output;
        try {
          output = JSON.parse(jsonText);
        } catch (parseError: any) {
          console.error('JSON parse failed:', parseError.message);
          
          // Try to fix common JSON errors
          try {
            // Fix missing quotes around property names
            jsonText = jsonText.replace(/(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
            // Fix single quotes to double quotes
            jsonText = jsonText.replace(/'/g, '"');
            // Remove trailing commas before closing brackets
            jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1');
            
            output = JSON.parse(jsonText);
            console.log('Successfully parsed after fixes');
          } catch (secondError) {
            throw new Error(`Invalid JSON from AI: ${parseError.message}`);
          }
        }
      
        // Validation and fixing function
        const fixClue = (clue: any, grid: string[][], isDown: boolean) => {
          if (clue.row === undefined || clue.col === undefined) {
            const answer = (clue.answer || '').toUpperCase();
            if (!answer) return clue;
            
            for (let r = 0; r < grid.length; r++) {
              for (let c = 0; c < (grid[r] || []).length; c++) {
                if (isDown) {
                  // Check vertical match
                  if (r + answer.length <= grid.length) {
                    const match = answer.split('').every((char, i) => 
                      grid[r + i] && grid[r + i][c] === char
                    );
                    if (match) return { ...clue, row: r, col: c };
                  }
                } else {
                  // Check horizontal match
                  if (c + answer.length <= grid[r].length) {
                    const match = answer.split('').every((char, i) => 
                      grid[r][c + i] === char
                    );
                    if (match) return { ...clue, row: r, col: c };
                  }
                }
              }
            }
          }
          return clue;
        };
      
        // Ensure structure
        if (!output.title) output.title = `${topic} Puzzle`;
        if (!output.grid || !Array.isArray(output.grid)) {
          throw new Error('Invalid or missing grid');
        }
        if (!output.clues) output.clues = { across: [], down: [] };
        if (!Array.isArray(output.clues.across)) output.clues.across = [];
        if (!Array.isArray(output.clues.down)) output.clues.down = [];
      
        // Fix and validate clues
        output.clues.across = output.clues.across
          .map((clue: any) => fixClue(clue, output.grid, false))
          .filter((clue: any) => 
            clue && 
            typeof clue.number === 'number' &&
            clue.clue &&
            clue.answer &&
            typeof clue.row === 'number' &&
            typeof clue.col === 'number'
          );
      
        output.clues.down = output.clues.down
          .map((clue: any) => fixClue(clue, output.grid, true))
          .filter((clue: any) => 
            clue &&
            typeof clue.number === 'number' &&
            clue.clue &&
            clue.answer &&
            typeof clue.row === 'number' &&
            typeof clue.col === 'number'
          );
      
        if (output.clues.across.length === 0 && output.clues.down.length === 0) {
          throw new Error('No valid clues generated');
        }
      
        console.log('Final puzzle:', JSON.stringify(output, null, 2));
        return output;
      
      } catch (error: any) {
        console.error('Puzzle generation failed:', error);
        throw new Error(`Could not generate puzzle: ${error.message}. Please try a different topic.`);
      }
}
    

    

    


