"use client";

import * as React from "react";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Patient {
  id: string;
  name: string;
  patientId: string;
  status: "active" | "intake";
  initials: string;
}

const patients: Patient[] = [
  { id: "1", name: "Mario R.", patientId: "PZ-023", status: "active", initials: "MR" },
  { id: "2", name: "Laura F.", patientId: "PZ-024", status: "intake", initials: "LF" },
  { id: "3", name: "Giada D.", patientId: "PZ-025", status: "active", initials: "GD" },
  { id: "4", name: "Tommaso G.", patientId: "PZ-026", status: "active", initials: "TG" },
];

const todayAppointments = [
  { id: "1", name: "Mario R.", initials: "MR", time: "09:00" },
  { id: "3", name: "Giada D.", initials: "GD", time: "11:30" },
  { id: "4", name: "Tommaso G.", initials: "TG", time: "14:00" },
];

interface PatientSidebarProps {
  currentPatientId: string;
}

export function PatientSidebar({ currentPatientId }: PatientSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const currentPatient = patients.find((p) => p.id === currentPatientId);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar>
      <SidebarHeader className="gap-4">
        {/* Back to All Patients */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2">
                <ChevronLeft className="size-4" />
                <span className="font-medium">All Patients</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Search Input */}
        <div className="px-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Current Patient Card */}
        {currentPatient && (
          <div className="px-2">
            <div className="rounded-lg border bg-sidebar-accent p-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage
                    src={`/avatars/${currentPatient.id}.png`}
                    alt={currentPatient.name}
                  />
                  <AvatarFallback>{currentPatient.initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-sm">
                    {currentPatient.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {currentPatient.patientId}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <Badge
                  variant={currentPatient.status === "active" ? "success" : "secondary"}
                  className="text-xs"
                >
                  {currentPatient.status === "active" ? "Active" : "Intake (New)"}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarSeparator />

        {/* Today Appointments */}
        <SidebarGroup>
          <SidebarGroupLabel>Today Appointments</SidebarGroupLabel>
          <SidebarMenu>
            {todayAppointments.map((appointment) => (
              <SidebarMenuItem key={appointment.id}>
                <SidebarMenuButton
                  tooltip={appointment.name}
                  asChild
                  isActive={appointment.id === currentPatientId}
                >
                  <Link href={`/patients/${appointment.id}`}>
                    <Avatar className="size-5">
                      <AvatarImage
                        src={`/avatars/${appointment.id}.png`}
                        alt={appointment.name}
                      />
                      <AvatarFallback className="text-[10px]">
                        {appointment.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1">{appointment.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {appointment.time}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Search Results (when searching) */}
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
                        tooltip={patient.name}
                        asChild
                        isActive={patient.id === currentPatientId}
                      >
                        <Link href={`/patients/${patient.id}`}>
                          <Avatar className="size-5">
                            <AvatarImage
                              src={`/avatars/${patient.id}.png`}
                              alt={patient.name}
                            />
                            <AvatarFallback className="text-[10px]">
                              {patient.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span>{patient.name}</span>
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
    </Sidebar>
  );
}
