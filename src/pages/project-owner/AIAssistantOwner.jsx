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
  MessageCircle
} from "lucide-react"
import { useLanguage } from "../../contexts/LanguageContext"
import { useAuth } from "../../contexts/AuthContext"
import Header from "../../components/common/Header"
import axios from "axios"
import Footer from "../../components/common/Footer"

const AIAssistantOwner = () => {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()
  const messagesEndRef = useRef(null)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await axios.get("http://localhost:8000/projectowner/my-projects/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setProjects(res.data)
      } catch (error) {
        console.error("Error fetching projects:", error)
      }
    }

    fetchProjects()
  }, [])

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: t("Welcome! I'm here to help you improve your project and choose the best offers"),
      timestamp: new Date().toISOString(),
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  const suggestedQuestions = [
    "Which is the best investment offer submitted for my project?",
    "Is this offer suitable for long-term growth?",
    "What are the potential downsides of the highest-value offer?",
    "Is a negotiated offer better than a direct one?",
    "Which offer brings the most value considering ROI and risk?"
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

 const handleSendMessage = async () => {
  if (!newMessage.trim()) return;

  const token = localStorage.getItem("accessToken");
  console.log("🔑 JWT Token being sent:", token); 

  const userMessage = {
    id: Date.now(),
    type: "user",
    content: newMessage,
    timestamp: new Date().toISOString(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setNewMessage("");
  setIsTyping(true);

  try {
    const res = await fetch("http://localhost:8001/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        prompt: newMessage,
        session_id: user?.id?.toString() || "default",
      }),
    });

    console.log("📤 Request Headers:", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    if (!res.ok) {
      console.error("❌ AI Server Response Error:", res.status, await res.text());
      throw new Error("Failed to fetch response from AI server");
    }

    const data = await res.json();
    console.log("✅ AI Response:", data);

    const aiMessage = {
      id: Date.now() + 1,
      type: "ai",
      content: data.answer,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, aiMessage]);
  } catch (error) {
    console.error("❌ Chatbot error:", error);
    setMessages((prev) => [...prev, {
      id: Date.now() + 1,
      type: "ai",
      content: "Sorry, authentication failed or AI service is unavailable.",
      timestamp: new Date().toISOString(),
    }]);
  } finally {
    setIsTyping(false);
  }
};


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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex-grow flex flex-col">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-grow w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="col-span-2 card h-full flex flex-col"> 
              <div className="p-0 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-full max-w-6xl -mt-6 px-2 py-6 md:py-6 flex items-center gap-4 bg-transparent">
                    <div className="p-1 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
                      <Bot className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white ">
                        Ask your <span className="text-blue-600">Ai Advisor</span>
                      </h1>
                      <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
                    </div>
                  </div>
                  <div>
                    <div>
                    </div>
                  </div>
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

              <div className="card p-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Projects</h3>
                {projects.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No projects found.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => setNewMessage(project.title)}
                        className="w-full text-left text-sm px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {project.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AIAssistantOwner