"use client";

import * as React from "react";
import { Search, Trash2, Copy, Info, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
} from "@/components/ui/context-menu";
import { ConversationTurn, Bookmark } from "@/types/types";

// Inline bookmark highlight component for conversation transcript
function BookmarkHighlightInline({
  children,
  orderNumber,
  bookmark,
  onDelete,
  onUpdate,
  frameworkOptions,
  categoryOptions,
}: {
  children: React.ReactNode;
  orderNumber: number;
  bookmark: Bookmark;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Bookmark>) => void;
  frameworkOptions: { value: string; label: string }[];
  categoryOptions: { value: string; label: string }[];
}) {
  const [showDeleteButton, setShowDeleteButton] = React.useState(false);

  const handleCopyText = React.useCallback(() => {
    navigator.clipboard.writeText(bookmark.text);
  }, [bookmark.text]);

  const handleClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteButton((prev) => !prev);
  }, []);

  const handleDelete = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete?.(bookmark.id);
    },
    [bookmark.id, onDelete],
  );

  const handleFrameworkChange = React.useCallback(
    (value: string) => {
      onUpdate?.(bookmark.id, { framework: value });
    },
    [bookmark.id, onUpdate],
  );

  const handleCategoryChange = React.useCallback(
    (value: string) => {
      onUpdate?.(bookmark.id, { category: value });
    },
    [bookmark.id, onUpdate],
  );

  React.useEffect(() => {
    if (!showDeleteButton) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`[data-bookmark-id="${bookmark.id}"]`)) {
        setShowDeleteButton(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDeleteButton, bookmark.id]);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <span
          data-bookmark-id={bookmark.id}
          className="relative inline-block cursor-pointer"
          onClick={handleClick}
        >
          <span className="underline decoration-green-600 dark:decoration-green-400 decoration-2 underline-offset-2 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-sm px-0.5">
            {children}
          </span>
          <sup className="ml-0.5 text-[10px] font-medium text-green-700 dark:text-green-400">
            [{orderNumber}]
          </sup>
          {showDeleteButton && onDelete && (
            <button
              onClick={handleDelete}
              className="absolute -top-2 -right-2 size-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-[10px] hover:bg-destructive/90 shadow-sm"
              title="Delete bookmark"
            >
              ×
            </button>
          )}
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={handleCopyText}>
          <Copy className="mr-2 size-4" />
          Copy text
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <FileText className="mr-2 size-4" />
            Framework
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuRadioGroup
              value={bookmark.framework}
              onValueChange={handleFrameworkChange}
            >
              {frameworkOptions.map((fw) => (
                <ContextMenuRadioItem key={fw.value} value={fw.value}>
                  {fw.label}
                </ContextMenuRadioItem>
              ))}
            </ContextMenuRadioGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Info className="mr-2 size-4" />
            Category
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuRadioGroup
              value={bookmark.category}
              onValueChange={handleCategoryChange}
            >
              {categoryOptions.map((cat) => (
                <ContextMenuRadioItem key={cat.value} value={cat.value}>
                  {cat.label}
                </ContextMenuRadioItem>
              ))}
            </ContextMenuRadioGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem
          variant="destructive"
          onClick={() => onDelete?.(bookmark.id)}
        >
          <Trash2 className="mr-2 size-4" />
          Delete bookmark
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

interface ConversationTranscriptProps {
  conversation: ConversationTurn[];
  sessionDuration?: string;
  globalSearchQuery?: string;
  bookmarks?: (Bookmark & { orderNumber: number })[];
  showBookmarks?: boolean;
  pendingSelection?: string | null;
  onBookmarkDelete?: (id: string) => void;
  onBookmarkUpdate?: (id: string, updates: Partial<Bookmark>) => void;
}

