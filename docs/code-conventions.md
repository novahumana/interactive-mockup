# Code Conventions

These conventions apply to **all** code changes in this project.

---

## Components

### Client vs Server Components

- **DEFAULT** to Server Components (no directive needed)
- **ADD** `"use client"` only when the component uses:
  - React hooks (`useState`, `useEffect`, `useContext`, etc.)
  - Browser APIs (`window`, `localStorage`, `document`)
  - Event handlers (`onClick`, `onChange`, etc.)
  - Third-party client-only libraries

### Component Libraries

| Need                     | Use               | Location               |
| ------------------------ | ----------------- | ---------------------- |
| Standard UI elements     | shadcn/ui         | `@/components/ui`      |
| App-specific components  | Humana components | `@/components/humana`  |
| Custom one-off component | Create new        | `@/components/humana/` |

```typescript
// ❌ Wrong: custom button when shadcn exists
const MyButton = ({ children }) => <button className="...">{children}</button>

// ✅ Correct: use shadcn
import { Button } from "@/components/ui/button"
```

- **MUST** check shadcn/ui before creating custom components
- **MUST** place app-specific components in `components/humana/`
- **MUST NOT** modify files in `components/ui/` (shadcn managed)

---

## Styling

### Tailwind Usage

- **MUST** use Tailwind utility classes for all styling
- **MUST NOT** use inline `style` attributes
- **MUST NOT** create separate CSS files for components

### Color System

| Color Type                        | Syntax       | Example                                             |
| --------------------------------- | ------------ | --------------------------------------------------- |
| Theme colors (light/dark aware)   | CSS variable | `text-foreground`, `bg-background`, `border-border` |
| Figma design tokens (exact match) | Hex value    | `text-[#15803D]`, `bg-[#F3F4F6]`                    |
| Tailwind palette                  | Class name   | `text-green-700`, `bg-gray-100`                     |

```typescript
// ❌ Wrong: hardcoded color that should be theme-aware
<div className="text-black bg-white">

// ✅ Correct: theme-aware colors
<div className="text-foreground bg-background">

// ✅ Correct: Figma spec requires exact color
<span className="text-[#15803D]">Success</span>
```

- **PREFER** CSS variables for colors that should adapt to light/dark mode
- **USE** hex values only when matching exact Figma specifications

---

## Imports

### Path Aliases

- **MUST** use path aliases for all internal imports
- **MUST NOT** use relative paths that traverse more than one level (`../../`)

| Alias           | Maps to           |
| --------------- | ----------------- |
| `@/components/` | `src/components/` |
| `@/lib/`        | `src/lib/`        |
| `@/hooks/`      | `src/hooks/`      |
| `@/data/`       | `src/data/`       |
| `@/types`       | `src/types.ts`    |
| `@/mocks/`      | `src/mocks/`      |

### Barrel Exports

```typescript
// ❌ Wrong: deep import
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// ✅ Correct: barrel import when available
import { Button, Card } from "@/components/ui";

// ✅ Correct: barrel import for Humana components
import { PatientCard, SessionList } from "@/components/humana";
```

- **PREFER** barrel imports from `@/components/ui` and `@/components/humana`
- **USE** direct imports only when barrel export is not available

### Import Order

```typescript
// 1. React/Next.js
import { useState } from "react";
import { useRouter } from "next/navigation";

// 2. External libraries
import { format } from "date-fns";

// 3. Internal: components
import { Button } from "@/components/ui";
import { PatientCard } from "@/components/humana";

// 4. Internal: utilities, hooks, data
import { cn } from "@/lib/utils";
import { usePatient } from "@/hooks/use-patient";
import { LocalStorage } from "@/data/localStorage";

// 5. Types (use `import type` when only importing types)
import type { Patient } from "@/types";
```
