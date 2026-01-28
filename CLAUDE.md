# Humana Project - Claude Instructions

## Project Overview
Humana is a **patient management platform for psychotherapists**. It's designed to be privacy-first, human-centered, with AI features that are opt-in per patient.

### Core Philosophy
- **Privacy-first**: Patient data protection is paramount
- **Human-centered design**: The therapist-patient relationship comes first
- **AI opt-in**: AI features (transcription, insights) are enabled per-patient, not globally

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Components**: Shadcn UI (Radix primitives)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode

### Design System
- **Figma file**: `xR952A48bMic8kiJ06jDMF`
- **Font**: Geist (Sans & Mono)
- **Border radius**: 8px (0.5rem) standard

### Key Colors (from Figma)
```
AI Enabled:  bg=#DCFCE7, border=#15803D, text=#15803D
AI Disabled: bg=#FEF2F2, border=#F87171, text=#F87171
Status Active: bg=#E5E5E5, text=#171717
```

## Project Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── humana/          # Custom Humana components
│   ├── ui/              # Shadcn UI components
│   ├── app-sidebar.tsx  # Main sidebar navigation
│   └── patients-table.tsx
├── hooks/               # Custom React hooks
└── lib/
    ├── constants.ts     # Brand constants & config
    └── utils.ts         # Utility functions (cn)
```

## Coding Conventions

### Components
- Use `"use client"` directive only when needed (hooks, interactivity)
- Prefer Shadcn components over custom implementations
- Custom Humana components go in `components/humana/`

### Styling
- Use Tailwind utility classes
- For Figma-specific colors, use hex values: `text-[#15803D]`
- Use CSS variables for theme colors: `text-foreground`, `bg-background`

### Imports
- Use path aliases: `@/components/`, `@/lib/`, `@/hooks/`
- Barrel exports available: `@/components/ui`, `@/components/humana`

## Completed Features (DO NOT MODIFY)
These components are complete and should not be touched:
- **Sidebar** (`components/app-sidebar.tsx`) - Navigation with Dashboard, Patients, Notes & Insights
- **Patients page** (`app/patients/`) - Patients table with status and AI badges
- Today's appointments shortcuts
- Dark/Light theme toggle

### Sidebar Behavior
The sidebar uses `usePathname()` to automatically highlight the active menu item based on the current route:
- `/` → Patients is active
- `/notes` → Notes & Insights is active
- `/dashboard` → Dashboard is active

## Current Work: Notes & Insights Page
**Figma node**: `260:1564` (Empty state - no patient selected)
**URL**: `https://www.figma.com/design/xR952A48bMic8kiJ06jDMF/Humana?node-id=260-1564`

### Page Structure (Empty State)
- Header: "Notes & Insights" title + description
- Filters row:
  - Patient combobox ("All patients")
  - Session dropdown ("All sessions")
  - Date range picker
- Empty state box (dashed border):
  - Inbox icon
  - "Select a patient to view notes"
  - Description text

## Pending Features
- [ ] Notes & Insights page (in progress)
- [ ] Patient detail page
- [ ] Session notes
- [ ] AI transcription integration

## Design Reference
When implementing new features, always reference the Figma design:
- File: `https://www.figma.com/design/xR952A48bMic8kiJ06jDMF/Humana`
- Use Figma MCP to fetch node details when needed
