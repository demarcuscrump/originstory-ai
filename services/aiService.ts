import OpenAI from 'openai';
import { Character, GameAction, GameEvent, Stats, ActionCategory, Nemesis, Upgrade, Crisis, NPC, MinorVillain, Sidekick, Alignment, OriginArchetype, IncitingIncident, UniverseTone } from "../types";

// Initialize OpenRouter Client via OpenAI SDK
const ai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || "dummy", // Prevents crash if not set, but won't work
  dangerouslyAllowBrowser: true, // Required for Vite/React client-side calls
  defaultHeaders: {
    "HTTP-Referer": window.location.href, // Recommended by OpenRouter
    "X-Title": "Origin Story", // Recommended by OpenRouter
  }
});

const TEXT_MODEL = import.meta.env.VITE_OPENROUTER_TEXT_MODEL || 'anthropic/claude-3.5-haiku';
const IMAGE_MODEL = import.meta.env.VITE_OPENROUTER_IMAGE_MODEL || 'openai/gpt-5.4-image-2';

// Safety wrapper to prevent UI crashes if AI fails
const safeJSONParse = (text: string, fallback: any, expectedType: 'ARRAY' | 'OBJECT' | 'ANY' = 'ANY') => {
    if (!text) return fallback;
    try {
        const cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedText);
        if (expectedType === 'ARRAY' && !Array.isArray(parsed)) return fallback;
        if (expectedType === 'OBJECT' && (typeof parsed !== 'object' || Array.isArray(parsed))) return fallback;
        return parsed;
    } catch (e) {
        console.warn("AI returned malformed JSON, using fallback.", e);
        return fallback;
    }
};

