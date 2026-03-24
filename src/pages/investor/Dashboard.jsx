"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Search, TrendingUp, MessageSquare, Bell, Trophy, Target,
  DollarSign, BarChart3, Star, ArrowUpRight, Activity, Brain, Bot,Users,Zap
} from "lucide-react"
import { useLanguage } from "../../contexts/LanguageContext"
import { useAuth } from "../../contexts/AuthContext"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
const InvestorDashboard = () => {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()

  const [recentInvestments, setRecentInvestments] = useState([])
  const [recentNotifications, setRecentNotifications] = useState([])  
  const [stats, setStats] = useState({                               
    totalOffers: 0,
    pendingOffers: 0,
    totalInvestedAmount: 0,
  })

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

   const fetchInvestments = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/investor/my-offers/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    console.log("Fetched Offers:", data); 
    const filtered = data.filter(
      offer => offer.status === "accepted"
    );
    const formatted = filtered.map(offer => ({
      id: offer.id,
      projectTitle: offer.project_title || "Unnamed Project",   
      projectImage: offer.project_image || null,                 
      category: offer.category || "Uncategorized",         
      status: offer.status,
      amount: parseFloat(offer.amount) || 0,
      ownership: offer.equity_percentage || 0,
      return: offer.status === "accepted" ? 10 + Math.floor(Math.random() * 10) : 0,
      projectOwner: offer.investor_name || "Unknown",            
      investorImage: offer.investor_profile_picture || null,    
      createdAt: offer.created_at,
      additionalTerms: offer.additional_terms || "",
      projectId: offer.project || null                           
    }));

    setRecentInvestments(formatted.slice(0, 2));

  } catch (error) {
    console.error("❌ Error fetching investments:", error);
  }
};


    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/accounts/notifications/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        setRecentNotifications(data.slice(0, 4));
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/investor/offer-statistics/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats({
          totalOffers: data.total_offers,
          pendingOffers: data.pending_offers,
          totalInvestedAmount: parseFloat(data.total_invested_amount),
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchInvestments();
    fetchNotifications();
    fetchStats();
  }, []);

  const quickActions = [
    {
      title: t("browseProjects"),
      description: "Discover new investment opportunities",
      icon: Search,
      link: "/investor/browse",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: t("myOffers"),
      description: "Manage your investment offers",
      icon: Target,
      link: "/investor/offers",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: t("messages"),
      description: "Communicate with project owners",
      icon: MessageSquare,
      link: "/investor/messages",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: t("notifications"),
      description: "Stay updated with alerts",
      icon: Bell,
      link: "/investor/notifications",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      title: t("Top Project Owners"),
      description: "Top project Owners",
      icon: Trophy,
      link: "/investor/leaderboard",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      title: t("aiAssistant"),
      description: "Get AI-powered investment insights",
      icon: Brain,
      link: "/investor/ai-assistant",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
    
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
<header className="relative overflow-hidden py-16 px-6 md:px-10 lg:px-16 bg-gradient-to-br from-emerald-100 via-cyan-100 to-blue-100 text-gray-900 w-full max-w-none mb-6">
  <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
    <div className="flex flex-col h-[240px]">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <span className="text-sm font-semibold uppercase text-blue-700 tracking-wider">Dashboard</span>
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
        {user?.full_name || user?.username || "User"} Dashboard
      </h1>

      <p className="text-lg text-gray-700 mb-6 max-w-2xl">
        Stay in control of your <span className="text-blue-700 font-medium">Investment Portfolio</span>.
      </p>

      <div className="flex flex-wrap gap-20 text-gray-700 text-lg mt-8">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          <span className="font-semibold">{stats.totalOffers} Total Offers</span>
        </div>
        <div className="flex items-center gap-2 text-orange-700">
          <MessageSquare className="h-6 w-6" />
          <span className="font-semibold">{stats.pendingOffers} Pending Offers</span>
        </div>
        <div className="flex items-center gap-2 text-green-700">
          <ArrowUpRight className="h-6 w-6" />
          <span className="font-semibold">${stats.totalInvestedAmount.toLocaleString()} Total Invested Amount</span>
        </div>
      </div>
    </div>
  </div>
</header>

      <div className="container-full">
        <div className="main-content">

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
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                      {action.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{action.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
  <div className="card">
    <div className="flex items-center justify-between mb-6">
    <div className="w-full max-w-6xl -mt-2 px-2 py-6 md:py-0 flex items-center gap-4 bg-transparent">
  <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
    <BarChart3 className="h-6 w-6" />
  </div>
  <div>
    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
      Recent <span className="text-blue-600">Investments</span>
    </h1>
    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
  </div>
</div>
      <Link
        to="/investor/offers"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center"
      >
        View All <ArrowUpRight className="w-4 h-4 ml-1" />
      </Link>
    </div>
    <div className="space-y-4">
      {recentInvestments.map((investment) => (
        <div
          key={investment.id}
          className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
  {investment.projectTitle}
</h3>
</div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full shadow-sm ${
                investment.status === "active"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                  : investment.status === "pending"
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
              }`}
            >
              {investment.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Investment Amount</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                ${investment.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ownership</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{investment.ownership}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Return</p>
              <p className={`font-semibold ${investment.return > 0 ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}`}>
                {investment.return > 0 ? `+${investment.return}%` : "Pending"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    investment.status === "active" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                ></div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {investment.status}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${investment.ownership}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
         <div className="mt-1">
  <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">Recent Notifications</h3>
      </div>
      <Link
        to="/investor/notifications"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center"
      >
        View All <ArrowUpRight className="w-4 h-4 ml-1" />
      </Link>
    </div>

    <div className="space-y-4">
      {recentNotifications.length > 0 ? (
        recentNotifications.map((notification, index) => (
          <div
            key={notification.id || index}
            className="flex items-start space-x-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl"
          >
            <div
              className={`w-2 h-2 rounded-full mt-2 ${
                notification.type === "project"
                  ? "bg-blue-500"
                  : notification.type === "offer"
                  ? "bg-green-500"
                  : "bg-purple-500"
              } animate-pulse`}
            ></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {notification.message}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {notification.timeAgo || "Just now"}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No notifications available</p>
      )}
    </div>
  </div>
</div>
          </div>
          
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default InvestorDashboard
