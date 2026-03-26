import React, { useState, useEffect } from "react";
import { useGetCandidateQuery, useUpdateCandidateMutation } from "../../../services/candidateApi";
import { Button } from "../../../components/ui/Button";
import { ArrowLeft, Mail, Briefcase, Calendar, User, CheckCircle, XCircle, Clock, AlertCircle, Save } from "lucide-react";
import { cn } from "../../../lib/utils";

interface CandidateDetailsPageProps {
  id: string;
  onBack: () => void;
}

export const CandidateDetailsPage = ({ id, onBack }: CandidateDetailsPageProps) => {
  const { data, isLoading, error } = useGetCandidateQuery(id);
  const [updateCandidate, { isLoading: isUpdating }] = useUpdateCandidateMutation();
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (data?.data?.notes) {
      setNotes(data.data.notes);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-lg font-semibold text-red-900">Error Loading Candidate</h3>
        <p className="mt-2 text-red-700">The candidate could not be found or there was a server error.</p>
        <Button variant="outline" onClick={onBack} className="mt-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
      </div>
    );
  }

  const candidate = data.data;

  const handleSaveNote = async () => {
    try {
      await updateCandidate({
        id,
        body: { notes },
      }).unwrap();
    } catch (err) {
      console.error("Failed to save note:", err);
      alert("Failed to save note. Please try again.");
    }
  };

  const statusInfo = {
    Applied: { icon: Clock, color: "text-blue-600", bg: "bg-blue-100", label: "Applied" },
    Interview: { icon: Briefcase, color: "text-yellow-600", bg: "bg-yellow-100", label: "Interviewing" },
    Hired: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: "Hired" },
    Rejected: { icon: XCircle, color: "text-red-600", bg: "bg-red-100", label: "Rejected" },
  };

  const currentStatus = statusInfo[candidate.status];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Candidate Details</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <User className="h-12 w-12" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">{candidate.name}</h2>
              <p className="text-gray-500">{candidate.position}</p>
              
              <div className={cn(
                "mt-4 flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium",
                currentStatus.bg,
                currentStatus.color
              )}>
                <currentStatus.icon className="h-4 w-4" />
                {currentStatus.label}
              </div>
            </div>

            <div className="mt-8 space-y-4 border-t pt-6">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{candidate.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{candidate.position}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  Applied on {new Date(candidate.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details/Timeline */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Application Overview</h3>
            <div className="mt-6 space-y-6">
              <div className="relative pl-8 before:absolute before:left-3 before:top-2 before:h-full before:w-0.5 before:bg-gray-100 last:before:hidden">
                <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-white bg-blue-600 shadow-sm"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Application Received</h4>
                  <p className="text-sm text-gray-500">{new Date(candidate.createdAt).toLocaleString()}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    The candidate successfully submitted their application for the {candidate.position} position.
                  </p>
                </div>
              </div>

              {candidate.status !== "Applied" && (
                <div className="relative pl-8 before:absolute before:left-3 before:top-2 before:h-full before:w-0.5 before:bg-gray-100 last:before:hidden">
                  <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-white bg-yellow-500 shadow-sm"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Status Updated to {candidate.status}</h4>
                    <p className="text-sm text-gray-500">{new Date(candidate.updatedAt).toLocaleString()}</p>
                    <p className="mt-2 text-sm text-gray-600">
                      The application status was moved to {candidate.status} by the recruitment team.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
            <div className="mt-4">
              <textarea
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
                rows={4}
                placeholder="Add internal notes about this candidate..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
              <div className="mt-2 flex justify-end">
                <Button 
                  size="sm" 
                  onClick={handleSaveNote}
                  isLoading={isUpdating}
                  disabled={notes === (candidate.notes || "")}
                >
                  <Save className="mr-2 h-4 w-4" /> Save Note
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
