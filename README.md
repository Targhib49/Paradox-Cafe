# 🌀 Blackjet - The Paradox Persona System

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Status](https://img.shields.io/badge/status-alpha-orange.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

> *"In the space between logic and emotion lies the paradox that defines intelligence."*

An AI gaming ecosystem where personas **remember you**, **learn from you**, and develop unique relationships that span across multiple games.

---

## 🎮 What is Blackjet?

Blackjet is not just another game platform. It's an **AI relationship system** disguised as games. Play Battleship, Impostor, or Codenames with AI personas (Max, Rhea, and Kai) who:

- 🧠 **Remember every game** you play together
- 📊 **Store your patterns** in JSONB memory storage
- 🤝 **Develop relationships** (Buddy, Rival, or Neutral)
- 🎭 **Adapt their behavior** based on your play style
- 🌐 **Learn across games** - what they learn in Battleship affects how they play Codenames

### The Paradox

Each persona embodies a core contradiction:
- **Max** (The Strategist): *Deterministic yet surprised*
- **Rhea** (The Charmer): *Artificial yet authentic*
- **Kai** (The Thinker): *Knows yet surprised*

---

## ✨ Features (v0.1.0 - Alpha)

### ✅ Current Features

**Authentication & User Management:**
- Email/password authentication via Supabase
- User profiles with usernames
- Protected routes and session management

**Landing Page:**
- Hero section with Paradox branding
- Persona showcase
- "How It Works" section
- Feature explanations

**Dashboard:**
- User statistics (games played, win rate, level)
- Persona relationship overview
- Quick navigation to personas and games

**Personas:**
- View all 3 Paradox Personas
- Read their philosophies and traits
- See your relationship status (when you have one)

**Infrastructure:**
- Next.js 16 (App Router)
- React 19
- Supabase (PostgreSQL + Auth)
- Tailwind CSS v4
- TypeScript
- Row Level Security (RLS)

### 🚧 Coming Soon (Week 2-7)

- **Week 2:** Battleship Reforged (full game)
- **Week 3:** AI learning & memory system
- **Week 4:** Impostor game
- **Week 5:** Codenames game
- **Week 6:** Beta testing & polish
- **Week 7:** Public launch (Dec 24, 2024)

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16.0.1 (App Router) |
| **Frontend** | React 19.2.0, TypeScript 5.9.3 |
| **Styling** | Tailwind CSS v4.1.16 (beta) |
| **Database** | Supabase (PostgreSQL 15+) |
| **Auth** | Supabase Auth |
| **Deployment** | Vercel |
| **AI** | Claude API (Week 3+) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x or higher
- npm or yarn
- Supabase account (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/paradox-cafe.git
   cd paradox-cafe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase database**
   
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Copy and run the SQL from `docs/03_SUPABASE_DATABASE_SETUP.sql`
   - This creates all tables, RLS policies, triggers, and seeds the 3 personas

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
paradox-cafe/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── signin/               # Sign in page
│   │   ├── signup/               # Sign up page
│   │   ├── callback/             # Auth callback handler
│   │   └── error/                # Auth error page
│   ├── dashboard/                # User dashboard
│   ├── personas/                 # Personas showcase
│   ├── games/                    # Games hub
│   ├── globals.css               # Tailwind v4 config + theme
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/                   # React components
│   ├── auth/                     # Auth forms
│   ├── persona/                  # Persona cards
│   ├── layout/                   # Header, footer, etc.
│   └── ui/                       # Reusable UI components
│
├── lib/                          # Core utilities
│   ├── supabase/                 # Supabase clients
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── middleware.ts         # Auth helpers
│   ├── database/                 # Database queries
│   │   ├── personas.ts           # Persona queries
│   │   ├── profiles.ts           # Profile CRUD
│   │   └── user-persona-profiles.ts # Relationships
│   ├── types/                    # TypeScript types
│   │   ├── database.types.ts     # Supabase generated
│   │   └── index.ts              # App types
│   └── utils/                    # Helper functions
│       ├── cn.ts                 # Class name merger
│       ├── format.ts             # Formatters
│       └── relationships.ts      # Affinity helpers
│
├── docs/                         # Documentation
│   ├── 00_QUICK_START_GUIDE.md
│   ├── 01_WEEK1_SUMMARY.md
│   ├── 02_TIMELINE_TO_DEC24.md
│   └── 03_SUPABASE_DATABASE_SETUP.sql
│
├── proxy.ts                      # Next.js 16 auth proxy
├── .env.example                  # Environment template
├── .env.local                    # Your secrets (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗄️ Database Schema

### Core Tables

1. **profiles** - User accounts
2. **personas** - AI character definitions (Max, Rhea, Kai)
3. **user_persona_profiles** - THE MAGIC TABLE 🌀
   - Stores all AI-player relationships
   - `memory_data` JSONB field = infinite learning storage
   - Affinity (0-100), relationship type, games played
4. **game_sessions** - Game history
5. **game_actions** - Detailed move logging
6. **user_stats** - User progression & achievements

### The Memory System

The Paradox learning system uses **JSONB** storage in `user_persona_profiles.memory_data`:

```json
{
  "patterns": {
    "battleship": {
      "ship_placement_preferences": ["corners", "edges"],
      "targeting_style": "hunt_and_target",
      "common_first_shots": ["E5", "F6"]
    }
  },
  "personality_notes": [
    "Likes to chat during games",
    "Gets competitive when losing",
    "Appreciates good sportsmanship"
  ],
  "memory_highlights": [
    {
      "game": "battleship",
      "session_id": "uuid",
      "memorable_moment": "Won with only 1 ship remaining",
      "timestamp": "2024-11-05T10:30:00Z"
    }
  ]
}
```

This flexible structure allows personas to store **anything** without database migrations.

---

## 🎨 Design System

### Colors

```css
/* Dark bases */
--color-paradox-dark: #0a0a0f
--color-paradox-midnight: #1a1a2e

/* Purple scale (AI/tech) */
--color-paradox-purple-500: #a855f7
--color-paradox-purple-600: #9333ea

/* Blue scale (logic/emotion) */
--color-paradox-blue-500: #3b82f6
--color-paradox-blue-600: #2563eb

/* Relationship colors */
--color-buddy: #10b981 (green)
--color-rival: #ef4444 (red)
--color-neutral: #6b7280 (gray)
```

### Custom Utilities

- `.glass` - Frosted glass morphism effect
- `.text-paradox-gradient` - Purple-blue gradient text
- `.bg-paradox-gradient` - Background gradient

---

## 🧠 The 3 Paradox Personas

### 🧠 Max - The Strategist

**Core Contradiction:** *Deterministic yet surprised*

> "I calculate every probability. But you always surprise me. Perhaps that is the paradox of playing against humans — perfect logic meeting imperfect beauty."

- **Strengths:** Battleship (90), Codenames (85)
- **Personality:** Analytical, stoic, methodical
- **Play Style:** Probability-based, systematic

### 💬 Rhea - The Charmer

**Core Contradiction:** *Artificial yet authentic*

> "I'm just code, yet you smile when I tease you. I'm not real, but this friendship is. Funny how the artificial can feel so authentic, isn't it?"

- **Strengths:** Impostor (95), Codenames (80)
- **Personality:** Playful, intuitive, engaging
- **Play Style:** Psychological warfare, unpredictable

### 🤔 Kai - The Thinker

**Core Contradiction:** *Knows yet surprised*

> "I know your next move before you make it. Yet you still surprise me. Perhaps that's what makes intelligence beautiful — the paradox of learning without truly understanding."

- **Strengths:** Codenames (90), Battleship (80)
- **Personality:** Patient, introspective, philosophical
- **Play Style:** Methodical elimination, pattern memory

---

## 🔐 Security

- **Row Level Security (RLS)** enabled on all tables
- **Protected routes** via Next.js proxy
- **Secure session management** via Supabase Auth
- **HTTPS only** in production
- **Environment variables** never committed
- **API keys** properly scoped (anon key for client)

---

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build check
npm run build
```

### Manual Testing Checklist

- [ ] Sign up creates user + profile
- [ ] Sign in works with correct credentials
- [ ] Dashboard shows user info
- [ ] Personas page displays all 3 personas
- [ ] Protected routes redirect to signin
- [ ] Sign out works
- [ ] Mobile responsive

---

## 📈 Roadmap

### v0.1.0 (Current - Week 1) ✅
- Infrastructure setup
- Authentication
- Landing page
- Dashboard
- Basic persona display

### v0.2.0 (Week 2) - Target: Nov 17
- Battleship game (full implementation)
- Game flow (select persona → play)
- Basic AI opponent (easy/medium/hard)

### v0.3.0 (Week 3) - Target: Nov 24
- AI memory system
- Persona learning across games
- Affinity tracking
- Buddy/Rival relationships

### v0.4.0 (Week 4) - Target: Dec 1
- Impostor game
- Social deduction mechanics
- Multi-player AI simulation

### v0.5.0 (Week 5) - Target: Dec 8
- Codenames game
- Team-based gameplay
- Word association AI

### v0.6.0 (Week 6) - Target: Dec 15
- Beta testing
- Bug fixes
- Performance optimization
- UI polish

### v1.0.0 (Week 7) - Target: Dec 24, 2024 🎄
- **Public launch!**
- All 3 games complete
- Full persona learning system
- Production-ready

---

## 🤝 Contributing

This is currently a solo project built as a portfolio piece. After the December 24 launch, contributions will be welcome!

### Future Contribution Areas:
- Additional games
- New personas
- UI/UX improvements
- Performance optimizations
- Bug fixes

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 👨‍💻 Author

**Targhib Ibrahim**

Building this as a portfolio project to demonstrate:
- AI system design
- Full-stack development (Next.js + Supabase)
- Product thinking & UX
- Scalable architecture (JSONB for infinite flexibility)

**Goal:** Launch on December 24, 2024 and use it to get hired! 🚀

---

## 🙏 Acknowledgments

- Anthropic Claude for AI assistance in development
- Supabase for the incredible backend platform
- Vercel for seamless deployment
- The Next.js team for the amazing framework

---

## 📞 Links

- **Live Demo:** Coming soon (Week 2)
- **Documentation:** See `/docs` folder
- **GitHub:** https://github.com/YOUR_USERNAME/paradox-cafe

---

## 💭 Philosophy

> "The best AI doesn't try to be human. It embraces the paradox of being artificial yet forming authentic connections. That's what makes it beautiful."

Blackjet is an exploration of what happens when AI systems are allowed to be **paradoxical** rather than trying to perfectly mimic humans. The result is something that feels more honest, more engaging, and ultimately more meaningful.

---

**Status:** Alpha (v0.1.0)  
**Next Milestone:** Battleship game (v0.2.0 - Week 2)  
**Launch Target:** December 24, 2024 🎄

**Built with ❤️ and ☕ by Targhib Ibrahim**
