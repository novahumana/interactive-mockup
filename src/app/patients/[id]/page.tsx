"use client";

import * as React from "react";
import { use } from "react";
import {
  LayoutDashboard,
  Brain,
  Orbit,
  Lightbulb,
  FolderClosed,
} from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { PatientSidebar } from "@/components/humana/patient-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface Patient {
  id: string;
  name: string;
  patientId: string;
  status: "active" | "intake";
  aiTranscription: "enabled" | "disabled";
  caseSummary: string;
  nextSessionPrep: string;
}

const patients: Record<string, Patient> = {
  "1": {
    id: "1",
    name: "Mario R.",
    patientId: "PZ-023",
    status: "active",
    aiTranscription: "enabled",
    caseSummary: "",
    nextSessionPrep: "",
  },
  "2": {
    id: "2",
    name: "Laura F.",
    patientId: "PZ-024",
    status: "intake",
    aiTranscription: "disabled",
    caseSummary: "",
    nextSessionPrep: "",
  },
  "3": {
    id: "3",
    name: "Giada D.",
    patientId: "PZ-025",
    status: "active",
    aiTranscription: "enabled",
    caseSummary: "",
    nextSessionPrep: "",
  },
  "4": {
    id: "4",
    name: "Tommaso G.",
    patientId: "PZ-026",
    status: "active",
    aiTranscription: "disabled",
    caseSummary: "",
    nextSessionPrep: "",
  },
};

export default function PatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.id;
  const patient = patients[patientId];

  const [aiEnabled, setAiEnabled] = React.useState(
    patient?.aiTranscription === "enabled",
  );
  const [caseSummary, setCaseSummary] = React.useState(
    patient?.caseSummary || "",
  );
  const [nextSessionPrep, setNextSessionPrep] = React.useState(
    patient?.nextSessionPrep || "",
  );

  if (!patient) {
    return (
      <SidebarProvider>
        <PatientSidebar currentPatientId={patientId} />
        <SidebarInset>
          <main className="flex-1 px-8 py-10">
            <div className="flex items-center justify-center h-[60vh]">
              <p className="text-muted-foreground">Patient not found</p>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <PatientSidebar currentPatientId={patientId} />
      <SidebarInset>
        <main className="flex-1 px-8 py-10">
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {patient.name}
                </h1>
                <span className="text-muted-foreground">
                  ({patient.patientId})
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Patient clinical workspace and documentation
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="w-full">
                <TabsTrigger value="overview" className="flex-1">
                  <LayoutDashboard className="size-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex-1">
                  <Brain className="size-4" />
                  Notes & Insights
                </TabsTrigger>
                <TabsTrigger value="formulation" className="flex-1">
                  <Orbit className="size-4" />
                  Formulation
                </TabsTrigger>
                <TabsTrigger value="frameworks" className="flex-1">
                  <Lightbulb className="size-4" />
                  Frameworks
                </TabsTrigger>
                <TabsTrigger value="files" className="flex-1">
                  <FolderClosed className="size-4" />
                  Files
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="flex flex-col gap-6">
                  {/* Case Summary Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Case summary</CardTitle>
                      <CardDescription>
                        Brief overview of the patient&apos;s case and
                        therapeutic goals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Write a brief summary of this patient's case, including presenting problems, history, and therapeutic goals..."
                        className="min-h-[160px] resize-none"
                        value={caseSummary}
                        onChange={(e) => setCaseSummary(e.target.value)}
                      />
                    </CardContent>
                  </Card>

                  {/* Next Session Prep Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Next session prep</CardTitle>
                      <CardDescription>
                        Notes and topics to address in the upcoming session
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Add notes, topics to discuss, or interventions to try in the next session..."
                        className="min-h-[160px] resize-none"
                        value={nextSessionPrep}
                        onChange={(e) => setNextSessionPrep(e.target.value)}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* AI & Transcription Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI & Transcription</CardTitle>
                    <CardDescription>
                      Manage AI features and transcription settings for this
                      patient
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Patient consent status
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Indicates whether the patient has provided consent for
                          AI features
                        </p>
                      </div>
                      <Badge
                        variant={aiEnabled ? "default" : "secondary"}
                        className={
                          aiEnabled
                            ? "bg-[#DCFCE7] text-[#15803D] border-[#15803D] hover:bg-[#DCFCE7]"
                            : "bg-[#FEF2F2] text-[#F87171] border-[#F87171] hover:bg-[#FEF2F2]"
                        }
                      >
                        {aiEnabled ? "Consent given" : "No consent"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 pt-2 border-t">
                      <Switch
                        checked={aiEnabled}
                        onCheckedChange={setAiEnabled}
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Enable AI features
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Enable transcription and AI-powered insights for
                          sessions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notes & Insights Tab */}
              <TabsContent value="notes">
                <div className="flex items-center justify-center h-[40vh] border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    Notes & Insights content coming soon
                  </p>
                </div>
              </TabsContent>

              {/* Formulation Tab */}
              <TabsContent value="formulation">
                <div className="flex items-center justify-center h-[40vh] border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    Formulation content coming soon
                  </p>
                </div>
              </TabsContent>

              {/* Frameworks Tab */}
              <TabsContent value="frameworks">
                <div className="flex items-center justify-center h-[40vh] border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    Frameworks content coming soon
                  </p>
                </div>
              </TabsContent>

              {/* Files Tab */}
              <TabsContent value="files">
                <div className="flex items-center justify-center h-[40vh] border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    Files content coming soon
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
