"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { Send, Search, MessageSquare } from "lucide-react"
import { useLanguage } from "../../contexts/LanguageContext"
import Header from "../../components/common/Header"
import axios from "axios"

const Messages = () => {
  const { t, isRTL } = useLanguage()
  const [searchParams] = useSearchParams()
  const offerIdFromUrl = searchParams.get("offer")

  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await axios.get("http://127.0.0.1:8000/investor/conversations/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setConversations(res.data || [])
        if (offerIdFromUrl) {
          const conv = res.data.find(c => c.offer_id.toString() === offerIdFromUrl)
          if (conv) {
            loadConversation(conv)
          }
        }
      } catch (err) {
        console.error("❌ Error fetching conversations", err)
      }
    }

    fetchConversations()
  }, [offerIdFromUrl])

  const loadConversation = async (conversation) => {
    if (!conversation) return
    setSelectedConversation(conversation)

    try {
      const token = localStorage.getItem("accessToken")
      const res = await axios.get(
        `http://127.0.0.1:8000/investor/conversations/${conversation.offer_id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessages(Array.isArray(res.data) ? res.data : res.data.results || [])

      await axios.post(
        `http://127.0.0.1:8000/investor/messages/${conversation.offer_id}/mark-read/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setConversations((prev) =>
        prev.map((c) =>
          c.offer_id === conversation.offer_id ? { ...c, is_read: true } : c
        )
      )
    } catch (err) {
      console.error("❌ Error loading messages", err)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return
    try {
      const token = localStorage.getItem("accessToken")
      const res = await axios.post(
        `http://127.0.0.1:8000/investor/conversations/${selectedConversation.offer_id}/send/`,
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessages((prev) => [...prev, res.data])
      setNewMessage("")
      scrollToBottom()
    } catch (err) {
      console.error("❌ Error sending message", err)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    return date.toLocaleDateString()
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.other_user_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.project_title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div>
          <div className="w-full max-w-6xl -mt-10 px-2 py-6 md:py-8 flex items-center gap-4 bg-transparent">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Messages</h1>
              <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
            </div>
          </div>
          <p className="text-m text-gray-500 -mt-6 mb-6 px-16">Communicate with users and manage negotiations</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6" style={{ height: "75vh" }}>
          {/* Sidebar */}
          <div className="w-full lg:w-[360px]">
            <div className="bg-white dark:bg-gray-800 shadow rounded-xl h-full flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="input-field pl-10 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 p-4">No conversations</p>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.offer_id}
                      onClick={() => loadConversation(conversation)}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        selectedConversation?.offer_id === conversation.offer_id
                          ? "bg-blue-50 dark:bg-blue-900 border-blue-200"
                          : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={conversation.profile_picture || "/placeholder.svg"}
                          alt={conversation.other_user_full_name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {conversation.other_user_full_name}
                            </h3>
                            <div className="flex items-center space-x-1">
                              {!conversation.is_read && (
                                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">New</span>
                              )}
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(conversation.last_message_time)}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 truncate">{conversation.project_title}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{conversation.last_message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 shadow rounded-xl h-full flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedConversation.profile_picture || "/placeholder.svg"}
                        alt={selectedConversation.other_user_full_name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {selectedConversation.other_user_full_name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{selectedConversation.project_title}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.from_me ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                            message.from_me
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.from_me ? "text-blue-100" : "text-gray-500 dark:text-gray-300"
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder={`${t("sendMessage")}...`}
                        className="flex-1 input-field dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a conversation</h3>
                    <p className="text-gray-600 dark:text-gray-300">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages
