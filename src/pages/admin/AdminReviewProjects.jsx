"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Filter, FileSearch } from "lucide-react"
import Header from "../../components/common/Header"
const AdminReviewProjects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ status: "" })

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
    setLoading(true)
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const url = new URL("http://127.0.0.1:8000/adminAccounts/projects/")
        if (filters.status) {
          url.searchParams.append("status", filters.status)
        }

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        console.log("Projects Data:", data);
        setProjects(data)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [filters])

  const filteredProjects = projects.filter((project) =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div>

    <div className="w-full max-w-6xl -mt-10 px-2 py-6 md:py-8 flex items-center gap-4 bg-transparent">
  <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
    <FileSearch className="h-6 w-6" />
  </div>
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
      Review <span className="text-blue-600">Projects</span>
    </h1>
    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
  </div>
</div>
                <p className="text-m text-gray-500 -mt-6 px-16">All submited projects on the platform</p>
            </div>
        <div className="card mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow space-y-4 mt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                className="input-field pl-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 w-full py-3 h-12 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary inline-flex items-center justify-center px-5 py-4 h-12 text-base font-medium border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  className="input-field bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 w-full py-3 h-12 rounded-xl"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="under_negotiation">Under Negotiation</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          )}
        </div>
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading projects...</p>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="card bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:shadow-lg transition-shadow p-6 rounded-xl"
              >
                <div className="space-y-4">
                  <div className="relative">
              <img
  src={project.image_url || "/placeholder.svg"}
  alt={project.title}
  className="w-full h-48 object-cover rounded-lg"
/>
                  </div>

                  <h2 className="text-lg font-bold">{project.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status: {project.status}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category: {project.category}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Readiness Level: {project.readiness_level}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Created: {new Date(project.created_at).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Owner: {project.owner?.full_name || "N/A"}</p>
                 <div className="text-center mt-4">
  <Link
    to={`/admin/project/${project.id}`}
    className="btn-primary inline-block text-sm px-8 py-4 "
  >
    View Details
  </Link>
</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminReviewProjects
