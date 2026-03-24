
import React from "react";

"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
  Star,
  DollarSign,
  Target,
  Award,
  CheckCircle,
  BarChart3,
  Zap,
  Globe,
  Lock,
  Lightbulb,
  Handshake,
  Eye,
  LightbulbIcon,
  LineChart,
  Bell,
  Brain,
  Network,
  Filter,
  Moon,
  Sun,
} from "lucide-react"
import Footer from "../../components/common/Footer"
import { motion } from "framer-motion"
import { useTheme } from "../../contexts/ThemeContext"
const iconBounce = {
  initial: { y: 0 },
  hover: {
    y: [-2, -6, 0],
    transition: {
      duration: 0.4,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
}

const LandingPage = () => {

const [isDark, setIsDark] = useState(false);
  const { isDarkMode } = useTheme() 
useEffect(() => {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [isDark]);

  const [currentStat, setCurrentStat] = useState(0)
  const [tab, setTab] = useState("projects")
  const navigate = useNavigate()

  const stats = [
    { value: "$2.8M", label: "Total Funding Raised", icon: DollarSign },
    { value: "150+", label: "Successful Projects", icon: Target },
    { value: "500+", label: "Active Investors", icon: Users },
    { value: "95%", label: "Success Rate", icon: Award },
  ]

  const features = [
    { title: "AI Deal Analysis", description: "Advanced algorithms to suggest matches.", icon: <Zap className='h-8 w-8 text-emerald-600' /> },
    { title: "Smart Notifications", description: "Real-time alerts for new opportunities.", icon: <Bell className='h-8 w-8 text-emerald-600' /> },
    { title: "Offer Filtering", description: "Advanced filters for investment criteria.", icon: <Filter className='h-8 w-8 text-emerald-600' /> },
    { title: "Secure Submission", description: "Confidence in IP protection.", icon: <Shield className='h-8 w-8 text-emerald-600' /> },
  ]
const [topInvestors, setTopInvestors] = useState([]);
const [topProjectOwners, setTopProjectOwners] = useState([])
useEffect(() => {
  const fetchTopOwners = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/projectowner/top-project-owners/")
      setTopProjectOwners(res.data)
    } catch (error) {
      console.error("❌ Failed to fetch top project owners:", error)
    }
  }

  fetchTopOwners()
}, [])
  const projects = [
  {
    name: "EcoTech Solutions",
    category: "Clean Energy",
    description: "Innovative solar panel technology with 40% higher efficiency than market standards.",
    goal: "$2.5M",
    percentage: 75,
  },
  {
    name: "MediSync",
    category: "Healthcare",
    description: "AI-powered diagnostic tool for early detection of cardiovascular diseases.",
    goal: "$1.8M",
    percentage: 60,
  },
  {
    name: "UrbanFarm",
    category: "AgriTech",
    description: "Vertical farming solution for urban environments with minimal water consumption.",
    goal: "$3.2M",
    percentage: 85,
  },
  {
    name: "FinSecure",
    category: "FinTech",
    description: "Blockchain-based security system for financial transactions with zero fraud incidents.",
    goal: "$1.5M",
    percentage: 45,
  },
  {
    name: "EduSmart",
    category: "EdTech",
    description: "Interactive platform for personalized online learning experiences.",
    goal: "$2.0M",
    percentage: 55,
  },
  {
    name: "AquaClean",
    category: "Environment",
    description: "AI-based water purification system for underserved regions.",
    goal: "$2.7M",
    percentage: 70,
  },
];

 const investorCards = [
    {
      name: "Green Future Capital",
      sectors: "Sustainability, Clean Energy",
      investments: 24,
      rate: "92%",
    },
    {
      name: "Horizon Ventures",
      sectors: "Technology, Healthcare",
      investments: 36,
      rate: "88%",
    },
    {
      name: "Innovation Partners",
      sectors: "AI, Robotics, IoT",
      investments: 18,
      rate: "94%",
    },
    {
      name: "Global Growth Fund",
      sectors: "Diverse Industries",
      investments: 42,
      rate: "85%",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])
useEffect(() => {
  const fetchTopInvestors = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/investor/top-investors/");
      setTopInvestors(res.data);
    } catch (error) {
      console.error("❌ Error fetching top investors:", error);
    }
  };

  fetchTopInvestors();
}, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
<nav className="bg-white shadow fixed w-full top-0 z-50 dark:bg-gray-800 dark:shadow-md">
  <div className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
    <div className="pl-0">
      <Link to="/" className="flex items-center">
        <img
          src={isDarkMode ? "/logo-dark2.png" : "/logo1.png"}
          alt="Smart Bidder Logo"
          className="h-10 w-auto object-contain"
        />
      </Link>
    </div>
    <div className="hidden md:flex items-center gap-6 text-[15px] font-medium">
      

      <button
        onClick={() => setIsDark(!isDark)}
        className="text-gray-500 dark:text-yellow-300 hover:text-emerald-600 transition"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600">Login</Link>
      <Link to="/register" className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Register</Link>
    </div>
  </div>
</nav>
     <section className="relative bg-gradient-to-r from-blue-900 to-emerald-800 overflow-hidden pt-20">
  <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
      Where Ideas Meet Investors
    </h1>
    <p className="text-xl md:text-2xl text-gray-200 mb-10">
      Connect your innovative projects with the right investors through our AI-powered platform.
    </p>
    <button
      onClick={() => navigate("/register")}
      className="px-8 py-4 bg-white text-blue-900 rounded-md text-lg font-medium hover:bg-gray-100"
    >
      Join SmartBidder
    </button>
  </div>
  <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
    <svg
      className="relative block w-full h-[80px] text-white dark:text-gray-900"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <path
        d="M321.39 56.44C229.18 68.3 114.72 73.37 0 60V120H1200V0C1110.64 27.51 978.68 55.56 842.91 55.56 
        708.94 55.56 573.79 40.39 435.96 46.79 
        396.15 48.64 359.65 52.05 321.39 56.44Z"
        fill="currentColor"
      ></path>
    </svg>
  </div>
</section>
     <section className="py-20 text-center px-4">
  <div className="max-w-4xl mx-auto">
     <div className="max-w-3xl mx-auto">
    <Brain className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
    </div>
    <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
      Revolutionizing Investment Connections
    </h2>
    <p className="text-gray-600 text-xl leading-relaxed">
      SmartBidder is an innovative platform that leverages artificial intelligence to create meaningful connections between entrepreneurs 
      with groundbreaking ideas and investors seeking promising opportunities. Our AI-enhanced matching algorithms analyze projects and investor 
      preferences to suggest the most compatible partnerships, 
      increasing the chances of successful funding and collaboration.
    </p>
  </div>
</section>
   <section className="py-20 bg-white dark:bg-gray-900 px-4 transition-colors duration-300">
  <div className="max-w-7xl mx-auto text-center mb-12">
    <motion.h2
      className="text-3xl font-bold text-gray-900 dark:text-white"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      Choose Your Role
    </motion.h2>
    <motion.p
      className="text-gray-600 dark:text-gray-300"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
    >
      SmartBidder caters to different users with specialized features for each role.
    </motion.p>
  </div>

  <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
    <motion.div
      className="bg-blue-50 dark:bg-gray-800 rounded-2xl p-8 text-left shadow cursor-pointer transition-colors duration-300"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.06, transition: { duration: 0.1, ease: 'easeOut' } }}
      transition={{ duration: 0.6, delay: 0.1 }}
      viewport={{ once: true }}
    >
      <motion.div
        variants={iconBounce}
        initial="initial"
        whileHover="hover"
        className="text-yellow-500 mb-4"
      >
        <LightbulbIcon className="w-8 h-8" />
      </motion.div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Entrepreneur</h3>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Showcase your innovative ideas and connect with potential investors.
      </p>
      <ul className="text-blue-500 dark:text-blue-300 space-y-1 text-m">
        <li>✔ AI-powered investor matching</li>
        <li>✔ Secure project submission</li>
        <li>✔ Feedback from industry experts</li>
        <li>✔ Guided funding process</li>
      </ul>
    </motion.div>

    <motion.div
      className="bg-green-50 dark:bg-gray-800 rounded-2xl p-8 text-left shadow cursor-pointer transition-colors duration-300"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.06, transition: { duration: 0.1, ease: 'easeOut' } }}
      transition={{ duration: 0.6, delay: 0.1 }}
      viewport={{ once: true }}
    >
      <motion.div
        variants={iconBounce}
        initial="initial"
        whileHover="hover"
        className="text-green-500 mb-4"
      >
        <TrendingUp className="w-8 h-8" />
      </motion.div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Investor</h3>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Discover promising projects aligned with your investment criteria.
      </p>
      <ul className="text-green-600 dark:text-green-400 space-y-1 text-m">
        <li>✔ Smart project recommendations</li>
        <li>✔ Detailed analytics and insights</li>
        <li>✔ Direct communication channels</li>
        <li>✔ Portfolio management tools</li>
      </ul>
    </motion.div>
  </div>
