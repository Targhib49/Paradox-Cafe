# Changelog

All notable changes to the Blackjet Paradox Persona System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2024-11-05

### 🎉 Initial Alpha Release - Week 1 Complete

**Theme:** Foundation & Infrastructure

This release establishes the complete foundation for the Blackjet Paradox Persona System.

### Added

#### Infrastructure
- Next.js 16.0.1 with App Router
- React 19.2.0
- Tailwind CSS v4.1.16 (beta) with custom Paradox theme
- TypeScript 5.9.3 configuration
- Supabase integration (PostgreSQL + Auth)
- Vercel deployment configuration
- Environment variable management

#### Database
- Complete schema with 6 tables:
  - `profiles` - User accounts
  - `personas` - AI character definitions
  - `user_persona_profiles` - Relationship & memory storage (THE MAGIC TABLE)
  - `game_sessions` - Game history
  - `game_actions` - Detailed move logging
  - `user_stats` - User progression & achievements
- Row Level Security (RLS) policies for all tables
- Database triggers for auto-updating timestamps
- Auto-creation of user_stats on profile creation
- Performance indexes on all tables
- 3 Paradox Personas seeded (Max, Rhea, Kai)

#### Authentication
- Email/password sign up with profile creation
- Email/password sign in
- Protected routes via proxy.ts
- User session management
- Sign out functionality
- Auth callback handler
- Error handling for auth flows
- Form validation (username, email, password)

#### Pages
- Landing page with:
  - Hero section with Paradox branding
  - Value proposition
  - Features section
  - Persona showcase
  - "How It Works" step-by-step guide
  - Footer with navigation
- Dashboard with:
  - User statistics (games, win rate, relationships, level)
  - Persona relationships display
  - Quick action cards
  - First-time user onboarding CTA
- Personas page:
  - Display all 3 Paradox Personas
  - Persona cards with details
  - Relationship info for authenticated users
  - Public access for unauthenticated users
- Games hub:
  - Game selection interface
  - Coming soon status for all games
  - Game descriptions

#### Components
- `PersonaCard` - Reusable persona display component
- `Header` - Navigation with active state highlighting
- `SignUpForm` - User registration form
- `SignInForm` - User authentication form
- `LoadingSpinner` - Loading state indicator

#### Design System
- Paradox brand colors (purple + blue gradients)
- Glass morphism effects
- Custom animations (fade-in, slide-up, glow-pulse)
- Relationship colors (buddy green, rival red, neutral gray)
- Mobile responsive design throughout
- Dark theme optimized for readability

#### Developer Experience
- TypeScript types for all database tables
- Supabase client utilities (browser + server)
- Database helper functions (personas, profiles, relationships)
- Utility functions (cn, format, relationships)
- Comprehensive documentation:
  - Quick Start Guide
  - Week 1 Summary
  - Timeline to December 24
  - Database setup SQL script

#### Testing
- All authentication flows tested
- Protected route verification
- Database queries confirmed working
- Mobile responsive testing
- TypeScript compilation without errors

### Technical Details

**Dependencies:**
- @supabase/supabase-js: 2.78.0
- @supabase/ssr: 0.7.0
- next: 16.0.1
- react: 19.2.0
- typescript: 5.9.3
- tailwindcss: 4.1.16
- framer-motion: 12.23.24
- lucide-react: 0.552.0

**Database:**
- PostgreSQL 15+ (via Supabase)
- JSONB memory storage for AI learning
- Row Level Security enabled
- Triggers and functions implemented

**Performance:**
- Lighthouse scores target: 90+ across all metrics
- Fast page loads with Next.js optimization
- Efficient database queries with indexes

### Security

- Row Level Security (RLS) on all tables
- Protected routes for authenticated content
- Secure session management
- Environment variables properly scoped
- HTTPS enforced in production
- API keys never committed to git

### Known Limitations

- Games not yet implemented (coming in v0.2.0)
- AI learning system not yet active (coming in v0.3.0)
- No actual persona memory storage yet (structure ready)
- Stats are placeholder values (real tracking starts Week 2)

---

## [Unreleased]

### Planned for v0.2.0 (Week 2 - Target: Nov 17, 2024)

