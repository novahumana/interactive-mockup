# Store Requirements

## Storage Mechanism

This is a demo application. All data is persisted in the browser's LocalStorage.

### Architecture

Storage access is abstracted through the `IStorage` interface, with `LocalStorage` as the current implementation. This allows swapping the storage backend in the future without changing consumer code.

```
IStorage (interface)
    └── LocalStorage (singleton implementation)
```

### Key Files

| File                                   | Purpose                                    |
| -------------------------------------- | ------------------------------------------ |
| `src/data/index.ts`                    | `IStorage` interface definition            |
| `src/data/localStorage.ts`             | `LocalStorage` singleton implementation    |
| `src/data/constants.ts`                | `STORAGE_KEYS` constant (all storage keys) |
| `src/mocks/patient-data.ts`            | Mock data used for seeding                 |
| `src/components/storage-bootstrap.tsx` | Seeds localStorage on app mount            |

---

## Storage Keys

All keys are defined in `STORAGE_KEYS`. Never use raw strings.

```typescript
import { STORAGE_KEYS } from "@/data/constants";
```

| Constant                                  | Key                                   | Type        | Description                      |
| ----------------------------------------- | ------------------------------------- | ----------- | -------------------------------- |
| `STORAGE_KEYS.patients`                   | `humana-patients`                     | `Patient[]` | Main data store (aggregate root) |
| `STORAGE_KEYS.bookmarkPreferredFramework` | `humana-bookmark-preferred-framework` | `string`    | User preference                  |
| `STORAGE_KEYS.bookmarkPreferredCategory`  | `humana-bookmark-preferred-category`  | `string`    | User preference                  |

---

## Usage Pattern

```typescript
import { LocalStorage } from "@/data/localStorage";
import { STORAGE_KEYS } from "@/data/constants";
import type { Patient } from "@/types/types";

const storage = LocalStorage.getInstance();

// Read patients
const patients = storage.get<Patient[]>(STORAGE_KEYS.patients) ?? [];

// Write patients
storage.set(STORAGE_KEYS.patients, patients);

// Read/write simple preferences
const framework = storage.getString(STORAGE_KEYS.bookmarkPreferredFramework);
storage.setString(STORAGE_KEYS.bookmarkPreferredFramework, "CBT");
```

---

## Bootstrap Behavior

On every page reload, `StorageBootstrap` (mounted in `layout.tsx`) seeds localStorage with mock data from `src/mocks/patient-data.ts`.

**Implications:**

- User modifications persist during client-side navigation
- User modifications are reset on full page reload
- This is intentional for demo purposes

---

## Domain Model

### Entity Relationship Diagram

```
Patient (root aggregate)
├── id, name, patientId, status, initials
├── aiTranscription, lastSession, recordedSessions
├── caseSummary, nextSessionPrep
│
├── sessions: Session[]
│   ├── id, date, dayName, noteCount
│   │
│   ├── transcription: Transcription
│   │   ├── sessionTitle, sessionDate, duration
│   │   ├── conversation?: ConversationTurn[]
│   │   │   └── speaker ("therapist" | "patient"), message
│   │   └── sections: TranscriptionSection[]
│   │       └── title, content (string | string[])
│   │
│   ├── notes: Note[]
│   │   └── id, badge?, content
│   │
│   └── bookmarks: Bookmark[]
│       └── id, text, framework, category, createdAt
│
└── upcomingSessions?: UpcomingSession[]
    └── date, time
```

### Entity Summary

| Entity                 | Description                                       | Parent                       |
| ---------------------- | ------------------------------------------------- | ---------------------------- |
| `Patient`              | Root aggregate. All data access starts here.      | —                            |
| `Session`              | A recorded therapy session with its artifacts.    | `Patient.sessions`           |
| `Transcription`        | Structured transcript of a session.               | `Session.transcription`      |
| `ConversationTurn`     | Single speaker turn in the dialogue.              | `Transcription.conversation` |
| `TranscriptionSection` | Titled section of transcription content.          | `Transcription.sections`     |
| `Note`                 | Therapist's free-form note on a session.          | `Session.notes`              |
| `Bookmark`             | Highlighted text with therapeutic categorization. | `Session.bookmarks`          |
| `UpcomingSession`      | Scheduled future appointment.                     | `Patient.upcomingSessions`   |

---

## Access Patterns

Since `Patient` is the root aggregate, always traverse from the patient level:

```typescript
// ❌ Wrong: raw key, no abstraction
const raw = localStorage.getItem("humana-patients");

// ❌ Wrong: direct nested access doesn't exist
const sessions = storage.get("sessions");

// ✅ Correct: use singleton + STORAGE_KEYS + traverse
const storage = LocalStorage.getInstance();
const patients = storage.get<Patient[]>(STORAGE_KEYS.patients) ?? [];
const patient = patients.find((p) => p.id === patientId);
const session = patient?.sessions?.find((s) => s.id === sessionId);
const bookmark = session?.bookmarks?.find((b) => b.id === bookmarkId);
```

### Mutation Pattern

```typescript
// 1. Read current state
const patients = storage.get<Patient[]>(STORAGE_KEYS.patients) ?? [];

// 2. Find and mutate
const patientIndex = patients.findIndex((p) => p.id === patientId);
if (patientIndex !== -1) {
  const sessionIndex =
    patients[patientIndex].sessions?.findIndex((s) => s.id === sessionId) ?? -1;
  if (sessionIndex !== -1) {
    patients[patientIndex].sessions![sessionIndex].notes.push(newNote);
    patients[patientIndex].sessions![sessionIndex].noteCount += 1;
  }
}

// 3. Persist entire array
storage.set(STORAGE_KEYS.patients, patients);
```

---

## Rules

- **MUST** use `LocalStorage.getInstance()` — never instantiate directly
- **MUST** use `STORAGE_KEYS` constants — never use raw key strings
- **MUST** treat `Patient` as the aggregate root for all data access
- **MUST** persist the entire `Patient[]` array on any mutation
- **MUST** keep `session.noteCount` in sync with `session.notes.length`
- **MUST** use ISO 8601 strings for date fields
- **MUST NOT** create new storage keys without adding them to `STORAGE_KEYS`
- **MUST NOT** access `localStorage` directly — always use the `LocalStorage` class

---

## Type Definitions

Canonical source: `src/types/types.ts`

```typescript
import type { Patient, Session, Bookmark, Note } from "@/types";
```
