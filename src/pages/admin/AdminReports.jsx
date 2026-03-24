"use client"

import { Bell, X, Eye, AlertTriangle } from "lucide-react"
import { useLanguage } from "../../contexts/LanguageContext"
import Header from "../../components/common/Header"
import { useState, useEffect } from "react"
import axios from "axios"

const AdminReports = () => {
  const { t, isRTL } = useLanguage()
  const [complaints, setComplaints] = useState([])
  const [filter, setFilter] = useState("all")

  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await axios.get("http://127.0.0.1:8000/adminAccounts/complaints/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const enrichedData = res.data.map((c) => ({
          id: c.id,
          complainant: c.complainant,
          defendant: c.defendant,
          complainantName: c.complainant.full_name || c.complainant.username,
          defendantName: c.defendant.full_name || c.defendant.username,
          message: c.message || "No details provided",
          createdAt: c.created_at,
          status: c.status || "pending",
        }))

        setComplaints(enrichedData)
      } catch (error) {
        console.error("Failed to fetch complaints", error)
      }
    }
    fetchComplaints()
  }, [])

  const fetchComplaintDetail = async (id) => {
    try {
      setLoadingDetail(true)
      const token = localStorage.getItem("accessToken")
      const res = await axios.get(`http://127.0.0.1:8000/adminAccounts/complaints/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSelectedComplaint(res.data)
      setIsDetailOpen(true)
    } catch (error) {
      console.error("Failed to fetch complaint detail", error)
    } finally {
      setLoadingDetail(false)
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

  const deleteComplaint = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this complaint?")
    if (!confirmed) return

    try {
      const token = localStorage.getItem("accessToken")
      await axios.delete(`http://127.0.0.1:8000/adminAccounts/complaints/${id}/delete/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setComplaints((prev) => prev.filter((c) => c.id !== id))
      if(selectedComplaint && selectedComplaint.id === id) {
        setIsDetailOpen(false)
        setSelectedComplaint(null)
      }
    } catch (error) {
      console.error("Failed to delete complaint", error)
    }
  }

  const saveComplaintStatus = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      await axios.patch(
        `http://127.0.0.1:8000/adminAccounts/complaints/${selectedComplaint.id}/`,
        { status: selectedComplaint.status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert("Complaint updated successfully")
      setIsDetailOpen(false)
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === selectedComplaint.id ? { ...c, status: selectedComplaint.status } : c
        )
      )
      setSelectedComplaint(null)
    } catch (error) {
      console.error("Failed to update complaint", error)
      alert("Failed to update complaint status")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
       <div>

    <div className="w-full max-w-6xl -mt-10 px-2 py-6 md:py-8 flex items-center gap-4 bg-transparent">
  <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
    <AlertTriangle  className="h-6 w-6" />
  </div>
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
      Complaints
    </h1>
    <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
  </div>
</div>
                <p className="text-m text-gray-500 -mt-6 mb-6 px-16">Manage and review user complaints</p>
            </div>

        <div className="space-y-4">
          {complaints
            .filter(c => filter === "all" || c.status === filter)
            .map((c) => (
              <div key={c.id} className="card hover:shadow-md transition-shadow bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-start space-x-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                      {c.complainantName} {t("complainedAbout") || "complained about"} {c.defendantName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{c.message}</p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(c.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2 items-end">
                    <button
                      onClick={() => fetchComplaintDetail(c.id)}
                      className="flex-1 btn-secondary text-sm py-2 inline-flex items-center justify-center mb-2"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>

                    <button
                      onClick={() => deleteComplaint(c.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center space-x-1"
                      title={t("delete") || "Delete"}
                    >
                      <X className="w-4 h-4" />
                      <span>{t("delete") || "Delete"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      {isDetailOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => {
                setIsDetailOpen(false)
                setSelectedComplaint(null)
              }}
            >
              Close
            </button>

            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Complaint Details</h2>

            <p><strong>Complainant:</strong> {selectedComplaint.complainant.full_name || selectedComplaint.complainant.username}</p>
            <p><strong>Defendant:</strong> {selectedComplaint.defendant.full_name || selectedComplaint.defendant.username}</p>
            <p className="my-4"><strong>Message:</strong> {selectedComplaint.message || "No details provided"}</p>

            <label className="block font-semibold mb-1">Status:</label>
            <select
              value={selectedComplaint.status}
              onChange={(e) => setSelectedComplaint({...selectedComplaint, status: e.target.value})}
              className="input-field w-full mb-4"
            >
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsDetailOpen(false)
                  setSelectedComplaint(null)
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={saveComplaintStatus}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default AdminReports
