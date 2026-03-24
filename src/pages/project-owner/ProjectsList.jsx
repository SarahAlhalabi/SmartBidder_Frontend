  "use client"

  import { useEffect, useState } from "react"
  import { Link } from "react-router-dom"
  import { Plus, Search,  Eye, Edit, ClipboardList, Edit3 } from "lucide-react"
  import axios from "axios"
  import { useLanguage } from "../../contexts/LanguageContext"
  import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
  const ProjectsList = () => {
    const { t, isRTL } = useLanguage()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [projects, setProjects] = useState([])
    const [editingProject, setEditingProject] = useState(null)
  const [viewingProject, setViewingProject] = useState(false) 
  const [projectDetails, setProjectDetails] = useState(null)  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    idea_summary: "",
    problem_solving: "",
    category: "",
    readiness_level: "",
    status: "",
    feasibility_study: {
      current_revenue: "",
      funding_required: "",
      marketing_investment_percentage: "",
      team_investment_percentage: "",
      expected_monthly_revenue: "",
      roi_period_months: "",
      expected_profit_margin: "",
      growth_opportunity: "",
    },
  })


   const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const res = await axios.get("http://localhost:8000/projectowner/my-projects/", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const projectsList = res.data

      const detailedProjects = await Promise.all(
        projectsList.map(async (project) => {
          try {
            const detailRes = await axios.get(
              `http://127.0.0.1:8000/projectowner/my-projectss/${project.id}/`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
            return {
              ...project,
              time_left_to_auto_close: detailRes.data.time_left_to_auto_close,
            }
          } catch {
            return project
          }
        })
      )

      setProjects(detailedProjects)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  fetchProjects()
}, [])


  const fetchProjectDetails = async (projectId) => {
    try {
      const token = localStorage.getItem("accessToken")
      const res = await axios.get(`http://127.0.0.1:8000/projectowner/my-projectss/${projectId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProjectDetails(res.data)
      setViewingProject(true)
    } catch (err) {
      console.error("Error fetching project details", err)
      alert("Failed to load project details")
    }
  }

    const handleEdit = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        await axios.patch(
    `http://127.0.0.1:8000/projectowner/my-projects/${editingProject.id}/`,
    formData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )

        alert("Project updated successfully!")
        setEditingProject(null)
        window.location.reload()
      } catch (error) {
        console.error("Error updating project:", error)
        alert("Failed to update project.")
      }
    }

    const filteredProjects = projects.filter((project) => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || project.status === statusFilter
      return matchesSearch && matchesStatus
    })

    const getStatusColor = (status) => {
      switch (status) {
        case "active":
          return "bg-green-100 text-green-800"
        case "negotiation":
          return "bg-yellow-100 text-yellow-800"
        case "closed":
          return "bg-gray-100 text-gray-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
             <div>

    <div className="w-full max-w-6xl -mt-10 px-2 py-6 md:py-8 flex items-center gap-4 bg-transparent">
  <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
    <ClipboardList  className="h-6 w-6" />
  </div>
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
      My <span className="text-blue-600">Projects</span>
    </h1>
    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
  </div>
</div>
                <p className="text-m text-gray-500 -mt-6 mb-6 px-16">Manage and track your projects</p>
            </div>
            <Link to="/project-owner/create-project" className="btn-primary inline-flex items-center">
              <Plus className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              {t("createProject")}
            </Link>
          </div>

          <div className="card mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 p-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="input-field pl-10 dark:bg-gray-900 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="sm:w-48">
                <select
                  className="input-field dark:bg-gray-900 dark:text-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">{t("active")}</option>
                  <option value="negotiation">{t("negotiation")}</option>
                  <option value="closed">{t("closed")}</option>
                </select>
              </div>
            </div>
          </div>

     {loading ? (
  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array(6).fill(0).map((_, i) => (
      <div
        key={i}
        className="h-[450px] bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
      ></div>
    ))}
  </div>
) : (
  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
    {filteredProjects.map((project) => (
      <div
        key={project.id}
        className="card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white flex flex-col h-[450px] p-6"
      >
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  project.status
                )}`}
              >
                {t(project.status)}
              </span>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {project.description}
          </p>

          <div className="text-sm space-y-2">
            <div>
              <strong>Category:</strong> {project.category}
            </div>
            <div>
              <strong>Idea:</strong> {project.idea_summary}
            </div>
            <div>
              <strong>Problem:</strong> {project.problem_solving}
            </div>
          </div>

          {project.time_left_to_auto_close && (
            <div className="mt-3">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  project.time_left_to_auto_close.includes("day(s)")
                    ? parseInt(project.time_left_to_auto_close) <= 3
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                ⏳ Auto-close: {project.time_left_to_auto_close}
              </span>
            </div>
          )}
        </div>

        <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <button
            onClick={() => fetchProjectDetails(project.id)}
            className="flex-1 btn-secondary text-sm py-2 inline-flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </button>

          <button
            onClick={() => {
              setEditingProject(project);
              setFormData({
                title: project.title,
                description: project.description,
                idea_summary: project.idea_summary,
                problem_solving: project.problem_solving,
                category: project.category || "",
                readiness_level: project.readiness_level || "",
                status: project.status || "",
                feasibility_study: project.feasibility_study || {
                  current_revenue: "",
                  funding_required: "",
                  marketing_investment_percentage: "",
                  team_investment_percentage: "",
                  expected_monthly_revenue: "",
                  roi_period_months: "",
                  expected_profit_margin: "",
                  growth_opportunity: "",
                },
              });
            }}
            className="flex-1 btn-primary text-sm py-2 inline-flex items-center justify-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
      </div>
    ))}
  </div>
)}


        </div>

        {editingProject && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
               <div>

    <div className="w-full max-w-6xl -mt-10 px-2 py-6 md:py-8 flex items-center gap-4 bg-transparent">
  <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
    <Edit3  className="h-4 w-4" />
  </div>
  <div>
    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"> Edit </h1>
    <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
  </div>
</div>
            </div>

              <label className="block text-sm font-medium mb-1">Title</label>
              <input className="input-field mb-3" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />

              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea className="input-field mb-3" rows="2" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

              <label className="block text-sm font-medium mb-1">Idea Summary</label>
              <input className="input-field mb-3" value={formData.idea_summary} onChange={(e) => setFormData({ ...formData, idea_summary: e.target.value })} />

              <label className="block text-sm font-medium mb-1">Problem Solving</label>
              <input className="input-field mb-4" value={formData.problem_solving} onChange={(e) => setFormData({ ...formData, problem_solving: e.target.value })} />
  <label className="block text-sm font-medium mb-1">Category</label>
  <select
    className="input-field mb-3"
    value={formData.category}
    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
  >
    <option value="medical">Medical</option>
    <option value="general_trade">General Trade</option>
    <option value="construction">Construction</option>
    <option value="business">Business</option>
    <option value="other">Other</option>
  </select>

  <label className="block text-sm font-medium mb-1">Readiness Level</label>
  <select
    className="input-field mb-3"
    value={formData.readiness_level}
    onChange={(e) => setFormData({ ...formData, readiness_level: e.target.value })}
  >
    <option value="idea">Idea</option>
    <option value="prototype">Prototype</option>
    <option value="existing">Existing Project</option>
  </select>

  <label className="block text-sm font-medium mb-1">Status</label>
  <select
    className="input-field mb-3"
    value={formData.status}
    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
  >
    <option value="active">Active</option>
    <option value="under_negotiation">Under Negotiation</option>
    <option value="closed">Closed</option>
  </select>

              <h3 className="text-lg font-semibold mt-6 mb-3">Feasibility Study</h3>

             {Object.entries(formData.feasibility_study)
  .filter(([key]) => key !== "id")
  .map(([key, value]) => (
    <div key={key}>
      <label className="block text-sm font-medium capitalize mb-1">
        {key.replace(/_/g, " ")}
      </label>
      <input
        className="input-field"
        value={value}
        onChange={(e) =>
          setFormData({
            ...formData,
            feasibility_study: {
              ...formData.feasibility_study,
              [key]: e.target.value,
            },
          })
        }
      />
    </div>
))}

              <div className="flex justify-end space-x-2 mt-4">
                <button className="btn-secondary" onClick={() => setEditingProject(null)}>Cancel</button>
                <button className="btn-primary" onClick={handleEdit}>Save</button>
              </div>
            </div>
          </div>
        )}
  {viewingProject && projectDetails && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
          📘 Project Details
        </h2>
        <button
          onClick={() => setViewingProject(false)}
          className="text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg"
        >
          ✕
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4">General Info</h3>
          <ul className="space-y-3 text-gray-800 dark:text-gray-200 text-sm">
            <li><span className="font-medium">Title:</span> {projectDetails.title}</li>
            <li><span className="font-medium">Category:</span> {projectDetails.category}</li>
            <li><span className="font-medium">Status:</span> {projectDetails.status}</li>
            <li><span className="font-medium">Readiness:</span> {projectDetails.readiness_level}</li>
          </ul>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-4">Summary</h3>
          <ul className="space-y-3 text-gray-800 dark:text-gray-200 text-sm">
            <li><span className="font-medium">Idea:</span> {projectDetails.idea_summary}</li>
            <li><span className="font-medium">Problem:</span> {projectDetails.problem_solving}</li>
            <li><span className="font-medium">Created:</span> {new Date(projectDetails.created_at).toLocaleDateString()}</li>
            <li><span className="font-medium">Updated:</span> {new Date(projectDetails.updated_at).toLocaleDateString()}</li>
          </ul>
        </div>
      </div>
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-4 flex items-center gap-2">
          📊 Feasibility Study
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-800 dark:text-gray-200">
         {Object.entries(projectDetails.feasibility_study)
  .filter(([key]) => key !== "id")
  .map(([key, value]) => (
    <div key={key}>
      <span className="block text-gray-500 dark:text-gray-400 capitalize mb-1">
        {key.replace(/_/g, " ")}
      </span>
      <span className="font-semibold text-blue-700 dark:text-blue-400">{value}</span>
    </div>
))}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setViewingProject(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-xl"
        >
          Close
        </button>
      </div>
    </div>
  </div>

  )}
<Footer />

      </div>
    )
  }

  export default ProjectsList
