"use client";

import { Plus, Search } from "lucide-react";
import { PatientsTable } from "@/components/patients-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PatientsPage() {
  return (
    <div className="page-container space-y-6">
            {/* Header */}
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                Patients
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your patients and access their clinical workspaces.
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient name…"
                    className="pl-9 pr-16"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Kbd>⌘F</Kbd>
                  </div>
                </div>

                {/* Status Filter */}
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="intake">Intake</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* New Patient Button */}
              <Button>
                <Plus className="size-4 mr-2" />
                New patient
                <Kbd className="ml-2">⌘K</Kbd>
              </Button>
            </div>

            {/* Table */}
            <PatientsTable />
    </div>
  );
}
