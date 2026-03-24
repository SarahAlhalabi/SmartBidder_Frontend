"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Clock, AlertTriangle } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import Header from "../../components/common/Header";

const  AdminProjectDetails = () => {
  const [toast, setToast] = useState({ message: "", type: "" }); // type: "success" | "error"
  const { t, isRTL } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [showOfferModal, setShowOfferModal] = useState(false);
 const [offerData, setOfferData] = useState({ status: "" });
const confirmDelete = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/adminAccounts/projects/${id}/delete-file/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete project");

    setToast({ message: "Project deleted successfully", type: "success" });
    setTimeout(() => {
      navigate("/admin/review-projects");
    }, 1500);

  } catch (error) {
    setToast({ message: error.message, type: "error" });
  }
};
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [recentOffers, setRecentOffers] = useState([]);
 const fetchRecentOffers = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/adminAccounts/offers/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const allOffers = await response.json();
    
    const filtered = allOffers
      .filter((offer) => offer.project_title === project.title)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3); 

    setRecentOffers(filtered);
  } catch (error) {
    console.error("Error fetching offers:", error);
  }
};
useEffect(() => {
  if (project) {
    fetchRecentOffers();
  }
}, [project]);
  const fundingRequired = project?.feasibility_study?.funding_required || 0;
  const minInvestment = Math.round(fundingRequired * 0.1);
  const maxInvestment = Math.round(fundingRequired * 0.5);
 const fetchProject = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/adminAccounts/projects/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      data.files = [
        {
          id: 1,
          name: "Business Plan.pdf",
          file: "https://example.com/sample.pdf",
          uploaded_at: "2025-06-16T12:00:00Z"
        },
        {
          id: 2,
          name: "Pitch Deck.pptx",
          file: "https://example.com/deck.pptx",
          uploaded_at: "2025-06-15T10:30:00Z"
        }
      ];

      setProject(data);
      setOfferData({ status: data.status });
      console.log("📂 Files received:", data.files);
    } catch (error) {
      console.error("Error loading project:", error);
    } finally {
      setLoading(false);
    }
  };
 useEffect(() => {
  fetchProject();
}, [id]);


  const handleOfferSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`http://127.0.0.1:8000/investor/${id}/offers/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        amount: offerData.amount,
        equity_percentage: offerData.ownership,
        additional_terms: offerData.terms,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to submit offer");
    }

    setToast({ message: "Offer submitted successfully!", type: "success" });
    setShowOfferModal(false);
    setOfferData({ amount: "", ownership: "", terms: "" });

  } catch (error) {
    setToast({ message: error.message || "Error submitting offer.", type: "error" });
  }

  setTimeout(() => setToast({ message: "", type: "" }), 4000);
};


  const getRiskColor = (risk) => {
    switch (risk) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading project...</p>;
  if (!project) return <p className="text-center text-red-500">Project not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Header />
{toast.message && (
  <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 text-sm transition-all duration-300
    ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
    {toast.message}
  </div>
)}

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {toast.message && (
  <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 text-sm transition-all duration-300
    ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
    {toast.message}
  </div>
)}

        <button
          onClick={() => navigate(-1)}
          className={`inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
          Back to Projects
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
<h2 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Admin View</h2>

              <h1 className="text-3xl font-bold mb-1 relative">
                {project.title}
                <span className="block w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mt-1 rounded-full"></span>
              </h1>
<h2 className="text-md text-gray-600 dark:text-gray-400 mb-2">
 Owner: <span className="font-medium text-gray-800 dark:text-gray-200">{project.owner?.full_name || "N/A"}</span>

