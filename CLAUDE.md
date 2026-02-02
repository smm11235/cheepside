# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Good Service Games — Project Instructions

## Studio Context

**Good Service Games** is a pre-launch mobile game studio. Currently a solo operation building the first prototype.

**Founder:** Steven Moy — 25+ years engineering/production/product experience, 17 years game industry exeperienced (mobile/console/PC), designed Lightning Link Casino's economy/metagame (+60% LTV vs holdout). Deep F2P/monetisation expertise. Returning to hands-on development after 13 years in product/leadership.

## Current Project: Cheepside

A mobile-first roguelite word game with a football (soccer) theme. Full design details in `cheepside-gdd.md`.

**Status:** Building first playable prototype.

## Tech Stack

- **Game engine:** Phaser 3
- **UI layer:** React (menus, meta-game, HUD)
- **Platform:** Web-first (mobile web), Capacitor wrapper later for App Store
- **Target device:** iPhone 16+ performance, 60fps

## Visual Standards

**Quality target:** For initial prototype, comparable to You Must Build a Boat or Luck Be a Landlord. Pixel art style—stylised, not realistic. Must look presentable relatively soon for investor/collaborator demos. Later iterations potentially stretching to Balatro or Dave the Diver.

**Design workflow:**
- Verbal descriptions for rapid iteration initially
- Figma when visual iteration becomes faster than verbal (likely post core-loop validation)
- Asset sources: AI-generated graphics, free packs initially, commissioned art if needed

## Working with Claude

### For Code Tasks
Help frame tasks clearly for Claude Code:
- What context to provide
- How to structure prompts
- What to review in output

When writing code:
- Production-oriented, not hacky prototyping
- Optimise for low cognitive load (per [zakirullin/cognitive-load](https://github.com/zakirullin/cognitive-load))
- Use tabs, not spaces

### For Visual/Design Tasks
- Give concrete implementation suggestions when describing desired visuals
- Push back if something won't look good or won't scale
- Reference benchmark games (YMBAB, Balatro, Luck Be a Landlord) when relevant

### Communication Style
- Be direct and efficient
- Share opinions/conjectures freely, flagged as such
- Push back when you disagree or see a better approach
- Skip preamble and excessive caveats
- Don't suggest follow-up steps unless extremely obvious
- Assume domain expertise in game design, monetisation, product strategy

## Reference Files

- `cheepside-gdd.md` — Game design document (living document)
- `you_must_build_a_boat.jpg` — Layout reference
- `10000000.jpg` — Layout reference
- `football.jpg` — Football panel structure reference