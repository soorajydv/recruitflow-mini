import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import { CandidateListPage } from "./features/candidates/pages/CandidateListPage";
import { CandidateDetailsPage } from "./features/candidates/pages/CandidateDetailsPage";
import { LoginPage } from "./features/auth/LoginPage";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./app/store";
import { logout } from "./features/auth/authSlice";
import { LayoutDashboard, Users, LogOut, Menu, X, AlertCircle, ChevronLeft } from "lucide-react";
import { cn } from "./lib/utils";
import { Modal } from "./components/ui/Modal";
import { Button } from "./components/ui/Button";

type Page = "dashboard" | "candidates" | "candidate-details";

function AppContent() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "candidates", label: "Candidates", icon: Users },
  ];

  const handleViewDetails = (id: string) => {
    setSelectedCandidateId(id);
    setCurrentPage("candidate-details");
  };

  const handleBackToList = () => {
    setSelectedCandidateId(null);
    setCurrentPage("candidates");
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    setIsLogoutModalOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "candidates":
        return <CandidateListPage onViewDetails={handleViewDetails} />;
      case "candidate-details":
        return selectedCandidateId ? (
          <CandidateDetailsPage id={selectedCandidateId} onBack={handleBackToList} />
        ) : (
          <CandidateListPage onViewDetails={handleViewDetails} />
        );
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg lg:hidden"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 transform border-r bg-white transition-all duration-300 ease-in-out lg:static lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-4 lg:px-6">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-8 w-8 shrink-0 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">R</div>
              {!isSidebarCollapsed && (
                <span className="text-xl font-bold tracking-tight whitespace-nowrap">RecruitFlow</span>
              )}
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id as Page);
                  setSelectedCandidateId(null);
                  setIsSidebarOpen(false);
                }}
                title={isSidebarCollapsed ? item.label : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  (currentPage === item.id || (currentPage === "candidate-details" && item.id === "candidates"))
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  isSidebarCollapsed && "justify-center px-0"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="border-t p-4 space-y-2">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <div className={cn("transition-transform duration-300", isSidebarCollapsed && "rotate-180")}>
                <ChevronLeft className="h-5 w-5" />
              </div>
              {!isSidebarCollapsed && <span>Collapse Sidebar</span>}
            </button>
            
            <button 
              onClick={handleLogout}
              title={isSidebarCollapsed ? "Logout" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-700",
                isSidebarCollapsed && "justify-center px-0"
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!isSidebarCollapsed && <span className="whitespace-nowrap">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white/80 px-6 backdrop-blur-md">
          <div className="flex flex-1 items-center justify-between">
            <h2 className="text-sm font-medium text-gray-500">
              {currentPage === "candidate-details" ? "Candidate Details" : navItems.find((n) => n.id === currentPage)?.label}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {user?.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-none">{user?.name}</span>
                  <span className="text-xs text-gray-500">{user?.role}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-amber-600">
            <AlertCircle className="h-6 w-6" />
            <p className="font-medium">Are you sure you want to logout?</p>
          </div>
          <p className="text-sm text-gray-500">
            You will need to sign in again to access the recruitment dashboard.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsLogoutModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmLogout}>
              Logout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
