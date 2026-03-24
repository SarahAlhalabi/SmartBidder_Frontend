"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Edit,
  Trash2,
  MessageSquare,
  Eye,
  Clock,
  DollarSign,
  TrendingUp,
  FolderKanban, CheckCircle2, XCircle, Tag
} from "lucide-react"
import { useLanguage } from "../../contexts/LanguageContext"
import Header from "../../components/common/Header"
import axios from "axios"

const MyOffers = () => {
  const { t, isRTL } = useLanguage()
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingOffer, setEditingOffer] = useState(null)
  const [stats, setStats] = useState(null)
  const [editData, setEditData] = useState({})
  const [offers, setOffers] = useState([])

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await axios.get("http://127.0.0.1:8000/investor/my-offers/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setOffers(res.data || [])
      } catch (err) {
        console.error("❌ Error loading offers", err)
      }
    }
    fetchOffers()
  }, [])

  const filteredOffers = offers.filter(
    (offer) => statusFilter === "all" || offer.status === statusFilter
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "withdrawn":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  const handleEditOffer = (offer) => {
    setEditingOffer(offer.id)
    setEditData({
      amount: offer.amount,
      ownership: offer.ownership,
      terms: offer.terms,
    })
  }

  const handleSaveEdit = (offerId) => {
    console.log("Updating offer:", offerId, editData)
    setEditingOffer(null)
    alert(t("offerUpdated"))
  }

  const handleWithdrawOffer = (offerId) => {
    if (window.confirm("Are you sure you want to withdraw this offer?")) {
      console.log("Withdrawing offer:", offerId)
      alert(t("offerWithdrawn"))
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await axios.get("http://127.0.0.1:8000/investor/offer-statistics/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStats(res.data)
      } catch (err) {
        console.error("❌ Error loading offer statistics", err)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-screen-2xl mx-auto py-8 px-4 sm:px-8 lg:px-12">
        <div className="w-full max-w-6xl -mt-10 px-2 py-6 md:py-8 flex items-center gap-4 bg-transparent">
          <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
            <Tag className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              My <span className="text-blue-600">Offers</span>
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
          </div>
        </div>

        <p className="text-m text-gray-500 -mt-6 mb-6 px-16">
          Track and manage your investment offers
        </p>

        <div className="flex flex-wrap justify-between gap-4 mb-6">
        </div>

        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Offers</h2>
            <select
              className="input-field w-48"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">{t("pending")}</option>
              <option value="approved">{t("approved")}</option>
              <option value="rejected">{t("rejected")}</option>
            </select>
          </div>
        </div>

<div className="space-y-4">
  {filteredOffers.map((offer) => (
    <div
      key={offer.id}
      className="card shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800"
    >
      <div className="flex items-start space-x-4">
        <img
          src={offer.project_image || "/placeholder.svg"}
          alt={offer.project_title}
          className="w-24 h-24 object-cover rounded-xl shadow-md border border-gray-300 dark:border-gray-700"
        />

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-wide">
                {offer.project_title}
              </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300 mt-1">
  </div>
            </div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                offer.status
              )}`}
            >
              {t(offer.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="text-green-800 dark:text-green-300 text-base font-bold">
                ${parseFloat(offer.amount).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{parseFloat(offer.equity_percentage)}%</span> ownership
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4" />
              <span>{offer.created_at ? formatTimeAgo(offer.created_at) : "N/A"}</span>
            </div>
          </div>

          {offer.additional_terms && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              <span className="font-medium">Terms:</span> {offer.additional_terms}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Link
                to={`/investor/project/${offer.project}`}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-full inline-flex items-center shadow-md transition-all duration-300"
              >
                <Eye className="w-4 h-4 mr-2" />
                {t("viewDetails")}
              </Link>

              {offer.status === "approved" && (
                <Link
                  to="/investor/messages"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-full shadow-sm transition duration-200 inline-flex items-center"
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Message
                </Link>
              )}
            </div>

            {offer.canEdit && offer.status === "pending" && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditOffer(offer)}
                  className="btn-secondary text-sm px-3 py-1 inline-flex items-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  {t("editOffer")}
                </button>
                <button
                  onClick={() => handleWithdrawOffer(offer.id)}
                  className="text-red-600 hover:text-red-700 text-sm px-3 py-1 inline-flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {t("withdrawOffer")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
      </div>
    </div>
  )
}
export default MyOffers
