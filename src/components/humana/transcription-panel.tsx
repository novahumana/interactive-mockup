"use client";

import * as React from "react";
import { Search, Trash2, Copy, Info, FileText, Pencil } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Kbd } from "@/components/ui/kbd";
import { Badge } from "@/components/ui/badge";
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
import { BookmarkPopover, type Bookmark } from "./bookmark-popover";
import { ConversationTranscript } from "./conversation-transcript";

interface ConversationTurn {
  speaker: "therapist" | "patient";
  message: string;
}

interface TranscriptionSection {
  title: string;
  content: string | string[];
}

interface TranscriptionPanelProps {
  sessionTitle: string;
  sessionDate: string;
  duration: string;
  conversation?: ConversationTurn[];
  sections: TranscriptionSection[];
  globalSearchQuery?: string;
  bookmarks?: Bookmark[];
  onBookmarkCreate?: (bookmark: Omit<Bookmark, "id" | "createdAt">) => void;
  onBookmarkDelete?: (bookmarkId: string) => void;
  onBookmarkUpdate?: (bookmarkId: string, updates: Partial<Bookmark>) => void;
  onSectionsChange?: (sections: TranscriptionSection[]) => void;
  onConversationChange?: (conversation: ConversationTurn[]) => void;
}

// Framework and category labels for display
const frameworkLabels: Record<string, string> = {
  "longitudinal-formulation": "Longitudinal Formulation",
  "hot-cross-bun": "Hot Cross Bun",
};

const categoryLabels: Record<string, string> = {
  "childhood-experience": "Childhood Experience",
  "core-beliefs": "Core Beliefs",
  "intermediate-beliefs": "Intermediate Beliefs",
  "coping-strategies": "Coping Strategies",
  triggers: "Triggers",
};

// Framework options for selection
const frameworks = [
  { value: "longitudinal-formulation", label: "Longitudinal Formulation" },
  { value: "hot-cross-bun", label: "Hot Cross Bun" },
];

// Category options for selection
const categories = [
  { value: "childhood-experience", label: "Childhood Experience" },
  { value: "core-beliefs", label: "Core Beliefs" },
  { value: "intermediate-beliefs", label: "Intermediate Beliefs" },
  { value: "coping-strategies", label: "Coping Strategies" },
  { value: "triggers", label: "Triggers" },
];