</h2>

              <div className="flex items-center flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {project.category}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRiskColor(project.riskLevel)}`}>
                  {t(project.riskLevel)} Risk
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{project.description}</p>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
                <h2 className="text-xl font-semibold">Project Insights</h2>
                <div>
                  <strong>Idea Summary: </strong>
                  <span>{project.idea_summary}</span>
                </div>
                <div>
                  <strong>Problem Solving: </strong>
                  <span>{project.problem_solving}</span>
                </div>
                <div>
                  <strong>Readiness Level: </strong>
                  <span>{project.readiness_level}</span>
                </div>
              </div>
{project.files && project.files.length > 0 && (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4 mt-6">
    <h2 className="text-xl font-semibold">Project Documents</h2>
    <ul className="divide-y divide-gray-200 dark:divide-gray-600">
      {project.files.map((file) => {
        const ext = file.name?.split(".").pop()?.toLowerCase();
        const icon = {
          pdf: "📄",
          pptx: "📊",
          docx: "📝",
          xlsx: "📈"
        }[ext] || "📁";
        return (
          <li key={file.id} className="py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <div>
                <div className="font-medium">{file.name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(file.uploaded_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>
            </div>
            <a
              href={file.file}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-4 py-1 text-sm"
            >
              Download
            </a>
          </li>
        );
      })}
    </ul>
  </div>
)}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">Investment Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Funding Goal</span>
                  <span className="font-bold text-right">${project.feasibility_study?.funding_required?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Funding</span>
                  <span className="font-bold text-right">${project.feasibility_study?.current_revenue?.toLocaleString()}</span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 shadow-inner">
  <div
    className="bg-green-500 h-4 rounded-full shadow-md transition-all duration-500 ease-in-out"
    style={{
      width: `${Math.min(
        ((project.feasibility_study?.current_revenue || 0) / (project.feasibility_study?.funding_required || 1)) * 100,
        100
      )}%`,
    }}
  ></div>
</div>
                <div className="text-center text-sm">
                  {Math.round(((project.feasibility_study?.current_revenue || 0) / (project.feasibility_study?.funding_required || 1)) * 100)}% funded
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 border-t border-gray-200 dark:border-gray-600 pt-4">
                <div>
                  <div className="text-xs text-gray-500">Min Investment</div>
                  <div className="font-semibold">${minInvestment.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Max Investment</div>
                  <div className="font-semibold">${maxInvestment.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Expected Return</div>
                  <div className="font-semibold text-green-600">{project.feasibility_study?.expected_profit_margin}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Timeline</div>
                  <div className="font-semibold">{project.feasibility_study?.roi_period_months} months</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Marketing Investment</div>
                  <div className="font-semibold">{project.feasibility_study?.marketing_investment_percentage}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Team Investment</div>
                  <div className="font-semibold">{project.feasibility_study?.team_investment_percentage}%</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-1">Growth Opportunity</div>
                <div className="text-sm">{project.feasibility_study?.growth_opportunity}</div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-4">

<button
  onClick={() => setShowDeleteModal(true)}
  className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all transform hover:scale-105 hover:from-red-600 hover:to-red-800 duration-200"
>
  Delete
</button>
</div>
            </div>

           <div className="card bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
  <div className="flex justify-between items-center mb-3">
    <h3 className="text-lg font-semibold">Recent Offers</h3>
   <button
   onClick={() => navigate(`/admin/offers?projectTitle=${encodeURIComponent(project.title)}`)}
  className="text-sm text-blue-600 hover:underline"
>
  View All
</button>

  </div>

  {recentOffers.length === 0 ? (
    <p className="text-sm text-gray-500">No recent offers.</p>
  ) : (
    <ul className="divide-y divide-gray-200 dark:divide-gray-600">
      {recentOffers.map((offer) => (
        <li key={offer.id} className="py-2">
          <div className="font-medium text-sm">{offer.investor_name} offered ${offer.amount}</div>
          <div className="text-xs text-gray-500">{offer.equity_percentage}% equity · {new Date(offer.created_at).toLocaleDateString()}</div>
        </li>
      ))}
    </ul>
  )}
</div>
          </div>
        </div>
      </div>

    {showOfferModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-lg max-h-[90vh] overflow-y-auto w-full max-w-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Edit Project Details</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const response = await fetch(`http://127.0.0.1:8000/adminAccounts/projects/${id}/`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
              body: JSON.stringify({
                title: project.title,
                description: project.description,
                idea_summary: project.idea_summary,
                problem_solving: project.problem_solving,
                category: project.category,
                readiness_level: project.readiness_level,
                status: project.status,
                feasibility_study: {
                  funding_required: project.feasibility_study?.funding_required,
                  current_revenue: project.feasibility_study?.current_revenue,
                  expected_profit_margin: project.feasibility_study?.expected_profit_margin,
                  roi_period_months: project.feasibility_study?.roi_period_months,
                  marketing_investment_percentage: project.feasibility_study?.marketing_investment_percentage,
                  team_investment_percentage: project.feasibility_study?.team_investment_percentage,
                  growth_opportunity: project.feasibility_study?.growth_opportunity,
                }
              }),
            });
            if (!response.ok) throw new Error("Failed to update project");
            setToast({ message: "Project updated successfully", type: "success" });
            setShowOfferModal(false);
            fetchProject(); 
          } catch (error) {
            setToast({ message: error.message, type: "error" });
          }
          setTimeout(() => setToast({ message: "", type: "" }), 3000);
        }}
        className="space-y-4"
      >
        {["title", "description", "idea_summary", "problem_solving", "category", "readiness_level"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1 capitalize">{field.replace("_", " ")}</label>
            <input
              type="text"
              className="input-field w-full"
              value={project[field] || ""}
              onChange={(e) => setProject({ ...project, [field]: e.target.value })}
              required
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="input-field w-full"
            value={project.status}
            onChange={(e) => setProject({ ...project, status: e.target.value })}
            required
          >
            <option value="active">Active</option>
            <option value="under_negotiation">Under Negotiation</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        {project.feasibility_study &&
          [
            "funding_required",
            "current_revenue",
            "expected_profit_margin",
            "roi_period_months",
            "marketing_investment_percentage",
            "team_investment_percentage",
            "growth_opportunity"
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1 capitalize">{field.replace(/_/g, " ")}</label>
              <input
                type={field.includes("percentage") || field.includes("margin") ? "number" : "text"}
                className="input-field w-full"
                value={project.feasibility_study[field] || ""}
                onChange={(e) =>
                  setProject({
                    ...project,
                    feasibility_study: {
                      ...project.feasibility_study,
                      [field]: e.target.value,
                    },
                  })
                }
                required
              />
            </div>
          ))}

        <div className="flex space-x-3 pt-4">
          <button type="button" onClick={() => setShowOfferModal(false)} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}
{showDeleteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h2>
      <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this project?</p>
      <div className="flex justify-end gap-3">
        <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100">Cancel</button>
        <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm">Yes, Delete</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default  AdminProjectDetails;