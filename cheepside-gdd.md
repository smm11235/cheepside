# Cheepside: Game Design Document

**Version:** 0.1 (Prototype)
**Last Updated:** February 2026
**Status:** Pre-production / First Prototype

---

## 1. Concept

### High Concept
Cheepside is a single-player roguelite that combines word game mechanics with football (soccer) match simulation. Players spell words to advance a ball down the pitch, with each successful "pass" rotating the ball to reveal new letters. The game uses a distinctive visual metaphor: the word game interface is styled as a head-on view of a football, with letters displayed on its hexagonal and pentagonal panels.

### Core Fantasy
You're the manager/playmaker of a team of birds, orchestrating attacks through clever wordplay. Spell words with the letters provided to build up to a pass or shot, maintaining possession, strengthing your position, and creating scoring opportunities.

### Influences
- **Word games:** Spelling Bee (centre letter requirement), Wordscapes, Bananagrams, Boggle
- **Roguelites:** Balatro, Luck Be a Landlord, Vampire Survivors, You Must Build a Boat, 10000000, Hades 2
- **Hybrid games:** Ridiculous Fishing, Dave the Diver

### Visual Style
Pixel art at the quality level of You Must Build a Boat or Luck Be a Landlord. Stylised, not realistic. The football pitch is 2D with cartoon bird sprites and an oversized ball. The word game interface resembles a classic black-and-white football viewed head-on.

---

## 2. Core Mechanics

### 2.1 Screen Layout
- **Top third:** Football pitch (2D, simplified). Shows ball position, bird players, and match state.
- **Bottom two-thirds:** Word game interface styled as a football viewed head-on.

Reference: You Must Build a Boat / 10000000 layout where action happens above and player input below. However, in this case we'll dedicate a bit more space to the game board than YMBAB/10000000

### 2.2 Word Game Interface
The interface represents a football viewed from the front:

- **Centre:** One pentagon (the "required" letter, Spelling Bee style)
- **Surrounding:** Five hexagons with additional letters
- **Background:** Other visible panels of the football (decorative, no letters) to maintain the ball aesthetic

The 12 pentagons on a real football map conceptually to the 11 players + 1 special element (probably - this is a future metagame hook).

### 2.3 Spelling Rules
- Words can use any combination of the available 6 letters
- Centre letter is optional but awards **2x points** when used
- Letters can be reused unlimited times
- Minimum word length: 3 letters
- Valid words checked against dictionary (~280k word list)
- Letter sets are pre-curated via SeedWordList.csv to ensure playable boards
- **QU is treated as a single tile** (not separate Q and U)

### 2.4 Scoring (Fibonacci by Length)
| Word Length | Points |
|-------------|--------|
| 3 letters   | 1      |
| 4 letters   | 2      |
| 5 letters   | 3      |
| 6 letters   | 5      |
| 7 letters   | 8      |
| 8 letters   | 13     |
| 9+ letters  | continues Fibonacci |

### 2.5 Possession Flow
A possession consists of 4 passes + 1 shot attempt:

| Phase       | Cumulative Points Required |
|-------------|---------------------------|
| Pass 1      | 5                         |
| Pass 2      | 20                        |
| Pass 3      | 40                        |
| Pass 4      | 65                        |
| Shot        | 100                       |

**Ball Rotation:**
- After each successful pass, the ball rotates to show a different pentagon in the centre
- The same pentagon cannot appear twice in a single possession (sequence of passes plus shot)
- After each shot (regardless of outcome), letters are fully reshuffled

### 2.6 Time Mechanics
- **Starting time:** 60 seconds
- **Time bonus:** +15 seconds awarded when player chooses to Pass
- **Maximum time:** 120 seconds (60 + 4×15)
- Time counts down continuously during possession
- **If time runs out, possession is lost** — even if points were sufficient to pass

**Strategic Hold:**
Once the current threshold is reached:
- Player may pass immediately to bank the +15s time bonus
- Or continue spelling for extra points (but clock keeps ticking)
- No automatic time bonus — must actively Pass to receive it

This creates risk/reward: more time on the current board might make sense if there are still easy words remaining, but the clock is ticking and the time bonus isn't banked until you pass.

### 2.7 Shot Resolution
When the player reaches 100 points and triggers a shot, success is determined by:

- **Accuracy factor:** Time remaining when 100 points reached
- **Power factor:** Points accumulated beyond 100

This creates risk/reward: more points improve shot power but reduce accuracy.

*Prototype implementation:* Weighted random roll (on a logrithmic curve) for goal vs no-goal. Exact formula TBD through playtesting.

### 2.8 Match Structure (Prototype)
- **Possessions per match:** 3
- **Objective:** Score as many goals as possible
- **No defence phase in initial prototype**

---

## 3. Prototype Scope (v0.1)

### Current Implementation (as of Feb 2026)
**Live at:** https://smm11235.github.io/cheepside/

**Implemented:**
- Full word game interface (pentagon centre + 5 hexagons)
- Keyboard input (type letters, Backspace, Enter to submit, Space to pass, Escape to clear)
- Touch/click input with visual feedback
- Fibonacci scoring with 2x bonus for centre letter
- Pass/shot threshold system (5 → 20 → 40 → 65 → 100)
- Time mechanics (60s start, +15s on pass, 120s max)
- Shot resolution with accuracy/power formula
- 3-possession match structure
- Ball position visualization on pitch
- React HUD overlay
- SeedWordList.csv letter generation (pre-curated, no repeats per possession)
- QU as single tile throughout

**Known Issues:**
- No visual polish / placeholder graphics
- No sound
- Ball rotation animation is instant (no transition)

### In Scope
1. **Football pitch visualisation (placeholder)**
   - Ball position indicator
   - Basic match state display (possession count, goals scored)
   - Does not need to look polished—information delivery only

2. **Word game interface**
   - Football-styled letter wheel (1 pentagon centre + 5 hexagon surround)
   - Letter input via tapping hexagons/pentagon
   - Current word display
   - Submit/clear word controls
   - Dictionary validation

3. **Core game loop**
   - Point accumulation toward pass/shot thresholds
   - Ball rotation on successful pass
   - Time countdown with bonuses
   - Shot resolution (simple probability)
   - 3-possession match with final score

4. **Basic HUD**
   - Current points / threshold
   - Time remaining
   - Possession indicator
   - Goals scored

### Out of Scope (v0.1)
- Defence mechanics
- Bird characters / team composition
- Metagame progression
- Equipment / upgrades
- Multiple leagues / opponents
- Sound / music
- Polish / juice / animations beyond functional

---

## 4. Future Iterations

### 4.1 Defence Phase (v0.2)
When possession is lost (time runs out before threshold), the opposing team has possession. Player interaction during defence TBD—likely still word-based but with different objective (e.g., emptying a bar rather than filling).

### 4.2 Bird Team Metagame (v0.3+)
- 11 bird players + 1 special
- Each bird corresponds to a pentagon on the ball
- Acquiring, training, and equipping birds
- Bird abilities that modify word game (letter bonuses, time extensions, score multipliers)

### 4.3 Roguelite Progression
- Match rewards regardless of win/loss ("even if you lose, you make progress")
- Unlockable bird species
- Equipment crafting/upgrades
- League progression with increasing difficulty

### 4.4 Expanded Match Mechanics
- Opponent AI with varying difficulty
- Special events mid-match
- Weather/pitch conditions affecting gameplay
- Set pieces (corners, free kicks) as bonus word challenges

### 4.5 Visual Polish
- Full pixel art for birds and pitch
- Ball rotation animations
- Goal celebrations
- Match atmosphere (crowd, stadium)

---

## 5. Open Questions

### Gameplay
- [ ] Defence mechanic specifics: What does the player do when not in possession?
- [x] Shot formula: `successChance = 0.4 + (accuracy/100)*0.4 + (power/100)*0.2` where accuracy = timeRemaining*2 (capped at 100), power = log2(bonusPoints+1)*15 (capped at 100)
- [x] Letter distribution: SeedWordList.csv provides ~3400 curated letter sets with viable centres and difficulty ratings
- [ ] Pangram bonus: Award extra points for using all 6 letters in one word?

### Metagame
- [ ] What's the roguelite "run" structure? Single match? Tournament? Season?
- [ ] Currency types and economy
- [ ] Bird acquisition: Gacha? Drafting? Achievement unlocks?
- [ ] What persists between runs vs resets?

### Technical
- [x] Dictionary source and size: WordList.txt (~280k words, 3+ letters)
- [ ] Offline support requirements
- [ ] Save system architecture

### Business
- [ ] Monetisation model (likely F2P with IAP, but specifics TBD)
- [ ] Soft launch markets
- [ ] Analytics events to instrument

---

## 6. Reference Materials

### Visual References
- `you_must_build_a_boat.jpg` — Layout reference (action top, input bottom)
- `10000000.jpg` — Layout reference (desktop version, mobile adaptation needed)
- `football.jpg` — Football panel structure reference

### Games to Study
- **Spelling Bee** (NYT) — Core word mechanic, centre letter requirement
- **You Must Build a Boat** — Hybrid genre pacing, match-3 meets runner
- **Balatro** — Roguelite poker, excellent "build your engine" feel
- **Luck Be a Landlord** — Slot machine roguelite, visual style reference

---

## Appendix: Glossary

- **Possession:** One offensive sequence (4 passes + 1 shot attempt)
- **Pass:** Successfully reaching a point threshold, causing ball rotation
- **Shot:** Final phase of possession at 100 cumulative points
- **Ball rotation:** Visual transition showing new centre pentagon and surrounding hexagons
- **Pentagon/Hexagon:** The panels on a football; pentagons are the "centre letter" positions
