"use client"

import {
  Bell, Check, X, MessageSquare
} from "lucide-react"
import { useLanguage } from "../../contexts/LanguageContext"
import Header from "../../components/common/Header"
import { useState, useEffect } from "react"
import axios from "axios"

const AdminNotifications = () => {
  const { t } = useLanguage()
  const [filter, setFilter] = useState("all")
  const [notifications, setNotifications] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [userDetails, setUserDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState(null)

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
          let type = "default"
          let userId = null

          if (n.message.includes("approved")) {
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
            type = "negotiation"
          } else if (n.message.includes("New account created")) {
            type = "account_request"
            const match = n.message.match(/ID:(\d+)/)
            if (match) {
              userId = parseInt(match[1])
            }
          }

          return {
            id: n.id,
            type,
            title: t("notification"),
            message: n.message,
            timestamp: n.created_at,
            read: n.is_read,
            icon,
            color,
            bgColor,
            userId,
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
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
      })

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
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
        headers: { Authorization: `Bearer ${token}` },
      })

      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch (err) {
      console.error("Failed to delete notification", err)
    }
  }

  const fetchUserDetails = async (userId) => {
    setLoadingDetails(true)
    setDetailsError(null)
    console.log("Fetching user ID:", userId)
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        setDetailsError("No auth token found")
        setLoadingDetails(false)
        return
      }
      const res = await axios.get(`http://127.0.0.1:8000/accounts/review-user/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log("User details fetched:", res.data)
      setUserDetails(res.data)
      setShowModal(true)
    } catch (error) {
      console.error("Error fetching user details:", error)
      setDetailsError("Failed to load user details")
    } finally {
      setLoadingDetails(false)
    }
  }

  const approveUser = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken")
      await axios.post(`http://127.0.0.1:8000/accounts/approve-user/${userId}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert("User approved successfully.")
      setShowModal(false)
      setNotifications((prev) => prev.filter((n) => !(n.userId === userId && n.type === "account_request")))
    } catch (err) {
      console.error("Error approving user", err)
      alert("Failed to approve user.")
    }
  }

  const rejectUser = async (userId) => {
    const confirmReject = window.confirm("Are you sure you want to reject this user?")
    if (!confirmReject) return

    try {
      const token = localStorage.getItem("accessToken")
      await axios.post(`http://127.0.0.1:8000/accounts/reject-user/${userId}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert("User rejected and deleted.")
      setShowModal(false)
      setNotifications((prev) => prev.filter((n) => !(n.userId === userId && n.type === "account_request")))
    } catch (err) {
      console.error("Error rejecting user", err)
      alert("Failed to reject user.")
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("notifications")}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card text-center bg-white dark:bg-gray-800">
            <Bell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total</div>
          </div>
          <div className="card text-center bg-white dark:bg-gray-800">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-red-600 font-bold text-sm">{unreadCount}</span>
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

        <div className="flex justify-between mb-4">
          <select className="input-field dark:bg-gray-700 dark:text-white" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="btn-secondary text-sm">
                Mark All As Read
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotifications.map((n) => (
            <div key={n.id} className={`card bg-white dark:bg-gray-800 ${!n.read ? "border-l-4 border-primary-500 bg-primary-50" : ""}`}>
              <div className="flex items-start space-x-4">
                <div className={`p-2 ${n.bgColor} rounded-lg`}>
                  <n.icon className={`w-5 h-5 ${n.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{n.title}</h3>
                      <p className="text-sm">{n.message}</p>
                    </div>
                    <span className="text-xs text-gray-500">{formatTimeAgo(n.timestamp)}</span>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    {!n.read && (
                      <button onClick={() => markAsRead(n.id)} className="text-blue-600 text-sm">Mark as Read</button>
                    )}
                    <button onClick={() => deleteNotification(n.id)} className="text-red-600 text-sm">Delete</button>

                    {n.type === "account_request" && n.userId && (
                      <>
                        <button onClick={() => fetchUserDetails(n.userId)} className="text-indigo-600 text-sm">View Details</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative overflow-auto max-h-[80vh]">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>

              {loadingDetails && <p>Loading user details...</p>}
              {detailsError && <p className="text-red-600">{detailsError}</p>}

              {userDetails && !loadingDetails && !detailsError && (
                <>
                  <h2 className="text-xl font-bold mb-4">User Details</h2>
                  <p><strong>Full Name:</strong> {userDetails.full_name}</p>
                  <p><strong>Email:</strong> {userDetails.email}</p>
                  <p><strong>Phone:</strong> {userDetails.phone_number}</p>
                  <p><strong>Role:</strong> {userDetails.role}</p>
                  <p><strong>Created At:</strong> {new Date(userDetails.created_at).toLocaleString()}</p>
                  <p><strong>Active:</strong> {userDetails.is_active ? "Yes" : "No"}</p>
                  {userDetails.project_owner_profile && (
                    <div className="mt-4">
                      <h3 className="font-semibold">Project Owner Profile</h3>
                      <p><strong>Bio:</strong> {userDetails.project_owner_profile.bio}</p>
                      {userDetails.project_owner_profile.profile_picture && (
                        <img
                          src={userDetails.project_owner_profile.profile_picture}
                          alt="Profile"
                          className="w-32 h-32 rounded mt-2"
                        />
                      )}
                      {userDetails.project_owner_profile.id_card_picture && (
                        <img
                          src={userDetails.project_owner_profile.id_card_picture}
                          alt="ID Card"
                          className="w-32 h-32 rounded mt-2"
                        />
                      )}
                      <p><strong>Terms Agreed:</strong> {userDetails.project_owner_profile.terms_agreed ? "Yes" : "No"}</p>
                    </div>
                  )}
                  {userDetails.investor_profile && (
                    <div className="mt-4">
                      <h3 className="font-semibold">Investor Profile</h3>
                      <p><strong>Company Name:</strong> {userDetails.investor_profile.company_name}</p>
                      <p><strong>Commercial Register:</strong> {userDetails.investor_profile.commercial_register}</p>
                      <p><strong>Phone Number:</strong> {userDetails.investor_profile.phone_number}</p>
                      {userDetails.investor_profile.profile_picture && (
                        <img
                          src={userDetails.investor_profile.profile_picture}
                          alt="Profile"
                          className="w-32 h-32 rounded mt-2"
                        />
                      )}
                      {userDetails.investor_profile.id_card_picture && (
                        <img
                          src={userDetails.investor_profile.id_card_picture}
                          alt="ID Card"
                          className="w-32 h-32 rounded mt-2"
                        />
                      )}
                      {userDetails.investor_profile.commercial_register_picture && (
                        <img
                          src={userDetails.investor_profile.commercial_register_picture}
                          alt="Commercial Register"
                          className="w-32 h-32 rounded mt-2"
                        />
                      )}
                    </div>
                  )}

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => approveUser(userDetails.id)}
                      className="btn-green px-4 py-2 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectUser(userDetails.id)}
                      className="btn-red px-4 py-2 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminNotifications
