"use client"

import {
  Bell, AlertTriangle, Eye, Check, X, User, Building, FileText
} from "lucide-react"
import { useLanguage } from "../../contexts/LanguageContext"
import Header from "../../components/common/Header"
import { useState, useEffect } from "react"
import axios from "axios"

const API_BASE_URL = "http://127.0.0.1:8000"

const MonitorActivity = () => {
  const { t } = useLanguage()
  const [notifications, setNotifications] = useState([])
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [userDetails, setUserDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(() => {
    const fetchImportantNotifications = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await axios.get(`${API_BASE_URL}/accounts/notifications/admin-important/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setNotifications(res.data)
      } catch (err) {
        console.error("Failed to fetch notifications")
      }
    }
    fetchImportantNotifications()
  }, [])

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = Math.floor((now - time) / (1000 * 60))
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return `${Math.floor(diff / 1440)}d ago`
  }

  const extractUserIdFromMessage = (message) => {
    const match = message.match(/ID:(\d+)/)
    return match ? match[1] : null
  }

  const fetchUserDetails = async () => {
    try {
      setLoadingDetails(true)
      const token = localStorage.getItem("accessToken")
      const id = extractUserIdFromMessage(selectedNotification.message)
      if (!id) return

      const res = await axios.get(`${API_BASE_URL}/accounts/new-user-detail/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserDetails(res.data)
    } catch (err) {
      console.error("Failed to fetch user details", err)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleAccept = (id) => {
    console.log("Accepted notification:", id)
  }

  const handleReject = (id) => {
    console.log("Rejected notification:", id)
  }

  const handleViewDetails = async (notification) => {
    setSelectedNotification(notification)
    if (notification.message.includes("New account created")) {
      await fetchUserDetails()
    }
    setShowModal(true)
  }

  const renderImage = (url, label) => {
    if (!url || url === "null" || url === "") {
      return (
        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg col-span-2 border border-dashed border-gray-300 dark:border-gray-600">
          <span className="font-medium text-gray-600 dark:text-gray-300">{label}:</span>
          <p className="mt-1 text-gray-500 italic">No {label.toLowerCase()} uploaded</p>
        </div>
      )
    }
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`

    return (
      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg col-span-2 border border-gray-300 dark:border-gray-600">
        <span className="font-medium text-gray-600 dark:text-gray-300">{label}:</span>
        <img
          src={fullUrl}
          alt={label}
          className="mt-2 max-w-xs max-h-48 object-contain rounded-lg shadow-sm"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/fallback-image.jpg"
          }}
        />
      </div>
    )
  }

  const renderUserDetails = () => {
    if (!userDetails) return null

    return (
      <div className="mt-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-3 text-gray-900 dark:text-white">
          <User className="w-6 h-6" />
          User Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {[
            ["Full Name", userDetails.full_name],
            ["Username", userDetails.username],
            ["Email", userDetails.email],
            ["Phone", userDetails.phone_number || 'N/A'],
            ["Role", userDetails.role],
            ["Status", userDetails.is_active ? "Active" : "Inactive"],
            ["Language", userDetails.language_preference],
            ["Created At", new Date(userDetails.created_at).toLocaleString()],
          ].map(([label, value], idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border ${
                label === "Status"
                  ? value === "Active"
                    ? "border-green-400 bg-green-50 text-green-700"
                    : "border-red-400 bg-red-50 text-red-700"
                  : "border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              }`}
            >
              <span className="font-medium">{label}:</span>
              <p className="mt-1 break-words">{value}</p>
            </div>
          ))}
        </div>

        {userDetails.investor_details && (
          <section className="mt-8 p-6 bg-blue-50 dark:bg-blue-900 rounded-lg shadow-md">
            <h4 className="font-bold text-xl flex items-center gap-3 mb-5 text-blue-900 dark:text-blue-300">
              <Building className="w-6 h-6" />
              Investor Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {[
                ["Company Name", userDetails.investor_details.company_name],
                ["Commercial Register", userDetails.investor_details.commercial_register],
                ["Phone", userDetails.investor_details.phone_number],
                ["Created By", userDetails.investor_details.created_by_name],
                ["Created At", new Date(userDetails.investor_details.created_at).toLocaleString()]
              ].map(([label, value], idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">{label}:</span>
                  <p className="mt-1 break-words">{value || "N/A"}</p>
                </div>
              ))}
              {renderImage(userDetails.investor_details.profile_picture, "Profile Picture")}
              {renderImage(userDetails.investor_details.id_card_picture, "ID Card")}
              {renderImage(userDetails.investor_details.commercial_register_picture, "Commercial Register Document")}
            </div>
          </section>
        )}

        {userDetails.project_owner_details && (
          <section className="mt-8 p-6 bg-green-50 dark:bg-green-900 rounded-lg shadow-md">
            <h4 className="font-bold text-xl flex items-center gap-3 mb-5 text-green-900 dark:text-green-300">
              <FileText className="w-6 h-6" />
              Project Owner Details
            </h4>
            <div className="grid grid-cols-1 gap-6 text-sm">
              {[
                ["Bio", userDetails.project_owner_details.bio],
                ["Terms Agreed", userDetails.project_owner_details.terms_agreed],
                ["Created At", new Date(userDetails.project_owner_details.created_at).toLocaleString()]
              ].map(([label, value], idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">{label}:</span>
                  <p className="mt-1 whitespace-pre-wrap break-words">{value || "N/A"}</p>
                </div>
              ))}
              {renderImage(userDetails.project_owner_details.profile_picture, "Profile Picture")}
              {renderImage(userDetails.project_owner_details.id_card_picture, "ID Card")}
            </div>
          </section>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-5xl mx-auto py-12 px-6 sm:px-8 lg:px-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-10 text-center">
          Monitor Activity
        </h1>

        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
            No activity found.
          </p>
        ) : (
          <div className="space-y-6">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg flex flex-col gap-4 border-l-8 border-yellow-400"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-3xl shadow-inner flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white font-medium">{n.message}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">{formatTimeAgo(n.created_at)}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => handleAccept(n.id)}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold flex items-center gap-2 shadow-md hover:brightness-110 transition"
                    title="Accept"
                  >
                    <Check className="w-5 h-5" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(n.id)}
                    className="px-6 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl font-semibold flex items-center gap-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                    title="Reject"
                  >
                    <X className="w-5 h-5" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleViewDetails(n)}
                    className="px-6 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl font-semibold flex items-center gap-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && selectedNotification && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
              Activity Details
            </h2>
            <p className="text-gray-900 dark:text-white mb-4 whitespace-pre-wrap">{selectedNotification.message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Created at: {new Date(selectedNotification.created_at).toLocaleString()}
            </p>

            {selectedNotification.message.includes("New account created") && (
              <div>
                {loadingDetails ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center">Loading user details...</p>
                ) : (
                  renderUserDetails()
                )}
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  setShowModal(false)
                  setUserDetails(null)
                }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MonitorActivity
