"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Filter, FileSearch } from "lucide-react"
import { useLanguage } from "../../contexts/LanguageContext"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"

const BrowseProjects = () => {
  const { t, isRTL } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    category: "",
    readinessLevel: "",
    minAmount: "",
    maxAmount: "",
    maxRoiPeriod: "",
    sortBy: "newest",
  })

  const [showFilters, setShowFilters] = useState(false)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const params = new URLSearchParams()
        if (filters.category) params.append("category", filters.category)
        if (filters.readinessLevel) params.append("readiness_level", filters.readinessLevel)
        if (filters.minAmount) params.append("min_funding", filters.minAmount)
        if (filters.maxAmount) params.append("max_funding", filters.maxAmount)
        if (filters.maxRoiPeriod) params.append("max_roi_period", filters.maxRoiPeriod)
        if (filters.sortBy) params.append("sort_by", filters.sortBy)

        const url = `http://127.0.0.1:8000/investor/projects/filter/?${params.toString()}`

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        })
        const data = await response.json()
        setProjects(Array.isArray(data) ? data : data.results || [])
      } catch (error) {
        console.error("Error fetching filtered projects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [filters])

  const categories = [
    { value: "", label: "All Categories" },
    { value: "medical", label: "Medical" },
    { value: "general_trade", label: "General Trade" },
    { value: "construction", label: "Construction" },
    { value: "business", label: "Business" },
    { value: "other", label: "Other" },
  ]

  const handleFilterChange = (key, value) => {
    setLoading(true)
    setFilters({ ...filters, [key]: value })
  }

  const getImageUrl = (image) => {
    if (!image) return null
    if (image.startsWith("http")) return image
    return `http://127.0.0.1:8000${image}`
  }

  const placeholderImage = "/placeholder.svg"

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl -mt-10 px-2 py-6 md:py-8 flex items-center gap-4 bg-transparent">
          <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
            <FileSearch className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Browse <span className="text-blue-600">Projects</span>
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
          </div>
        </div>

        <p className="text-m text-gray-500 -mt-6 mb-6 px-16">Discover investment opportunities that match your interests</p>

        <div className="card mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className="input-field pl-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary inline-flex items-center">
                <Filter className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} /> Filters
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    className="input-field bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Amount</label>
                  <input
                    type="number"
                    className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    placeholder="0"
                    value={filters.minAmount}
                    onChange={(e) => handleFilterChange("minAmount", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Amount</label>
                  <input
                    type="number"
                    className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    placeholder="100000"
                    value={filters.maxAmount}
                    onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                  <select
                    className="input-field bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  >
                    <option value="newest">{t("newest")}</option>
                    <option value="rating">{t("highestRated")}</option>
                    <option value="funding">{t("mostFunded")}</option>
                    <option value="amount">Funding Goal</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

       {loading ? (
  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array(6).fill(0).map((_, i) => (
      <div
        key={i}
        className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow animate-pulse space-y-4"
      >
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mt-4"></div>
      </div>
    ))}
  </div>
) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => {
              const imgSrc = getImageUrl(project.image) || placeholderImage
              return (
                <div
                  key={project.id}
                  className="card bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:shadow-lg transition-shadow p-6 rounded-xl"
                >
                  <div className="relative mb-4">
                    <img
                      src={imgSrc}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = placeholderImage
                      }}
                    />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{project.title}</h2>

                    <div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{project.description}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Funding Progress</span>
                        <span className="font-medium">
                          ${project.feasibility_study?.current_revenue?.toLocaleString()} / ${project.feasibility_study?.funding_required?.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (project.feasibility_study?.current_revenue / project.feasibility_study?.funding_required) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Min Investment</span>
                        <div className="font-medium">${Math.round(project.feasibility_study?.funding_required / 10)?.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Expected Return</span>
                        <div className="font-medium text-green-600">{project.feasibility_study?.expected_profit_margin}</div>
                      </div>
                    </div>

                    <div className="justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-center mt-4">
                        <Link to={`/investor/project/${project.id}`} className="btn-primary text-sm px-8 py-4">
                          {t("viewDetails")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No projects found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  )
}

export default BrowseProjects
