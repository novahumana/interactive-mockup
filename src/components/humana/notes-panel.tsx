"use client";

import * as React from "react";
import { Search, Plus, Trash2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface Note {
  id: string;
  badge?: string;
  content: string;
  canDelete?: boolean;
  canEdit?: boolean;
}

interface NotesPanelProps {
  notes: Note[];
  onAddNote?: () => void;
  onDeleteNote?: (noteId: string) => void;
  onEditNote?: (noteId: string, newContent: string) => void;
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
  onDeleteNote,
  onEditNote,
  globalSearchQuery = "",
}: NotesPanelProps) {
  const [localSearchQuery, setLocalSearchQuery] = React.useState("");

  // Use global search if provided, otherwise use local search
  const activeSearchQuery = globalSearchQuery || localSearchQuery;

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(activeSearchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold leading-none">Notes ({notes.length})</h3>
        <Button size="sm" onClick={onAddNote} className="h-8 rounded-md">
          Add Note
          <Plus className="ml-1.5 size-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search in notes"
          className="h-9 pl-9 rounded-md"
          value={globalSearchQuery || localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          disabled={!!globalSearchQuery}
        />
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredNotes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            {activeSearchQuery
              ? `No notes found for "${activeSearchQuery}"`
              : "No notes yet"}
          </p>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              badge={note.badge}
              content={note.content}
              searchQuery={activeSearchQuery}
              canDelete={note.canDelete}
              canEdit={note.canEdit}
              onDelete={onDeleteNote}
              onEdit={onEditNote}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface NoteCardProps {
  id: string;
  badge?: string;
  content: string;
  searchQuery?: string;
  canDelete?: boolean;
  canEdit?: boolean;
  onDelete?: (noteId: string) => void;
  onEdit?: (noteId: string, newContent: string) => void;
}

function NoteCard({ id, badge, content, searchQuery = "", canDelete, canEdit, onDelete, onEdit }: NoteCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState(content);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Focus textarea when entering edit mode
  React.useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(editedContent.length, editedContent.length);
    }
  }, [isEditing, editedContent.length]);

  // Handle save
  const handleSave = () => {
    if (editedContent.trim() && onEdit) {
      onEdit(id, editedContent.trim());
    }
    setIsEditing(false);
  };

  // Handle cancel
  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  // Handle click on card to enter edit mode
  const handleCardClick = () => {
    if (canEdit && !isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <div
      className={`group relative rounded-lg border bg-muted/50 p-3 space-y-2 ${canEdit && !isEditing ? "cursor-pointer hover:bg-muted/70 transition-colors" : ""}`}
      onClick={handleCardClick}
    >
      {isEditing ? (
        // Edit mode
        <div className="space-y-2">
          {badge && (
            <Badge variant="secondary" className="text-xs rounded-full px-2 py-0.5">
              {badge}
            </Badge>
          )}
          <Textarea
            ref={textareaRef}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="min-h-[80px] text-sm resize-none"
            placeholder="Write your note..."
          />
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              className="h-7 px-2 text-muted-foreground"
            >
              <X className="size-3.5 mr-1" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="h-7 px-2"
              disabled={!editedContent.trim()}
            >
              <Check className="size-3.5 mr-1" />
              Save
            </Button>
          </div>
        </div>
      ) : (
        // View mode
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            {badge && (
              <Badge variant="secondary" className="text-xs rounded-full px-2 py-0.5">
                {badge}
              </Badge>
            )}
            <p className="text-sm leading-relaxed text-foreground">
              <HighlightedText text={content} searchQuery={searchQuery} />
            </p>
          </div>
          {canDelete && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