</section>
<section className="py-20 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
  <div className="max-w-7xl mx-auto text-center mb-12">
    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Platform Features</h2>
    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
      SmartBidder offers a suite of powerful tools designed to streamline the investment process.
    </p>
  </div>

  <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
    {[
      {
        icon: <Network className="w-6 h-6 text-emerald-600" />,
        title: "AI Deal Analysis",
        description:
          "Our advanced algorithms analyze projects and investor preferences to suggest the most compatible matches.",
      },
      {
        icon: <Bell className="w-6 h-6 text-emerald-600" />,
        title: "Smart Notifications",
        description:
          "Stay updated with real-time alerts about new opportunities that match your criteria.",
      },
      {
        icon: <Filter className="w-6 h-6 text-emerald-600" />,
        title: "Offer Filtering",
        description:
          "Customize your search with advanced filters to find exactly what you're looking for.",
      },
      {
        icon: <Shield className="w-6 h-6 text-emerald-600" />,
        title: "Secure Project Submission",
        description:
          "Submit your projects with confidence knowing your intellectual property is protected.",
      },
    ].map((feat, i) => (
      <div
        key={i}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow transition-all transform hover:scale-105 hover:shadow-lg relative overflow-hidden
        after:absolute after:bottom-0 after:left-0 after:h-[4px] after:w-0 hover:after:w-full after:bg-emerald-500 after:transition-all after:duration-300"
      >
        <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mx-auto mb-6">
          {feat.icon}
        </div>
        <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">{feat.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{feat.description}</p>
      </div>
    ))}
  </div>
