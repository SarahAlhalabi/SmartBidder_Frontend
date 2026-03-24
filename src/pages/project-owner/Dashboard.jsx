"use client"

import { Link } from "react-router-dom"
  import { Progress } from "../../../components/ui/progress"
import {
  Plus,
  TrendingUp,
  MessageSquare,
  Users,
  Brain,
  BarChart3,
  ArrowUpRight,
  Activity,
  Target,
  Zap,
  Bot,
  LineChart,
  BarChart2,
  ShieldCheck,
  Clock,
  BellDot
} from "lucide-react"
import axios from "axios"
import { useEffect, useState } from "react"
import { useLanguage } from "../../contexts/LanguageContext"
import { useAuth } from "../../contexts/AuthContext"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"

const StatsCard = ({ title, value, color, Icon, note }) => (
  <div className={`group stats-card border-l-4 border-l-${color}-500 bg-white dark:bg-gray-800 rounded-xl shadow p-5 transition-all duration-300 hover:shadow-xl hover:border-l-${color}-700`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 group-hover:text-${color}-700 dark:group-hover:text-${color}-400 transition-colors duration-200`}>{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        {note && <p className={`text-sm text-${color}-600 dark:text-${color}-400 flex items-center mt-1`}>{note}</p>}
      </div>
      <div className={`p-3 bg-${color}-100 dark:bg-${color}-900/30 rounded-xl`}>
        <Icon className={`w-8 h-8 text-${color}-600 dark:text-${color}-400`} />
      </div>
    </div>
  </div>
)

const ProjectOwnerDashboard = () => {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()

  const [stats, setStats] = useState({
    activeProjects: 0,
    totalFunding: 0,
    totalInvestors: 0,
    pendingOffers: 0,
  })

  const [recentProjects, setRecentProjects] = useState([])
const [loadingProjects, setLoadingProjects] = useState(true)
const [notifications, setNotifications] = useState([])
const [loadingNotifications, setLoadingNotifications] = useState(true)

  const quickActions = [
    { title: t("createProject"), description: "Start a new project", icon: Plus, link: "/project-owner/create-project", color: "from-emerald-500 to-emerald-600" },
    { title: t("myProjects"), description: "Manage existing projects", icon: BarChart3, link: "/project-owner/projects", color: "from-sky-500 to-sky-600" },
    { title: t("investmentOffers"), description: "Review investment offers", icon: TrendingUp, link: "/project-owner/offers", color: "from-indigo-500 to-indigo-600" },
    { title: t("messages"), description: "Investor communication", icon: MessageSquare, link: "/project-owner/messages", color: "from-orange-500 to-orange-600" },
    { title: t("topInvestors"), description: "View investor leaderboard", icon: Users, link: "/project-owner/leaderboard", color: "from-blue-500 to-blue-600" },
    { title: t("Data Analysis"), description: "Actionable data insights", icon: BarChart3, link: "/project-owner/ai-analysis", color: "from-purple-500 to-purple-600" },
  ]

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await axios.get("http://127.0.0.1:8000/projectowner/dashboard/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStats({
          activeProjects: res.data.active_projects_count,
          totalFunding: parseFloat(res.data.total_funding_required),
          totalInvestors: res.data.total_investors_connected,
          pendingOffers: res.data.pending_offers,
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      }
    }
    fetchDashboardStats()
  }, [])
useEffect(() => {
  const fetchRecentProjects = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const res = await axios.get("http://127.0.0.1:8000/projectowner/my-projects/", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const recent = res.data
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3)
        .map((proj) => ({
          id: proj.id,
          title: proj.title,
          status: proj.status,
          funding: proj.feasibility_study?.funding_required * 0.7 || 0,
          goal: proj.feasibility_study?.funding_required || 100000,
          category: proj.category || "General",
          investors: proj.investors_count || 0,
          daysLeft: proj.days_left || 30, 
        }))

      setRecentProjects(recent)
    } catch (error) {
      console.error("Error fetching recent projects:", error)
    } finally {
      setLoadingProjects(false)
    }
  }

  fetchRecentProjects()
}, [])
useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const res = await axios.get("http://127.0.0.1:8000/accounts/notifications/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setNotifications(res.data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoadingNotifications(false)
    }
  }

  fetchNotifications()
}, [])


  return (
    
   <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <Header />
       <header className="relative overflow-hidden py-16 px-6 md:px-10 lg:px-16 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-900 w-full max-w-none mb-2">

  <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
    <div className="flex flex-col h-[240px] ">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500">
          <BarChart2 className="h-6 w-6 text-white" />
        </div>
        <span className="text-sm font-semibold uppercase text-blue-700 tracking-wider">Dashboard</span>
      </div>
     <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
  {user?.full_name || user?.username || "User"} Dashboard
</h1>

      <p className="text-lg text-gray-700 mb-6 max-w-2xl">
        Stay in control of your <span className="text-blue-700 font-medium">Project Funding</span> platform.
      </p>
      <div className="flex flex-wrap gap-20 text-gray-700 text-lg mt-8">
  <div className="flex items-center gap-2">
    <Users className="h-6 w-6 text-blue-600" />
    <span className="font-semibold">{stats.activeProjects} Active Projects</span>
  </div>
  <div className="flex items-center gap-2 text-green-700">
    <ArrowUpRight className="h-6 w-6" />
    <span className="font-semibold">+{Math.round((stats.totalFunding / 1000000) * 100) / 100}M Total Funding</span>
  </div>
  <div className="flex items-center gap-2 text-purple-700">
    <Users className="h-6 w-6" />
    <span className="font-semibold">{stats.totalInvestors} Total Investors</span>
  </div>
  <div className="flex items-center gap-2 text-orange-700">
    <MessageSquare className="h-6 w-6" />
    <span className="font-semibold">{stats.pendingOffers} Pending Offers</span>
  </div>
</div>

    </div>

   
  </div>
</header>
      <div className="main-content px-4 md:px-8 xl:px-16 py-8">

      <div className="mb-8">
 <div className="w-full max-w-6xl -mt-14 px-2 py-6 md:py-8 flex items-center gap-4 bg-transparent">
  <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
    <Zap className="h-6 w-6" />
  </div>
  <div>
    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
      Quick <span className="text-blue-600">Actions</span>
    </h1>
    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
  </div>
</div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {quickActions.map((action, index) => (
      <Link key={index} to={action.link} className="card-hover group">
        <div className="flex items-center">
          <div
            className={`p-4 bg-gradient-to-r ${action.color} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}
          >
            <action.icon className="w-8 h-8 text-white" />
          </div>
          <div className={`${isRTL ? "mr-4" : "ml-4"} flex-1`}>
            <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
              {action.title}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{action.description}</div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </div>
      </Link>
    ))}
  </div>
