# AI Chat Bot - WonderWorld Theme Park

An AI chatbot engineered to answer questions related to WonderWorld theme park, powered by Google's Gemini LLM.

### Technologies Used

- **Language** - TypeScript
- **Runtime** - Bun
- **Backend** - ExpressJS
- **Frontend** - ReactJS
- **Styling** - Tailwind & Shadcn
- **LLM** - Google's Gemini

### Monorepo Layout

```
ai-chat-bot
-apps               # Source Code
    /server         # ExpressJS REST API server
    /client         # ReactJS frontend
-package.json       # Root dependencies & scripts
-bun.lock           # Bun dependencies lock file
-tsconfig.json      # TypeScript Configuration
-README.md
```

### Getting Started

1. Create a .env file with Gemini API Key

```terminal
cp apps/server/.env.example apps/server/.env
```

2. Install Dependencies

```terminal
bun install
```

3. Start app development mode

```terminal
bun run dev
```

> Note: This will start both client and server concurrently. Run the commnand from specific directory if only client / server has to be started.

---

🚀 Happy Coding