#### Battleship Reforged Game
- [ ] Complete game board (10x10 grid)
- [ ] Ship placement system with validation
- [ ] Attack system (hit detection, miss, sunk)
- [ ] Turn management (player ↔ AI)
- [ ] Win/loss conditions
- [ ] Game over screen with stats
- [ ] Play again functionality

#### AI Opponents
- [ ] Easy difficulty (random shooting)
- [ ] Medium difficulty (hunt/target mode)
- [ ] Hard difficulty (probability heat map)
- [ ] Difficulty selector UI

#### Game Flow
- [ ] Game selection interface
- [ ] Persona selection screen
- [ ] Difficulty selection (temporary before AI learning)
- [ ] In-game UI (turn indicators, ship status)
- [ ] Post-game summary

### Planned for v0.3.0 (Week 3 - Target: Nov 24, 2024)

#### AI Learning & Memory
- [ ] Game analysis engine (pattern extraction)
- [ ] Memory storage in JSONB
- [ ] Memory retrieval before games
- [ ] AI behavior adaptation based on memory
- [ ] "What [Persona] Learned" post-game display

#### Relationship System
- [ ] Affinity tracking (0-100)
- [ ] Relationship type determination (Buddy/Rival/Neutral)
- [ ] Relationship badges in UI
- [ ] Different dialogue based on relationship
- [ ] Cross-game memory (Battleship → other games)

### Planned for v0.4.0 (Week 4 - Target: Dec 1, 2024)

#### Impostor Game
- [ ] Role assignment system
- [ ] Word selection mechanics
- [ ] Discussion phase UI
- [ ] Voting system
- [ ] Impostor detection logic
- [ ] AI persona behaviors for social deduction

### Planned for v0.5.0 (Week 5 - Target: Dec 8, 2024)

#### Codenames Game
- [ ] Team assignment (red/blue)
- [ ] Spymaster role
- [ ] Word grid generation (5x5)
- [ ] Clue giving system
- [ ] Word selection/voting
- [ ] Team score tracking

#### Polish & Beta Prep
- [ ] UI/UX improvements
- [ ] Bug fixes from testing
- [ ] Performance optimization
- [ ] Mobile experience refinement

### Planned for v0.6.0 (Week 6 - Target: Dec 15, 2024)

#### Beta Testing
- [ ] Recruit 10-20 beta testers
- [ ] Feedback collection system
- [ ] Bug tracking setup
- [ ] Critical bug fixes
- [ ] User experience improvements

### Planned for v1.0.0 (Week 7 - Target: Dec 24, 2024) 🎄

#### Public Launch
- [ ] All 3 games complete and polished
- [ ] AI learning system fully functional
- [ ] Cross-game persona memory working
- [ ] Marketing materials prepared
- [ ] Product Hunt launch
- [ ] Social media announcements
- [ ] Press kit and demo video

#### Post-Launch Features (Future)
- [ ] Additional personas (2-3 more)
- [ ] More games (Maze, others)
- [ ] Achievements system
- [ ] Leaderboards
- [ ] Premium tier (monetization)
- [ ] Mobile app
- [ ] Multiplayer modes

---

## Version History Summary

| Version | Release Date | Status | Key Features |
|---------|-------------|--------|--------------|
| 0.1.0 | Nov 5, 2024 | ✅ Released | Foundation, Auth, Landing |
| 0.2.0 | Nov 17, 2024 | 🚧 In Progress | Battleship game |
| 0.3.0 | Nov 24, 2024 | 📋 Planned | AI learning & memory |
| 0.4.0 | Dec 1, 2024 | 📋 Planned | Impostor game |
| 0.5.0 | Dec 8, 2024 | 📋 Planned | Codenames + polish |
| 0.6.0 | Dec 15, 2024 | 📋 Planned | Beta testing |
| 1.0.0 | Dec 24, 2024 | 🎯 Target | Public launch! |

---

## Upgrade Notes

### From Nothing to v0.1.0

This is the initial release. To set up:

1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env.local`
4. Add your Supabase credentials
5. Run the SQL setup script in Supabase
6. Run `npm run dev`

---

## Contributing

After v1.0.0 launch, contributions will be welcome! For now, this is a solo portfolio project.

---

**Last Updated:** November 5, 2024  
**Current Version:** v0.1.0  
**Next Version:** v0.2.0 (Battleship game)
