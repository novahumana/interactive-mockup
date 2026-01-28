"use client";

import * as React from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Note {
  id: string;
  badge?: string;
  content: string;
}

interface NotesPanelProps {
  notes: Note[];
  onAddNote?: () => void;
  globalSearchQuery?: string;
}

// Helper function to highlight matching text
function HighlightedText({
  text,
  searchQuery,
}: {
  text: string;
  searchQuery: string;
}) {
  if (!searchQuery.trim()) {
    return <>{text}</>;
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(searchQuery)})`, "gi"));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === searchQuery.toLowerCase() ? (
          <mark
            key={index}
            className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

// Escape special regex characters
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function NotesPanel({
  notes,
  onAddNote,
  globalSearchQuery = "",
}: NotesPanelProps) {
  const [localSearchQuery, setLocalSearchQuery] = React.useState("");

  // Use global search if provided, otherwise use local search
  const activeSearchQuery = globalSearchQuery || localSearchQuery;

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(activeSearchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notes ({notes.length})</h3>
        <Button size="sm" onClick={onAddNote}>
          Add Note
          <Plus className="ml-1 size-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search in notes"
          className="pl-9"
          value={globalSearchQuery || localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          disabled={!!globalSearchQuery}
        />
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredNotes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {activeSearchQuery
              ? `No notes found for "${activeSearchQuery}"`
              : "No notes yet"}
          </p>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              badge={note.badge}
              content={note.content}
              searchQuery={activeSearchQuery}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface NoteCardProps {
  badge?: string;
  content: string;
  searchQuery?: string;
}

function NoteCard({ badge, content, searchQuery = "" }: NoteCardProps) {
  return (
    <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
      {badge && (
        <Badge variant="secondary" className="text-xs">
          {badge}
        </Badge>
      )}
      <p className="text-sm leading-relaxed">
        <HighlightedText text={content} searchQuery={searchQuery} />
      </p>
    </div>
  );
}
