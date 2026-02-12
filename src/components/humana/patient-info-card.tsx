"use client";

import Link from "next/link";
import { ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpcomingSession } from "@/types/types";

interface PatientInfoCardProps {
  name: string;
  patientId: string;
  /** The raw patient ID used for routing (e.g. "1", "2") */
  patientRouteId?: string;
  upcomingSessions?: UpcomingSession[];
  onViewDetails?: () => void;
}

export function PatientInfoCard({
  name,
  patientId,
  patientRouteId,
  upcomingSessions = [],
  onViewDetails,
}: PatientInfoCardProps) {
  return (
    <div className="flex items-start justify-between rounded-lg border bg-card p-4">
      <div className="space-y-2">
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-sm text-muted-foreground">{patientId}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          asChild={!!patientRouteId}
          onClick={onViewDetails}
        >
          {patientRouteId ? (
            <Link href={`/patients/${patientRouteId}`}>
              See Patient Details
              <ExternalLink className="ml-2 size-3" />
            </Link>
          ) : (
            <>
              See Patient Details
              <ExternalLink className="ml-2 size-3" />
            </>
          )}
        </Button>
      </div>

      {upcomingSessions.length > 0 && (
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-sm text-muted-foreground mb-2">
            <Calendar className="size-4" />
            <span>Upcoming sessions</span>
          </div>
          <div className="space-y-1">
            {upcomingSessions.map((session, index) => (
              <p key={index} className="text-sm">
                {session.date} · {session.time}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