</div>

        
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
  <div className="xl:col-span-2">
    <div className="card bg-white dark:bg-gray-800 p-6 rounded-xl shadow h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="w-full max-w-6xl -mt-2 px-2 py-6 md:py-0 flex items-center gap-4 bg-transparent">
  <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
    <Clock className="h-6 w-6" />
  </div>
  <div>
    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
      Recent <span className="text-blue-600">Projects</span>
    </h1>
    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
  </div>
</div>
        <Link
          to="/project-owner/projects"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center"
        >
          View All <ArrowUpRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
     <div
  className={`space-y-6  ${
    recentProjects.length > 2 ? "max-h-[500px] pr-2" : ""
  }`}
>

        {!loadingProjects && recentProjects.map((project) => (

          <div
            key={project.id}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{project.title}</h4>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                    {project.category}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{project.investors} investors</span>
                  <span>•</span>
                  <span>{project.daysLeft} days left</span>
                </div>
              </div>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  project.status === "active"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                    : project.status === "negotiation"
                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                    : "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300"
                }`}
              >
                {t(project.status)}
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Funding Progress</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  ${project.funding.toLocaleString()} / ${project.goal.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(project.funding / project.goal) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {Math.round((project.funding / project.goal) * 100)}% funded
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  ${(project.goal - project.funding).toLocaleString()} remaining
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  <div className="xl:col-span-1">
    <div className="flex flex-col gap-4 h-full">
      <div className="card bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-200 dark:border-pink-800 p-6 rounded-xl shadow min-h-[240px]">

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
            <LineChart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          </div>
          <h3 className="text-lg font-bold text-pink-900 dark:text-pink-100">Actionable data insights</h3>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-pink-900 dark:text-pink-100">Optimization Tip</span>
            </div>
            <p className="text-sm text-pink-800 dark:text-pink-200">
              Consider adding more project milestones to increase investor confidence by 23%
            </p>
          </div>
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-pink-900 dark:text-pink-100">Market Trend</span>
            </div>
            <p className="text-sm text-pink-800 dark:text-pink-200">
              Tech projects similar to yours are seeing 15% higher funding rates this month
            </p>
          </div>
        </div>
        <Link
          to="/project-owner/ai-analysis"
          className="btn-primary w-full mt-4 text-sm py-2 flex items-center justify-center space-x-2"
        >
          <Brain className="w-4 h-4" />
          <span>View Full Analysis</span>
        </Link>
      </div>

    <div className="card bg-white dark:bg-gray-800 p-6 rounded-xl shadow  ">
  <div className="flex items-center justify-between mb-6">
      <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
    <BellDot className="h-6 w-6" />
  </div>
  <div>
    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
      Notificatons
    </h1>
    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
  
  </div>
    <Link
      to="/project-owner/notifications"
      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
    >
      View All
    </Link>
  </div>

  <div
  className={`space-y-4 transition-all duration-300 ${
    notifications.length === 1
      ? "h-[90px]"
      : notifications.length === 2
      ? "h-[320px]"
      : notifications.length >= 3
      ? "h-[320px] overflow-y-auto"
      : "h-[80px]"
  }`}
>

    {loadingNotifications ? (
      <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
    ) : notifications.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400 text-sm">No notifications available.</p>
    ) : (
      notifications.slice(0, 3).map((notif, index) => (
        <div
          key={index}
          className="flex items-start space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 animate-pulse"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {notif.message}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {notif.created_at ? new Date(notif.created_at).toLocaleString() : "No date"}
            </p>
          </div>
        </div>
      ))
    )}
  </div>
</div>


    </div>
  </div>
</div>
</div>

<Footer />
</div>

)
}
export default ProjectOwnerDashboard
