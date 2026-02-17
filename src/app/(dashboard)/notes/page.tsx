"use client";

import * as React from "react";
import { Inbox, Search } from "lucide-react";
import { DateRange } from "react-day-picker";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Combobox } from "@/components/ui/combobox";
import { DateRangePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PatientInfoCard,
  TranscriptionPanel,
  NotesPanel,
} from "@/components/humana";

import { patientsData } from "@/mocks/patient-data";
import { LocalStorage } from "@/data/localStorage";
import { STORAGE_KEYS } from "@/data/constants";
import {
  Patient,
  Bookmark,
  ConversationTurn,
  TranscriptionSection,
} from "@/types/types";

// Mock data for sessions filter
const sessionsFilter = [
  { id: "all", name: "All sessions" },
  { id: "recent", name: "Recent sessions" },
  { id: "this-week", name: "This week" },
  { id: "this-month", name: "This month" },
];

export default function NotesInsightsPage() {
  const [selectedPatient, setSelectedPatient] = React.useState("all");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [selectedSession, setSelectedSession] = React.useState<string>("");
  const [globalSearchQuery, setGlobalSearchQuery] = React.useState("");
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = React.useState(false);
  const [newNoteContent, setNewNoteContent] = React.useState("");
  const [newNoteBadge, setNewNoteBadge] = React.useState("");

  const storage = LocalStorage.getInstance();

  // Read patient data from unified storage (seeded by StorageBootstrap)
  const [patientsStore, setPatientsStore] = React.useState<
    Record<string, Patient>
  >(() => {
    return (
      storage.get<Record<string, Patient>>(STORAGE_KEYS.patients) ??
      patientsData
    );
  });

  const patientData =
    selectedPatient !== "all" ? (patientsStore[selectedPatient] ?? null) : null;

  // Set first session as default when patient changes
  React.useEffect(() => {
    if (patientData?.sessions?.length) {
      setSelectedSession(patientData.sessions[0].id);
    } else {
      setSelectedSession("");
    }
  }, [selectedPatient, patientData?.sessions]);

  const currentSession = patientData?.sessions?.find(
    (s) => s.id === selectedSession,
  );

  // Get current session conversation directly from patient store
  const getSessionConversation = React.useMemo(() => {
    if (!currentSession) return undefined;
    return currentSession.transcription.conversation;
  }, [currentSession]);

  const getSessionSections = React.useMemo(() => {
    if (!currentSession) return [];
    return currentSession.transcription.sections;
  }, [currentSession]);

  // Get notes for current session directly from patient store
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
    return patientData?.sessions?.flatMap((s) => s.bookmarks ?? []) ?? [];
  }, [patientData?.sessions]);

  /** Helper: update patientsStore state + persist to unified storage after a bookmark mutation */
  const updatePatientSessions = React.useCallback(
    (
      mapSession: (
        s: import("@/types/types").Session,
      ) => import("@/types/types").Session,
    ) => {
      setPatientsStore((prev) => {
        const patient = prev[selectedPatient];
        if (!patient?.sessions) return prev;
        return {
          ...prev,
          [selectedPatient]: {
            ...patient,
            sessions: patient.sessions.map(mapSession),
          },
        };
      });

      const stored = storage.get<Record<string, Patient>>(
        STORAGE_KEYS.patients,
      );
      if (stored?.[selectedPatient]) {
        const updatedPatient = {
          ...stored[selectedPatient],
          sessions: stored[selectedPatient].sessions?.map(mapSession),
        };
        storage.set(STORAGE_KEYS.patients, {
          ...stored,
          [selectedPatient]: updatedPatient,
        });
      }
    },
    [selectedPatient, storage],
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

  // Handle sections change – update store state and persist to unified storage
  const handleSectionsChange = React.useCallback(
    (sections: TranscriptionSection[]) => {
      // Update local store for immediate re-render
      setPatientsStore((prev) => {
        const patient = prev[selectedPatient];
        if (!patient?.sessions) return prev;
        return {
          ...prev,
          [selectedPatient]: {
            ...patient,
            sessions: patient.sessions.map((s) =>
              s.id === selectedSession
                ? { ...s, transcription: { ...s.transcription, sections } }
                : s,
            ),
          },
        };
      });

      // Persist to unified storage
      const stored = storage.get<Record<string, Patient>>(
        STORAGE_KEYS.patients,
      );
      if (stored?.[selectedPatient]) {
        const updatedPatient = {
          ...stored[selectedPatient],
          sessions: stored[selectedPatient].sessions?.map((s) =>
            s.id === selectedSession
              ? { ...s, transcription: { ...s.transcription, sections } }
              : s,
          ),
        };
        storage.set(STORAGE_KEYS.patients, {
          ...stored,
          [selectedPatient]: updatedPatient,
        });
      }
    },
    [selectedPatient, selectedSession, storage],
  );

  // Handle conversation change – update store state and persist to unified storage
  const handleConversationChange = React.useCallback(
    (conversation: ConversationTurn[]) => {
      // Update local store for immediate re-render
      setPatientsStore((prev) => {
        const patient = prev[selectedPatient];
        if (!patient?.sessions) return prev;
        return {
          ...prev,
          [selectedPatient]: {
            ...patient,
            sessions: patient.sessions.map((s) =>
              s.id === selectedSession
                ? {
                    ...s,
                    transcription: { ...s.transcription, conversation },
                  }
                : s,
            ),
          },
        };
      });

      // Persist to unified storage
      const stored = storage.get<Record<string, Patient>>(
        STORAGE_KEYS.patients,
      );
      if (stored?.[selectedPatient]) {
        const updatedPatient = {
          ...stored[selectedPatient],
          sessions: stored[selectedPatient].sessions?.map((s) =>
            s.id === selectedSession
              ? {
                  ...s,
                  transcription: { ...s.transcription, conversation },
                }
              : s,
          ),
        };
        storage.set(STORAGE_KEYS.patients, {
          ...stored,
          [selectedPatient]: updatedPatient,
        });
      }
    },
    [selectedPatient, selectedSession, storage],
  );

  // Handle adding a new note – insert into current session's notes
  const handleAddNote = () => {
    if (!newNoteContent.trim() || !selectedPatient || !selectedSession) return;

    const newNote = {
      id: `note-${Date.now()}`,
      badge: newNoteBadge || undefined,
      content: newNoteContent,
    };

    updatePatientSessions((s) =>
      s.id === selectedSession ? { ...s, notes: [...s.notes, newNote] } : s,
    );

    // Reset dialog state
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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="pt-10 pb-8 px-10 items-center overflow-hidden">
        <div className="flex flex-col gap-6 flex-1 min-h-0 w-full max-w-7xl">
          {/* Header */}
          <div className="space-y-1 shrink-0">
            <h1 className="text-2xl font-semibold tracking-tight">
              Notes & Insights
            </h1>
            <p className="text-base text-muted-foreground">
              Discover key highlights and semantic insights from your notes.
            </p>
            <p className="text-sm text-muted-foreground/60">
              Filter by case, session, or timeframe to explore patterns in your
              work.
            </p>
          </div>

          {/* Filters Row */}
          <div className="flex items-center justify-between flex-wrap gap-3 shrink-0">
            <div className="flex items-center gap-3">
              {/* Patient Filter - Combobox with search */}
              <Combobox
                options={[
                  { value: "all", label: "All patients" },
                  ...Object.values(patientsData).map((p: Patient) => ({
                    value: p.id,
                    label: p.name,
                  })),
                ]}
                value={selectedPatient}
                onValueChange={setSelectedPatient}
                placeholder="All patients"
                searchPlaceholder="Search patients..."
                emptyMessage="No patient found."
              />

              {/* Session Filter */}
              <Select defaultValue="all">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All sessions" />
                </SelectTrigger>
                <SelectContent>
                  {sessionsFilter.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Picker */}
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Date Range"
            />
          </div>

          {/* Content Area */}
          {selectedPatient === "all" || !patientData ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 border border-dashed rounded-lg min-h-[300px]">
              <div className="flex items-center justify-center size-12 rounded-md border bg-card shadow-xs">
                <Inbox className="size-6 text-foreground" />
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="text-xl font-semibold">
                  Select a patient to view notes
                </h2>
                <p className="text-sm text-muted-foreground">
                  Use the patient filter above to focus your insights.
                </p>
              </div>
            </div>
          ) : (
            /* Patient Selected View */
            <div className="flex-1 flex flex-col gap-4 min-h-0">
              {/* Patient Info Card */}
              <PatientInfoCard
                name={patientData.name}
                patientId={patientData.patientId}
                patientRouteId={selectedPatient}
                upcomingSessions={patientData.upcomingSessions}
              />

              {/* Session Tabs + Search */}
              <div className="flex items-center justify-between gap-4 shrink-0">
                {(patientData.sessions?.length ?? 0) > 0 ? (
                  <Tabs
                    value={selectedSession}
                    onValueChange={setSelectedSession}
                  >
                    <TabsList>
                      {patientData?.sessions?.map((session) => (
                        <TabsTrigger
                          key={session.id}
                          value={session.id}
                          className="gap-2"
                        >
                          {session.dayName} {session.date}
                          {session.noteCount > 0 && (
                            <Badge
                              variant="secondary"
                              className="size-5 p-0 justify-center"
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
                    className="pl-9 pr-12"
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
                <div className="flex-1 grid grid-cols-[1fr_360px] gap-4 min-h-0">
                  {/* Transcription Panel */}
                  <TranscriptionPanel
                    sessionTitle={currentSession.transcription.sessionTitle}
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
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  No session data available
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Note Dialog */}
        <Dialog
          open={isAddNoteDialogOpen}
          onOpenChange={setIsAddNoteDialogOpen}
        >
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
      </SidebarInset>
    </SidebarProvider>
  );
}