export const analyzeCharacterConcept = async (concept: string): Promise<Partial<Character> | null> => {
  if (!import.meta.env.VITE_OPENROUTER_API_KEY || !concept) return null;

  const prompt = `
    Analyze this comic book character concept: "${concept}".
    Map it to the closest fitting Game Mechanics.
    If the concept is vague, make creative assumptions.
    Return ONLY a JSON object matching this structure:
    {
      "origin": "String (one of the archetypes)",
      "incident": "String (one of the inciting incidents)",
      "universe": "String (Tone)",
      "alignment": "Hero" | "Anti-Hero" | "Villain",
      "specificPower": "Short refined description",
      "reasoning": "Short explanation"
    }
  `;

  try {
    const response = await ai.chat.completions.create({
      model: TEXT_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    const parsed = safeJSONParse(response.choices[0].message.content || "{}", null, 'OBJECT');
    if (!parsed) return null;
    return {
      origin: parsed.origin || OriginArchetype.STREET,
      incident: parsed.incident || IncitingIncident.ACCIDENT,
      universe: parsed.universe || UniverseTone.MODERN,
      alignment: parsed.alignment || Alignment.HERO,
      specificPower: parsed.specificPower || "Enhanced abilities",
      reasoning: parsed.reasoning || "Fitted concept."
    } as Partial<Character>;
  } catch (error) {
    return null;
  }
};

export const generateNarrative = async (
  character: Character,
  action: GameAction,
  currentStats: Stats,
  recentHistory: GameEvent[],
  nemesis?: Nemesis | null
): Promise<string> => {
  if (!import.meta.env.VITE_OPENROUTER_API_KEY) return "The multiverse is silent (API Key Missing).";

  const nemesisContext = nemesis && !nemesis.defeated
    ? `Rival: ${nemesis.name} (${nemesis.schemeProgress}% scheme progress).`
    : "No rival active.";

  const systemPrompt = `
    Narrator for "Origin Story".
    Protagonist: ${character.heroName} (${character.alignment} - ${character.origin}).
    Powers: ${character.specificPower}.
    Tone: ${character.universe}.
    Action: "${action.label}" - ${action.description}.
    
    Task: Write a 40-60 word comic panel caption describing the result.
    Style: ${character.universe} comic style.
    CRITICAL INSTRUCTION: Return ONLY the raw story text. Do not include conversational filler like "Here is the caption:".
  `;

  const historyContext = recentHistory.slice(-2).map(e => e.text).join("\n");

  try {
    const response = await ai.chat.completions.create({
      model: TEXT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Context:\n${historyContext}\n\nOutcome for: ${action.label}` }
      ],
      max_tokens: 150,
      temperature: 0.8,
    });
    return response.choices[0].message.content || "The panel is blank.";
  } catch (error) {
    return "A cosmic disturbance prevents the story from unfolding.";
  }
};

export const generateArcEvent = async (character: Character, arcType: string, nemesis?: Nemesis | null): Promise<string> => {
    if (!import.meta.env.VITE_OPENROUTER_API_KEY) return "A major event occurs, but the pages are torn.";

    const prompt = `
      Write a MAJOR NARRATIVE EVENT (Max 80 words).
      Phase: ${arcType}.
      Protagonist: ${character.heroName} (${character.alignment}).
      Tone: ${character.universe}.
      CRITICAL INSTRUCTION: Return ONLY the raw story text. Do not include conversational filler.
    `;

    try {
        const response = await ai.chat.completions.create({
            model: TEXT_MODEL,
            messages: [{ role: "user", content: prompt }],
        });
        return response.choices[0].message.content || "The plot thickens...";
    } catch (error) {
        return "Fate intervenes.";
    }
};

export const generateOriginStory = async (character: Character): Promise<string> => {
    if (!import.meta.env.VITE_OPENROUTER_API_KEY) return "Manual Override: Character created without origin story.";

    const powerInstruction = character.specificPower 
        ? `Powers: "${character.specificPower}"` 
        : `Powers: INVENT a creative power set fitting for a ${character.origin} in a ${character.universe} setting.`;

    const prompt = `
      Write the OPENING NARRATION (Max 100 words) for a new comic #1.
      Protagonist (Alter Ego): ${character.name} -> ${character.heroName}.
      Alignment: ${character.alignment} (Important: Ensure the tone matches this alignment).
      Archetype: ${character.origin}.
      Incident: ${character.incident}.
      ${powerInstruction}
      Setting: ${character.universe}.
      
      Start with the moment life changed. End with the acceptance of this new path (heroic or villainous).
      CRITICAL INSTRUCTION: Return ONLY the raw story text. Do not include conversational filler like "Here is the story:" or "Here is the opening narration:".
    `;

    try {
        const response = await ai.chat.completions.create({
            model: TEXT_MODEL,
            messages: [{ role: "user", content: prompt }],
        });
        return response.choices[0].message.content || "The ink spilled... origin story unavailable.";
    } catch (error) {
        console.error("OpenRouter API Error:", error);
        return "The ink spilled... origin story unavailable.";
    }
};

export const generateRetconNarrative = async (character: Character, causeOfDeath: string): Promise<string> => {
    if (!import.meta.env.VITE_OPENROUTER_API_KEY) return "You wake up. It was a dream.";
    try {
        const response = await ai.chat.completions.create({
            model: TEXT_MODEL,
            messages: [{ role: "user", content: `Write a 50-word comic book RETCON explaining why ${character.heroName} didn't actually die from ${causeOfDeath}. Tone: ${character.universe}. CRITICAL INSTRUCTION: Return ONLY the raw story text. Do not include conversational filler.` }],
        });
        return response.choices[0].message.content || "You survived somehow.";
    } catch (error) { return "The timeline resets."; }
};

export const generateSidekick = async (character: Character): Promise<Sidekick | null> => {
    if (!import.meta.env.VITE_OPENROUTER_API_KEY) return null;
    const prompt = `Create a sidekick/minion for ${character.heroName} (${character.universe}). 
    Return ONLY JSON matching:
    { "name": "String", "realName": "String", "archetype": "String", "specialty": "COMBAT" | "INTEL" | "SUPPORT", "description": "String" }`;

    try {
        const response = await ai.chat.completions.create({
            model: TEXT_MODEL,
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });
        const data = safeJSONParse(response.choices[0].message.content || "{}", null, 'OBJECT');
        if (!data) return null;

        return {
            id: `sidekick-${Date.now()}`,
            name: data.name || "Ally",
            realName: data.realName || "Unknown",
            archetype: data.archetype || "Sidekick",
            specialty: data.specialty || "SUPPORT",
            loyalty: 80,
            status: 'ACTIVE',
            description: data.description || "A loyal follower."
        };
    } catch (e) { return null; }
};

export const generateNemesis = async (character: Character): Promise<Nemesis | null> => {
  if (!import.meta.env.VITE_OPENROUTER_API_KEY) return null;

  const prompt = `
    Create an ARCHNEMESIS for ${character.heroName} (${character.alignment}).
    Tone: ${character.universe}.
    The nemesis must be the thematic opposite.
    Return ONLY JSON matching:
    { "name": "String", "epithet": "String", "archetype": "String", "description": "String", "weakness": "String", "power": 50, "schemeName": "String", "schemeDescription": "String" }
  `;

  try {
    const response = await ai.chat.completions.create({
      model: TEXT_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    const data = safeJSONParse(response.choices[0].message.content || "{}", null, 'OBJECT');
    if (!data) return null;
    return { 
      name: data.name || "Nemesis",
      epithet: data.epithet || "The Undefeated",
      archetype: data.archetype || "Villain",
      description: data.description || "A mysterious figure.",
      weakness: data.weakness || "Unknown",
      power: data.power || 50,
      schemeName: data.schemeName || "Operation Null",
      schemeDescription: data.schemeDescription || "A dark plot.",
      defeated: false, 
      schemeProgress: 0 
    };
  } catch (error) { return null; }
};

export const generateEntityImage = async (name: string, description: string, type: 'VILLAIN' | 'HERO', universe: string): Promise<string | undefined> => {
    if (!import.meta.env.VITE_OPENROUTER_API_KEY) return undefined;
    const prompt = `Comic book style portrait of ${name}, ${description}. Style: ${universe}. White background. No text.`;
    
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.href,
                "X-Title": "Origin Story"
            },
            body: JSON.stringify({
                model: IMAGE_MODEL,
                messages: [{ role: "user", content: prompt }],
                modalities: ["image", "text"]
            })
        });
        const data = await response.json();
        
        // OpenRouter image models return image URLs or base64 embedded in markdown, or directly, or in an images array
        const message = data.choices?.[0]?.message;
        
        if (message?.images?.[0]?.image_url?.url) {
            return message.images[0].image_url.url;
        }
        
        const content = message?.content;
        if (content) {
             // Basic extraction of a URL if it returns markdown like ![alt](url)
             const urlMatch = content.match(/!\[.*?\]\((.*?)\)/);
             if (urlMatch && urlMatch[1]) return urlMatch[1];
             
             // If it returns raw URL
             if (content.startsWith("http") || content.startsWith("data:image")) return content.trim();
        }
        return undefined;
    } catch (e) { return undefined; }
};

