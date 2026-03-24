"use client"

import { useState, useEffect, useRef } from "react"
import {
  Send,
  Bot,
  User,
  TrendingUp,
  BarChart3,
  Shield,
  Target,
  Lightbulb,
  Brain,
  Sparkles,
  ArrowRight,
  Star,
} from "lucide-react"
import { useLanguage } from "../../contexts/LanguageContext"
import { useAuth } from "../../contexts/AuthContext"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"

const AIAssistant = () => {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()
  const messagesEndRef = useRef(null)

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: t("Welcome! I'm here to help you find and evaluate the best investment opportunities."),
      timestamp: new Date().toISOString(),
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  const suggestedQuestions = [
    "What are the best projects for a $50,000 investment?",
    "Analyze the risk profile of technology projects",
    "How should I diversify my investment portfolio?",
    "What are the current market trends in healthcare investments?",
    "Compare the ROI potential of different project categories",
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: newMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
    setIsTyping(true)

    try {
      const res = await fetch("http://localhost:8002/investor_chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: newMessage,
          session_id: user?.id?.toString() || "default",
        }),
      })

      const data = await res.json()

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: data.answer,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("❌ Chatbot error:", error)
      const errorMsg = {
        id: Date.now() + 1,
        type: "ai",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const ProjectAnalysisCard = ({ project }) => (
    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
      <div className="flex justify-between mb-2">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100">{project.title}</h4>
        <span className="text-sm font-bold text-blue-700 dark:text-blue-300">AI Score: {project.aiScore}/100</span>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Expected Return: <span className="text-green-600 dark:text-green-400">{project.expectedReturn}</span></p>
      <div>
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Strengths:</p>
        <ul className="list-disc ml-5 text-sm text-blue-800 dark:text-blue-200">
          {project.strengths.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>
      <div className="mt-2">
        <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">Risks:</p>
        <ul className="list-disc ml-5 text-sm text-orange-800 dark:text-orange-200">
          {project.risks.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>
    </div>
  )

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 card h-[600px] flex flex-col">
          <div className="w-full max-w-6xl -mt-6 px-2 py-6 md:py-6 flex items-center gap-4 bg-transparent">
            <div className="p-1 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white ">
                Smart <span className="text-blue-600"> Investment Advisor</span>
              </h1>
              <div className="h-1 w-28 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-lg ${msg.type === "user" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"} px-4 py-2 rounded-xl shadow-md`}>
                  <p className="text-sm">{msg.content}</p>
                  {msg.projectData && <ProjectAnalysisCard project={msg.projectData} />}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 rounded-xl animate-pulse">
                  {t("aiTyping")}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="card p-4 space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Suggested Questions</h3>
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setNewMessage(q)}
                className="w-full text-left text-sm px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >{q}</button>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AIAssistant