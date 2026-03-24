"use client"

import { useEffect, useState } from "react"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  Filter, Search, TrendingUp, User, Clock,
  Star, MessageSquare, Check, X, Handshake
} from "lucide-react"
import { useLanguage } from "../../contexts/LanguageContext"
import Header from "../../components/common/Header"

const InvestmentOffers = () => {
  const { t, isRTL } = useLanguage()
  const navigate = useNavigate()
  const [offers, setOffers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [pendingAction, setPendingAction] = useState("")
  const [filters, setFilters] = useState({
    minAmount: "", maxAmount: "", minOwnership: "", maxOwnership: "", minRating: "", sortBy: "time"
  })
  const [showFilters, setShowFilters] = useState(false)
  const getFullImageUrl = (url) => {
    if (!url) return null
    if (url.startsWith("http") || url.startsWith("https")) return url
    return `http://127.0.0.1:8000${url}`
  }

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await axios.get("http://127.0.0.1:8000/projectowner/project-owner/offers/", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            search: searchTerm,
            amount__gte: filters.minAmount || undefined,
            amount__lte: filters.maxAmount || undefined,
            equity_percentage__gte: filters.minOwnership || undefined,
            equity_percentage__lte: filters.maxOwnership || undefined,
            status: filters.status || undefined,
          }
        })
        console.log("Offers data from API:", res.data);
        setOffers(res.data)
      } catch (err) {
        setError("Failed to load offers")
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [searchTerm, filters])

  const submitReview = async () => {
  if (!selectedOffer) return;
  const token = localStorage.getItem("accessToken");

  try {
    if (rating > 0) {
      const payload = {
        rating: Number(rating), 
        ...(comment.trim() && { comment: comment.trim() }) 
      };

      console.log("Review Payload:", payload);

      await axios.post(
        `http://127.0.0.1:8000/accounts/offers/${selectedOffer.id}/review/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Review submitted successfully");
    }

    await performActionAfterRating();
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Backend validation error:", error.response.data); 
      toast.error(`Failed: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error("Unexpected error:", error);
      toast.error("Failed to submit review or action");
    }
  } finally {
    setShowRatingModal(false);
    setRating(0);
    setComment("");
  }
};


  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
  }

const handleOfferAction = (offerId, action) => {
  const offer = offers.find(o => o.id === offerId);
  if (!offer) return;

  if (action === "negotiate") {
    navigate(`/project-owner/messages?offer=${offerId}`);
    return;
  }

  setSelectedOffer(offer);
  setPendingAction(action);
  setShowRatingModal(true);
};



  const performActionAfterRating = async () => {
    if (!selectedOffer || !pendingAction) return;
    const token = localStorage.getItem("accessToken");

    try {
      if (pendingAction === "accept") {
        await axios.patch(
          `http://127.0.0.1:8000/projectowner/offers/${selectedOffer.id}/update-status/`,
          { status: "Accepted" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Offer accepted successfully");
        setOffers(prev =>
          prev.map(o =>
            o.id === selectedOffer.id ? { ...o, status: "accepted" } : { ...o, status: "rejected" }
          )
        );
      }

      if (pendingAction === "reject") {
        await axios.post(
          `http://127.0.0.1:8000/investor/offers/${selectedOffer.id}/reject/`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Offer rejected successfully");
        setOffers(prev =>
          prev.map(o =>
            o.id === selectedOffer.id ? { ...o, status: "rejected" } : o
          )
        );
      }
    } catch (error) {
      toast.error("Failed to process offer action");
      if (error.response) {
        console.error("Backend error:", error.response.data);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setSelectedOffer(null);
      setPendingAction("");
    }
  };

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.investor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.project_title?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAmount =
      (!filters.minAmount || offer.amount >= +filters.minAmount) &&
      (!filters.maxAmount || offer.amount <= +filters.maxAmount)

    const matchesOwnership =
      (!filters.minOwnership || offer.equity_percentage >= +filters.minOwnership) &&
      (!filters.maxOwnership || offer.equity_percentage <= +filters.maxOwnership)

    return matchesSearch && matchesAmount && matchesOwnership
  })

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (filters.sortBy) {
      case "amount": return b.amount - a.amount
      case "ownership": return b.equity_percentage - a.equity_percentage
      default: return new Date(b.created_at) - new Date(a.created_at)
    }
  })

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60))
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div>
          <div className="w-full max-w-6xl -mt-10 px-2 py-6 md:py-8 flex items-center gap-4 bg-transparent">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
              <Handshake className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Investment <span className="text-blue-600">Offers</span>
              </h1>
              <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
            </div>
          </div>
          <p className="text-m text-gray-500 -mt-6 mb-6 px-16">Review and manage investment offers for your projects</p>
        </div>

        {showRatingModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Rate Investor</h2>

              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>

              <textarea
                placeholder="Add a comment "
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowRatingModal(false);
                    performActionAfterRating();
                  }}
                  className="btn-secondary"
                >
                  Skip & Continue
                </button>

                <button
                  onClick={submitReview}
                  className="btn-primary"
                  disabled={rating === 0}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="card mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search offers..."
                className="input-field pl-10 dark:bg-gray-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">Loading offers...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : sortedOffers.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="mx-auto w-10 h-10 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No offers found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or wait for new offers.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOffers.map((offer) => (
              <div key={offer.id} className="card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12">
                    <img
                      src={getFullImageUrl(offer.investor_profile_picture) || "/placeholder.svg"}
                      alt={offer.investor_name}
                      className="rounded-full w-12 h-12 object-cover"
                      onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{offer.investor_name}</h3>
                      <div className="flex items-center gap-1 text-yellow-500 text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        4.5
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                        {offer.status}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        ${offer.amount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-blue-500" />
                        {offer.equity_percentage}% ownership
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {formatTimeAgo(offer.created_at)}
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                      <strong>Project:</strong> {offer.project_title || "No project title"}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {offer.additional_terms || "No message provided."}
                    </p>

                    {offer.status.toLowerCase() === "pending" && (
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => handleOfferAction(offer.id, "accept")} className="btn-primary text-sm px-4 py-2 flex items-center gap-1">
                          <Check className="w-4 h-4" /> {t("accept")}
                        </button>
                        <button onClick={() => handleOfferAction(offer.id, "reject")} className="btn-secondary text-sm px-4 py-2 flex items-center gap-1">
                          <X className="w-4 h-4" /> {t("reject")}
                        </button>
        <button 
  onClick={() => handleOfferAction(offer.id, "negotiate")}
  className="btn-secondary text-sm px-4 py-2 flex items-center gap-1"
>
  <MessageSquare className="w-4 h-4" /> {t("negotiate")}
</button>
                      </div>
                    )}

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

export default InvestmentOffers