export const generatePanelImage = async (narrative: string, character: Character): Promise<string | undefined> => {
  if (!import.meta.env.VITE_OPENROUTER_API_KEY) return undefined;
  const prompt = `Comic panel: ${narrative}. Character: ${character.heroName}, wearing ${character.costume}. Style: ${character.universe}. No text.`;
  try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.href,
                "X-Title": "Origin Story"
            },
            body: JSON.stringify({
                model: IMAGE_MODEL,
                messages: [{ role: "user", content: prompt }],
                modalities: ["image", "text"]
            })
        });
        const data = await response.json();
        
        const message = data.choices?.[0]?.message;
        
        if (message?.images?.[0]?.image_url?.url) {
            return message.images[0].image_url.url;
        }
        
        const content = message?.content;
        if (content) {
             const urlMatch = content.match(/!\[.*?\]\((.*?)\)/);
             if (urlMatch && urlMatch[1]) return urlMatch[1];
             if (content.startsWith("http") || content.startsWith("data:image")) return content.trim();
        }
        return undefined;
  } catch (error) { return undefined; }
};

export const generateMinorVillain = async (character: Character): Promise<MinorVillain | null> => {
    if (!import.meta.env.VITE_OPENROUTER_API_KEY) return null;
    const prompt = `Create a minor 'Villain of the Week' (or 'Hero of the Week' if player is villain) for ${character.heroName} (${character.alignment}). 
    Return ONLY JSON: { "name": "String", "gimmick": "String", "powerLevel": 20, "loot": "INTEL" | "WEALTH" | "REP" }`;
    
    try {
        const response = await ai.chat.completions.create({
            model: TEXT_MODEL,
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });
        const data = safeJSONParse(response.choices[0].message.content || "{}", null, 'OBJECT');
        if(!data) return null;
        return {
            id: `villain-${Date.now()}`,
            name: data.name || "Unknown Threat",
            gimmick: data.gimmick || "Mystery",
            powerLevel: data.powerLevel || 50,
            loot: data.loot || "WEALTH"
        };
    } catch (e) { return null; }
};

