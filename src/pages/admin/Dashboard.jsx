"use client"
import { useLanguage } from "../../contexts/LanguageContext"
import { useAuth } from "../../contexts/AuthContext"
import { Card, CardContent } from "../../../components/ui/card"
import {
  Users,
  BarChart3,
  BarChart2,
  TrendingUp,
  Shield,
  Activity,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Target,
  ArrowDownRight,
  BellDot
} from "lucide-react"
import Header from "../../components/common/Header"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

const AdminDashboard = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adminNotifications, setAdminNotifications] = useState([])

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await axios.get("http://127.0.0.1:8000/adminAccounts/dashboard-stats/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStats(res.data)
        setError(null)
      } catch {
        setError("Failed to load dashboard stats")
      } finally {
        setLoading(false)
      }
    }
    fetchMetrics()
  }, [])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await axios.get("http://127.0.0.1:8000/accounts/notifications/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setAdminNotifications(res.data.slice(0, 5))
      } catch (err) {
        console.error("Failed to fetch notifications", err)
      }
    }
    fetchNotifications()
  }, [])

  if (loading) return <p>Loading stats...</p>
  if (error) return <p className="text-red-600">{error}</p>

  const metrics = stats ? [
    {
      metric: "Total Users",
      value: stats.total_users.toLocaleString(),
      note: "+23 this week",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-blue-600 bg-blue-50",
      percentage: "+1.9%",
    },
    {
      metric: "Active Projects",
      value: stats.active_projects.toLocaleString(),
      note: "Currently funding",
      trend: "neutral",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600 bg-purple-50",
      percentage: "0%",
    },
    {
      metric: "Total Investments",
      value: stats.total_investments.toLocaleString(),
      note: "Platform volume",
      trend: "up",
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600 bg-emerald-50",
      percentage: "+12.5%",
    },
    {
      metric: "Success Rate",
      value: stats.success_rate_percent + "%",
      note: "Funded projects",
      trend: "up",
      icon: Target,
      color: "from-orange-500 to-orange-600 bg-orange-50",
      percentage: "+3.2%",
    },
  ] : []
    const managementSections = [
      {
        title: "User Management",
        description: "Manage investors and project owners",
        icon: Users,
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        actions: [
          { name: "Manage Investors", description: "View and manage investor accounts", count: 847 },
          { name: "Manage Project Owners", description: "View and manage project owner accounts", count: 400 }
        ]
      },
      {
        title: "Project Management",
        description: "Review and monitor projects",
        icon: BarChart3,
        color: "from-green-500 to-green-600",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        actions: [
          { name: "Review Projects", description: "browse projects ", count: stats.projectsAwaitingApproval },
          { name: "Monitor Activity", description: "Track platform activity ", count: stats.activeProjects }
        ]
      },
      {
        title: "Content Moderation",
        description: "Review  violations",
        icon: Shield,
        color: "from-red-500 to-red-600",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        actions: [
        
          { name: "Violation Reports", description: "Handle platform violation reports", count: 7 }
        ]
      }
    ]

    const getStatusIcon = (status) => {
      switch (status) {
        case "success": return <CheckCircle className="w-4 h-4 text-green-500" />
        case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />
        case "error": return <AlertTriangle className="w-4 h-4 text-red-500" />
        default: return <Activity className="w-4 h-4 text-blue-500" />
      }
    }

    const getStatusBg = (status) => {
      switch (status) {
        case "success": return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
        case "warning": return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
        case "error": return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        default: return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
      }
    }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden mb-12">
    <div
      className="absolute inset-0 opacity-20 pointer-events-none"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        backgroundRepeat: "repeat",
      }}
    />
    <div className="relative w-full px-4 lg:px-20 py-20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="flex-1 ">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Dashboard</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">Admin Dashboard</h1>
<p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
  <span className="text-white font-semibold">{user?.name}</span>. Stay in control of the{" "}
  <span className="text-blue-400 font-semibold">Smart Bidder</span> platform.
</p>

          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex items-center gap-2 text-slate-300">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm">69 Active Users</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-sm">+3% This Week</span>
            </div>
          </div>
        </div>
        <div className="lg:flex-shrink-0">
        </div>
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
  </div>
        <div className="container-full">
          <div className="main-content">
<div className="w-full max-w-6xl -mt-20 px-6 py-6 md:py-8 flex items-center gap-5 bg-transparent">
  <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
    <BarChart2 className="h-6 w-6" />
  </div>
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
      Platform <span className="text-blue-600">Insights</span> Overview
    </h1>
    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
   
  </div>
</div>

