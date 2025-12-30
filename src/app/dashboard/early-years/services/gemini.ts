
'use client';

import { GoogleGenAI, Modality, Type } from "@google/genai";

// Use API key directly from process.env.API_KEY as per guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLessonImage = async (prompt: string): Promise<string | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error: any) {
    console.error("Image generation error:", error);
    return null;
  }
};

export const generateTTS = async (text: string, voice: string = 'Kore'): Promise<string | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error: any) {
    if (error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      console.error("TTS quota exceeded. User needs to select a paid API key.");
      throw new Error("QUOTA_EXCEEDED");
    }
    console.error("TTS generation error:", error);
    return null;
  }
};

export const generateRhyme = async (topic: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a very simple 4-line nursery rhyme for a 3-year-old about ${topic}. Use simple words, rhythm, and a cheerful tone. Only return the rhyme text.`,
  });
  return response.text || "La la la, let's sing a song!";
};

export const generateNumeracyTask = async (type: 'patterns' | 'one-to-one' | 'number-order', topic: string): Promise<any | null> => {
  const ai = getAI();
  try {
    let schema: any;
    if (type === 'patterns') {
      schema = {
        type: Type.OBJECT,
        properties: {
          sequence: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Array of FontAwesome icon names without fa- prefix, e.g. ["circle", "square", "circle", "square"]' },
          next: { type: Type.STRING, description: 'The icon that comes next' },
          options: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of icon options including the correct one' }
        },
        required: ['sequence', 'next', 'options']
      };
    } else if (type === 'one-to-one') {
      schema = {
        type: Type.OBJECT,
        properties: {
          count: { type: Type.INTEGER, description: 'Number of items to match (1-5)' },
          character: { type: Type.STRING, description: 'FontAwesome class for the recipient, e.g. "fa-cat"' },
          item: { type: Type.STRING, description: 'FontAwesome class for the object, e.g. "fa-fish"' },
          name: { type: Type.STRING, description: 'Plural name of recipients' },
          itemName: { type: Type.STRING, description: 'Plural name of items' }
        },
        required: ['count', 'character', 'item', 'name', 'itemName']
      };
    } else {
      schema = {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: 'after, before, or between' },
          question: { type: Type.STRING },
          answer: { type: Type.INTEGER },
          options: { type: Type.ARRAY, items: { type: Type.INTEGER } }
        },
        required: ['type', 'question', 'answer', 'options']
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a Nursery 1 (3-year-old) math task for '${type}' related to '${topic}'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Numeracy task generation error:", error);
    return null;
  }
};

export const generateConceptDetails = async (name: string, type: 'colors' | 'shapes' | 'feelings' | 'sizes'): Promise<any | null> => {
  const ai = getAI();
  try {
    let schema: any = {
      type: Type.OBJECT,
      properties: {
        prompt: { type: Type.STRING, description: 'A simple visual prompt for image generation.' },
        explanation: { type: Type.STRING, description: 'A friendly 1-sentence explanation.' },
        meta: { type: Type.STRING, description: 'Hex code for colors, FA icon for shapes, sound-word for feelings.' }
      },
      required: ['prompt', 'explanation', 'meta']
    };

    if (type === 'sizes') {
      schema = {
        type: Type.OBJECT,
        properties: {
          pair: { type: Type.STRING, description: 'The name of the comparison, e.g. "Heavy and Light".' },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                prompt: { type: Type.STRING },
                key: { type: Type.STRING, description: 'e.g. "heavy" or "light"' }
              },
              required: ['label', 'prompt', 'key']
            }
          },
          explanation: { type: Type.STRING, description: 'Combined explanation of the pair.' }
        },
        required: ['pair', 'items', 'explanation']
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate educational details for a 3-year-old about the ${type} concept: '${name}'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Concept details generation error:", error);
    return null;
  }
};

export const generateArtDetails = async (name: string, type: 'shapes' | 'textures'): Promise<any | null> => {
  const ai = getAI();
  try {
    let schema: any;
    if (type === 'shapes') {
      schema = {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING, description: 'A kid-friendly instruction like "Draw a circle for the head and dots for eyes!"' },
          parts: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING }, 
            description: 'List of basic shapes required: Circle, Square, Triangle.' 
          }
        },
        required: ['description', 'parts']
      };
    } else {
      schema = {
        type: Type.OBJECT,
        properties: {
          prompt: { type: Type.STRING, description: 'A detailed macro photo prompt for this texture.' },
          description: { type: Type.STRING, description: 'A spoken reaction like "Ooh! This is so bumpy and rough!"' }
        },
        required: ['prompt', 'description']
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate educational Nursery 1 (3-year-old) art content for '${name}' in the category of '${type}'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Art details generation error:", error);
    return null;
  }
};

export const generateAnimalDetails = async (animalName: string): Promise<{ sound: string; fact: string } | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a simple sound and a fun fact for a Nursery 1 student (3 years old) about the animal: ${animalName}.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sound: { type: Type.STRING, description: 'A simple onomatopoeic sound like Moo, Woof, or Buzz.' },
            fact: { type: Type.STRING, description: 'A very simple, short one-sentence fact for a toddler.' }
          },
          required: ['sound', 'fact']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Animal details generation error:", error);
    return null;
  }
};

export const generateSkillDetails = async (name: string, type: 'observation' | 'curiosity' | 'care'): Promise<any | null> => {
  const ai = getAI();
  try {
    let schema: any;
    if (type === 'observation') {
      schema = {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          macro: { type: Type.STRING, description: 'A detailed prompt for a close-up macro texture shot.' },
          full: { type: Type.STRING, description: 'A prompt for the full object in a nursery setting.' }
        },
        required: ['name', 'macro', 'full']
      };
    } else if (type === 'curiosity') {
      schema = {
        type: Type.OBJECT,
        properties: {
          q: { type: Type.STRING, description: 'A simple "Why" or "How" question for a toddler.' },
          a: { type: Type.STRING, description: 'A simple 1-sentence magical explanation.' }
        },
        required: ['q', 'a']
      };
    } else {
      schema = {
        type: Type.OBJECT,
        properties: {
          task: { type: Type.STRING },
          action: { type: Type.STRING },
          icon: { type: Type.STRING, description: 'A FontAwesome icon class like fa-heart.' },
          before: { type: Type.STRING, description: 'Prompt for the "sad/dirty/hungry" state.' },
          after: { type: Type.STRING, description: 'Prompt for the "happy/clean/fed" state.' }
        },
        required: ['task', 'action', 'icon', 'before', 'after']
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a Nursery 1 (3-year-old) science skill activity for '${name}' in the category of '${type}'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Skill details generation error:", error);
    return null;
  }
};

export const generateSongVideo = async (prompt: string): Promise<string | null> => {
  const ai = getAI();
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `A bright, colorful 3D nursery rhyme animation of ${prompt}. Playful, friendly characters, simple shapes, high quality, kid-friendly.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) return null;

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Video generation error:", error);
    return null;
  }
};

    