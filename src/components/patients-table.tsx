"use client";

import Link from "next/link";
import { MoreHorizontal, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AIBadge } from "@/components/humana";

interface Patient {
  id: string;
  name: string;
  patientId: string;
  status: "active" | "intake";
  aiTranscription: "enabled" | "disabled";
  lastSession: string;
}

const patients: Patient[] = [
  {
    id: "1",
    name: "Mario R.",
    patientId: "PZ-023",
    status: "active",
    aiTranscription: "enabled",
    lastSession: "2024-12-01",
  },
  {
    id: "2",
    name: "Laura F.",
    patientId: "PZ-023",
    status: "intake",
    aiTranscription: "disabled",
    lastSession: "2024-12-01",
  },
];

export function PatientsTable() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Patient</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">AI & Transcription</TableHead>
              <TableHead className="font-medium">Last Session</TableHead>
              <TableHead className="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <Link
                    href={`/patients/${patient.id}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <span className="font-semibold">{patient.name}</span>
                    <span className="text-muted-foreground">
                      ({patient.patientId})
                    </span>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={patient.status === "active" ? "success" : "secondary"}
                  >
                    {patient.status === "active" ? "Active" : "Intake (New)"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <AIBadge enabled={patient.aiTranscription === "enabled"} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {patient.lastSession}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/patients/${patient.id}`}>
                          View details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit patient</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1-2 of 2 patients
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="size-8" disabled>
            <ArrowLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" className="size-8" disabled>
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
