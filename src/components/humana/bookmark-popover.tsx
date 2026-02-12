"use client";

import * as React from "react";
import { Bookmark as BookmarkIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { Bookmark } from "@/types/types";
import { LocalStorage } from "@/data/localStorage";
import { STORAGE_KEYS } from "@/data/constants";

interface BookmarkPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  position: { x: number; y: number };
  onCreateBookmark: (bookmark: Omit<Bookmark, "id" | "createdAt">) => void;
}

const frameworks = [
  { value: "longitudinal-formulation", label: "Longitudinal Formulation" },
  { value: "hot-cross-bun", label: "Hot Cross Bun" },
];

const categories = [
  { value: "childhood-experience", label: "Childhood Experience" },
  { value: "core-beliefs", label: "Core Beliefs" },
  { value: "intermediate-beliefs", label: "Intermediate Beliefs" },
  { value: "coping-strategies", label: "Coping Strategies" },
  { value: "triggers", label: "Triggers" },
];

const storage = LocalStorage.getInstance();

// Helper to get stored preference
function getStoredPreference(key: string): string {
  return storage.getString(key);
}

// Helper to set stored preference
function setStoredPreference(key: string, value: string): void {
  storage.setString(key, value);
}

export function BookmarkPopover({
  isOpen,
  onClose,
  selectedText,
  position,
  onCreateBookmark,
}: BookmarkPopoverProps) {
  // Initialize state with stored preferences
  const [framework, setFramework] = React.useState(() =>
    getStoredPreference(STORAGE_KEYS.bookmarkPreferredFramework),
  );
  const [category, setCategory] = React.useState(() =>
    getStoredPreference(STORAGE_KEYS.bookmarkPreferredCategory),
  );

  // Handle ESC key to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Update framework handler - save to localStorage
  const handleFrameworkChange = React.useCallback((value: string) => {
    setFramework(value);
    setStoredPreference(STORAGE_KEYS.bookmarkPreferredFramework, value);
  }, []);

  // Update category handler - save to localStorage
  const handleCategoryChange = React.useCallback((value: string) => {
    setCategory(value);
    setStoredPreference(STORAGE_KEYS.bookmarkPreferredCategory, value);
  }, []);

  const handleCreateBookmark = () => {
    if (!selectedText || !framework || !category) return;

    onCreateBookmark({
      text: selectedText,
      framework,
      category,
    });

    onClose();
  };

  return (
    <Popover open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <PopoverAnchor
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          width: 0,
          height: 0,
        }}
      />
      <PopoverContent
        className="w-[380px] max-w-2xs bg-popover p-4"
        side="bottom"
        align="start"
        sideOffset={8}
        collisionPadding={16}
        avoidCollisions={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-col gap-2 relative">
            <h4 className="text-base font-medium leading-none">
              Annotate Bookmark
            </h4>
            <p className="text-sm text-muted-foreground">
              Save as a bookmark the selected text
            </p>
            <button
              onClick={onClose}
              className="absolute top-0 right-0 rounded-xs opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Selected Text Preview - Read-only, non-selectable */}
          <div
            className="min-h-[64px] px-3 py-2 rounded-md border bg-input/30 text-sm select-none pointer-events-none overflow-hidden"
            aria-readonly="true"
          >
            <p className="text-muted-foreground italic">
              &quot;{selectedText}&quot;
            </p>
          </div>

          {/* Framework Select */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Framework</label>
            <Select value={framework} onValueChange={handleFrameworkChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select the framework used" />
              </SelectTrigger>
              <SelectContent>
                {frameworks.map((fw) => (
                  <SelectItem key={fw.value} value={fw.value}>
                    {fw.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Select */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Create Bookmark Button */}
          <Button
            onClick={handleCreateBookmark}
            disabled={!framework || !category}
            className="w-full"
          >
            <BookmarkIcon className="size-4 mr-2" />
            Create Bookmark
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
