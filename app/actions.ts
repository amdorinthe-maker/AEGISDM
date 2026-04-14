'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function generateAIGent(type: 'encounter' | 'loot' | 'npc', context: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash",
        generationConfig : {
            responseMimeType: "application/json",
        }
     });
    let prompt = "";

if (type === 'npc') {
      // Check if we want a structured object (for the Manager) or a story (for the Hub)
      const isManagerCall = context.includes("DATA_ONLY");
      
      if (isManagerCall) {
        prompt = `Generate a D&D 5e NPC for a ${context.replace("DATA_ONLY", "")} setting. 
        Return ONLY a JSON object with these keys: "name", "race", "role", "lore", "appearance_tags".
        appearance_tags should be 3-4 keywords like 'scarred', 'hooded', 'noble', 'bearded'.
        Lore should be 2 sentences and include a secret.`;
      } else {
        prompt = `You are an expert DM. Generate a unique D&D 5e NPC for a ${context} setting. 
        Structure the response as follows:
        ### [Name], [Race/Occupation]
        **Appearance:** [1 sentence on a notable physical feature]
        **Personality/Voice:** [How they talk and their general vibe]
        **Core Motivation:** [What do they want right now?]
        **The Secret:** [One thing they are hiding from the party]
        **The Hook:** [Why would they approach the party or need help?]`;
      }
    }
    else if (type === 'loot') {
      prompt = `You are an expert D&D 5e DM. Generate a unique, high-flavor loot item for a ${context} Tier party (Low: Lv 1-4, Mid: Lv 5-10, High: Lv 11+).
      Structure the response like this:
      ### [Item Name]
      **Rarity/Type:** [e.g., Rare Wondrous Item]
      **Visuals:** [1 sentence on appearance]
      **Effect:** [2 sentences on what it does mechanically]
      **The Quirk:** [1 sentence on a minor, non-mechanical personality trait or history of the item]
      **Gold Value:** [Appropriate GP amount]`;
    } 
    else {
      // Default to Encounter
      prompt = `You are an expert D&D 5e DM. Generate a unique random encounter for a ${context} environment. 
      Include a creative title, the primary conflict, and a "twist" that makes it more than just a simple fight. 
      Include DC checks and potential rewards.`;
    }

    const result = await model.generateContent(prompt);
    return { text: result.response.text() };

  } catch (error) {
    console.error("AI Error:", error);
    return { text: JSON.stringify({
        name: "Connection Interupted",
        race: "System",
        role: "Error",
        lore: "The threads of the multiverse are tangled... the AI couldn't generate content right now. Try again in a moment!",
        appearance_tags: "glitching, static, red"
    })
     };
  }
}
// app/actions.ts
export async function generateNPCPortrait(appearance: string) {
  try {
    // We use the specialized Nano Banana 2 model for image generation
    // This is the model that powers "Gemini 3 Flash Image"
    const prompt = `A professional D&D character portrait, fantasy style, digital oil painting. 
    Character details: ${appearance}. Cinematic lighting, detailed face, neutral background.`;

    // Internal tool call for image generation
    const result = await image_generation({ 
      prompt: prompt,
      aspect_ratio: "1:1" 
    });

    // We return the generated URL
    return { imageUrl: result.image_url }; 

} catch (error) {
  console.error("AI Error:", error);
  // Return a valid JSON string even in failure
  return { 
    text: JSON.stringify({
      name: "Tangled Weave",
      race: "Magic",
      role: "Error",
      lore: "The weave of magic is tangled... try again in a moment!",
      appearance_tags: "mystical energy"
    })
  };
}}