// Bookmark highlight component with click to delete and context menu for editing
function BookmarkHighlight({
  children,
  orderNumber,
  bookmark,
  onDelete,
  onUpdate,
}: {
  children: React.ReactNode;
  orderNumber: number;
  bookmark: Bookmark;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Bookmark>) => void;
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

  // Close delete button when clicking outside
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
            {orderNumber}
          </sup>
          {showDeleteButton && onDelete && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
              <Button
                variant="secondary"
                size="sm"
                className="h-7 gap-1.5"
                onClick={handleDelete}
              >
                <Trash2 className="size-3.5" />
                Delete
              </Button>
            </span>
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
              {frameworks.map((fw) => (
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
              {categories.map((cat) => (
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

// Pending selection highlight component (styled like bookmark but without number)
function PendingSelectionHighlight({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="underline decoration-green-600 dark:decoration-green-400 decoration-2 underline-offset-2 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-sm px-0.5">
      {children}
    </span>
  );
}

// Helper function to highlight matching text and show bookmarks
function HighlightedText({
  text,
  searchQuery,
  bookmarks = [],
  showBookmarks = false,
  pendingSelection = null,
  onBookmarkDelete,
  onBookmarkUpdate,
}: {
  text: string;
  searchQuery: string;
  bookmarks?: (Bookmark & { orderNumber: number })[];
  showBookmarks?: boolean;
  pendingSelection?: string | null;
  onBookmarkDelete?: (id: string) => void;
  onBookmarkUpdate?: (id: string, updates: Partial<Bookmark>) => void;
}) {
  // Find bookmarks that match this text
  const matchingBookmarks = bookmarks.filter((b) =>
    text.toLowerCase().includes(b.text.toLowerCase()),
  );

  // Check if this text contains the pending selection
  const hasPendingSelection =
    pendingSelection &&
    text.toLowerCase().includes(pendingSelection.toLowerCase());

  // If no search, no bookmarks to show, and no pending selection, return plain text
  if (
    !searchQuery.trim() &&
    (!showBookmarks || matchingBookmarks.length === 0) &&
    !hasPendingSelection
  ) {
    return <>{text}</>;
  }

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
              <PendingSelectionHighlight key={index}>
                {part}
              </PendingSelectionHighlight>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  }

  // Handle search highlighting
  if (searchQuery.trim()) {
    const parts = text.split(
      new RegExp(`(${escapeRegExp(searchQuery)})`, "gi"),
    );

    return (
      <>
        {parts.map((part, index) => {
          const isSearchMatch =
            part.toLowerCase() === searchQuery.toLowerCase();

          if (isSearchMatch) {
            return (
              <mark
                key={index}
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
              // Need to split this part to highlight only the bookmarked portion
              const bookmarkParts = part.split(
                new RegExp(
                  `(${escapeRegExp(partMatchingBookmark.text)})`,
                  "gi",
                ),
              );

              return (
                <span key={index}>
                  {bookmarkParts.map((bp, bpIndex) => {
                    if (
                      bp.toLowerCase() ===
                      partMatchingBookmark.text.toLowerCase()
                    ) {
                      return (
                        <BookmarkHighlight
                          key={`${index}-${bpIndex}`}
                          orderNumber={partMatchingBookmark.orderNumber}
                          bookmark={partMatchingBookmark}
                          onDelete={onBookmarkDelete}
                          onUpdate={onBookmarkUpdate}
                        >
                          {bp}
                        </BookmarkHighlight>
                      );
                    }
                    return bp;
                  })}
                </span>
              );
            }
          }

          return <span key={index}>{part}</span>;
        })}
      </>
    );
  }

  // No search, just handle bookmark underlines
  if (showBookmarks && matchingBookmarks.length > 0) {
    const bookmarkSegments: React.ReactNode[] = [];
    let lastIndex = 0;
    let processedBookmarkIds = new Set<string>();

    // Sort bookmarks by their position in the text
    const sortedMatches = matchingBookmarks
      .map((b) => ({
        ...b,
        startIndex: text.toLowerCase().indexOf(b.text.toLowerCase()),
      }))
      .filter((b) => b.startIndex !== -1)
      .sort((a, b) => a.startIndex - b.startIndex);

    for (const match of sortedMatches) {
      // Skip if we've already processed this bookmark (handles duplicates by ID)
      if (processedBookmarkIds.has(match.id)) continue;
      processedBookmarkIds.add(match.id);

      // Add text before this bookmark
      if (match.startIndex > lastIndex) {
        bookmarkSegments.push(
          <span key={`text-${lastIndex}`}>
            {text.slice(lastIndex, match.startIndex)}
          </span>,
        );
      }

      // Add the bookmarked text with underline and number
      const endIndex = match.startIndex + match.text.length;
      bookmarkSegments.push(
        <BookmarkHighlight
          key={`bookmark-${match.id}`}
          orderNumber={match.orderNumber}
          bookmark={match}
          onDelete={onBookmarkDelete}
          onUpdate={onBookmarkUpdate}
        >
          {text.slice(match.startIndex, endIndex)}
        </BookmarkHighlight>,
      );

      lastIndex = endIndex;
    }

    // Add remaining text after last bookmark
    if (lastIndex < text.length) {
      bookmarkSegments.push(
        <span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>,
      );
    }

    return <>{bookmarkSegments}</>;
  }

  return <>{text}</>;
}

// Escape special regex characters
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function TranscriptionPanel({
  sessionTitle,
  sessionDate,
  duration,
  conversation,
  sections,
  globalSearchQuery = "",
  bookmarks = [],
  onBookmarkCreate,
  onBookmarkDelete,
  onBookmarkUpdate,
  onSectionsChange,
  onConversationChange,
}: TranscriptionPanelProps) {
  const [localSearchQuery, setLocalSearchQuery] = React.useState("");
  const [showBookmarks, setShowBookmarks] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [selectedText, setSelectedText] = React.useState("");
  const [popoverPosition, setPopoverPosition] = React.useState({ x: 0, y: 0 });
  const [pendingSelection, setPendingSelection] = React.useState<string | null>(
    null,
  );
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedSections, setEditedSections] =
    React.useState<TranscriptionSection[]>(sections);
  const [editedConversation, setEditedConversation] = React.useState<
    ConversationTurn[]
  >(conversation || []);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Sync editedSections with sections when sections change (e.g., switching sessions)
  React.useEffect(() => {
    setEditedSections(sections);
  }, [sections]);

  // Sync editedConversation with conversation when conversation changes (e.g., switching sessions)
  React.useEffect(() => {
    setEditedConversation(conversation || []);
  }, [conversation]);

  // Handle toggling edit mode
  const handleToggleEdit = React.useCallback(() => {
    if (isEditing) {
      // Exiting edit mode - save changes
      onSectionsChange?.(editedSections);
      onConversationChange?.(editedConversation);
    }
    setIsEditing(!isEditing);
    // Clear any pending selection when entering edit mode
    if (!isEditing) {
      setPendingSelection(null);
      setPopoverOpen(false);
      window.getSelection()?.removeAllRanges();
    }
  }, [
    isEditing,
    editedSections,
    editedConversation,
    onSectionsChange,
    onConversationChange,
  ]);

  // Handle section content change
  const handleSectionContentChange = React.useCallback(
    (index: number, newContent: string | string[]) => {
      setEditedSections((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], content: newContent };
        return updated;
      });
    },
    [],
  );

  // Use global search if provided, otherwise use local search
  const activeSearchQuery = globalSearchQuery || localSearchQuery;

  // Add order numbers to bookmarks
  const bookmarksWithNumbers = React.useMemo(
    () =>
      bookmarks.map((b, index) => ({
        ...b,
        orderNumber: index + 1,
      })),
    [bookmarks],
  );

  // Expand selection to word boundaries
  const expandToWordBoundaries = React.useCallback((selection: Selection) => {
    if (!selection.rangeCount) return null;

    const range = selection.getRangeAt(0);
    const text = selection.toString();

    if (!text.trim()) return null;

    // Get the text content and expand to word boundaries
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;

    if (
      startContainer.nodeType === Node.TEXT_NODE &&
      endContainer.nodeType === Node.TEXT_NODE
    ) {
      const startText = startContainer.textContent || "";
      const endText = endContainer.textContent || "";

      // Find word start
      let startOffset = range.startOffset;
      while (startOffset > 0 && !/\s/.test(startText[startOffset - 1])) {
        startOffset--;
      }

      // Find word end
      let endOffset = range.endOffset;
      while (endOffset < endText.length && !/\s/.test(endText[endOffset])) {
        endOffset++;
      }

      // Create new range with expanded boundaries
      const newRange = document.createRange();
      newRange.setStart(startContainer, startOffset);
      newRange.setEnd(endContainer, endOffset);

      // Update the selection
      selection.removeAllRanges();
      selection.addRange(newRange);

      return newRange.toString().trim();
    }

    return text.trim();
  }, []);

  // Handle text selection
  const handleMouseUp = React.useCallback(
    (e: React.MouseEvent) => {
      // Don't create bookmarks while in editing mode
      if (isEditing) {
        return;
      }

      // Don't open popover if clicking on a bookmark or button
      if (
        (e.target as HTMLElement).closest("button") ||
        (e.target as HTMLElement).closest("[data-bookmark-id]") ||
        (e.target as HTMLElement).closest("textarea")
      ) {
        return;
      }

      // Small delay to ensure selection is complete
      setTimeout(() => {
        const selection = window.getSelection();

        if (!selection || selection.isCollapsed) {
          setPendingSelection(null);
          return;
        }

        // Expand selection to word boundaries
        const expandedText = expandToWordBoundaries(selection);

        if (expandedText && expandedText.length > 0 && onBookmarkCreate) {
          // Get selection position relative to the content container
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const containerRect = contentRef.current?.getBoundingClientRect();

          if (rect && containerRect) {
            setPendingSelection(expandedText);
            setSelectedText(expandedText);
            // Position the popover below the selection
            setPopoverPosition({
              x: rect.left - containerRect.left,
              y:
                rect.bottom - containerRect.top + contentRef.current!.scrollTop,
            });
            setPopoverOpen(true);
          }
        }
      }, 10);
    },
    [isEditing, onBookmarkCreate, expandToWordBoundaries],
  );

  // Handle bookmark creation
  const handleCreateBookmark = React.useCallback(
    (bookmarkData: Omit<Bookmark, "id" | "createdAt">) => {
      onBookmarkCreate?.(bookmarkData);
      setSelectedText("");
      setPendingSelection(null);
      window.getSelection()?.removeAllRanges();
    },
    [onBookmarkCreate],
  );

  // Close popover
  const handleClosePopover = React.useCallback(() => {
    setPopoverOpen(false);
    setSelectedText("");
    setPendingSelection(null);
    window.getSelection()?.removeAllRanges();
  }, []);

  // Filter sections based on search query only
  const filteredSections = React.useMemo(() => {
    if (!activeSearchQuery.trim()) {
      return sections;
    }

    const query = activeSearchQuery.toLowerCase();

    return sections
      .map((section) => {
        const titleMatches = section.title.toLowerCase().includes(query);

        if (Array.isArray(section.content)) {
          const filteredContent = section.content.filter((item) =>
            item.toLowerCase().includes(query),
          );
          if (filteredContent.length > 0 || titleMatches) {
            return {
              ...section,
              content:
                filteredContent.length > 0 ? filteredContent : section.content,
            };
          }
          return null;
        } else {
          if (section.content.toLowerCase().includes(query) || titleMatches) {
            return section;
          }
          return null;
        }
      })
      .filter((section): section is TranscriptionSection => section !== null);
  }, [sections, activeSearchQuery]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 h-full relative">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <h3 className="text-lg font-semibold leading-none">Transcription</h3>
          <p className="text-sm text-muted-foreground">Duration: {duration}</p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          onClick={handleToggleEdit}
          className="h-8 gap-1.5 rounded-md"
        >
          <Pencil className="size-3.5" />
          {isEditing ? "Done" : "Edit"}
        </Button>
      </div>

      {/* Search and Bookmarks - disabled during editing */}
      <div
        className={`flex items-center justify-between gap-3 ${isEditing ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search in the transcription"
            className="h-9 pl-9 pr-12 rounded-md"
            value={globalSearchQuery || localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            disabled={!!globalSearchQuery || isEditing}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Kbd>⌘F</Kbd>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="bookmarks"
            checked={showBookmarks}
            onCheckedChange={setShowBookmarks}
            disabled={isEditing}
          />
          <label
            htmlFor="bookmarks"
            className={`text-sm font-medium ${isEditing ? "" : "cursor-pointer"}`}
          >
            Show Bookmarks
          </label>
          {bookmarks.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
            >
              {bookmarks.length}
            </Badge>
          )}
        </div>
      </div>

      {/* Session Info */}
      <div className="border-t pt-4">
        <h4 className="text-lg font-semibold leading-none">{sessionTitle}</h4>
        <p className="text-sm text-muted-foreground mt-1">{sessionDate}</p>
      </div>

      {/* Content */}
      <div ref={contentRef} className="flex-1 overflow-hidden relative">
        {isEditing ? (
          /* Editing Mode */
          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Conversation Editor */}
            {editedConversation && editedConversation.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Conversation (JSON format):
                </h5>
                <Textarea
                  value={JSON.stringify(editedConversation, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      if (Array.isArray(parsed)) {
                        setEditedConversation(parsed);
                      }
                    } catch {
                      // Invalid JSON, just update the text
                    }
                  }}
                  className="min-h-[200px] text-sm font-mono"
                  placeholder="Edit conversation as JSON..."
                />
              </div>
            )}
            {editedSections.map((section, index) => (
              <div key={index} className="space-y-2">
                <h5 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.title}:
                </h5>
                {Array.isArray(section.content) ? (
                  <Textarea
                    value={section.content.join("\n")}
                    onChange={(e) =>
                      handleSectionContentChange(
                        index,
                        e.target.value
                          .split("\n")
                          .filter((line) => line.trim()),
                      )
                    }
                    className="min-h-[100px] text-sm"
                    placeholder="Enter content (one item per line)"
                  />
                ) : (
                  <Textarea
                    value={section.content}
                    onChange={(e) =>
                      handleSectionContentChange(index, e.target.value)
                    }
                    className="min-h-[100px] text-sm"
                    placeholder="Enter content..."
                  />
                )}
              </div>
            ))}
          </div>
        ) : conversation && conversation.length > 0 ? (
          /* Show Conversation Transcript */
          <ConversationTranscript
            conversation={conversation}
            sessionDuration={duration}
            globalSearchQuery={activeSearchQuery}
          />
        ) : (
          /* Show Sections */
          <div
            className="flex-1 overflow-y-auto space-y-4 select-text"
            onMouseUp={handleMouseUp}
          >
            {filteredSections.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {activeSearchQuery
                  ? `No results found for "${activeSearchQuery}"`
                  : "No content available"}
              </p>
            ) : (
              filteredSections.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h5 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    <HighlightedText
                      text={section.title}
                      searchQuery={activeSearchQuery}
                      bookmarks={bookmarksWithNumbers}
                      showBookmarks={showBookmarks}
                      pendingSelection={pendingSelection}
                      onBookmarkDelete={onBookmarkDelete}
                      onBookmarkUpdate={onBookmarkUpdate}
                    />
                    :
                  </h5>
                  {Array.isArray(section.content) ? (
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {section.content.map((item, i) => (
                        <li key={i}>
                          <HighlightedText
                            text={item}
                            searchQuery={activeSearchQuery}
                            bookmarks={bookmarksWithNumbers}
                            showBookmarks={showBookmarks}
                            pendingSelection={pendingSelection}
                            onBookmarkDelete={onBookmarkDelete}
                            onBookmarkUpdate={onBookmarkUpdate}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm leading-relaxed">
                      <HighlightedText
                        text={section.content}
                        searchQuery={activeSearchQuery}
                        bookmarks={bookmarksWithNumbers}
                        showBookmarks={showBookmarks}
                        pendingSelection={pendingSelection}
                        onBookmarkDelete={onBookmarkDelete}
                        onBookmarkUpdate={onBookmarkUpdate}
                      />
                    </p>
                  )}
                </div>
              ))
            )}

            {/* Bookmark Popover - only show when not editing */}
            {!isEditing && (
              <BookmarkPopover
                isOpen={popoverOpen}
                onClose={handleClosePopover}
                selectedText={selectedText}
                position={popoverPosition}
                onCreateBookmark={handleCreateBookmark}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
