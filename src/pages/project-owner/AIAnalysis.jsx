"use client";
import { useState, useEffect } from "react";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import axios from "axios";

const AIAnalysis = () => {
  const { t, isRTL } = useLanguage();
  const [selectedProject, setSelectedProject] = useState("");
  const [investmentDistribution, setInvestmentDistribution] = useState(null);
  const [investorInterest, setInvestorInterest] = useState(null);
  const [capitalRecovery, setCapitalRecovery] = useState(null);
  const [readinessAlignment, setReadinessAlignment] = useState(null);
  const [projects, setProjects] = useState([]);
  const [costRevenueData, setCostRevenueData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          "http://localhost:8000/projectowner/my-projects/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProjects(res.data);
        if (res.data.length > 0 && !selectedProject) {
          setSelectedProject(res.data[0].id.toString());
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const fetchReadinessAlignment = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/projectowner/project/${selectedProject}/readiness-alignment/`
        );
        setReadinessAlignment(response.data);
      } catch (error) {
        console.error("Failed to fetch readiness alignment", error);
        setReadinessAlignment(null);
      }
    };
    fetchReadinessAlignment();
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;
    const fetchAnalysis = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/projectowner/project/${selectedProject}/detailed-analysis/`
        );
        setAnalysisData({
          recommendations: [],
          offerAnalysis: {
            averageAmount: 0,
            averageOwnership: 0,
            recommendedAcceptance: [],
            riskOffers: [],
          },
          marketTrends: {
            growth: "N/A",
            sentiment: "N/A",
            competition: "N/A",
            timing: "N/A",
          },
          ...response.data,
        });
      } catch (error) {
        console.error("Failed to fetch analysis data", error);
        setAnalysisData(null);
      }
    };
    fetchAnalysis();
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;
    const fetchCapitalRecovery = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/projectowner/project/${selectedProject}/capital-recovery-health/`
        );
        setCapitalRecovery(response.data);
      } catch (error) {
        console.error("Failed to fetch capital recovery data", error);
        setCapitalRecovery(null);
      }
    };
    fetchCapitalRecovery();
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;
    const fetchCostRevenue = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/projectowner/project/${selectedProject}/cost-to-revenue-analysis/`
        );
        setCostRevenueData(response.data);
      } catch (error) {
        console.error("Failed to fetch cost-to-revenue analysis", error);
        setCostRevenueData(null);
      }
    };
    fetchCostRevenue();
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;
    const fetchInvestmentDistribution = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/projectowner/project/${selectedProject}/investment-distribution/`
        );
        setInvestmentDistribution(response.data);
      } catch (error) {
        console.error("Failed to fetch investment distribution", error);
        setInvestmentDistribution(null);
      }
    };
    fetchInvestmentDistribution();
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;
    const fetchInvestorInterest = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/projectowner/project/${selectedProject}/investor-interest/`
        );
        setInvestorInterest(response.data);
      } catch (error) {
        console.error("Failed to fetch investor interest", error);
        setInvestorInterest(null);
      }
    };
    fetchInvestorInterest();
  }, [selectedProject]);

  const getRecommendationIcon = (type) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "risk":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "improvement":
        return <Target className="w-5 h-5 text-blue-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-center flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-300 text-lg">Loading analysis...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl -mt-10 px-2 py-6 md:py-8 flex items-center gap-4 bg-transparent">
          <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Data <span className="text-blue-600">Analysis</span>
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
          </div>
        </div>
        <div className="card mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow transition-colors">
          <div className="flex items-center space-x-4">
            <Brain className="w-6 h-6 text-primary-600 flex-shrink-0" />
            <div className="flex-1">
              <label
                htmlFor="project-select"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Select Project for Analysis
              </label>
              <select
                id="project-select"
                className="input-field w-full max-w-md"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow transition-colors">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <div
              className={`text-3xl font-bold mb-2 ${getScoreColor(
                analysisData.overall_score
              )}`}
            >
              {analysisData.overall_score}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Overall Score
            </div>
          </div>
          <div className="card text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow transition-colors">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div
              className={`text-3xl font-bold mb-2 ${getScoreColor(
                analysisData.market_potential
              )}`}
            >
              {analysisData.market_potential}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Market Potential
            </div>
          </div>
          <div className="card text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow transition-colors">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <div
              className={`text-3xl font-bold mb-2 ${getScoreColor(
                analysisData.risk_assessment
              )}`}
            >
              {analysisData.risk_assessment}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Risk Assessment
            </div>
          </div>
          <div className="card text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow transition-colors">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <div
              className={`text-3xl font-bold mb-2 ${getScoreColor(
                analysisData.competitive_edge
              )}`}
            >
              {analysisData.competitive_edge}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Competitive Edge
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {readinessAlignment && (
              <div className="card mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow transition-colors">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Project Readiness Alignment
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-gray-600 dark:text-gray-300">Readiness Level</span>
                    <span className="font-medium capitalize text-gray-900 dark:text-white">
                      {readinessAlignment.readiness_level}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-gray-600 dark:text-gray-300">Readiness Score</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {readinessAlignment.readiness_score}/100
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    {readinessAlignment.analysis}
                  </p>
                </div>
              </div>
            )}
            {costRevenueData && (
              <div className="card mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow transition-colors">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Cost to Revenue Analysis
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-gray-600 dark:text-gray-300">Funding Required</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${costRevenueData.funding_required?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-gray-600 dark:text-gray-300">Expected Annual Profit</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${costRevenueData.expected_annual_profit?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-gray-600 dark:text-gray-300">ROI Period</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {costRevenueData.roi_period_months} months
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-gray-600 dark:text-gray-300">Capital Recovery Speed</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {costRevenueData.capital_recovery_speed_years
                        ? `${costRevenueData.capital_recovery_speed_years.toFixed(2)} years`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-gray-600 dark:text-gray-300">Profitability</span>
                    <span
                      className={`font-medium ${
                        costRevenueData.is_profitable
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {costRevenueData.is_profitable ? "Profitable" : "Not Profitable"}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">AI Analysis</h3>
                  <ul className="list-disc list-inside space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    {costRevenueData.analysis_messages.map((msg, idx) => (
                      <li key={idx}>{msg}</li>
                    ))}
                  </ul>
                </div>

                {costRevenueData.recommendations && costRevenueData.recommendations.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">AI Recommendations</h3>
                    <ul className="list-disc list-inside space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      {costRevenueData.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
            {investmentDistribution && (
              <div className="card mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow transition-colors">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Investment Distribution
                </h2>
                <div className="space-y-4">
                  {"team_percentage" in investmentDistribution && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <span className="text-gray-600 dark:text-gray-300">Team Investment %</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {investmentDistribution.team_percentage}%
                      </span>
                    </div>
                  )}
                  {"marketing_percentage" in investmentDistribution && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <span className="text-gray-600 dark:text-gray-300">Marketing Investment %</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {investmentDistribution.marketing_percentage}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {investmentDistribution.investment_distribution}
                  </p>
                </div>
              </div>
            )}
            {investorInterest && (
              <div className="card mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow transition-colors">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Investor Interest
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-gray-600 dark:text-gray-300">Total Offers</span>
                    <span className="font-medium text-gray-900 dark:text-white">{investorInterest.total_offers}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-gray-600 dark:text-gray-300">Accepted Offers</span>
                    <span className="font-medium text-green-600">{investorInterest.accepted_offers}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-gray-600 dark:text-gray-300">Rejected Offers</span>
                    <span className="font-medium text-red-600">{investorInterest.rejected_offers}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-gray-600 dark:text-gray-300">Total Negotiations</span>
                    <span className="font-medium text-gray-900 dark:text-white">{investorInterest.total_negotiations}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-gray-600 dark:text-gray-300">Unique Investors</span>
                    <span className="font-medium text-gray-900 dark:text-white">{investorInterest.unique_investors}</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    {investorInterest.interest_level}
                  </p>
                </div>
              </div>
            )}
            {capitalRecovery && (
              <div className="card mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow transition-colors">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Capital Recovery Analysis
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-gray-600 dark:text-gray-300">Expected Monthly Revenue</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${capitalRecovery.expected_monthly_revenue?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-gray-600 dark:text-gray-300">Funding Required</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${capitalRecovery.funding_required?.toLocaleString()}
                    </span>
                  </div>
                  {capitalRecovery.calculated_roi_months !== null && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <span className="text-gray-600 dark:text-gray-300">Calculated ROI Period</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {capitalRecovery.calculated_roi_months} months
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    {capitalRecovery.capital_recovery_health}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="card mt-8 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow transition-colors">
          <div className="flex items-start space-x-4">
            <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                AI Analysis Disclaimer
              </h3>
              <p className="text-blue-800 dark:text-blue-300 text-sm leading-relaxed">
                This analysis is generated by AI and should be used as a guide only.
                Always conduct your own due diligence and consult with financial
                advisors before making investment decisions. Market conditions and
                investor behavior can change rapidly.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AIAnalysis;