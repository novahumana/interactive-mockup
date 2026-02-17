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
import { DatePicker } from "@/components/ui/date-picker";
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
  FormulationTab,
} from "@/components/humana";

import { patientsData } from "@/mocks/patient-data";
import { LocalStorage } from "@/data/localStorage";
import { STORAGE_KEYS } from "@/data/constants";
import {
  Patient,
  ConversationTurn,
  TranscriptionSection,
  Bookmark,
} from "@/types/types";

export default function PatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.id;

  const storage = LocalStorage.getInstance();

  // Patient data is read from the unified storage key (seeded by StorageBootstrap)
  // and kept as state so that in-session edits trigger re-renders.
  const [patient, setPatient] = React.useState<Patient | undefined>(() => {
    const stored = storage.get<Record<string, Patient>>(STORAGE_KEYS.patients);
    return stored?.[patientId] ?? patientsData[patientId];
  });

  const [aiEnabled, setAiEnabled] = React.useState(
    patient?.aiTranscription === "enabled",
  );
  const [caseSummary, setCaseSummary] = React.useState(
    patient?.caseSummary || "",
  );
  const [nextSessionPrep, setNextSessionPrep] = React.useState(
    patient?.nextSessionPrep || "",
  );

  const [nextSessionDate, setNextSessionDate] = React.useState<
    Date | undefined
  >(undefined);
  const [nextSessionTime, setNextSessionTime] = React.useState("");
  const [nextSessionAmPm, setNextSessionAmPm] = React.useState<"AM" | "PM">(
    "AM",
  );

  // Populate next session fields client-side only (avoids SSR/localStorage hydration mismatch)
  React.useEffect(() => {
    const upcoming = patient?.upcomingSessions?.[0];
    if (!upcoming?.date) return;
    setNextSessionDate(new Date(upcoming.date));
    setNextSessionTime(upcoming.time ?? "");
    const [hours] = (upcoming.time ?? "").split(":").map(Number);
    setNextSessionAmPm(hours >= 12 ? "PM" : "AM");
  }, [patient?.id]);

  const handleAmPmChange = (ampm: "AM" | "PM") => {
    setNextSessionAmPm(ampm);
    if (!nextSessionTime) return;
    const [h, m] = nextSessionTime.split(":").map(Number);
    let newHour = h;
    if (ampm === "AM" && h >= 12) newHour = h - 12;
    if (ampm === "PM" && h < 12) newHour = h + 12;
    setNextSessionTime(
      `${String(newHour).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    );
  };

  // All notes across all sessions (for summary view)
  const allNotes = React.useMemo(() => {
    return patient?.sessions?.flatMap((s) => s.notes) ?? [];
  }, [patient?.sessions]);

  // Notes & Insights state
  const [selectedSession, setSelectedSession] = React.useState<string>("");
  const [globalSearchQuery, setGlobalSearchQuery] = React.useState("");
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = React.useState(false);
  const [newNoteContent, setNewNoteContent] = React.useState("");
  const [newNoteBadge, setNewNoteBadge] = React.useState("");

  // Set first session as default when patient changes
  React.useEffect(() => {
    if (patient?.sessions?.length) {
      setSelectedSession(patient.sessions[0].id);
    } else {
      setSelectedSession("");
    }
  }, [patient?.sessions]);

  const currentSession = patient?.sessions?.find(
    (s) => s.id === selectedSession,
  );

  // Get current session conversation directly from patient state
  const getSessionConversation = React.useMemo(() => {
    if (!currentSession) return undefined;
    return currentSession.transcription.conversation;
  }, [currentSession]);

  const getSessionSections = React.useMemo(() => {
    if (!currentSession) return [];
    return currentSession.transcription.sections;
  }, [currentSession]);

  // Get notes for current session directly from patient state
  const currentSessionNotes = React.useMemo(() => {
    if (!currentSession) return [];
    return currentSession.notes.map((note) => ({
      ...note,
      canDelete: true,
      canEdit: true,
    }));
  }, [currentSession]);

  // Get bookmarks for current patient (flat array across all sessions)
  const currentPatientBookmarks = React.useMemo(() => {
    return patient?.sessions?.flatMap((s) => s.bookmarks ?? []) ?? [];
  }, [patient?.sessions]);

  /** Helper: update patient state + persist to unified storage after a bookmark mutation */
  const updatePatientSessions = React.useCallback(
    (
      mapSession: (
        s: import("@/types/types").Session,
      ) => import("@/types/types").Session,
    ) => {
      setPatient((prev) => {
        if (!prev?.sessions) return prev;
        return { ...prev, sessions: prev.sessions.map(mapSession) };
      });

      const stored = storage.get<Record<string, Patient>>(
        STORAGE_KEYS.patients,
      );
      if (stored?.[patientId]) {
        const updatedPatient = {
          ...stored[patientId],
          sessions: stored[patientId].sessions?.map(mapSession),
        };
        storage.set(STORAGE_KEYS.patients, {
          ...stored,
          [patientId]: updatedPatient,
        });
      }
    },
    [patientId, storage],
  );

  // Handle creating a bookmark (added to the currently selected session)
  const handleCreateBookmark = React.useCallback(
    (bookmarkData: Omit<Bookmark, "id" | "createdAt">) => {
      const newBookmark: Bookmark = {
        ...bookmarkData,
        id: `bookmark-${Date.now()}`,
        createdAt: new Date(),
      };

      updatePatientSessions((s) =>
        s.id === selectedSession
          ? { ...s, bookmarks: [...(s.bookmarks ?? []), newBookmark] }
          : s,
      );
    },
    [selectedSession, updatePatientSessions],
  );

  // Handle deleting a bookmark (searches across all sessions)
  const handleDeleteBookmark = React.useCallback(
    (bookmarkId: string) => {
      updatePatientSessions((s) => ({
        ...s,
        bookmarks: (s.bookmarks ?? []).filter((b) => b.id !== bookmarkId),
      }));
    },
    [updatePatientSessions],
  );

  // Handle updating a bookmark (searches across all sessions)
  const handleUpdateBookmark = React.useCallback(
    (bookmarkId: string, updates: Partial<Bookmark>) => {
      updatePatientSessions((s) => ({
        ...s,
        bookmarks: (s.bookmarks ?? []).map((b) =>
          b.id === bookmarkId ? { ...b, ...updates } : b,
        ),
      }));
    },
    [updatePatientSessions],
  );

  // Handle sections change – update patient state and persist to unified storage
  const handleSectionsChange = React.useCallback(
    (sections: TranscriptionSection[]) => {
      // Update local patient state for immediate re-render
      setPatient((prev) => {
        if (!prev?.sessions) return prev;
        return {
          ...prev,
          sessions: prev.sessions.map((s) =>
            s.id === selectedSession
              ? { ...s, transcription: { ...s.transcription, sections } }
              : s,
          ),
        };
      });

      // Persist to unified storage
      const stored = storage.get<Record<string, Patient>>(
        STORAGE_KEYS.patients,
      );
      if (stored?.[patientId]) {
        const updatedPatient = {
          ...stored[patientId],
          sessions: stored[patientId].sessions?.map((s) =>
            s.id === selectedSession
              ? { ...s, transcription: { ...s.transcription, sections } }
              : s,
          ),
        };
        storage.set(STORAGE_KEYS.patients, {
          ...stored,
          [patientId]: updatedPatient,
        });
      }
    },
    [patientId, selectedSession, storage],
  );

  // Handle conversation change – update patient state and persist to unified storage
  const handleConversationChange = React.useCallback(
    (conversation: ConversationTurn[]) => {
      // Update local patient state for immediate re-render
      setPatient((prev) => {
        if (!prev?.sessions) return prev;
        return {
          ...prev,
          sessions: prev.sessions.map((s) =>
            s.id === selectedSession
              ? { ...s, transcription: { ...s.transcription, conversation } }
              : s,
          ),
        };
      });

      // Persist to unified storage
      const stored = storage.get<Record<string, Patient>>(
        STORAGE_KEYS.patients,
      );
      if (stored?.[patientId]) {
        const updatedPatient = {
          ...stored[patientId],
          sessions: stored[patientId].sessions?.map((s) =>
            s.id === selectedSession
              ? { ...s, transcription: { ...s.transcription, conversation } }
              : s,
          ),
        };
        storage.set(STORAGE_KEYS.patients, {
          ...stored,
          [patientId]: updatedPatient,
        });
      }
    },
    [patientId, selectedSession, storage],
  );

  // Handle adding a new note – insert into current session's notes
  const handleAddNote = () => {
    if (!newNoteContent.trim() || !patientId || !selectedSession) return;

    const newNote = {
      id: `note-${Date.now()}`,
      badge: newNoteBadge || undefined,
      content: newNoteContent,
    };

    updatePatientSessions((s) =>
      s.id === selectedSession ? { ...s, notes: [...s.notes, newNote] } : s,
    );

    setNewNoteContent("");
    setNewNoteBadge("");
    setIsAddNoteDialogOpen(false);
  };

  // Handle deleting a note from the current session
  const handleDeleteNote = React.useCallback(
    (noteId: string) => {
      updatePatientSessions((s) =>
        s.id === selectedSession
          ? { ...s, notes: s.notes.filter((n) => n.id !== noteId) }
          : s,
      );
    },
    [selectedSession, updatePatientSessions],
  );

  // Handle editing a note in the current session
  const handleEditNote = React.useCallback(
    (noteId: string, newContent: string) => {
      updatePatientSessions((s) =>
        s.id === selectedSession
          ? {
              ...s,
              notes: s.notes.map((n) =>
                n.id === noteId ? { ...n, content: newContent } : n,
              ),
            }
          : s,
      );
    },
    [selectedSession, updatePatientSessions],
  );

  if (!patient) {
    return (
      <SidebarProvider>
        <PatientSidebar
          currentPatientId={patientId}
          aiEnabled={aiEnabled}
          onAiEnabledChange={setAiEnabled}
        />
        <SidebarInset>
          <main className="flex-1 pt-10 pb-8 px-10">
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
      <PatientSidebar
        currentPatientId={patientId}
        aiEnabled={aiEnabled}
        onAiEnabledChange={setAiEnabled}
      />
      <SidebarInset>
        <main className="flex-1 px-8 py-10">
          <div className="page-container space-y-6">
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

                      {/* Summary Notes — tabbed by session */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Summary notes
                        </label>
                        <Tabs defaultValue="all">
                          <TabsList className="h-8 gap-0.5">
                            <TabsTrigger
                              value="all"
                              className="text-xs px-3 h-7"
                            >
                              All notes
                              {allNotes.length > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="ml-1.5 size-4 p-0 justify-center rounded-full text-[10px]"
                                >
                                  {allNotes.length}
                                </Badge>
                              )}
                            </TabsTrigger>
                            {patient.sessions?.map((session) => (
                              <TabsTrigger
                                key={session.id}
                                value={session.id}
                                className="text-xs px-3 h-7"
                              >
                                {session.dayName.slice(0, 3)} {session.date}
                                {session.notes.length > 0 && (
                                  <Badge
                                    variant="secondary"
                                    className="ml-1.5 size-4 p-0 justify-center rounded-full text-[10px]"
                                  >
                                    {session.notes.length}
                                  </Badge>
                                )}
                              </TabsTrigger>
                            ))}
                          </TabsList>

                          {/* All notes */}
                          <TabsContent value="all" className="mt-2">
                            {allNotes.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-6 border rounded-md">
                                No notes yet
                              </p>
                            ) : (
                              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                {allNotes.map((note) => (
                                  <div
                                    key={note.id}
                                    className="rounded-lg border bg-muted/50 p-3 space-y-1"
                                  >
                                    {note.badge && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs rounded-full px-2 py-0.5"
                                      >
                                        {note.badge}
                                      </Badge>
                                    )}
                                    <p className="text-sm leading-relaxed">
                                      {note.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </TabsContent>

                          {/* Per-session notes */}
                          {patient.sessions?.map((session) => (
                            <TabsContent
                              key={session.id}
                              value={session.id}
                              className="mt-2"
                            >
                              {session.notes.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6 border rounded-md">
                                  No notes for this session
                                </p>
                              ) : (
                                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                  {session.notes.map((note) => (
                                    <div
                                      key={note.id}
                                      className="rounded-lg border bg-muted/50 p-3 space-y-1"
                                    >
                                      {note.badge && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs rounded-full px-2 py-0.5"
                                        >
                                          {note.badge}
                                        </Badge>
                                      )}
                                      <p className="text-sm leading-relaxed">
                                        {note.content}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </TabsContent>
                          ))}
                        </Tabs>
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
                    <CardContent className="space-y-4">
                      {/* Next session date + time */}
                      <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">
                          Next session
                        </Label>
                        <div className="flex items-center gap-2">
                          <DatePicker
                            date={nextSessionDate}
                            onDateChange={setNextSessionDate}
                            placeholder="Select a date"
                            className="flex-1 w-auto"
                          />
                          <Input
                            type="time"
                            value={nextSessionTime}
                            onChange={(e) => setNextSessionTime(e.target.value)}
                            className="w-[110px] bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          />
                          <div className="flex border rounded-md overflow-hidden shrink-0">
                            <Button
                              type="button"
                              variant={
                                nextSessionAmPm === "AM" ? "default" : "ghost"
                              }
                              size="sm"
                              className="rounded-none h-9 px-3 text-xs"
                              onClick={() => handleAmPmChange("AM")}
                            >
                              AM
                            </Button>
                            <Button
                              type="button"
                              variant={
                                nextSessionAmPm === "PM" ? "default" : "ghost"
                              }
                              size="sm"
                              className="rounded-none h-9 px-3 text-xs border-l"
                              onClick={() => handleAmPmChange("PM")}
                            >
                              PM
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Prep Notes */}
                      <Textarea
                        placeholder="Add notes, topics to discuss, or interventions to try in the next session..."
                        className="min-h-[120px] resize-none"
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
                  {(patient?.sessions?.length ?? 0) > 0 ? (
                    <Tabs
                      value={selectedSession}
                      onValueChange={setSelectedSession}
                    >
                      <TabsList className="h-9 p-1">
                        {patient?.sessions?.map((session) => (
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
                    {/* Transcription Panel — hidden when no AI consent */}
                    {aiEnabled ? (
                      <TranscriptionPanel
                        sessionTitle={
                          currentSession.transcription.sessionTitle
                        }
                        sessionDate={currentSession.transcription.sessionDate}
                        duration={currentSession.transcription.duration}
                        conversation={getSessionConversation}
                        sections={getSessionSections}
                        globalSearchQuery={globalSearchQuery}
                        bookmarks={currentPatientBookmarks}
                        onBookmarkCreate={handleCreateBookmark}
                        onBookmarkDelete={handleDeleteBookmark}
                        onBookmarkUpdate={handleUpdateBookmark}
                        onSectionsChange={handleSectionsChange}
                        onConversationChange={handleConversationChange}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg text-center p-8">
                        <p className="font-medium text-sm">
                          Transcription not available
                        </p>
                        <p className="text-xs text-muted-foreground max-w-[220px]">
                          This patient has not given consent for AI
                          transcription. Enable consent from the Settings icon
                          in the sidebar.
                        </p>
                      </div>
                    )}

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
                <FormulationTab
                  bookmarks={currentPatientBookmarks}
                  sessions={patient.sessions}
                />
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
