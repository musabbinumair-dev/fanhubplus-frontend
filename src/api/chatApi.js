import { BASE_URL, MOCK_CONTENT_ITEMS } from "./api.js";

// Storage keys for preserving separate conversations
const STORAGE_KEY_FANHUB = "fandomverse_chat_history_fanhub";
const STORAGE_KEY_AI = "fandomverse_chat_history_ai";

const getOrCreateSessionId = (mode) => {
  const key = `fandomverse_${mode}_session_id`;
  try {
    let sid = localStorage.getItem(key);
    if (!sid) {
      sid = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(key, sid);
    }
    return sid;
  } catch (e) {
    return `session_${Date.now()}`;
  }
};

export const getStoredMessages = (mode) => {
  try {
    const key = mode === "ai" ? STORAGE_KEY_AI : STORAGE_KEY_FANHUB;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveStoredMessages = (mode, messages) => {
  try {
    const key = mode === "ai" ? STORAGE_KEY_AI : STORAGE_KEY_FANHUB;
    localStorage.setItem(key, JSON.stringify(messages));
  } catch (e) {
    // ignore storage write errors
  }
};

export const clearStoredMessages = (mode) => {
  try {
    const key = mode === "ai" ? STORAGE_KEY_AI : STORAGE_KEY_FANHUB;
    localStorage.removeItem(key);
    localStorage.removeItem(`fandomverse_${mode}_session_id`);
  } catch (e) {
    // ignore
  }
};

export const sendChatMessage = async ({ message, mode }) => {
  // Simulate natural brief latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  const lower = message.toLowerCase();

  if (mode === "fanhub") {
    // Recommendation queries
    if (lower.includes("recommend") || lower.includes("watch") || lower.includes("play") || lower.includes("something")) {
      const recommendations = MOCK_CONTENT_ITEMS.slice(0, 3).map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        image: item.image || item.videoThumbnail || item.posterImage,
        desc: item.desc,
        path: `/category/${item.category?.toLowerCase() || "anime"}`
      }));

      return {
        sender: "bot",
        text: "Here are top-rated community picks curated for you right now:",
        recommendations,
        timestamp: new Date()
      };
    }

    // Platform tour query
    if (lower.includes("tour") || lower.includes("explore")) {
      return {
        sender: "bot",
        text: "Welcome to FandomVerse! Here's how to navigate:\n• **Explore**: Browse trending articles, trailers, and fan breakdowns.\n• **Categories**: Filter by Anime, Gaming, Movies, Comics, and more.\n• **Submit Content**: Upload your own creations for community spotlight.\n• **Bookmarks**: Save items to your personal library anytime.",
        timestamp: new Date()
      };
    }

    // Bookmark FAQ query
    if (lower.includes("bookmark") || lower.includes("save")) {
      return {
        sender: "bot",
        text: "To bookmark any story or character, click the bookmark icon (★) at the top of any card or modal. You can view all your saved items under the 'Saved Bookmarks' tab in your left navigation menu.",
        timestamp: new Date()
      };
    }

    // Upcoming events query
    if (lower.includes("event") || lower.includes("calendar") || lower.includes("upcoming")) {
      return {
        sender: "bot",
        text: "Upcoming FandomVerse Events:\n• **Anime Expo & Cosplay Showdown** (Oct 15, 2026)\n• **Next-Gen Gaming Showcase** (Nov 02, 2026)\n• **Fandom Comic Jam & Live Q&A** (Nov 20, 2026)\nHead to the Events tab to reserve your passes!",
        timestamp: new Date()
      };
    }

    // Default FanHub reply
    return {
      sender: "bot",
      text: `Thanks for asking! As your FanHub Assistant, I can help you find trending anime, walkthroughs, movies, or answer questions about navigating FandomVerse. Try asking for recommendations or a quick tour!`,
      timestamp: new Date()
    };
  } else {
    // AI Assistant Mode: call existing Gemini AI endpoint
    const sessionId = getOrCreateSessionId("ai");
    const token = localStorage.getItem("token");

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const clientApiKey =
        (typeof import.meta !== "undefined" &&
          import.meta.env &&
          (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY)) ||
        undefined;

      const res = await fetch(`${BASE_URL}/chat/message`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message,
          sessionId,
          useAiMode: true,
          apiKey: clientApiKey
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.botMessage && data.botMessage.text) {
          return {
            sender: "bot",
            text: data.botMessage.text,
            timestamp: new Date(data.botMessage.timestamp || Date.now())
          };
        }
      }
    } catch (err) {
      // Backend unavailable, continue to local fallback
    }

    // Offline fallback for AI Assistant Mode
    if (lower.includes("spoiler") || lower.includes("plot")) {
      return {
        sender: "bot",
        text: "Here is a spoiler-free plot overview:\n\nIn a fractured world where ancient elemental technologies lie dormant, an outcast traveler stumbles upon a celestial signal. As competing factions mobilize to claim it, choices between survival and unity dictate the fate of the realm. Themes of resilience, mystery, and moral ambiguity drive the narrative forward without revealing critical late-game twists.",
        timestamp: new Date()
      };
    }

    if (lower.includes("story idea") || lower.includes("idea")) {
      return {
        sender: "bot",
        text: "Here's a fresh story concept: **'The Echo Protocol'**\n\nPremise: In a neon-lit cyberpunk metropolis, memories can be extracted and bought as virtual experiences. When a rogue memory curator uncovers a recording that seems to predict the city's destruction, they must team up with an enigmatic street runner before the timeline catches up.",
        timestamp: new Date()
      };
    }

    if (lower.includes("compare") || lower.includes("genre")) {
      return {
        sender: "bot",
        text: "Comparing **Cyberpunk** vs **Dark Fantasy**:\n\n• **Core Themes**: Cyberpunk examines technology, societal disparity, and loss of identity. Dark Fantasy focuses on grim morality, corruption, and fragile hopes in mythical settings.\n• **Visual Style**: Cyberpunk uses neon hues, rain-slicked concrete, and tech interfaces. Dark Fantasy relies on gothic architecture, shadowed landscapes, and rustic textures.",
        timestamp: new Date()
      };
    }

    if (lower.includes("review") || lower.includes("write")) {
      return {
        sender: "bot",
        text: "Here's a strong template for your fan review:\n\n1. **The Hook**: Share your initial anticipation and immediate impressions.\n2. **Worldbuilding & Pacing**: Highlight the visual atmosphere and narrative tempo.\n3. **Character Arcs**: Critique standout moments and emotional depth.\n4. **Final Verdict**: State who this story is best suited for and give your rating.",
        timestamp: new Date()
      };
    }

    // Default AI mode reply
    return {
      sender: "bot",
      text: `Hello! I'm your AI creative companion. I can help brainstorm fanfiction storylines, explain complex lore without spoilers, compare genres, or polish your fan reviews. What are we exploring today?`,
      timestamp: new Date()
    };
  }
};
