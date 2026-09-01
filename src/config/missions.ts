// Edit this file to add, remove, or change missions.
export type MissionField = {
  key: string;
  label: string;
  required: boolean;
};

export type MissionDef = {
  id: string;
  category: 'BME' | 'Budapest' | 'International' | 'People' | 'IAC';
  prompt: string;
  fields: MissionField[];
};

export const missions: MissionDef[] = [
  // --- BME ---
  {
    id: "bme-neptun-01", category: "BME",
    prompt: "Find someone who knows what Neptun is used for. Write their answer.",
    fields: [
      { key: "person", label: "Who did you speak to?", required: true },
      { key: "answer", label: "What did they tell you?", required: true }
    ]
  },
  {
    id: "bme-faculty-01", category: "BME",
    prompt: "Ask someone to name one BME faculty.",
    fields: [
      { key: "person", label: "Who did you speak to?", required: true },
      { key: "answer", label: "Which faculty?", required: true }
    ]
  },
  {
    id: "bme-mentor-tip-01", category: "BME",
    prompt: "Ask a mentor for one useful BME survival tip.",
    fields: [
      { key: "mentor", label: "Mentor's name", required: true },
      { key: "tip", label: "What is their tip?", required: true }
    ]
  },
  {
    id: "bme-neptun-02", category: "BME",
    prompt: "Find someone who has already logged into Neptun. Ask what they used it for.",
    fields: [
      { key: "person", label: "Who did you speak to?", required: true },
      { key: "answer", label: "What did they use it for?", required: true }
    ]
  },
  {
    id: "bme-study-01", category: "BME",
    prompt: "Ask someone what they are most excited to study at BME.",
    fields: [
      { key: "person", label: "Who did you speak to?", required: true },
      { key: "answer", label: "What are they excited about?", required: true }
    ]
  },
  {
    id: "bme-ehk-01", category: "BME",
    prompt: "Find someone who knows where the EHK office is.",
    fields: [
      { key: "person", label: "Who did you speak to?", required: true },
      { key: "answer", label: "Where is it?", required: true }
    ]
  },

  // --- Budapest ---
  {
    id: "bp-landmark-01", category: "Budapest",
    prompt: "Find someone who can name a Budapest landmark. Write it down.",
    fields: [
      { key: "person", label: "Who did you speak to?", required: true },
      { key: "answer", label: "What is the landmark?", required: true }
    ]
  },
  {
    id: "bp-river-01", category: "Budapest",
    prompt: "Ask someone which river runs through Budapest.",
    fields: [
      { key: "person", label: "Who did you speak to?", required: true },
      { key: "answer", label: "Which river?", required: true }
    ]
  },
  {
    id: "bp-food-01", category: "Budapest",
    prompt: "Find someone who knows one Hungarian food.",
    fields: [
      { key: "person", label: "Who did you speak to?", required: true },
      { key: "answer", label: "What is the food?", required: true }
    ]
  },
  {
    id: "bp-word-01", category: "Budapest",
    prompt: "Ask someone to name one Hungarian word they have learned.",
    fields: [
      { key: "person", label: "Who did you speak to?", required: true },
      { key: "answer", label: "What is the word?", required: true }
    ]
  },
  {
    id: "bp-transport-01", category: "Budapest",
    prompt: "Find someone who has already used Budapest public transport. Ask which one.",
    fields: [
      { key: "person", label: "Who did you speak to?", required: true },
      { key: "answer", label: "Which transport (bus, tram, etc)?", required: true }
    ]
  },
  {
    id: "bp-visit-01", category: "Budapest",
    prompt: "Ask someone what place in Budapest they most want to visit.",
    fields: [
      { key: "person", label: "Who did you speak to?", required: true },
      { key: "answer", label: "Where do they want to visit?", required: true }
    ]
  },

  // --- International ---
  {
    id: "intl-hello-01", category: "International",
    prompt: "Meet someone from another country. Write their country and how they say hello.",
    fields: [
      { key: "country", label: "Which country?", required: true },
      { key: "hello", label: "How do they say hello?", required: true }
    ]
  },
  {
    id: "intl-food-01", category: "International",
    prompt: "Meet someone from another country and ask for one food they recommend from home.",
    fields: [
      { key: "country", label: "Which country?", required: true },
      { key: "food", label: "What food?", required: true }
    ]
  },
  {
    id: "intl-languages-01", category: "International",
    prompt: "Find someone who speaks at least three languages. Write the languages.",
    fields: [
      { key: "person", label: "Who did you speak to?", required: true },
      { key: "languages", label: "Which languages?", required: true }
    ]
  },
  {
    id: "intl-thanks-01", category: "International",
    prompt: "Ask someone how to say thank you in their language.",
    fields: [
      { key: "language", label: "Which language?", required: true },
      { key: "thanks", label: "How to say thank you?", required: true }
    ]
  },
  {
    id: "intl-surprised-01", category: "International",
    prompt: "Ask someone what surprised them about Hungary so far.",
    fields: [
      { key: "person", label: "Who did you speak to?", required: true },
      { key: "answer", label: "What surprised them?", required: true }
    ]
  },
  {
    id: "intl-visit-01", category: "International",
    prompt: "Meet someone from a country you have never visited.",
    fields: [
      { key: "person", label: "Who did you speak to?", required: true },
      { key: "country", label: "Which country?", required: true }
    ]
  },

  // --- People ---
  {
    id: "ppl-new-01", category: "People",
    prompt: "Meet someone new. Write their first name and one interesting fact about them.",
    fields: [
      { key: "name", label: "What is their name?", required: true },
      { key: "fact", label: "What is the interesting fact?", required: true }
    ]
  },
  {
    id: "ppl-hobby-01", category: "People",
    prompt: "Find someone who shares one hobby with you.",
    fields: [
      { key: "name", label: "Who did you speak to?", required: true },
      { key: "hobby", label: "What is the shared hobby?", required: true }
    ]
  },
  {
    id: "ppl-faculty-01", category: "People",
    prompt: "Find someone studying at a different faculty.",
    fields: [
      { key: "name", label: "Who did you speak to?", required: true },
      { key: "faculty", label: "Which faculty?", required: true }
    ]
  },
  {
    id: "ppl-glasses-01", category: "People",
    prompt: "Find someone wearing glasses and ask what they do to relax after a long day.",
    fields: [
      { key: "name", label: "Who did you speak to?", required: true },
      { key: "answer", label: "How do they relax?", required: true }
    ]
  },
  {
    id: "ppl-blue-01", category: "People",
    prompt: "Find someone wearing something blue and ask what country they are from.",
    fields: [
      { key: "name", label: "Who did you speak to?", required: true },
      { key: "country", label: "Which country?", required: true }
    ]
  },
  {
    id: "ppl-pet-01", category: "People",
    prompt: "Find someone who has a pet and ask what animal it is.",
    fields: [
      { key: "name", label: "Who did you speak to?", required: true },
      { key: "animal", label: "What animal?", required: true }
    ]
  },

  // --- IAC ---
  {
    id: "iac-contact-01", category: "IAC",
    prompt: "Ask an IAC member how international students can contact us.",
    fields: [
      { key: "answer", label: "How can they contact IAC?", required: true }
    ]
  },
  {
    id: "iac-problems-01", category: "IAC",
    prompt: "Ask an IAC member what kind of problems students can contact IAC about.",
    fields: [
      { key: "answer", label: "What problems?", required: true }
    ]
  },
  {
    id: "iac-office-01", category: "IAC",
    prompt: "Find out where the IAC/EHK office is.",
    fields: [
      { key: "answer", label: "Where is it?", required: true }
    ]
  },
  {
    id: "iac-event-01", category: "IAC",
    prompt: "Ask an IAC member to name one upcoming student event.",
    fields: [
      { key: "answer", label: "Which event?", required: true }
    ]
  },
  {
    id: "iac-help-01", category: "IAC",
    prompt: "Ask an IAC member what students should do if they have a problem but do not know who to contact.",
    fields: [
      { key: "answer", label: "What should they do?", required: true }
    ]
  },
  {
    id: "iac-does-01", category: "IAC",
    prompt: "Ask an IAC member what IAC does for international students.",
    fields: [
      { key: "answer", label: "What does IAC do?", required: true }
    ]
  }
];

export function getRandomMissions(): MissionDef[] {
  const categories = ['BME', 'Budapest', 'International', 'People', 'IAC'] as const;
  const selected = categories.map(cat => {
    const catMissions = missions.filter(m => m.category === cat);
    return catMissions[Math.floor(Math.random() * catMissions.length)];
  });
  return selected.sort(() => Math.random() - 0.5);
}
