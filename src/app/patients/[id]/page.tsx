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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
          sessionTitle: "Session S1",
          sessionDate: "2024-09-20",
          duration: "58 min.",
          sections: [
            {
              title: "Situation",
              content:
                "Patient arrived late to work after oversleeping. Boss made a comment about punctuality in front of colleagues.",
            },
            {
              title: "Patient's Report",
              content:
                "The patient arrived late to work after oversleeping. Boss made a comment about punctuality in front of colleagues. Patient reported feeling intense shame and anxiety throughout the day.",
            },
            {
              title: "Automatic Thoughts Identified",
              content: [
                '"I\'m a failure"',
                '"Everyone thinks I\'m incompetent"',
                '"I\'ll never be able to keep this job"',
              ],
            },
            {
              title: "Emotions",
              content: "Sadness: 75/100\nShame: 85/100\nAnxiety: 60/100",
            },
            {
              title: "Behaviors",
              content:
                "Avoided eye contact with colleagues for the rest of the day. Skipped lunch to stay at desk. Didn't speak up in afternoon meeting.",
            },
            {
              title: "Cognitive Patterns",
              content:
                "Patient demonstrates clear patterns of catastrophizing and all-or-nothing thinking. Core beliefs around personal inadequacy and defectiveness appear to be activated by perceived criticism from authority figures.",
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
            content: "Patient showing good progress with anxiety management techniques.",
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
    new Set()
  );

  // Local state for bookmarks
  const [bookmarks, setBookmarks] = React.useState<Record<string, Bookmark[]>>(
    {}
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
    {}
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
  }, [currentSession, patientId, selectedSession, localNotes, deletedNoteIds, editedNotes]);

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
    [patientId]
  );

  // Handle deleting a bookmark
  const handleDeleteBookmark = React.useCallback(
    (bookmarkId: string) => {
      setBookmarks((prev) => ({
        ...prev,
        [patientId]: (prev[patientId] || []).filter((b) => b.id !== bookmarkId),
      }));
    },
    [patientId]
  );

  // Handle updating a bookmark
  const handleUpdateBookmark = React.useCallback(
    (bookmarkId: string, updates: Partial<Bookmark>) => {
      setBookmarks((prev) => ({
        ...prev,
        [patientId]: (prev[patientId] || []).map((b) =>
          b.id === bookmarkId ? { ...b, ...updates } : b
        ),
      }));
    },
    [patientId]
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
          [sessionKey]: (prev[sessionKey] || []).filter((note) => note.id !== noteId),
        }));
      } else {
        // Mark original note as deleted
        setDeletedNoteIds((prev) => new Set([...prev, noteId]));
      }
    },
    [patientId, selectedSession, localNotes]
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
            note.id === noteId ? { ...note, content: newContent } : note
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
    [patientId, selectedSession, localNotes]
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
                        Your notes about this patient&apos;s overall presentation and progress.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Session Stats */}
                      <div className="flex flex-wrap items-center gap-8">
                        <div className="flex items-center gap-1">
                          <FileText className="size-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Last session:</span>
                          <span className="text-sm font-medium">{patient.lastSession}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="size-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Recorded sessions:</span>
                          <span className="text-sm font-medium">{patient.recordedSessions}</span>
                        </div>
                      </div>

                      {/* Summary Notes */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Summary notes</label>
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
