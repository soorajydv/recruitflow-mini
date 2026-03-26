import React, { useState } from "react";
import {
  useGetCandidatesQuery,
  useAddCandidateMutation,
  useUpdateCandidateMutation,
  useDeleteCandidateMutation,
  Candidate,
} from "../../../services/candidateApi";
import { useDebounce } from "../../../hooks/useDebounce";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Modal } from "../../../components/ui/Modal";
import { CandidateForm } from "../components/CandidateForm";
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, Eye, AlertTriangle } from "lucide-react";
import { cn } from "../../../lib/utils";

interface CandidateListPageProps {
  onViewDetails: (id: string) => void;
}

export const CandidateListPage = ({ onViewDetails }: CandidateListPageProps) => {
  // Table State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const debouncedSearch = useDebounce(search, 500);

  // API Queries
  const { data, isLoading, isFetching } = useGetCandidatesQuery({
    page,
    limit: 10,
    search: debouncedSearch,
    status,
    sortBy,
    order,
  });

  const [addCandidate, { isLoading: isAdding }] = useAddCandidateMutation();
  const [updateCandidate, { isLoading: isUpdating }] = useUpdateCandidateMutation();
  const [deleteCandidate, { isLoading: isDeleting }] = useDeleteCandidateMutation();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | undefined>();
  
  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | undefined>();

  const handleAdd = () => {
    setSelectedCandidate(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (candidate: Candidate) => {
    setCandidateToDelete(candidate);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (candidateToDelete) {
      try {
        await deleteCandidate(candidateToDelete._id).unwrap();
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Failed to delete candidate:", error);
      }
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (selectedCandidate) {
        await updateCandidate({ id: selectedCandidate._id, body: formData }).unwrap();
      } else {
        await addCandidate(formData).unwrap();
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save candidate:", error);
    }
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const statusColors = {
    Applied: "bg-blue-100 text-blue-700",
    Interview: "bg-yellow-100 text-yellow-700",
    Hired: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-sm text-gray-500">Manage your recruitment pipeline</p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Candidate
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 rounded-lg border bg-white p-4 shadow-sm md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, email, position..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          options={[
            { label: "All Statuses", value: "" },
            { label: "Applied", value: "Applied" },
            { label: "Interview", value: "Interview" },
            { label: "Hired", value: "Hired" },
            { label: "Rejected", value: "Rejected" },
          ]}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <Select
            className="flex-1"
            options={[
              { label: "Created At", value: "createdAt" },
              { label: "Name", value: "name" },
              { label: "Position", value: "position" },
            ]}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">
                  <button
                    onClick={() => toggleSort("name")}
                    className="flex items-center gap-1 hover:text-gray-900"
                  >
                    Name <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Position</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading || isFetching ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-4 w-full rounded bg-gray-100"></div>
                    </td>
                  </tr>
                ))
              ) : data?.candidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No candidates found matching your criteria.
                  </td>
                </tr>
              ) : (
                data?.candidates.map((candidate) => (
                  <tr key={candidate._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{candidate.name}</td>
                    <td className="px-6 py-4 text-gray-600">{candidate.email}</td>
                    <td className="px-6 py-4 text-gray-600">{candidate.position}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                          statusColors[candidate.status]
                        )}
                      >
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails(candidate._id)}
                          className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(candidate)}
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(candidate)}
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-6 py-4">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(page * 10, data.meta.total)}
              </span>{" "}
              of <span className="font-medium">{data.meta.total}</span> candidates
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === data.meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCandidate ? "Edit Candidate" : "Add New Candidate"}
      >
        <CandidateForm
          initialData={selectedCandidate}
          onSubmit={handleFormSubmit}
          isLoading={isAdding || isUpdating}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-red-100 bg-red-50 p-4 text-red-800">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <p className="text-sm">
              Are you sure you want to delete <strong>{candidateToDelete?.name}</strong>? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting}>
              Delete Candidate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

