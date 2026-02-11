"use client";

import * as React from "react";
import { use } from "react";
import {
  LayoutDashboard,
  Brain,
  Orbit,
  Lightbulb,
  FolderClosed,
  FileText,
  Search,
} from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { PatientSidebar } from "@/components/humana/patient-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TranscriptionPanel,
  NotesPanel,
  type Bookmark,
} from "@/components/humana";

interface Session {
  id: string;
  date: string;
  dayName: string;
  noteCount: number;
  transcription: {
    sessionTitle: string;
    sessionDate: string;
    duration: string;
    sections: { title: string; content: string | string[] }[];
  };
  notes: { id: string; badge?: string; content: string }[];
}

interface Patient {
  id: string;
  name: string;
  patientId: string;
  status: "active" | "intake";
  aiTranscription: "enabled" | "disabled";
  lastSession: string;
  recordedSessions: number;
  caseSummary: string;
  nextSessionPrep: string;
  sessions: Session[];
}

const patients: Record<string, Patient> = {
  "1": {
    id: "1",
    name: "Mario R.",
    patientId: "PZ-023",
    status: "active",
    aiTranscription: "enabled",
    lastSession: "2024-09-20",
    recordedSessions: 3,
    caseSummary: "",
    nextSessionPrep: "",
    sessions: [
      {
        id: "s1",
        date: "09.20",
        dayName: "Tuesday",
        noteCount: 2,
        transcription: {
          sessionTitle: "Session S1 - Work Anxiety & Perfectionism",
          sessionDate: "2024-09-20",
          duration: "58 min.",
          sections: [
            {
              title: "Complete Session Transcript",
              content: `[00:00 - Opening]

Therapist: Hello Mario, good to see you. How have you been since we last spoke?

Patient: Yeah, hi. Um, I've been... it's been a tough week, honestly. Work has been really stressful.

Therapist: I'm sorry to hear that. Can you tell me a bit more about what's been happening?

Patient: So, this whole thing started on Tuesday morning. I overslept. Which almost never happens to me, but I was up late working the night before, and I just... I didn't hear my alarm. By the time I woke up, I was already 20 minutes late for work.

Therapist: Okay, you overslept. What happened when you got to work?

Patient: Well, I rushed in, and my boss was already there. And he made, like, this comment in front of everyone. He said, "Nice of you to join us, Mario." And just... (pause) everyone heard it. My colleagues all looked at me.

Therapist: That must have been uncomfortable. How did you feel in that moment?

Patient: I felt... I don't know, like I wanted to disappear. My face got all hot. I felt so ashamed. It wasn't just embarrassment, it was like... like everyone was thinking I'm irresponsible, that I can't handle my job.

Therapist: So the comment from your boss triggered some thoughts about what others were thinking of you?

Patient: Exactly. I kept thinking things like, "I'm a failure. Everyone here thinks I'm incompetent now." And the worst part is, I started thinking, "I'm never going to be able to keep this job. They're going to fire me." Which is crazy because one time being late shouldn't mean that, but my mind just went there.

Therapist: That does sound like your mind went to some pretty extreme conclusions. Let me ask you this - has your boss mentioned anything about your performance or job security since that comment?

Patient: No, nothing. He seemed normal after that. But I couldn't shake the feeling all day. I avoided making eye contact with people at lunch. Actually, I didn't even go to lunch. I just stayed at my desk, trying to look busy.

Therapist: So you isolated yourself because of the feelings you were having?

Patient: Yeah. And then in the afternoon, there was a team meeting, and I usually contribute ideas and things, but I completely stayed quiet. I didn't say a word. I was terrified of saying something wrong or stupid.

Therapist: I notice you said you were terrified. Can you describe what that felt like physically?

Patient: My stomach felt tight, like knots. And my hands were shaking a little. I was just in my head the whole time, replaying that moment in the morning over and over again. Like, his tone, the way people looked at me. I couldn't focus on anything anyone was saying in the meeting.

Therapist: That sounds really difficult. How did the rest of the week go?

Patient: It got a bit better by Thursday, but I was still kind of withdrawn. And honestly, Saturday I was dreading going back to work on Monday. I'm still dreading it.

Therapist: So even though it's seven days later, you're still carrying this anxiety with you. Mario, I want to pause here and reflect something back to you. Your boss made one comment, which I acknowledge was thoughtless, but since then, nothing has changed in terms of your actual job performance or your standing there, correct?

Patient: (pause) Well, yeah. I mean, obviously nothing has actually changed. I'm still doing my job fine. I know that logically.

Therapist: But emotionally, it feels like everything has changed?

Patient: Yes. Exactly that. It's like my mind jumped to this conclusion that I'm going to lose my job, and even though I know that's probably not true, I can't shake the feeling.

Therapist: What you're describing is what we call catastrophizing. Your mind takes one event - being late, getting a mildly critical comment - and it extrapolates that into a worst-case scenario. Does that resonate with you?

Patient: Yeah, it does. I mean, I've noticed I do this a lot, actually. Not just at work, but other places too.

Therapist: Can you give me another example?

Patient: Um, like, if my partner's quiet for a bit, I immediately think, "Oh no, I've done something wrong. She's mad at me." And I get all anxious until I ask her what's wrong, and usually she's just thinking about something work-related. It's exhausting, actually.

Therapist: It does sound exhausting - being in that state of worry constantly. I want to explore something. When you were a teenager, did this kind of anxious thinking happen then as well?

Patient: (longer pause) Yeah. Actually, a lot. My dad could be pretty critical growing up. He'd always point out what I did wrong instead of... I don't know, what I did right. And I learned pretty quickly that if I wasn't perfect, if I made mistakes, I'd get criticized.

Therapist: So there's a connection here. Being criticized by your boss triggered something deeper - some old patterns from your childhood about what criticism means about you as a person.

Patient: That makes sense. When he made that comment, it felt like... like I wasn't just being late, I was being a failure as a person. Because that's how my dad used to make me feel. Like one mistake meant I was fundamentally flawed.

Therapist: Do you see any difference between being late to work - which is a behavior that happened once - and being a failure as a person?

Patient: Of course there's a difference. I know that logically. But it doesn't feel like there's a difference when I'm in the middle of it.

Therapist: Right. That gap between what you know logically and what you feel is what we can work on. Let me ask you some challenging questions. Based on the evidence from your actual job, are you incompetent?

Patient: No. I get compliments on my work. I've had three promotions in the five years I've been there.

Therapist: And would an incompetent person receive three promotions?

Patient: No, of course not.

Therapist: So where's the discrepancy between the facts of your job performance and these thoughts you're having?

Patient: (pause) The discrepancy is huge. I guess, when I look at it objectively, I'm actually doing really well. But when I'm feeling anxious, I completely lose perspective.

Therapist: That's an important insight. And there's something else I want to point out. You said your boss seemed normal after the comment, that you haven't heard anything negative, yet you're still convinced you're going to be fired. What would change that conviction?

Patient: I don't know. I guess... I guess I'd have to just see, over time, that nothing bad happens? That everything goes back to normal?

Therapist: So you need the evidence of time and continued okay-ness to overcome the catastrophic thought?

Patient: Yeah. But I hate waiting. I hate being in this anxious state.

Therapist: I understand. And that's actually something we can work with. Let's think about some coping strategies. When you notice this catastrophic thinking starting, what do you think might help?

Patient: I've tried deep breathing before, but... I'm not really consistent with it.

Therapist: What about examining the thoughts? Like, challenging them? We could develop a approach for when you notice these thoughts happening. For example, instead of just accepting "I'm going to lose my job," you could ask yourself: What's the evidence for this? What's the evidence against it?

Patient: I suppose that could help. I'm just not sure I'll remember to do it in the moment.

Therapist: That's fair. Anxiety makes it hard to remember skills when you're in the middle of it. One thing that might help is practicing these skills when you're calmer, so they become more automatic. Also, writing things down sometimes helps. You could even keep a note on your phone about questions to ask yourself when these thoughts arise.

Patient: That might work. I could try that.

Therapist: Another thing I want us to explore is the connection to your childhood. It sounds like your father's critical style created a template for how you interpret criticism now - as a reflection of your fundamental worthiness. Is that fair to say?

Patient: That's pretty much it, yeah. I still feel like I need to be perfect to be okay. To be loved.

Therapist: And how's that working for you?

Patient: (laughs a little) It's not. Because obviously nobody's perfect, and I'm exhausted trying to be.

Therapist: Right. So one of the longer-term things we might want to work on is loosening the connection between your performance and your self-worth. But that's a deeper piece of work that takes time.

Patient: Okay. I can see why that would be important.

Therapist: For now, let's focus on: One, raising your awareness of when these catastrophic thoughts are happening. Two, practicing some thought-challenging techniques. And three, building in some regular stress-management practices like breathing or exercise.

Patient: Yeah, okay. I can do that.

Therapist: Good. One more question before we wrap up - when you go back to work this week, do you think you'll be able to use any of these tools?

Patient: I'll try. I'm still nervous about it, but having a plan helps a bit.

Therapist: That makes sense. Anxiety doesn't disappear right away, but having tools and perspective helps, and over time, the anxiety response typically decreases as you gather evidence that the catastrophic thing didn't happen.

Patient: Okay. That gives me some hope.

Therapist: Good. I want to check in with you about your week. Aside from work, how's the rest of your life been?

Patient: Pretty good, actually. My relationship is good, I'm exercising a bit, seeing friends. It's really just the work thing that's been bothering me lately.

Therapist: So work anxiety is your primary concern right now?

Patient: Yeah, pretty much. Well, and this tendency to catastrophize. The realization that I've been doing this my whole life is kind of... heavy.

Therapist: That's a big realization though. Self-awareness is the first step to change. Let's make sure we schedule another appointment so we can check in on how things are going and continue with this work.

Patient: Definitely. When should I come back?

Therapist: How about next week at the same time? That way you can practice some of these tools, and we can see how it goes.

Patient: Works for me. Thank you. I feel like I have more of a sense of what's happening and what I can do about it.

Therapist: Good. That's what I'm here for. We'll take it one step at a time. See you next week, Mario.

Patient: See you. Thanks again.

[End of Session - 58 minutes]`,
            },
            {
              title: "Key Clinical Observations",
              content: [
                "Patient demonstrates clear catastrophic thinking patterns triggered by perceived criticism",
                "Strong connection identified between current anxiety and childhood experiences with critical parenting",
                "Core belief: Performance = Self-worth. Perfectionism as defense mechanism",
                "Good insight and awareness of pattern; willing to work on skills",
                "Primary anxiety triggers: work performance evaluation, interpersonal criticism",
              ],
            },
            {
              title: "Automatic Thoughts Identified",
              content: [
                '"I\'m a failure"',
                '"Everyone thinks I\'m incompetent"',
                '"I\'ll never be able to keep this job"',
                '"One mistake means I\'m fundamentally flawed"',
              ],
            },
            {
              title: "Emotions Reported",
              content:
                "Shame: 85/100\nAnxiety: 75/100\nDread about future: 65/100\nFear of judgment: 80/100",
            },
            {
              title: "Therapeutic Interventions Used",
              content: [
                "Validation and normalization of anxiety responses",
                "Cognitive defusion - separating thoughts from facts",
                "Thought challenging and evidence examination",
                "Psychoeducation about catastrophizing",
                "Exploration of historical roots (childhood parenting style)",
                "Introduction to coping strategies (breathing, thought records)",
                "Behavioral activation discussion (continuing normal activities despite anxiety)",
              ],
            },
            {
              title: "Homework Assigned",
              content: [
                "Practice thought examination when catastrophic thoughts arise",
                "Create a note on phone with thought-challenging questions",
                "Continue stress management practices (exercise, social connection)",
                "Begin tracking anxiety patterns and triggers",
                "Observe evidence throughout the week that catastrophic predictions don\'t occur",
              ],
            },
          ],
        },
        notes: [
          {
            id: "n1",
            badge: "Badge",
            content:
              "Patient expressed significant shame around perceived workplace failures, linking current feelings to childhood experiences of parental criticism.",
          },
          {
            id: "n2",
            badge: "Badge",
            content:
              "Patient expressed significant shame around perceived workplace failures, linking current feelings to childhood experiences of parental criticism.",
          },
        ],
      },
      {
        id: "s2",
        date: "11.20",
        dayName: "Thursday",
        noteCount: 0,
        transcription: {
          sessionTitle: "Session S2",
          sessionDate: "2024-11-20",
          duration: "45 min.",
          sections: [
            {
              title: "Situation",
              content:
                "Follow-up session discussing progress since last meeting.",
            },
          ],
        },
        notes: [],
      },
    ],
  },
  "2": {
    id: "2",
    name: "Laura F.",
    patientId: "PZ-024",
    status: "intake",
    aiTranscription: "disabled",
    lastSession: "2024-09-18",
    recordedSessions: 1,
    caseSummary: "",
    nextSessionPrep: "",
    sessions: [
      {
        id: "s1",
        date: "09.18",
        dayName: "Monday",
        noteCount: 1,
        transcription: {
          sessionTitle: "Initial Assessment",
          sessionDate: "2024-09-18",
          duration: "60 min.",
          sections: [
            {
              title: "Situation",
              content: "Initial intake session with new patient.",
            },
          ],
        },
        notes: [
          {
            id: "n1",
            badge: "Intake",
            content: "New patient presenting with anxiety symptoms.",
          },
        ],
      },
    ],
  },
  "3": {
    id: "3",
    name: "Giada D.",
    patientId: "PZ-025",
    status: "active",
    aiTranscription: "enabled",
    lastSession: "2024-09-15",
    recordedSessions: 5,
    caseSummary: "",
    nextSessionPrep: "",
    sessions: [
      {
        id: "s1",
        date: "09.15",
        dayName: "Sunday",
        noteCount: 1,
        transcription: {
          sessionTitle: "Session S5",
          sessionDate: "2024-09-15",
          duration: "50 min.",
          sections: [
            {
              title: "Situation",
              content: "Ongoing therapy session focusing on coping strategies.",
            },
          ],
        },
        notes: [
          {
            id: "n1",
            badge: "Progress",
            content:
              "Patient showing good progress with anxiety management techniques.",
          },
        ],
      },
    ],
  },
  "4": {
    id: "4",
    name: "Tommaso G.",
    patientId: "PZ-026",
    status: "active",
    aiTranscription: "disabled",
    lastSession: "2024-09-12",
    recordedSessions: 2,
    caseSummary: "",
    nextSessionPrep: "",
    sessions: [
      {
        id: "s1",
        date: "09.12",
        dayName: "Thursday",
        noteCount: 0,
        transcription: {
          sessionTitle: "Session S2",
          sessionDate: "2024-09-12",
          duration: "55 min.",
          sections: [
            {
              title: "Situation",
              content: "Second session exploring family dynamics.",
            },
          ],
        },
        notes: [],
      },
    ],
  },
};