export const generateShowdownNarrative = async (character: Character, nemesis: Nemesis, isVictory: boolean): Promise<string> => {
  if (!import.meta.env.VITE_OPENROUTER_API_KEY) return "The battle ends abruptly.";
  const prompt = `Describe final battle between ${character.heroName} and ${nemesis.name}. Result: ${isVictory ? "Protagonist Wins" : "Protagonist Loses"}. Max 60 words. CRITICAL INSTRUCTION: Return ONLY the raw story text. Do not include conversational filler.`;
  try {
    const response = await ai.chat.completions.create({ model: TEXT_MODEL, messages: [{ role: "user", content: prompt }] });
    return response.choices[0].message.content || "The dust settles.";
  } catch (error) { return "Battle data lost."; }
};

export const generateHeadline = async (character: Character, stats: Stats): Promise<string> => {
  if (!import.meta.env.VITE_OPENROUTER_API_KEY) return "EXTRA! EXTRA!";
  const prompt = `3-word newspaper headline about ${character.heroName}. Suspicion: ${stats.suspicion}%. CRITICAL INSTRUCTION: Return ONLY the raw headline text, no filler.`;
  try {
    const response = await ai.chat.completions.create({ model: TEXT_MODEL, messages: [{ role: "user", content: prompt }] });
    return response.choices[0].message.content?.replace(/"/g, '') || "EXTRA! EXTRA!";
  } catch (error) { return "PRINTING ERROR"; }
};

export const generateSuggestedActions = async (narrative: string, character: Character): Promise<GameAction[]> => {
  if (!import.meta.env.VITE_OPENROUTER_API_KEY) return [];
  const prompt = `Suggest 3 actions for ${character.heroName} (${character.alignment}) based on: "${narrative}". 
  Return ONLY a JSON object matching this structure: { "actions": [ { "label": "String", "description": "String", "category": "Hero" | "Civilian" } ] }`;

  try {
    const response = await ai.chat.completions.create({
      model: TEXT_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" } // OpenRouter usually expects the prompt to just be clear. We will parse it.
    });
    // OpenRouter might wrap the array in an object if json_object is set. Let's parse flexibly.
    let content = response.choices[0].message.content || "[]";
    const parsed = safeJSONParse(content, [], 'ANY');
    
    let actionsArray = [];
    if (Array.isArray(parsed)) actionsArray = parsed;
    else if (parsed && typeof parsed === 'object') {
        // If wrapped in an object like { "actions": [...] }
        const key = Object.keys(parsed).find(k => Array.isArray(parsed[k]));
        if (key) actionsArray = parsed[key];
    }
    
    return actionsArray.map((item: any, index: number) => ({
      id: `dynamic-${Date.now()}-${index}`,
      label: item.label || "Act",
      description: item.description || "Do something",
      category: item.category === "Civilian" ? ActionCategory.CIVILIAN : ActionCategory.HERO,
      effect: item.category === "Civilian" ? { sanity: 5, suspicion: -2 } : { justice: 5, glory: 2, suspicion: 5, sanity: -2 }
    }));
  } catch (error) { return []; }
};

export const generateUpgrades = async (character: Character): Promise<Upgrade[]> => {
  if (!import.meta.env.VITE_OPENROUTER_API_KEY) return [];
  const prompt = `Create 3 HQ upgrades for ${character.heroName} (${character.origin}). 
  Return ONLY a JSON object matching this structure: { "upgrades": [ { "type": "COMFORT"|"INTEL"|"WEAPON", "name": "String", "description": "String" } ] }`;

  try {
    const response = await ai.chat.completions.create({
      model: TEXT_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    let content = response.choices[0].message.content || "[]";
    const parsed = safeJSONParse(content, [], 'ANY');
    let upgradesArray = Array.isArray(parsed) ? parsed : (parsed && typeof parsed === 'object' ? Object.values(parsed).find(v => Array.isArray(v)) || [] : []);
    
    return upgradesArray.map((item: any, index: number) => ({
      id: `upgrade-${index}`,
      type: item.type || 'COMFORT',
      name: item.name || 'Upgrade',
      description: item.description || 'A nice addition to the HQ.',
      purchased: false,
      costType: item.type === 'COMFORT' ? 'wealth' : (item.type === 'INTEL' ? 'justice' : 'glory'),
      costAmount: item.type === 'COMFORT' ? 30 : (item.type === 'INTEL' ? 30 : 50),
    }));
  } catch (error) { return []; }
};

export const generateCrisis = async (character: Character): Promise<Crisis | null> => {
  if (!import.meta.env.VITE_OPENROUTER_API_KEY) return null;
  const prompt = `Create a Crisis Event for ${character.heroName} (${character.alignment}). 
  Return ONLY JSON: { "title": "String", "description": "String", "options": [ { "label": "String", "description": "String", "type": "ALTRUISTIC" | "PRAGMATIC" } ] }`;

  try {
     const response = await ai.chat.completions.create({
       model: TEXT_MODEL,
       messages: [{ role: "user", content: prompt }],
       response_format: { type: "json_object" }
     });
     const data = safeJSONParse(response.choices[0].message.content || "{}", null, 'OBJECT');
     if(!data || !Array.isArray(data.options) || data.options.length < 2) return null;
     
     return {
        id: `crisis-${Date.now()}`,
        title: data.title || "Emergency",
        description: data.description || "A difficult choice must be made.",
        options: [data.options[0], data.options[1]]
     };
  } catch (error) { return null; }
};

export const generateNPCs = async (character: Character): Promise<NPC[]> => {
  if (!import.meta.env.VITE_OPENROUTER_API_KEY) return [];
  const prompt = `Create 2 supporting NPCs for ${character.heroName} (${character.alignment}). 
  Return ONLY a JSON object matching this structure: { "npcs": [ { "name": "String", "relation": "String", "description": "String", "bonusType": "SANITY" | "WEALTH" | "JUSTICE" } ] }`;

  try {
     const response = await ai.chat.completions.create({
       model: TEXT_MODEL,
       messages: [{ role: "user", content: prompt }],
       response_format: { type: "json_object" }
     });
     let content = response.choices[0].message.content || "[]";
     const parsed = safeJSONParse(content, [], 'ANY');
     let npcsArray = Array.isArray(parsed) ? parsed : (parsed && typeof parsed === 'object' ? Object.values(parsed).find(v => Array.isArray(v)) || [] : []);
     
     return npcsArray.map((item: any, index: number) => ({
        id: `npc-${index}`,
        name: item.name || "Citizen",
        relation: item.relation || "Acquaintance",
        description: item.description || "A face in the crowd.",
        relationship: 50, 
        bonusType: item.bonusType || 'SANITY'
     }));
  } catch (error) { return []; }
};

export const generateNewCostume = async (character: Character, stats: Stats): Promise<string> => {
  if (!import.meta.env.VITE_OPENROUTER_API_KEY) return "A basic spandex suit.";
  const prompt = `Design a costume for ${character.heroName} (${character.universe}). Max 20 words. CRITICAL INSTRUCTION: Return ONLY the raw description text. Do not include conversational filler.`;
  try {
    const response = await ai.chat.completions.create({ model: TEXT_MODEL, messages: [{ role: "user", content: prompt }] });
    return response.choices[0].message.content?.trim() || "A classic superhero costume.";
  } catch (error) { return "A makeshift vigilante outfit."; }
};
