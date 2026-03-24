import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { LanguageProvider } from "./contexts/LanguageContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import ProtectedRoute from "./components/common/ProtectedRoute"
import LandingPage from "./pages/visitor/LandingPage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import InvestorDashboard from "./pages/investor/Dashboard"
import ProjectOwnerDashboard from "./pages/project-owner/Dashboard"
import AdminDashboard from "./pages/admin/Dashboard"
import ProjectsList from "./pages/project-owner/ProjectsList"
import CreateProject from "./pages/project-owner/CreateProject"
import InvestmentOffers from "./pages/project-owner/InvestmentOffers"
import Messages from "./pages/project-owner/Messages"
import InvestorLeaderboard from "./pages/project-owner/InvestorLeaderboard"
import AIAnalysis from "./pages/project-owner/AIAnalysis"
import BrowseProjects from "./pages/investor/BrowseProjects"
import ProjectDetails from "./pages/investor/ProjectDetails"
import MyOffers from "./pages/investor/MyOffers"
import InvestorMessages from "./pages/investor/InvestorMessages"
import ProjectLeaderboard from "./pages/investor/ProjectLeaderboard"
import Notifications from "./pages/investor/Notifications"
import ProjectOwnerNotifications from "./pages/project-owner/Notifications"
import NegotiationRoom from "./pages/common/NegotiationRoom"
import AIAssistant from "./pages/investor/AIAssistant"
import AIAssistantOwner from "./pages/project-owner/AIAssistantOwner"
import ForgotPassword from "./pages/auth/ForgotPassword"
import Profile from "./pages/project-owner/Profile"
import EditProfile from "./pages/project-owner/EditProfile"
import Settings from "./pages/project-owner/Settings"
import ChatWidgetButton from "./components/common/ChatWidgetButton";
import HelpAndPolicies from "./components/common/HelpAndPolicies";
import Footer from "./components/common/Footer";
import ChatBot from "./components/common/ChatBot";
import InvestorProfile from "./pages/investor/InvestorProfile" ;
import EditInvestorProfile from "./pages/investor/EditInvestorProfile" ;
import AdminManageInvestors from "./pages/admin/AdminManageInvestors"
import AdminManageProjectOwners from "./pages/admin/AdminManageProjectOwners"
import AdminReviewProjects from "./pages/admin/AdminReviewProjects"
import AdminOffers from "./pages/admin/AdminOffers"
import AdminProjectDetails from "./pages/admin/AdminProjectDetails";
import AdminNotifications from "./pages/admin/AdminNotifications"
import AdminReports from "./pages/admin/AdminReports"
import MonitorActivity from "./pages/admin/MonitorActivity"
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastContainer />
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/investor/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["investor"]}>
                      <InvestorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project-owner/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["project-owner"]}>
                      <ProjectOwnerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/project-owner/projects"
                  element={
                    <ProtectedRoute allowedRoles={["project-owner"]}>
                      <ProjectsList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project-owner/create-project"
                  element={
                    <ProtectedRoute allowedRoles={["project-owner"]}>
                      <CreateProject />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project-owner/offers"
                  element={
                    <ProtectedRoute allowedRoles={["project-owner"]}>
                      <InvestmentOffers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project-owner/messages"
                  element={
                    <ProtectedRoute allowedRoles={["project-owner"]}>
                      <Messages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project-owner/leaderboard"
                  element={
                    <ProtectedRoute allowedRoles={["project-owner"]}>
                      <InvestorLeaderboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project-owner/ai-analysis"
                  element={
                    <ProtectedRoute allowedRoles={["project-owner"]}>
                      <AIAnalysis />
                    </ProtectedRoute>
                  }
                />
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/project-owner/edit-profile" element={<EditProfile />} />

<Route
  path="/project-owner/notifications"
  element={
    <ProtectedRoute allowedRoles={["project-owner"]}>
      <ProjectOwnerNotifications />
    </ProtectedRoute>
  }
/>

<Route path="/project-owner/settings" element={<Settings />} />
                <Route
                  path="/investor/browse"
                  element={
                    <ProtectedRoute allowedRoles={["investor"]}>
                      <BrowseProjects />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/investor/project/:id"
                  element={
                    <ProtectedRoute allowedRoles={["investor"]}>
                      <ProjectDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/investor/offers"
                  element={
                    <ProtectedRoute allowedRoles={["investor"]}>
                      <MyOffers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/investor/messages"
                  element={
                    <ProtectedRoute allowedRoles={["investor"]}>
                      <InvestorMessages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/investor/leaderboard"
                  element={
                    <ProtectedRoute allowedRoles={["investor"]}>
                      <ProjectLeaderboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/investor/notifications"
                  element={
                    <ProtectedRoute allowedRoles={["investor"]}>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/investor/ai-assistant"
                  element={
                    <ProtectedRoute allowedRoles={["investor"]}>
                      <AIAssistant />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project-owner/ai-assistant"
                  element={
                    <ProtectedRoute allowedRoles={["project-owner"]}>
                      <AIAssistantOwner />
                    </ProtectedRoute>
                  }
                />
                   <Route
                  path="/investor/investor-profile"
                   element={
    <ProtectedRoute allowedRoles={["investor"]}>
      <InvestorProfile />
    </ProtectedRoute>
  }
                />
                    <Route
      path="/investor/edit-profile"
      element={
        <ProtectedRoute allowedRoles={["investor"]}>
          <EditInvestorProfile />
        </ProtectedRoute>
      }
    />
                <Route
                  path="/negotiation/:negotiationId"
                  element={
                    <ProtectedRoute allowedRoles={["investor", "project-owner"]}>
                      <NegotiationRoom />
                    </ProtectedRoute>
                  }
                />
                <Route path="/chatbot" element={<ChatBot />} />
  <Route
    path="/admin/investors"
    element={
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminManageInvestors />
      </ProtectedRoute>
    }
  />
   <Route
    path="/admin/project-owners"
    element={
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminManageProjectOwners />
      </ProtectedRoute>
    }
  />
  <Route
  path="/admin/review-projects"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminReviewProjects />
    </ProtectedRoute>
  }
/>
  <Route
  path="/admin/project/:id"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminProjectDetails />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/offers"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminOffers />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/notifications"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminNotifications />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/reports"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminReports />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/monitor-activity"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <MonitorActivity />
    </ProtectedRoute>
  }
/>
<Route
  path="/help-policies"
  element={
    <ProtectedRoute allowedRoles={["admin", "investor", "project-owner"]}>
      <HelpAndPolicies />
    </ProtectedRoute>
  }
/>
<Route
  path="/footer"
  element={
    <ProtectedRoute allowedRoles={["admin", "investor", "project-owner"]}>
      <Footer />
    </ProtectedRoute>
  }
/>
              </Routes>
              <ChatWidgetButton />
              
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
    
  )
}

export default App
