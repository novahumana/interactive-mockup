/** Represents any bookmark the therapist created while reviewing a session's transcription
 *
 * @property id - Unique identifier for the bookmark.
 * @property text - The exact text from the transcription that was bookmarked.
 * @property framework - The therapeutic framework category assigned to this bookmark (e.g., "Longitudinal Formulation").
 * @property category - The specific category within the framework (e.g., "Core Beliefs").
 * @property createdAt - Timestamp of when the bookmark was created.
 */
export interface Bookmark {
  id: string;
  text: string;
  framework: string;
  category: string;
  createdAt: Date;
}

/** Represents any note written by the therapist and attached to a specific session */
export interface Note {
  id: string;
  badge?: string;
  content: string;
}

/**
 * Represents a single turn in a conversation between a therapist and a patient.
 * @property speaker - Indicates who is speaking in this turn.
 * @property message - The text content of the speaker's message.
 */
export interface ConversationTurn {
  speaker: "therapist" | "patient";
  message: string;
}

/**
 * Represents a section of a transcription with a title and associated content.
 *
 * The content can be a single string or an array of strings to support
 * multi-paragraph or segmented text.
 */
export interface TranscriptionSection {
  title: string;
  content: string | string[];
}

/**
 * Represents a transcription record for a session.
 *
 * @remarks
 * Includes basic session metadata (title, date, duration), optional
 * conversation turns, and required sections that structure the content.
 *
 * @property sessionTitle - The title of the session.
 * @property sessionDate - The date of the session.
 * @property duration - The total duration of the session.
 * @property conversation - Optional ordered list of conversation turns.
 * @property sections - Structured sections of the transcription.
 */
export interface Transcription {
  sessionTitle: string;
  sessionDate: string;
  duration: string;
  conversation?: ConversationTurn[];
  sections: TranscriptionSection[];
}

/**
 * Represents a single session with metadata, transcription, notes, and bookmarks.
 *
 * @remarks
 * A session aggregates its identifying information and related content produced during that session.
 *
 * @property id - Unique identifier for the session.
 * @property date - The date the session took place.
 * @property dayName - The name of the day (e.g., "Monday") for easier reference.
 * @property noteCount - The number of notes associated with this session.
 * @property transcription - The detailed transcription of the session.
 * @property notes - An array of notes taken by the therapist during or after the session.
 * @property bookmarks - An array of bookmarks created from the session's content.
 */
export interface Session {
  id: string;
  date: string;
  dayName: string;
  noteCount: number;
  transcription: Transcription;
  notes: Note[];
  bookmarks: Bookmark[];
}

/**
 * Represents an upcoming session's scheduled date and time.
 */
export interface UpcomingSession {
  date: string;
  time: string;
}

/** Define a Patient object */
export interface Patient {
  id: string;
  name: string;
  patientId: string;
  status: "active" | "intake";
  initials?: string;
  aiTranscription?: "enabled" | "disabled";
  lastSession?: string;
  recordedSessions?: number;
  caseSummary?: string;
  nextSessionPrep?: string;
  sessions?: Session[];
  upcomingSessions?: UpcomingSession[];
}