export function ConversationTranscript({
  conversation,
  sessionDuration = "58 min.",
  globalSearchQuery = "",
  bookmarks = [],
  showBookmarks = false,
  pendingSelection = null,
  onBookmarkDelete,
  onBookmarkUpdate,
}: ConversationTranscriptProps) {
  // Filter conversation based on search query
  const filteredConversation = React.useMemo(() => {
    if (!globalSearchQuery.trim()) {
      return conversation.map((turn, index) => ({ ...turn, index }));
    }

    const query = globalSearchQuery.toLowerCase();
    return conversation
      .map((turn, index) => ({ ...turn, index }))
      .filter((turn) => turn.message.toLowerCase().includes(query));
  }, [conversation, globalSearchQuery]);

  // Framework options for context menu
  const frameworkOptions = [
    { value: "longitudinal-formulation", label: "Longitudinal Formulation" },
    { value: "hot-cross-bun", label: "Hot Cross Bun" },
  ];

  // Category options for context menu
  const categoryOptions = [
    { value: "childhood-experience", label: "Childhood Experience" },
    { value: "core-beliefs", label: "Core Beliefs" },
    { value: "intermediate-beliefs", label: "Intermediate Beliefs" },
    { value: "coping-strategies", label: "Coping Strategies" },
    { value: "triggers", label: "Triggers" },
  ];

  const highlightText = (text: string, query: string): React.ReactNode => {
    // Find bookmarks that match this text
    const matchingBookmarks = bookmarks.filter((b) =>
      text.toLowerCase().includes(b.text.toLowerCase()),
    );

    // Check if this text contains the pending selection
    const hasPendingSelection =
      pendingSelection &&
      text.toLowerCase().includes(pendingSelection.toLowerCase());

    // Handle pending selection highlighting (takes priority when active)
    if (hasPendingSelection && pendingSelection) {
      const parts = text.split(
        new RegExp(`(${escapeRegExp(pendingSelection)})`, "gi"),
      );
      return (
        <>
          {parts.map((part, index) => {
            if (part.toLowerCase() === pendingSelection.toLowerCase()) {
              return (
                <span
                  key={index}
                  className="underline decoration-green-600 dark:decoration-green-400 decoration-2 underline-offset-2 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-sm px-0.5"
                >
                  {part}
                </span>
              );
            }
            return <span key={index}>{part}</span>;
          })}
        </>
      );
    }

    // Handle search highlighting
    if (query.trim()) {
      const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "gi"));
      return (
        <>
          {parts.map((part, i) => {
            if (part.toLowerCase() === query.toLowerCase()) {
              return (
                <mark
                  key={i}
                  className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5"
                >
                  {part}
                </mark>
              );
            }

            // Check if this part contains bookmarked text when showBookmarks is active
            if (showBookmarks) {
              const partMatchingBookmark = matchingBookmarks.find((b) =>
                part.toLowerCase().includes(b.text.toLowerCase()),
              );
              if (partMatchingBookmark) {
                return renderBookmarkInText(part, partMatchingBookmark, i);
              }
            }

            return <span key={i}>{part}</span>;
          })}
        </>
      );
    }

    // No search, just handle bookmark underlines
    if (showBookmarks && matchingBookmarks.length > 0) {
      return renderBookmarkSegments(text, matchingBookmarks);
    }

    return text;
  };

  // Render a bookmark highlight within a text segment
  const renderBookmarkInText = (
    text: string,
    bookmark: (typeof bookmarks)[number],
    keyPrefix: number,
  ): React.ReactNode => {
    const bookmarkParts = text.split(
      new RegExp(`(${escapeRegExp(bookmark.text)})`, "gi"),
    );
    return (
      <span key={keyPrefix}>
        {bookmarkParts.map((bp, bpIndex) => {
          if (bp.toLowerCase() === bookmark.text.toLowerCase()) {
            return (
              <BookmarkHighlightInline
                key={`${keyPrefix}-${bpIndex}`}
                orderNumber={bookmark.orderNumber}
                bookmark={bookmark}
                onDelete={onBookmarkDelete}
                onUpdate={onBookmarkUpdate}
                frameworkOptions={frameworkOptions}
                categoryOptions={categoryOptions}
              >
                {bp}
              </BookmarkHighlightInline>
            );
          }
          return bp;
        })}
      </span>
    );
  };

  // Render all bookmark segments in a text block (no search active)
  const renderBookmarkSegments = (
    text: string,
    matchingBookmarks: typeof bookmarks,
  ): React.ReactNode => {
    const segments: React.ReactNode[] = [];
    let lastIndex = 0;
    const processedBookmarkIds = new Set<string>();

    const sortedMatches = matchingBookmarks
      .map((b) => ({
        ...b,
        startIndex: text.toLowerCase().indexOf(b.text.toLowerCase()),
      }))
      .filter((b) => b.startIndex !== -1)
      .sort((a, b) => a.startIndex - b.startIndex);

    for (const match of sortedMatches) {
      if (processedBookmarkIds.has(match.id)) continue;
      processedBookmarkIds.add(match.id);

      if (match.startIndex > lastIndex) {
        segments.push(
          <span key={`text-${lastIndex}`}>
            {text.slice(lastIndex, match.startIndex)}
          </span>,
        );
      }

      const endIndex = match.startIndex + match.text.length;
      segments.push(
        <BookmarkHighlightInline
          key={`bookmark-${match.id}`}
          orderNumber={match.orderNumber}
          bookmark={match}
          onDelete={onBookmarkDelete}
          onUpdate={onBookmarkUpdate}
          frameworkOptions={frameworkOptions}
          categoryOptions={categoryOptions}
        >
          {text.slice(match.startIndex, endIndex)}
        </BookmarkHighlightInline>,
      );

      lastIndex = endIndex;
    }

    if (lastIndex < text.length) {
      segments.push(
        <span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>,
      );
    }

    return <>{segments}</>;
  };

  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 h-full relative">
      {/* Header */}
      <div className="space-y-0.5">
        <h3 className="text-lg font-semibold leading-none">
          Session Transcript
        </h3>
        <p className="text-sm text-muted-foreground">
          Duration: {sessionDuration}
        </p>
      </div>

      {/* Search bar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search in transcript..."
          className="h-9 pl-9 pr-12 rounded-md"
          readOnly
          value={globalSearchQuery}
        />
      </div>

      {/* Transcript */}
      <div className="flex-1 overflow-y-auto space-y-3 select-text">
        {filteredConversation.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No results found for &quot;{globalSearchQuery}&quot;
          </p>
        ) : (
          filteredConversation.map((turn) => (
            <div key={turn.index} className="space-y-2">
              <div className="flex items-center gap-3">
                {/* Speaker Badge */}
                <Badge
                  variant={
                    turn.speaker === "therapist" ? "default" : "secondary"
                  }
                  className={`min-w-fit ${
                    turn.speaker === "therapist"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                  }`}
                >
                  {turn.speaker === "therapist" ? "Therapist" : "Patient"}
                </Badge>
              </div>

              {/* Message content */}
              <div
                className={`ml-24 pl-3 border-l-2 ${
                  turn.speaker === "therapist"
                    ? "border-blue-200 dark:border-blue-800"
                    : "border-amber-200 dark:border-amber-800"
                }`}
              >
                <p className="text-sm leading-relaxed text-foreground">
                  {highlightText(turn.message, globalSearchQuery)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