</section>

      
<section className="py-20 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
  <div className="max-w-7xl mx-auto text-center mb-16">
    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Top Profiles</h2>
    <p className="text-gray-500 dark:text-gray-300 text-lg max-w-2xl mx-auto">
      Discover our featured projects and investors making waves on SmartBidder.
    </p>
    <div className="mt-8 flex justify-center gap-8 border-b border-gray-300 dark:border-gray-600 max-w-md mx-auto">
      <button
        onClick={() => setTab("projects")}
        className={`pb-3 text-lg font-medium transition ${
          tab === "projects"
            ? "text-emerald-600 border-b-2 border-emerald-600"
            : "text-gray-500 dark:text-gray-300 hover:text-emerald-600"
        }`}
      >
        Top Project Owners
      </button>
      <button
        onClick={() => setTab("investors")}
        className={`pb-3 text-lg font-medium transition ${
          tab === "investors"
            ? "text-emerald-600 border-b-2 border-emerald-600"
            : "text-gray-500 dark:text-gray-300 hover:text-emerald-600"
        }`}
      >
        Top Investors
      </button>
    </div>
  </div>

{tab === "projects" && (
  <div className="relative max-w-7xl mx-auto">
    <div className="flex justify-end mb-4 px-4 gap-2">
      <button
        onClick={() => {
          const container = document.getElementById("projects-scroll")
          container.scrollBy({ left: -300, behavior: "smooth" })
        }}
        className="p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-emerald-500 hover:text-white transition"
      >
        ←
      </button>
      <button
        onClick={() => {
          const container = document.getElementById("projects-scroll")
          container.scrollBy({ left: 300, behavior: "smooth" })
        }}
        className="p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-emerald-500 hover:text-white transition"
      >
        →
      </button>
    </div>

    <div
      id="projects-scroll"
      className="flex gap-6 overflow-x-scroll px-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
    >
    {topProjectOwners.map((owner, index) => (
  <div
    key={index}
    className="min-w-[270px] max-w-[270px] bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.03] group snap-start text-center"
  >
    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 mx-auto mb-4 flex items-center justify-center overflow-hidden">
      {owner.profile_picture_url ? (
        <img
          src={owner.profile_picture_url}
          alt={owner.user.full_name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-gray-400 text-2xl">👤</span>
      )}
    </div>
    <h3 className="font-bold mb-1 text-gray-900 dark:text-white">
      {owner.user.full_name}
    </h3>
  </div>
))}

    </div>
  </div>
)}

  {tab === "investors" && (
  <div className="relative max-w-7xl mx-auto">
    <div className="flex justify-end mb-4 px-4 gap-2">
      <button
        onClick={() => {
          const container = document.getElementById("investor-scroll");
          container.scrollBy({ left: -300, behavior: "smooth" });
        }}
        className="p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-emerald-500 hover:text-white transition"
      >
        ←
      </button>
      <button
        onClick={() => {
          const container = document.getElementById("investor-scroll");
          container.scrollBy({ left: 300, behavior: "smooth" });
        }}
        className="p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-emerald-500 hover:text-white transition"
      >
        →
      </button>
    </div>

    <div
      id="investor-scroll"
      className="flex gap-6 overflow-x-scroll scroll-smooth snap-x snap-mandatory px-4 scrollbar-hide"
    >
      {topInvestors.map((investor, i) => (
        <div
          key={investor.id}
          className="min-w-[270px] max-w-[270px] bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.03] group snap-start text-center"
        >
          <div className="w-20 h-20 rounded-full overflow-hidden shadow mx-auto mb-4 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {investor.profile_picture ? (
              <img
                src={investor.profile_picture}
                alt={investor.user.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-2xl">👤</span>
            )}
          </div>
          <h3 className="font-bold mb-1 text-gray-900 dark:text-white">
            {investor.user.full_name}
          </h3>
        </div>
      ))}
    </div>
  </div>
)}

