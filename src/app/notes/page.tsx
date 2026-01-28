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
  type Bookmark,
} from "@/components/humana";

// Mock data for patients
const patients = [
  { value: "all", label: "All patients" },
  { value: "1", label: "Mario R." },
  { value: "2", label: "Giada D." },
  { value: "3", label: "Giovanni F." },
];

// Mock data for sessions filter
const sessionsFilter = [
  { id: "all", name: "All sessions" },
  { id: "recent", name: "Recent sessions" },
  { id: "this-week", name: "This week" },
  { id: "this-month", name: "This month" },
];

// Mock patient data
const mockPatientData: Record<
  string,
  {
    name: string;
    patientId: string;
    upcomingSessions: { date: string; time: string }[];
    sessions: {
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
    }[];
  }
> = {
  "1": {
    name: "Mario R.",
    patientId: "PZ-023",
    upcomingSessions: [
      { date: "Dec 10, 2024", time: "09:00" },
      { date: "Dec 17, 2024", time: "09:00" },
    ],
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
    name: "Giada D.",
    patientId: "PZ-045",
    upcomingSessions: [{ date: "Dec 12, 2024", time: "14:00" }],
    sessions: [
      {
        id: "s1",
        date: "10.15",
        dayName: "Monday",
        noteCount: 1,
        transcription: {
          sessionTitle: "Session S1",
          sessionDate: "2024-10-15",
          duration: "50 min.",
          sections: [
            {
              title: "Situation",
              content: "Initial assessment session.",
            },
          ],
        },
        notes: [
          {
            id: "n1",
            badge: "Initial",
            content: "Patient presents with generalized anxiety symptoms.",
          },
        ],
      },
    ],
  },
  "3": {
    name: "Giovanni F.",
    patientId: "PZ-067",
    upcomingSessions: [],
    sessions: [],
  },
};

export default function NotesInsightsPage() {
  const [selectedPatient, setSelectedPatient] = React.useState("all");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [selectedSession, setSelectedSession] = React.useState<string>("");
  const [globalSearchQuery, setGlobalSearchQuery] = React.useState("");
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = React.useState(false);
  const [newNoteContent, setNewNoteContent] = React.useState("");
  const [newNoteBadge, setNewNoteBadge] = React.useState("");

  // Local state for notes (in real app, this would be in a database)
  const [localNotes, setLocalNotes] = React.useState<
    Record<string, { id: string; badge?: string; content: string }[]>
  >({});

  // Local state for bookmarks - persisted in localStorage
  const [bookmarks, setBookmarks] = React.useState<Record<string, Bookmark[]>>(
    {}
  );

  // Load bookmarks from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem("humana-bookmarks");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const bookmarksWithDates: Record<string, Bookmark[]> = {};
        for (const [key, value] of Object.entries(parsed)) {
          bookmarksWithDates[key] = (value as Bookmark[]).map((b) => ({
            ...b,
            createdAt: new Date(b.createdAt),
          }));
        }
        setBookmarks(bookmarksWithDates);
      } catch {
        // Invalid data, start fresh
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

  const patientData =
    selectedPatient !== "all" ? mockPatientData[selectedPatient] : null;

  // Set first session as default when patient changes
  React.useEffect(() => {
    if (patientData?.sessions.length) {
      setSelectedSession(patientData.sessions[0].id);
    } else {
      setSelectedSession("");
    }
  }, [selectedPatient, patientData?.sessions]);

  const currentSession = patientData?.sessions.find(
    (s) => s.id === selectedSession,
  );

  // Get notes for current session (combining mock data with local notes)
  const currentSessionNotes = React.useMemo(() => {
    if (!currentSession) return [];
    const sessionKey = `${selectedPatient}-${selectedSession}`;
    const additionalNotes = localNotes[sessionKey] || [];
    return [...currentSession.notes, ...additionalNotes];
  }, [currentSession, selectedPatient, selectedSession, localNotes]);

  // Get bookmarks for current patient (stored per-patient, not per-session)
  const currentPatientBookmarks = React.useMemo(() => {
    return bookmarks[selectedPatient] || [];
  }, [selectedPatient, bookmarks]);

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
        [selectedPatient]: [...(prev[selectedPatient] || []), newBookmark],
      }));
    },
    [selectedPatient]
  );

  // Handle deleting a bookmark
  const handleDeleteBookmark = React.useCallback(
    (bookmarkId: string) => {
      setBookmarks((prev) => ({
        ...prev,
        [selectedPatient]: (prev[selectedPatient] || []).filter((b) => b.id !== bookmarkId),
      }));
    },
    [selectedPatient]
  );

  // Handle updating a bookmark
  const handleUpdateBookmark = React.useCallback(
    (bookmarkId: string, updates: Partial<Bookmark>) => {
      setBookmarks((prev) => ({
        ...prev,
        [selectedPatient]: (prev[selectedPatient] || []).map((b) =>
          b.id === bookmarkId ? { ...b, ...updates } : b
        ),
      }));
    },
    [selectedPatient]
  );

  // Handle adding a new note
  const handleAddNote = () => {
    if (!newNoteContent.trim() || !selectedPatient || !selectedSession) return;

    const sessionKey = `${selectedPatient}-${selectedSession}`;
    const newNote = {
      id: `note-${Date.now()}`,
      badge: newNoteBadge || undefined,
      content: newNoteContent,
    };

    setLocalNotes((prev) => ({
      ...prev,
      [sessionKey]: [...(prev[sessionKey] || []), newNote],
    }));

    // Reset dialog state
    setNewNoteContent("");
    setNewNoteBadge("");
    setIsAddNoteDialogOpen(false);
  };

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
                options={patients}
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
                {patientData.sessions.length > 0 ? (
                  <Tabs
                    value={selectedSession}
                    onValueChange={setSelectedSession}
                  >
                    <TabsList>
                      {patientData.sessions.map((session) => (
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
      </SidebarInset>
    </SidebarProvider>
  );
}
