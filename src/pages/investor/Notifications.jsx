"use client"

import { Bell, Check, X, Star, TrendingUp, MessageSquare, DollarSign,BellDot } from "lucide-react"
import { useLanguage } from "../../contexts/LanguageContext"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import { useState, useEffect } from "react"
import axios from "axios"

const Notifications = () => {
  const { t, isRTL } = useLanguage()
  const [filter, setFilter] = useState("all")
 const [notifications, setNotifications] = useState([])

useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const res = await axios.get("http://127.0.0.1:8000/accounts/notifications/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const enrichedData = res.data.map((n) => {
        let icon = Bell
        let color = "text-blue-600"
        let bgColor = "bg-blue-100"
        if (n.message.includes("accepted")) {
          icon = Check
          color = "text-green-600"
          bgColor = "bg-green-100"
        } else if (n.message.includes("rejected")) {
          icon = X
          color = "text-red-600"
          bgColor = "bg-red-100"
        } else if (n.message.toLowerCase().includes("negotiate")) {
          icon = MessageSquare
          color = "text-purple-600"
          bgColor = "bg-purple-100"
        }

        return {
          id: n.id,
          type: "default",
          title: t("notification"),
          message: n.message,
          timestamp: n.created_at,
          read: n.is_read,
          icon,
          color,
          bgColor,
          projectId: null,
        }
      })

      setNotifications(enrichedData)
    } catch (err) {
      console.error("Failed to fetch notifications", err)
    }
  }

  fetchNotifications()
}, [t])

 const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read
    if (filter === "read") return notification.read
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

const markAsRead = async (id) => {
  try {
    const token = localStorage.getItem("accessToken")
    await axios.post(`http://127.0.0.1:8000/accounts/notifications/${id}/mark-read/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  } catch (err) {
    console.error("Failed to mark notification as read", err)
  }
}


 const markAllAsRead = async () => {
  try {
    const token = localStorage.getItem("accessToken")
    await axios.post("http://127.0.0.1:8000/accounts/notifications/mark-all-read/", {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    )
  } catch (err) {
    console.error("Failed to mark all as read", err)
  }
}

const deleteNotification = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this notification?")
  if (!confirmDelete) return

  try {
    const token = localStorage.getItem("accessToken")
    await axios.delete(`http://127.0.0.1:8000/accounts/notifications/${id}/delete/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setNotifications((prev) => prev.filter((n) => n.id !== id))
  } catch (err) {
    console.error("Failed to delete notification", err)
  }
}

  const clearAll = () => {
    setNotifications([])
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60))
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
       
        <div className="w-full max-w-6xl -mt-10 px-2 py-6 md:py-8 flex items-center gap-4 bg-transparent">
  <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
    <BellDot  className="h-6 w-6" />
  </div>
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
      My <span className="text-blue-600">Notifications</span>
    </h1>
    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
  </div>
</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card text-center bg-white dark:bg-gray-800">
            <Bell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Notifications</div>
          </div>
          <div className="card text-center bg-white dark:bg-gray-800">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-red-600 dark:text-red-300 font-bold text-sm">{unreadCount}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{unreadCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Unread</div>
          </div>
          <div className="card text-center bg-white dark:bg-gray-800">
            <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.length - unreadCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Read</div>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800 mb-6">
          <div className="flex items-center justify-between">
            <select className="input-field w-48 dark:bg-gray-700 dark:text-white" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="btn-secondary text-sm">
                  {t("markAsRead")} All
                </button>
              )}
              <button onClick={clearAll} className="btn-secondary text-sm">
                {t("clearAll")}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotifications.map((n) => (
            <div key={n.id} className={`card hover:shadow-md transition-shadow bg-white dark:bg-gray-800 ${!n.read ? "border-l-4 border-l-primary-500 bg-primary-50 dark:bg-gray-700" : ""}`}>
              <div className="flex items-start space-x-4">
                <div className={`p-2 ${n.bgColor} dark:bg-opacity-20 rounded-lg`}>
                  <n.icon className={`w-5 h-5 ${n.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={`font-semibold ${!n.read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>{n.title}</h3>
                      <p className={`text-sm ${!n.read ? "text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400"}`}>{n.message}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(n.timestamp)}</span>
                      {!n.read && <div className="w-2 h-2 bg-primary-600 rounded-full"></div>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!n.read && <button onClick={() => markAsRead(n.id)} className="text-primary-600 hover:text-primary-700 text-sm font-medium">{t("markAsRead")}</button>}
                    {n.projectId && <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">View Project</button>}
                    {n.type === "negotiation" && <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">Open Chat</button>}
                    <button
  onClick={() => deleteNotification(n.id)}
  className="text-red-600 hover:text-red-800 text-sm font-medium"
>
  Delete
</button>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t("noNotifications")}</h3>
            <p className="text-gray-600 dark:text-gray-300">You're all caught up! No notifications to show.</p>
          </div>
        )}

       
      </div>
      <Footer/>
    </div>
  )
}

export default Notifications
