"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer"
const ProjectDetails = () => {
  const { t, isRTL } = useLanguage();
  const { id } = useParams();
   console.log("Project ID from URL:", id);
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "" }); 
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerData, setOfferData] = useState({ amount: "", ownership: "", terms: "" });
  const fundingRequired = project?.feasibility_study?.funding_required || 0;
  const minInvestment = Math.round(fundingRequired * 0.1);
  const maxInvestment = Math.round(fundingRequired * 0.5);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/investor/projects/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to load project");

        const data = await response.json();
        data.files = [
          {
            id: 1,
            name: "Business Plan.pdf",
            file: "https://example.com/sample.pdf",
            uploaded_at: "2025-06-16T12:00:00Z",
          },
          {
            id: 2,
            name: "Pitch Deck.pptx",
            file: "https://example.com/deck.pptx",
            uploaded_at: "2025-06-15T10:30:00Z",
          },
        ];

        setProject(data);
      } catch (error) {
        console.error("Error loading project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const getRiskColor = (risk) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  if (loading) return <p className="text-center text-gray-500">Loading project...</p>;
  if (!project) return <p className="text-center text-red-500">Project not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Header />

      {toast.message && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 text-sm transition-all duration-300 ${
            toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className={`inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors mb-6 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
          Back to Projects
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
<div className="w-full aspect-w-16 aspect-h-9 mb-6 rounded-lg overflow-hidden">
  <img
    src={project.image_url || "/placeholder.svg"}
    alt={project.title}
    className="w-full h-full object-cover"
  />
</div>



              <h1 className="text-3xl font-bold mb-1 relative">
                {project.title}
                <span className="block w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mt-1 rounded-full"></span>
              </h1>

              <h2 className="text-md text-gray-600 dark:text-gray-400 mb-2">
                Owner:{" "}
                <span className="font-medium text-gray-800 dark:text-gray-200">{project.owner_name}</span>
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
                        xlsx: "📈",
                      }[ext] || "📁";

                      return (
                        <li key={file.id} className="py-3 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{icon}</span>
                            <div>
                              <div className="font-medium">{file.name}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(file.uploaded_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
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
                  <span className="font-bold text-right">
                    ${project.feasibility_study?.funding_required?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Current Funding</span>
                  <span className="font-bold text-right">
                    ${project.feasibility_study?.current_revenue?.toLocaleString()}
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 shadow-inner">
                  <div
                    className="bg-green-500 h-4 rounded-full shadow-md transition-all duration-500 ease-in-out"
                    style={{
                      width: `${Math.min(
                        ((project.feasibility_study?.current_revenue || 0) / (project.feasibility_study?.funding_required || 1)) *
                          100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>

                <div className="text-center text-sm">
                  {Math.round(
                    ((project.feasibility_study?.current_revenue || 0) / (project.feasibility_study?.funding_required || 1)) * 100
                  )}
                  % funded
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

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button onClick={() => setShowOfferModal(true)} className="btn-primary w-full">
                  {t("submitOffer")}
                </button>
              </div>
            </div>

            <div className="card bg-yellow-50 dark:bg-yellow-100/10 border border-yellow-200 dark:border-yellow-700 p-4 rounded-xl">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1 mr-2" />
                <div>
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-200 mb-1">Investment Risk</h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    All investments carry risk. Please review all project documents and conduct your own due diligence before investing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t("submitOffer")}</h3>
            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("offerAmount")} (USD)</label>
                <input
                  type="number"
                  required
                  min={minInvestment}
                  max={maxInvestment}
                  className="input-field"
                  value={offerData.amount}
                  onChange={(e) => setOfferData({ ...offerData, amount: e.target.value })}
                  placeholder={`${minInvestment} - ${maxInvestment}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("offerOwnership")} (%)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="49"
                  className="input-field"
                  value={offerData.ownership}
                  onChange={(e) => setOfferData({ ...offerData, ownership: e.target.value })}
                  placeholder="5-25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("additionalTerms")} (Optional)</label>
                <textarea
                  rows={3}
                  className="input-field"
                  value={offerData.terms}
                  onChange={(e) => setOfferData({ ...offerData, terms: e.target.value })}
                  placeholder="Any additional terms or conditions..."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowOfferModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {t("submitOfferButton")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default ProjectDetails;
