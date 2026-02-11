"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ConversationTurn {
  speaker: "therapist" | "patient";
  message: string;
}

interface ConversationTranscriptProps {
  conversation: ConversationTurn[];
  sessionDuration?: string;
  globalSearchQuery?: string;
}

export function ConversationTranscript({
  conversation,
  sessionDuration = "58 min.",
  globalSearchQuery = "",
}: ConversationTranscriptProps) {
  const [expandedLines, setExpandedLines] = React.useState<Set<number>>(
    new Set(),
  );

  // Calculate approximate timestamps
  const getTotalLines = () => conversation.length;
  const getTimestamp = (lineIndex: number): string => {
    const totalLines = getTotalLines();
    const totalMinutes = parseInt(sessionDuration.split(" ")[0]) || 58;
    const minutesPerLine = totalMinutes / totalLines;
    const minutes = Math.floor(lineIndex * minutesPerLine);
    const seconds = Math.round(((lineIndex * minutesPerLine) % 1) * 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const toggleLineExpansion = (index: number) => {
    setExpandedLines((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

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

  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={i}
              className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </>
    );
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
      <div className="flex-1 overflow-y-auto space-y-3">
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

                {/* Expand button */}
                <button
                  onClick={() => toggleLineExpansion(turn.index)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  title={expandedLines.has(turn.index) ? "Collapse" : "Expand"}
                >
                  {expandedLines.has(turn.index) ? "▼" : "▶"}
                </button>
              </div>

              {/* Message content - always visible but with expand/collapse for long messages */}
              <div
                className={`ml-24 pl-3 border-l-2 ${
                  turn.speaker === "therapist"
                    ? "border-blue-200 dark:border-blue-800"
                    : "border-amber-200 dark:border-amber-800"
                } ${
                  expandedLines.has(turn.index)
                    ? "max-h-none"
                    : turn.message.length > 150
                      ? "max-h-20 overflow-hidden"
                      : "max-h-none"
                } transition-all duration-200`}
              >
                <p className="text-sm leading-relaxed text-foreground">
                  {highlightText(turn.message, globalSearchQuery)}
                </p>

                {/* Show more indicator */}
                {!expandedLines.has(turn.index) &&
                  turn.message.length > 150 && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      ... (click to expand)
                    </p>
                  )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats at bottom */}
      <div className="border-t pt-3 text-xs text-muted-foreground flex justify-between">
        <span>{conversation.length} turns in conversation</span>
        <span>
          {Math.ceil(
            conversation.reduce((acc, turn) => acc + turn.message.length, 0) /
              60,
          )}{" "}
          words
        </span>
      </div>
    </div>
  );
}
