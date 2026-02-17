"use client";

import * as React from "react";
import {
  Settings,
  GitCompare,
  Plus,
  Info,
  Search,
  ChevronRight,
  Flag,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Bookmark, Session } from "@/types/types";

// ─── Static data ────────────────────────────────────────────────────────────

const FRAMEWORKS = [
  {
    id: "beck-cbt",
    name: "Beck CBT",
    description: "Cognitive Behavioral Therapy by Aaron Beck",
  },
  {
    id: "act",
    name: "ACT",
    description: "Acceptance and Commitment Therapy",
  },
  { id: "dbt", name: "DBT", description: "Dialectical Behavior Therapy" },
  {
    id: "emdr",
    name: "EMDR",
    description: "Eye Movement Desensitization and Reprocessing",
  },
];

const BECK_CBT_MODELS = [
  { value: "longitudinal", label: "Longitudinal Formulation" },
  { value: "hot-cross-bun", label: "Hot Cross Bun" },
  { value: "thought-record", label: "Thought Record" },
  { value: "behavioral-activation", label: "Behavioral Activation" },
  { value: "safety-behaviors", label: "Safety Behaviors" },
];

const BECK_CBT_CATEGORIES = [
  "Childhood Experiences",
  "Core Beliefs",
  "Intermediate Beliefs / Rules",
  "Coping Strategies",
  "Precipitating Factors",
  "Maintaining Factors",
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormulationVersion {
  id: string;
  label: string;
  createdAt: Date;
  isLatest: boolean;
  bookmarkSnapshot: Bookmark[];
}

interface FormulationTabProps {
  bookmarks: Bookmark[];
  sessions?: Session[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FormulationTab({ bookmarks, sessions }: FormulationTabProps) {
  // Framework / model
  const [manageFrameworksOpen, setManageFrameworksOpen] = React.useState(false);
  const [activeFramework] = React.useState("beck-cbt");
  const [modelOpen, setModelOpen] = React.useState(false);
  const [selectedModel, setSelectedModel] = React.useState("longitudinal");

  // Versions
  const [versions, setVersions] = React.useState<FormulationVersion[]>([
    {
      id: "v1",
      label: "V1",
      createdAt: new Date("2024-09-20T14:30:00"),
      isLatest: true,
      bookmarkSnapshot: bookmarks,
    },
  ]);
  const [selectedVersionId, setSelectedVersionId] = React.useState("v1");
  const [versionPickerOpen, setVersionPickerOpen] = React.useState(false);

  // Compare
  const [compareOpen, setCompareOpen] = React.useState(false);
  const [compareVersionId, setCompareVersionId] = React.useState<string>("");

  // Session filter (inner tabs)
  const [sessionFilter, setSessionFilter] = React.useState<string>("all");

  // Category highlight
  const [selectedCategory, setSelectedCategory] = React.useState<string>(
    BECK_CBT_CATEGORIES[0],
  );
  const [categorySearch, setCategorySearch] = React.useState("");

  const selectedVersion = versions.find((v) => v.id === selectedVersionId);
  const currentBookmarks = selectedVersion?.bookmarkSnapshot ?? bookmarks;

  // Filter bookmarks by session
  const filteredBySession = React.useMemo(() => {
    if (sessionFilter === "all") return currentBookmarks;
    return currentBookmarks.filter((b) => {
      const session = sessions?.find((s) =>
        s.bookmarks.some((sb) => sb.id === b.id),
      );
      return session?.id === sessionFilter;
    });
  }, [currentBookmarks, sessionFilter, sessions]);

  // Group bookmarks by category
  const bookmarksByCategory = React.useMemo(() => {
    const map: Record<string, Bookmark[]> = {};
    for (const cat of BECK_CBT_CATEGORIES) {
      map[cat] = filteredBySession.filter((b) => b.category === cat);
    }
    return map;
  }, [filteredBySession]);

  // Categories that have bookmarks (for left sidebar counts)
  const filteredCategories = BECK_CBT_CATEGORIES.filter((c) =>
    c.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  // Add new version
  const handleAddVersion = () => {
    const vNum = versions.length + 1;
    const newVersion: FormulationVersion = {
      id: `v${vNum}`,
      label: `V${vNum}`,
      createdAt: new Date(),
      isLatest: true,
      bookmarkSnapshot: [...bookmarks],
    };
    setVersions((prev) =>
      prev.map((v) => ({ ...v, isLatest: false })).concat(newVersion),
    );
    setSelectedVersionId(newVersion.id);
  };

  const modelLabel =
    BECK_CBT_MODELS.find((m) => m.value === selectedModel)?.label ??
    "Select model";

  return (
    <>
      {/* Dark formulation card */}
      <div className="rounded-md border border-white/10 bg-zinc-950 shadow-sm overflow-hidden">
        {/* ── Header bar ── */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between bg-zinc-900 border border-white/10 rounded-md px-4 py-3 shadow-sm">
            {/* Left: Framework + Manage */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-400">Framework</span>
              <Badge className="bg-zinc-100 text-zinc-900 border-transparent hover:bg-zinc-100 text-xs font-semibold px-2 py-0.5">
                Beck CBT
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs bg-white/5 border-white/15 text-zinc-100 hover:bg-white/10 hover:text-white gap-1.5"
                onClick={() => setManageFrameworksOpen(true)}
              >
                <Settings className="size-3.5" />
                Manage Framework
              </Button>
            </div>

            {/* Right: Model combobox */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">Model</span>
              <Popover open={modelOpen} onOpenChange={setModelOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-[200px] h-9 px-3 justify-between bg-white/5 border-white/15 text-zinc-100 hover:bg-white/10 hover:text-white text-sm font-normal"
                  >
                    <span className="truncate">{modelLabel}</span>
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-0">
                  <Command>
                    <CommandInput placeholder="Search model…" />
                    <CommandList>
                      <CommandEmpty>No model found.</CommandEmpty>
                      <CommandGroup>
                        {BECK_CBT_MODELS.map((model) => (
                          <CommandItem
                            key={model.value}
                            value={model.value}
                            onSelect={(val) => {
                              setSelectedModel(val);
                              setModelOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 size-4",
                                selectedModel === model.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {model.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <Separator className="mt-4 bg-white/10" />

        {/* ── Version section ── */}
        <div className="px-4 pt-4 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            {/* Version combobox */}
            <Popover open={versionPickerOpen} onOpenChange={setVersionPickerOpen}>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-3 bg-white/5 border border-white/15 rounded-md px-4 py-3 w-[320px] min-w-[280px] text-left shadow-sm hover:bg-white/10 transition-colors">
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    {selectedVersion?.isLatest && (
                      <div className="flex items-center gap-1">
                        <Badge className="bg-zinc-800 text-zinc-100 border-transparent hover:bg-zinc-800 text-[10px] font-semibold px-2 py-0.5 gap-1">
                          Latest
                          <Flag className="size-3" />
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-zinc-100 leading-none">
                        {selectedVersion?.label}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {selectedVersion
                          ? format(
                              selectedVersion.createdAt,
                              "dd/MM/yyyy, h:mm:ss a",
                            )
                          : ""}
                      </span>
                    </div>
                  </div>
                  <ChevronsUpDown className="size-4 text-zinc-400 shrink-0" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-0" align="start">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {versions.map((v) => (
                        <CommandItem
                          key={v.id}
                          value={v.id}
                          onSelect={(val) => {
                            setSelectedVersionId(val);
                            setVersionPickerOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 size-4",
                              selectedVersionId === v.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <span className="font-medium">{v.label}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {format(v.createdAt, "dd/MM/yyyy")}
                          </span>
                          {v.isLatest && (
                            <Badge
                              variant="secondary"
                              className="ml-auto text-[10px]"
                            >
                              Latest
                            </Badge>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Version actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="h-8 px-3 text-xs bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border-0 gap-1.5"
                onClick={() => setCompareOpen(true)}
                disabled={versions.length < 2}
              >
                Compare
                <GitCompare className="size-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 px-3 text-xs bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border-0 gap-1.5"
                onClick={handleAddVersion}
              >
                <Plus className="size-4" />
                Add new version
              </Button>
            </div>
          </div>

          {/* Info row */}
          <div className="flex gap-2 items-start">
            <Info className="size-4 text-zinc-500 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-500 leading-relaxed">
              Versions are generated from the current snapshot of all bookmarks
              across sessions.{" "}
              <span className="block">
                Updating bookmarks creates a new version.
              </span>
            </p>
          </div>
        </div>

        <Separator className="mt-4 bg-white/10" />

        {/* ── Content section ── */}
        <div className="px-4 pt-4 pb-10 flex flex-col gap-4">
          {/* Session filter tabs */}
          <div className="flex items-center bg-zinc-900 rounded-lg p-0.5 h-9">
            <button
              className={cn(
                "flex-1 text-sm font-medium px-3 py-1 rounded-md transition-colors h-full",
                sessionFilter === "all"
                  ? "bg-white/10 text-zinc-100 border border-white/15 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-100",
              )}
              onClick={() => setSessionFilter("all")}
            >
              All Sessions
            </button>
            {sessions?.map((s) => (
              <button
                key={s.id}
                className={cn(
                  "flex-1 text-sm font-medium px-3 py-1 rounded-md transition-colors h-full",
                  sessionFilter === s.id
                    ? "bg-white/10 text-zinc-100 border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-100",
                )}
                onClick={() => setSessionFilter(s.id)}
              >
                {s.dayName.slice(0, 3)} {s.date}
              </button>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="flex gap-6 items-start">
            {/* Left sidebar — category list */}
            <div className="w-64 shrink-0 flex flex-col gap-2">
              {/* Group label */}
              <div className="flex items-center justify-between h-8 px-1">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <Badge className="bg-zinc-800 text-zinc-100 border-transparent hover:bg-zinc-800 text-[10px] font-semibold px-1.5 py-0.5">
                    {
                      BECK_CBT_CATEGORIES.filter(
                        (c) => (bookmarksByCategory[c]?.length ?? 0) > 0,
                      ).length
                    }
                  </Badge>
                  <span className="text-xs text-zinc-400 font-medium truncate">
                    Categories
                  </span>
                </div>
              </div>

              {/* Category search */}
              <div className="relative flex items-center">
                <Search className="absolute left-3 size-4 text-zinc-500 pointer-events-none" />
                <Input
                  placeholder="Search keywords…"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="pl-9 pr-10 h-9 bg-white/5 border-white/15 text-zinc-100 placeholder:text-zinc-500 text-sm"
                />
                <div className="absolute right-2">
                  <Kbd className="text-zinc-500 bg-zinc-800 border-0">⌘</Kbd>
                </div>
              </div>

              {/* Category menu items */}
              <div className="flex flex-col gap-1">
                {filteredCategories.map((cat) => {
                  const count = bookmarksByCategory[cat]?.length ?? 0;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "flex items-center gap-2 h-8 px-2 rounded-md text-sm transition-colors w-full text-left",
                        selectedCategory === cat
                          ? "bg-white/10 text-zinc-100"
                          : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5",
                      )}
                    >
                      <span className="flex-1 truncate">{cat}</span>
                      {count > 0 && (
                        <Badge className="bg-zinc-800 text-zinc-100 border-transparent hover:bg-zinc-800 text-[10px] font-semibold px-1.5 py-0 ml-auto shrink-0">
                          {count}
                        </Badge>
                      )}
                      <ChevronRight className="size-4 text-zinc-600 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right content — one card per category that has bookmarks */}
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              {BECK_CBT_CATEGORIES.filter(
                (cat) => (bookmarksByCategory[cat]?.length ?? 0) > 0,
              ).map((cat) => {
                const catBookmarks = bookmarksByCategory[cat] ?? [];
                return (
                  <div
                    key={cat}
                    className={cn(
                      "flex flex-col gap-2 p-4 rounded-md border shadow-lg transition-colors",
                      selectedCategory === cat
                        ? "bg-zinc-900 border-white/20"
                        : "bg-zinc-950 border-white/10",
                    )}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-base font-semibold text-white leading-none">
                        {cat}
                      </span>
                      <Badge className="bg-zinc-800 text-zinc-100 border-transparent hover:bg-zinc-800 text-xs font-semibold">
                        {catBookmarks.length}{" "}
                        {catBookmarks.length === 1 ? "bookmark" : "bookmarks"}
                      </Badge>
                    </div>
                    {catBookmarks.map((bm, idx) => (
                      <React.Fragment key={bm.id}>
                        {idx > 0 && (
                          <Separator className="bg-white/10 my-1" />
                        )}
                        <p className="text-sm text-zinc-100 leading-relaxed whitespace-pre-wrap">
                          {bm.text}
                        </p>
                      </React.Fragment>
                    ))}
                  </div>
                );
              })}

              {/* Empty state */}
              {BECK_CBT_CATEGORIES.every(
                (cat) => (bookmarksByCategory[cat]?.length ?? 0) === 0,
              ) && (
                <div className="flex items-center justify-center h-[200px] border-2 border-dashed border-white/10 rounded-lg">
                  <p className="text-sm text-zinc-500">
                    No bookmarks yet. Start creating bookmarks from the
                    transcription to populate this formulation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Manage Frameworks Dialog ── */}
      <Dialog open={manageFrameworksOpen} onOpenChange={setManageFrameworksOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Manage Frameworks</DialogTitle>
            <DialogDescription>
              Select the therapeutic framework to use for this patient&apos;s
              formulation.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-2">
            {FRAMEWORKS.map((fw) => {
              const isActive = fw.id === activeFramework;
              return (
                <div
                  key={fw.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-md border transition-colors",
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50",
                  )}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{fw.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {fw.description}
                    </span>
                  </div>
                  {isActive && (
                    <Badge variant="secondary" className="text-xs shrink-0">
                      Active
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Compare Versions Dialog ── */}
      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Compare Versions</DialogTitle>
            <DialogDescription>
              Select a version to compare with the current selection.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 py-2">
            {/* Left version */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedVersion?.label ?? "V1"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {selectedVersion
                    ? format(selectedVersion.createdAt, "dd/MM/yyyy")
                    : ""}
                </span>
              </div>
              <div className="border rounded-md p-3 min-h-[200px] flex flex-col gap-2 bg-muted/30">
                {(selectedVersion?.bookmarkSnapshot ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No bookmarks in this version.
                  </p>
                ) : (
                  (selectedVersion?.bookmarkSnapshot ?? []).map((bm) => (
                    <div
                      key={bm.id}
                      className="text-xs p-2 rounded border bg-background"
                    >
                      <span className="font-medium text-muted-foreground">
                        {bm.category}
                      </span>
                      <p className="mt-0.5 text-foreground">{bm.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right version selector */}
            <div className="flex-1 flex flex-col gap-2">
              <Select value={compareVersionId} onValueChange={setCompareVersionId}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select version to compare" />
                </SelectTrigger>
                <SelectContent>
                  {versions
                    .filter((v) => v.id !== selectedVersionId)
                    .map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.label} — {format(v.createdAt, "dd/MM/yyyy")}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="border rounded-md p-3 min-h-[200px] flex flex-col gap-2 bg-muted/30">
                {!compareVersionId ? (
                  <p className="text-sm text-muted-foreground">
                    Select a version above.
                  </p>
                ) : (
                  (() => {
                    const cv = versions.find((v) => v.id === compareVersionId);
                    return (cv?.bookmarkSnapshot ?? []).map((bm) => (
                      <div
                        key={bm.id}
                        className="text-xs p-2 rounded border bg-background"
                      >
                        <span className="font-medium text-muted-foreground">
                          {bm.category}
                        </span>
                        <p className="mt-0.5 text-foreground">{bm.text}</p>
                      </div>
                    ));
                  })()
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
