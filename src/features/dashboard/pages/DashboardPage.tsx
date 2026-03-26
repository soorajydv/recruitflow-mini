import React from "react";
import { useGetDashboardStatsQuery, useSeedCandidatesMutation } from "../../../services/candidateApi";
import { Users, UserCheck, UserX, Clock, Briefcase, Database } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/Button";

export const DashboardPage = () => {
  const { data, isLoading } = useGetDashboardStatsQuery();
  const [seedCandidates, { isLoading: isSeeding }] = useSeedCandidatesMutation();

  const handleSeed = async () => {
    try {
      await seedCandidates().unwrap();
      alert("20 Nepali candidates seeded successfully!");
    } catch (error) {
      console.error("Failed to seed data:", error);
      alert("Failed to seed data. Check console for details.");
    }
  };

  const stats = [
    {
      label: "Total Candidates",
      value: data?.total || 0,
      icon: Users,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      label: "Applied",
      value: data?.statusCounts.Applied || 0,
      icon: Clock,
      color: "bg-gray-500",
      textColor: "text-gray-600",
    },
    {
      label: "Interviews",
      value: data?.statusCounts.Interview || 0,
      icon: Briefcase,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
    },
    {
      label: "Hired",
      value: data?.statusCounts.Hired || 0,
      icon: UserCheck,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      label: "Rejected",
      value: data?.statusCounts.Rejected || 0,
      icon: UserX,
      color: "bg-red-500",
      textColor: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of your recruitment funnel</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSeed} isLoading={isSeeding}>
          <Database className="mr-2 h-4 w-4" /> Seed Demo Data
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className={cn("rounded-lg p-2 text-white", stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className={cn("text-3xl font-bold", stat.textColor)}>
                {isLoading ? "..." : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 italic">No recent activity to display.</p>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Pipeline Health</h3>
          <div className="space-y-4">
             <p className="text-sm text-gray-500 italic">Pipeline metrics coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