export default function PatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.id;
  const patient = patients[patientId];

  const [aiEnabled, setAiEnabled] = React.useState(
    patient?.aiTranscription === "enabled",
  );
  const [caseSummary, setCaseSummary] = React.useState(
    patient?.caseSummary || "",
  );
  const [nextSessionPrep, setNextSessionPrep] = React.useState(
    patient?.nextSessionPrep || "",
  );

  // Notes & Insights state
  const [selectedSession, setSelectedSession] = React.useState<string>("");
  const [globalSearchQuery, setGlobalSearchQuery] = React.useState("");
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = React.useState(false);
  const [newNoteContent, setNewNoteContent] = React.useState("");
  const [newNoteBadge, setNewNoteBadge] = React.useState("");

  // Local state for notes
  const [localNotes, setLocalNotes] = React.useState<
    Record<string, { id: string; badge?: string; content: string }[]>
  >({});

  // Track deleted note IDs (for original session notes)
  const [deletedNoteIds, setDeletedNoteIds] = React.useState<Set<string>>(
    new Set(),
  );

  // Local state for bookmarks
  const [bookmarks, setBookmarks] = React.useState<Record<string, Bookmark[]>>(
    {},
  );

  // Load bookmarks from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem("humana-bookmarks");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const bookmarksWithDates: Record<string, Bookmark[]> = {};
        for (const [key, value] of Object.entries(parsed)) {
          bookmarksWithDates[key] = (value as Bookmark[]).map((b) => ({
            ...b,
            createdAt: new Date(b.createdAt),
          }));
        }
        setBookmarks(bookmarksWithDates);
      } catch {
        setBookmarks({});
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  React.useEffect(() => {
    if (Object.keys(bookmarks).length > 0) {
      localStorage.setItem("humana-bookmarks", JSON.stringify(bookmarks));
    }
  }, [bookmarks]);

  // Set first session as default when patient changes
  React.useEffect(() => {
    if (patient?.sessions.length) {
      setSelectedSession(patient.sessions[0].id);
    } else {
      setSelectedSession("");
    }
  }, [patient?.sessions]);

  const currentSession = patient?.sessions.find(
    (s) => s.id === selectedSession,
  );

  // Track edited note content (for original session notes)
  const [editedNotes, setEditedNotes] = React.useState<Record<string, string>>(
    {},
  );

  // Get notes for current session (all notes are deletable and editable)
  const currentSessionNotes = React.useMemo(() => {
    if (!currentSession) return [];
    const sessionKey = `${patientId}-${selectedSession}`;
    const additionalNotes = localNotes[sessionKey] || [];
    // Original notes from session data (filter out deleted ones, apply edits)
    const originalNotes = currentSession.notes
      .filter((note) => !deletedNoteIds.has(note.id))
      .map((note) => ({
        ...note,
        content: editedNotes[note.id] ?? note.content,
        canDelete: true,
        canEdit: true,
      }));
    // User-created notes are also deletable and editable
    const userNotes = additionalNotes.map((note) => ({
      ...note,
      canDelete: true,
      canEdit: true,
    }));
    return [...originalNotes, ...userNotes];
  }, [
    currentSession,
    patientId,
    selectedSession,
    localNotes,
    deletedNoteIds,
    editedNotes,
  ]);

  // Get bookmarks for current patient
  const currentPatientBookmarks = React.useMemo(() => {
    return bookmarks[patientId] || [];
  }, [patientId, bookmarks]);

  // Handle creating a bookmark
  const handleCreateBookmark = React.useCallback(
    (bookmarkData: Omit<Bookmark, "id" | "createdAt">) => {
      const newBookmark: Bookmark = {
        ...bookmarkData,
        id: `bookmark-${Date.now()}`,
        createdAt: new Date(),
      };

      setBookmarks((prev) => ({
        ...prev,
        [patientId]: [...(prev[patientId] || []), newBookmark],
      }));
    },
    [patientId],
  );

  // Handle deleting a bookmark
  const handleDeleteBookmark = React.useCallback(
    (bookmarkId: string) => {
      setBookmarks((prev) => ({
        ...prev,
        [patientId]: (prev[patientId] || []).filter((b) => b.id !== bookmarkId),
      }));
    },
    [patientId],
  );

  // Handle updating a bookmark
  const handleUpdateBookmark = React.useCallback(
    (bookmarkId: string, updates: Partial<Bookmark>) => {
      setBookmarks((prev) => ({
        ...prev,
        [patientId]: (prev[patientId] || []).map((b) =>
          b.id === bookmarkId ? { ...b, ...updates } : b,
        ),
      }));
    },
    [patientId],
  );

  // Handle adding a new note
  const handleAddNote = () => {
    if (!newNoteContent.trim() || !patientId || !selectedSession) return;

    const sessionKey = `${patientId}-${selectedSession}`;
    const newNote = {
      id: `note-${Date.now()}`,
      badge: newNoteBadge || undefined,
      content: newNoteContent,
    };

    setLocalNotes((prev) => ({
      ...prev,
      [sessionKey]: [...(prev[sessionKey] || []), newNote],
    }));

    setNewNoteContent("");
    setNewNoteBadge("");
    setIsAddNoteDialogOpen(false);
  };

  // Handle deleting a note (both original and user-created)
  const handleDeleteNote = React.useCallback(
    (noteId: string) => {
      if (!patientId || !selectedSession) return;
      const sessionKey = `${patientId}-${selectedSession}`;

      // Check if it's a user-created note (stored in localNotes)
      const userNotes = localNotes[sessionKey] || [];
      const isUserNote = userNotes.some((note) => note.id === noteId);

      if (isUserNote) {
        // Delete from localNotes
        setLocalNotes((prev) => ({
          ...prev,
          [sessionKey]: (prev[sessionKey] || []).filter(
            (note) => note.id !== noteId,
          ),
        }));
      } else {
        // Mark original note as deleted
        setDeletedNoteIds((prev) => new Set([...prev, noteId]));
      }
    },
    [patientId, selectedSession, localNotes],
  );

  // Handle editing a note (both original and user-created)
  const handleEditNote = React.useCallback(
    (noteId: string, newContent: string) => {
      if (!patientId || !selectedSession) return;
      const sessionKey = `${patientId}-${selectedSession}`;

      // Check if it's a user-created note (stored in localNotes)
      const userNotes = localNotes[sessionKey] || [];
      const isUserNote = userNotes.some((note) => note.id === noteId);

      if (isUserNote) {
        // Update in localNotes
        setLocalNotes((prev) => ({
          ...prev,
          [sessionKey]: (prev[sessionKey] || []).map((note) =>
            note.id === noteId ? { ...note, content: newContent } : note,
          ),
        }));
      } else {
        // Store edited content for original note
        setEditedNotes((prev) => ({
          ...prev,
          [noteId]: newContent,
        }));
      }
    },
    [patientId, selectedSession, localNotes],
  );

  if (!patient) {
    return (
      <SidebarProvider>
        <PatientSidebar currentPatientId={patientId} />
        <SidebarInset>
          <main className="flex-1 px-8 py-10">
            <div className="flex items-center justify-center h-[60vh]">
              <p className="text-muted-foreground">Patient not found</p>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <PatientSidebar currentPatientId={patientId} />
      <SidebarInset>
        <main className="flex-1 px-8 py-10">
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {patient.name}
                </h1>
                <span className="text-muted-foreground">
                  ({patient.patientId})
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Patient clinical workspace and documentation
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="w-full">
                <TabsTrigger value="overview" className="flex-1">
                  <LayoutDashboard className="size-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex-1">
                  <Brain className="size-4" />
                  Notes & Insights
                </TabsTrigger>
                <TabsTrigger value="formulation" className="flex-1">
                  <Orbit className="size-4" />
                  Formulation
                </TabsTrigger>
                <TabsTrigger value="frameworks" className="flex-1">
                  <Lightbulb className="size-4" />
                  Frameworks
                </TabsTrigger>
                <TabsTrigger value="files" className="flex-1">
                  <FolderClosed className="size-4" />
                  Files
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="flex flex-col gap-6">
                  {/* Case Summary Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">Case summary</CardTitle>
                      <CardDescription>
                        Your notes about this patient&apos;s overall
                        presentation and progress.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Session Stats */}
                      <div className="flex flex-wrap items-center gap-8">
                        <div className="flex items-center gap-1">
                          <FileText className="size-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Last session:
                          </span>
                          <span className="text-sm font-medium">
                            {patient.lastSession}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="size-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Recorded sessions:
                          </span>
                          <span className="text-sm font-medium">
                            {patient.recordedSessions}
                          </span>
                        </div>
                      </div>

                      {/* Summary Notes */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Summary notes
                        </label>
                        <Textarea
                          placeholder="Patient presents with recurrent depressive episodes linked to workplace stress and perfectionist thinking patterns. Core beliefs around inadequacy identified. Good engagement with cognitive restructuring techniques."
                          className="min-h-[120px] resize-none"
                          value={caseSummary}
                          onChange={(e) => setCaseSummary(e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Next Session Prep Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Next session prep</CardTitle>
                      <CardDescription>
                        Notes and topics to address in the upcoming session
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Add notes, topics to discuss, or interventions to try in the next session..."
                        className="min-h-[160px] resize-none"
                        value={nextSessionPrep}
                        onChange={(e) => setNextSessionPrep(e.target.value)}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* AI & Transcription Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI & Transcription</CardTitle>
                    <CardDescription>
                      Manage AI features and transcription settings for this
                      patient
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Patient consent status
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Indicates whether the patient has provided consent for
                          AI features
                        </p>
                      </div>
                      <Badge
                        variant={aiEnabled ? "default" : "secondary"}
                        className={
                          aiEnabled
                            ? "bg-[#DCFCE7] text-[#15803D] border-[#15803D] hover:bg-[#DCFCE7]"
                            : "bg-[#FEF2F2] text-[#F87171] border-[#F87171] hover:bg-[#FEF2F2]"
                        }
                      >
                        {aiEnabled ? "Consent given" : "No consent"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 pt-2 border-t">
                      <Switch
                        checked={aiEnabled}
                        onCheckedChange={setAiEnabled}
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Enable AI features
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Enable transcription and AI-powered insights for
                          sessions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notes & Insights Tab */}
              <TabsContent value="notes" className="space-y-6">
                {/* Session Tabs + Search */}
                <div className="flex items-center justify-between gap-3">
                  {patient.sessions.length > 0 ? (
                    <Tabs
                      value={selectedSession}
                      onValueChange={setSelectedSession}
                    >
                      <TabsList className="h-9 p-1">
                        {patient.sessions.map((session) => (
                          <TabsTrigger
                            key={session.id}
                            value={session.id}
                            className="gap-1.5 px-3 py-1 data-[state=active]:shadow-sm"
                          >
                            {session.dayName} {session.date}
                            {session.noteCount > 0 && (
                              <Badge
                                variant="secondary"
                                className="size-5 p-0 justify-center rounded-full text-xs"
                              >
                                {session.noteCount}
                              </Badge>
                            )}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No sessions available
                    </div>
                  )}

                  {/* Global Search */}
                  <div className="relative w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search keywords..."
                      className="h-9 pl-9 pr-12 rounded-md"
                      value={globalSearchQuery}
                      onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Kbd>⌘F</Kbd>
                    </div>
                  </div>
                </div>

                {/* Two Column Layout */}
                {currentSession ? (
                  <div className="grid grid-cols-[1fr_360px] gap-4 min-h-[500px]">
                    {/* Transcription Panel */}
                    <TranscriptionPanel
                      sessionTitle={currentSession.transcription.sessionTitle}
                      sessionDate={currentSession.transcription.sessionDate}
                      duration={currentSession.transcription.duration}
                      sections={currentSession.transcription.sections}
                      globalSearchQuery={globalSearchQuery}
                      bookmarks={currentPatientBookmarks}
                      onBookmarkCreate={handleCreateBookmark}
                      onBookmarkDelete={handleDeleteBookmark}
                      onBookmarkUpdate={handleUpdateBookmark}
                    />

                    {/* Notes Panel */}
                    <NotesPanel
                      notes={currentSessionNotes}
                      globalSearchQuery={globalSearchQuery}
                      onAddNote={() => setIsAddNoteDialogOpen(true)}
                      onDeleteNote={handleDeleteNote}
                      onEditNote={handleEditNote}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground border-2 border-dashed rounded-lg">
                    <p className="text-sm">No session data available</p>
                  </div>
                )}
              </TabsContent>

              {/* Formulation Tab */}
              <TabsContent value="formulation">
                <div className="flex items-center justify-center h-[40vh] border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    Formulation content coming soon
                  </p>
                </div>
              </TabsContent>

              {/* Frameworks Tab */}
              <TabsContent value="frameworks">
                <div className="flex items-center justify-center h-[40vh] border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    Frameworks content coming soon
                  </p>
                </div>
              </TabsContent>

              {/* Files Tab */}
              <TabsContent value="files">
                <div className="flex items-center justify-center h-[40vh] border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    Files content coming soon
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>

      {/* Add Note Dialog */}
      <Dialog open={isAddNoteDialogOpen} onOpenChange={setIsAddNoteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Note</DialogTitle>
            <DialogDescription>
              Add a note to this session. Notes help you capture important
              insights and observations.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="badge">Badge (optional)</Label>
              <Input
                id="badge"
                placeholder="e.g., Important, Follow-up, Insight"
                value={newNoteBadge}
                onChange={(e) => setNewNoteBadge(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Note Content</Label>
              <Textarea
                id="content"
                placeholder="Write your note here..."
                className="min-h-[120px]"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddNoteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddNote} disabled={!newNoteContent.trim()}>
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