<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-12 transform scale-95">
  <div className="bg-gradient-to-r from-[#1e3a8a] via-[#1e40af] to-[#0f766e] px-8 py-6 shadow-md hover:shadow-xl transition-shadow duration-500">
    <div className="grid grid-cols-12 gap-6 items-center">
      <div className="col-span-5 pl-24">
        <h3 className="text-xl font-semibold text-white">Metric</h3>
      </div>
      <div className="col-span-3 pl-2">
        <h3 className="text-xl font-semibold text-white">Value</h3>
      </div>
      <div className="col-span-3 pl-10">
        <h3 className="text-xl font-semibold text-white">Note</h3>
      </div>
      <div className="col-span-1 text-center">
        <h3 className="text-xl font-semibold text-white">Trend</h3>
      </div>
    </div>
  </div>
  <div>
   {metrics.map((item, index) => {
    const IconComponent = item.icon;
    let hoverBorderColor = "";
    if (item.metric === "Total Users") hoverBorderColor = "hover:border-blue-500";
    else if (item.metric === "Active Projects") hoverBorderColor = "hover:border-purple-500";
    else if (item.metric === "Total Investments") hoverBorderColor = "hover:border-emerald-500";
    else if (item.metric === "Success Rate") hoverBorderColor = "hover:border-orange-500";


      return (
        <div
          key={index}
          className={`px-8 py-8 group transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-50 dark:hover:from-slate-800 hover:to-white dark:hover:to-slate-900 hover:shadow-xl border-b border-slate-100 dark:border-slate-700 border-l-4 border-transparent ${hoverBorderColor}`}
        >
          <div className="grid grid-cols-12 gap-6 items-center">
            <div className="col-span-5">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color.split(" ")[0]} ${item.color.split(" ")[1]} rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    {item.metric}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-3 h-3 rounded-full ${item.color.split(" ")[2]}`}></div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Active</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-3">
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{item.value}</div>
              <div className={`text-sm font-medium ${item.trend === "up"
                ? "text-emerald-600"
                : item.trend === "down"
                ? "text-red-600"
                : "text-slate-500 dark:text-slate-400"
              }`}>
                {item.percentage}
              </div>
            </div>
            <div className="col-span-3">
              <span className={`text-lg font-medium ${
                item.note.includes("+")
                  ? "text-emerald-600"
                  : "text-slate-600 dark:text-slate-300"
              }`}>
                {item.note}
              </span>
            </div>
            <div className="col-span-1 flex justify-center">
              {item.trend === "up" && (
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-800/20 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                </div>
              )}
              {item.trend === "down" && (
                <div className="w-10 h-10 bg-red-100 dark:bg-red-800/20 rounded-full flex items-center justify-center">
                  <ArrowDownRight className="w-5 h-5 text-red-600" />
                </div>
              )}
              {item.trend === "neutral" && (
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <div className="w-3 h-0.5 bg-slate-400 dark:bg-slate-300 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    })}
  </div>
</div>
            <div className="mb-8">
             <div className="w-full max-w-6xl -mt-10 px-6 py-6 md:py-8 flex items-center gap-5 bg-transparent">
  <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
    <Users className="h-6 w-6" />
  </div>
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
      Platform <span className="text-blue-600">Management</span>
    </h1>
    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
  </div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {managementSections.map((section, index) => (
  <div key={index} className="card h-[500px] flex flex-col bg-white rounded-xl shadow-md p-6">
  <div className="mb-6">
    <div className="flex items-center space-x-3 mb-4">
      <div className={`p-3 bg-gradient-to-r ${section.color} rounded-xl`}>
        <section.icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{section.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
      </div>
    </div>
  </div>
  <div className="flex flex-col justify-between gap-4 flex-grow">
    {section.actions.map((action, actionIndex) => (
     <button
  key={actionIndex}
  onClick={() => {
    if (action.name === "Manage Investors") navigate("/admin/investors");
    else if (action.name === "Manage Project Owners") navigate("/admin/project-owners");
    else if (action.name === "Review Projects") navigate("/admin/review-projects");
    else if (action.name === "Monitor Activity") navigate("/admin/monitor-activity");
    else if (action.name === "Violation Reports") navigate("/admin/reports");
  }}
  className="w-full text-left p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 h-full"
>
  <div className="flex items-center justify-between h-full">
    <div className="flex flex-col justify-center">
      <div className="text-[20px] lg:text-[22px] font-bold text-gray-900 dark:text-white leading-tight tracking-wide">
  {action.name}
</div>
      <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-[4px]">
        {action.description}
      </div>
    </div>

    <div className="flex items-center space-x-2">
      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium rounded-full">
        {action.count}
      </span>
      <ArrowUpRight className="w-4 h-4 text-gray-400" />
    </div>
  </div>
</button>

    ))}
  </div>
</div>

  ))}
</div>

</div>
<div className="card">
<div className="flex items-center justify-between mb-6">
<div className="w-full max-w-6xl -mt-8 px-6 py-6 md:py-8 flex items-center gap-5 bg-transparent">
  <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
    <BellDot className="h-6 w-6" />
  </div>
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
      Notificatons
    </h1>
    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
  </div>
</div>
                <button onClick={() => navigate("/admin/notifications")} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center">
                  View All <ArrowUpRight className="w-4 h-4 ml-1" />
                </button>
              </div>
             <div className="space-y-4">
  {adminNotifications.length === 0 ? (
    <p className="text-gray-600 dark:text-gray-400">No notifications yet.</p>
  ) : (
    adminNotifications
      .slice(-3)
      .reverse() 
      .map((n) => (
        <div
          key={n.id}
          className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {n.message}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {new Date(n.created_at).toLocaleString()}
          </p>
        </div>
      ))
  )}
</div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  export default AdminDashboard