</section>

<section className="py-20 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
    <div>
      <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Platform Preview</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
        Our AI-powered dashboard provides real-time insights and analytics to help you make informed decisions. Track your projects,
        monitor investments, and receive personalized recommendations all in one place
      </p>
      <ul className="list-inside text-gray-600 dark:text-gray-300 space-y-2 text-base">
        <li>✅ Customizable widgets for personalized experience</li>
        <li>✅ Real-time notifications and updates</li>
        <li>✅ Advanced analytics and reporting tools</li>
      </ul>
    </div>
    <div className="relative w-full h-[420px] bg-gray-200 dark:bg-gray-700 rounded-2xl border-4 border-white dark:border-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-200 text-xl shadow-lg overflow-hidden">
      <video
        className="w-full h-full object-cover rounded-2xl z-10"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/Demo.mp4" type="video/mp4" />

        Your browser does not support the video tag.
      </video>
      <div className="absolute bottom-[-40px] left-[-40px] w-36 h-36 bg-emerald-300 opacity-30 rounded-full z-0"></div>
      <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-amber-300 opacity-30 rounded-full z-0"></div>
    </div>
  </div>
</section>
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900 to-emerald-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-12 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between">
              <div className="md:max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Join SmartBidder?</h2>
                <p className="text-lg md:text-xl text-gray-200 mb-8 md:mb-0">
                  Choose your role and start connecting with the right partners today.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigate("/register?type=entrepreneur")} className="px-8 py-4 rounded-md bg-white text-blue-900 font-medium hover:bg-gray-100 transition-colors">Sign Up as Entrepreneur</button>
                <button onClick={() => navigate("/register?type=investor")} className="px-8 py-4 rounded-md bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors">Sign Up as Investor</button>
              </div>
            </div>
          </div>
        </div>
      </section>

     <Footer/>
    </div>
  )
}

export default LandingPage
