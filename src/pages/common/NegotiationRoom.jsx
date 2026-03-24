"use client"
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Send,
  Shield,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Lock,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { useLanguage } from "../../contexts/LanguageContext"
import { useAuth } from "../../contexts/AuthContext"
import Header from "../../components/common/Header"

const NegotiationRoom = () => {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()
  const { negotiationId } = useParams()
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)

  const [newMessage, setNewMessage] = useState("")
  const [showCounterOffer, setShowCounterOffer] = useState(false)
  const [counterOfferData, setCounterOfferData] = useState({
    amount: "",
    ownership: "",
    terms: "",
  })
  const negotiation = {
    id: negotiationId,
    projectTitle: "AI-Powered E-commerce Platform",
    projectOwner: {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
    },
    investor: {
      id: 2,
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.9,
    },
    status: "in-progress",
    createdAt: "2024-01-20T10:00:00Z",
    originalOffer: {
      amount: 50000,
      ownership: 20,
      terms: "Standard investment terms with quarterly reporting",
    },
    currentOffer: {
      amount: 45000,
      ownership: 18,
      terms: "Revised terms with monthly reporting and milestone-based funding",
    },
    messages: [
      {
        id: 1,
        senderId: 2,
        senderName: "Michael Chen",
        senderRole: "investor",
        content: "Thank you for accepting my offer to negotiate. I'm very interested in your AI platform.",
        timestamp: "2024-01-20T10:05:00Z",
        type: "message",
      },
      {
        id: 2,
        senderId: 1,
        senderName: "Sarah Johnson",
        senderRole: "project-owner",
        content: "I appreciate your interest! I'd like to discuss the terms in more detail.",
        timestamp: "2024-01-20T10:15:00Z",
        type: "message",
      },
      {
        id: 3,
        senderId: 2,
        senderName: "Michael Chen",
        senderRole: "investor",
        content: "I'd like to propose a counter offer with slightly adjusted terms.",
        timestamp: "2024-01-20T10:30:00Z",
        type: "message",
      },
      {
        id: 4,
        senderId: 2,
        senderName: "Michael Chen",
        senderRole: "investor",
        content: "",
        timestamp: "2024-01-20T10:32:00Z",
        type: "counter-offer",
        offerData: {
          amount: 45000,
          ownership: 18,
          terms: "Revised terms with monthly reporting and milestone-based funding",
        },
      },
      {
        id: 5,
        senderId: 1,
        senderName: "Sarah Johnson",
        senderRole: "project-owner",
        content: "This looks reasonable. Let me review the milestone structure you're proposing.",
        timestamp: "2024-01-20T11:00:00Z",
        type: "message",
      },
    ],
  }

  const otherParty = user?.role === "investor" ? negotiation.projectOwner : negotiation.investor
  const isInvestor = user?.role === "investor"

  useEffect(() => {
    scrollToBottom()
  }, [negotiation.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const handleCounterOffer = () => {
    if (counterOfferData.amount && counterOfferData.ownership) {
      console.log("Submitting counter offer:", counterOfferData)
      setShowCounterOffer(false)
      setCounterOfferData({ amount: "", ownership: "", terms: "" })
    }
  }

  const handleAcceptOffer = () => {
    console.log("Accepting current offer")
  }

  const handleRejectOffer = () => {
    console.log("Rejecting current offer")
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className={`inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
            Back
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t("secureNegotiation")}</h1>
              <p className="text-gray-600 dark:text-gray-400">{negotiation.projectTitle}</p>
            </div>
            <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-xl">
              <Shield className="w-5 h-5" />
              <span className="font-medium">{t("encryptedMessage")}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3">
            <div className="card h-[600px] flex flex-col">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={otherParty.avatar || "/placeholder.svg"}
                      alt={otherParty.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{otherParty.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {isInvestor ? "Project Owner" : "Investor"}
                        </span>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-yellow-600 dark:text-yellow-400">★</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{otherParty.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">{t("secureChat")}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {negotiation.messages.map((message) => {
                  const isCurrentUser = message.senderId === user?.id || message.senderRole === user?.role
                  const isCounterOffer = message.type === "counter-offer"

                  return (
                    <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? "order-2" : "order-1"}`}>
                        {!isCurrentUser && (
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {message.senderName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        )}

                        {isCounterOffer ? (
                          <div
                            className={`p-4 rounded-lg border-2 ${
                              isCurrentUser
                                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                                : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700"
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-3">
                              <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                              <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {t("counterOffer")}
                              </span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">{t("amount")}:</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  ${message.offerData.amount.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">{t("ownershipPercentage")}:</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {message.offerData.ownership}%
                                </span>
                              </div>
                              {message.offerData.terms && (
                                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                  <p className="text-gray-700 dark:text-gray-300">{message.offerData.terms}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              isCurrentUser
                                ? "bg-blue-600 dark:bg-blue-500 text-white"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                        )}

                        {isCurrentUser && (
                          <div className="flex justify-end mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder={`${t("sendMessage")}...`}
                      className="input-field"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => setShowCounterOffer(true)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>{t("makeCounterOffer")}</span>
                  </button>
                  {!isInvestor && (
                    <>
                      <button onClick={handleAcceptOffer} className="btn-primary flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>{t("acceptOffer")}</span>
                      </button>
                      <button
                        onClick={handleRejectOffer}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{t("rejectOffer")}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="xl:col-span-1 space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t("negotiationSummary")}</h3>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{t("originalOffer")}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t("amount")}:</span>
                      <span className="font-medium">${negotiation.originalOffer.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t("ownershipPercentage")}:</span>
                      <span className="font-medium">{negotiation.originalOffer.ownership}%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{t("currentOffer")}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t("amount")}:</span>
                      <span className="font-medium text-blue-700 dark:text-blue-300">
                        ${negotiation.currentOffer.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t("ownershipPercentage")}:</span>
                      <span className="font-medium text-blue-700 dark:text-blue-300">
                        {negotiation.currentOffer.ownership}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t("negotiationStatus")}:</span>
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-medium">
                    {t("inProgress")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600 dark:text-gray-400">Started:</span>
                  <span className="text-gray-900 dark:text-gray-100">{formatDate(negotiation.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400 mt-1" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">{t("secureNegotiation")}</h4>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    This negotiation is end-to-end encrypted. Your personal information is protected and not shared with
                    the other party.
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Negotiation Guidelines</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1" />
                  <p className="text-gray-700 dark:text-gray-300">Keep communication professional and respectful</p>
                </div>
                <div className="flex items-start space-x-3">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1" />
                  <p className="text-gray-700 dark:text-gray-300">Document all agreed terms clearly</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Respond within 48 hours to keep negotiations active
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-1" />
                  <p className="text-gray-700 dark:text-gray-300">Contact support if you encounter any issues</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCounterOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t("makeCounterOffer")}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("amount")} (USD)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={counterOfferData.amount}
                  onChange={(e) => setCounterOfferData({ ...counterOfferData, amount: e.target.value })}
                  placeholder="45000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("ownershipPercentage")} (%)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={counterOfferData.ownership}
                  onChange={(e) => setCounterOfferData({ ...counterOfferData, ownership: e.target.value })}
                  placeholder="18"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("proposedTerms")} (Optional)
                </label>
                <textarea
                  rows={3}
                  className="input-field"
                  value={counterOfferData.terms}
                  onChange={(e) => setCounterOfferData({ ...counterOfferData, terms: e.target.value })}
                  placeholder="Describe any additional terms or conditions..."
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-6">
              <button onClick={() => setShowCounterOffer(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={handleCounterOffer} className="btn-primary flex-1">
                {t("submitOfferButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NegotiationRoom
