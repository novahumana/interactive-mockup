"use client";

import * as React from "react";
import {
  ChevronLeft,
  Search,
  Play,
  Settings,
  Calendar,
  User,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Patient } from "@/types/types";

const patients: Patient[] = [
  {
    id: "1",
    name: "Mario R.",
    patientId: "PZ-023",
    status: "active",
    initials: "MR",
  },
  {
    id: "2",
    name: "Laura F.",
    patientId: "PZ-024",
    status: "intake",
    initials: "LF",
  },
  {
    id: "3",
    name: "Giada D.",
    patientId: "PZ-025",
    status: "active",
    initials: "GD",
  },
  {
    id: "4",
    name: "Tommaso G.",
    patientId: "PZ-026",
    status: "active",
    initials: "TG",
  },
];

const todayAppointments = [
  { id: "1", name: "Mario R.", time: "09:00" },
  { id: "3", name: "Giada D.", time: "11:30" },
  { id: "4", name: "Giovanni F.", time: "15:30" },
];

interface PatientSidebarProps {
  currentPatientId: string;
  aiEnabled: boolean;
  onAiEnabledChange: (enabled: boolean) => void;
}

export function PatientSidebar({
  currentPatientId,
  aiEnabled,
  onAiEnabledChange,
}: PatientSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [transcriptionLanguage, setTranscriptionLanguage] = React.useState("");
  const [audioSource, setAudioSource] = React.useState("");
  const { theme, setTheme } = useTheme();

  const currentPatient = patients.find((p) => p.id === currentPatientId);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Sidebar>
      {/* Header: back link only */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <ChevronLeft className="size-4" />
                <span>All Patients</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Search + Current Patient + Actions */}
        <SidebarGroup className="gap-2">
          {/* Search */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search patients"
              className="pl-9 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-2">
              <Kbd>⌘</Kbd>
            </div>
          </div>

          {/* Current Patient Card */}
          {currentPatient && (
            <div className="rounded-sm border p-3 flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">
                Current Patient
              </span>
              <span className="font-semibold text-lg leading-none">
                {currentPatient.name}
              </span>
              <span className="text-sm text-muted-foreground">
                {currentPatient.patientId}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button className="flex-1" size="sm" disabled={!aiEnabled}>
              <Play className="size-4" />
              Start transcription
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-9 shrink-0"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="size-4" />
            </Button>
          </div>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Today Appointments */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-1">
            <Calendar className="size-4 shrink-0" />
            <span>Today Appointments</span>
            <Badge variant="secondary" className="ml-auto text-xs px-1.5">
              {todayAppointments.length}
            </Badge>
          </SidebarGroupLabel>
          <SidebarMenu>
            {todayAppointments.map((appointment) => (
              <SidebarMenuItem key={appointment.id}>
                <SidebarMenuButton
                  asChild
                  isActive={appointment.id === currentPatientId}
                >
                  <Link href={`/patients/${appointment.id}`}>
                    <User className="size-4 shrink-0" />
                    <span className="flex-1 text-sm">{appointment.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {appointment.time}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Search Results */}
        {searchQuery && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Search Results</SidebarGroupLabel>
              <SidebarMenu>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <SidebarMenuItem key={patient.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={patient.id === currentPatientId}
                      >
                        <Link href={`/patients/${patient.id}`}>
                          <User className="size-4 shrink-0" />
                          <span className="text-sm">{patient.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                    No patients found
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* Footer: user info + theme toggle + sidebar trigger */}
      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-2">
          <Avatar className="size-8">
            <AvatarImage src="/avatar.png" alt="John Doe" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 leading-none flex-1 min-w-0">
            <span className="font-semibold text-sm truncate">John Doe</span>
            <span className="text-xs text-muted-foreground truncate">
              johndoe@example.com
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={toggleTheme}
            >
              <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <SidebarTrigger className="size-7" />
          </div>
        </div>
        <div className="px-2 pb-2">
          <p className="text-[11px] text-muted-foreground leading-tight">
            Demo version – No data is saved
          </p>
        </div>
      </SidebarFooter>

      {/* Transcription Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Transcription Settings</DialogTitle>
            <DialogDescription>
              Settings to apply to new transcriptions
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            {/* Patient Consent */}
            <div className="flex items-center justify-between gap-4 pb-3 border-b">
              <div className="flex flex-col gap-0.5">
                <Label>Patient consent</Label>
                <span className="text-xs text-muted-foreground">
                  {aiEnabled
                    ? "Consent given — transcription enabled"
                    : "No consent — transcription disabled"}
                </span>
              </div>
              <Switch checked={aiEnabled} onCheckedChange={onAiEnabledChange} />
            </div>

            {/* Transcription Language */}
            <div className="flex flex-col gap-2">
              <Label>Transcription Language</Label>
              <Select
                value={transcriptionLanguage}
                onValueChange={setTranscriptionLanguage}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select the language of the meeting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">Italian</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Audio Source */}
            <div className="flex flex-col gap-2">
              <Label>Select Source</Label>
              <Select value={audioSource} onValueChange={setAudioSource}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select the source of the audio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="microphone">Microphone</SelectItem>
                  <SelectItem value="system">System Audio</SelectItem>
                  <SelectItem value="both">Microphone + System Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setSettingsOpen(false)}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
