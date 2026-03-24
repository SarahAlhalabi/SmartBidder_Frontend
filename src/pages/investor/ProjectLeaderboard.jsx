"use client"

import { useState, useEffect } from "react"
import { Trophy, Medal, Award, Star, Crown } from "lucide-react"
import { useLanguage } from "../../contexts/LanguageContext"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import { motion } from "framer-motion"
import axios from "axios"

const ProjectOwnerLeaderboard = () => {
  const { t } = useLanguage()
  const [projectOwners, setProjectOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTopOwners = async () => {
      setLoading(true)
      try {
        const res = await axios.get("http://127.0.0.1:8000/projectowner/top-project-owners/")
        const sorted = res.data.sort((a, b) => b.final_rating - a.final_rating)
        setProjectOwners(sorted)
        setError(null)
      } catch (err) {
        setError("Failed to load top project owners")
      } finally {
        setLoading(false)
      }
    }
    fetchTopOwners()
  }, [])

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30"
      case 2:
        return "text-gray-700 bg-gray-200 dark:bg-gray-700/50"
      case 3:
        return "text-orange-700 bg-orange-100 dark:bg-orange-900/30"
      default:
        return "text-gray-500 dark:text-gray-400"
    }
  }

  const getPodiumBadge = (rank) => {
    let bgColor = ""
    if (rank === 1) bgColor = "from-yellow-400 to-yellow-600 shadow-yellow-500/60"
    else if (rank === 2) bgColor = "from-gray-400 to-gray-600 shadow-gray-500/60"
    else if (rank === 3) bgColor = "from-orange-400 to-orange-600 shadow-orange-500/60"
    else return null

    return (
      <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br ${bgColor} shadow-lg flex items-center justify-center text-white z-50`}>
        <Crown className="w-8 h-8" />
      </div>
    )
  }

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading top project owners...</p>
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>

  const topThree = projectOwners.slice(0, 3)
  const rest = projectOwners.slice(3)

  const [first, second, third] = topThree

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <Header />

      <div className="flex-grow max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl -mt-10 px-2 py-6 md:py-8 flex items-center gap-4 bg-transparent">
          <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Top Project Owners
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
          </div>
        </div>
        <p className="text-m text-gray-500 -mt-6 mb-6 px-16">
          Discover and connect with the most successful entrepreneurs on our platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {second && (
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.15 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md pt-16 pb-6 px-6 flex flex-col items-center order-1 md:order-1">
              {getPodiumBadge(2)}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-4 ${getRankColor(2)} mb-4`}>2</div>
              <img src={second.profile_picture_url || "/placeholder.svg"} alt={second.user.full_name} className="w-24 h-24 rounded-full border-4 border-transparent hover:border-green-500 transition" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white text-center">{second.user.full_name}</h3>
              <div className="flex items-center justify-center space-x-2 text-yellow-500 mt-2">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-lg font-semibold text-gray-800 dark:text-white">{second.final_rating}</span>
              </div>
            </motion.div>
          )}

          {first && (
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.15 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md pt-20 pb-8 px-8 flex flex-col items-center order-2 md:order-2 md:col-span-1 transform md:scale-110 z-10">
              {getPodiumBadge(1)}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-4 ${getRankColor(1)} mb-6`}>1</div>
              <img src={first.profile_picture_url || "/placeholder.svg"} alt={first.user.full_name} className="w-32 h-32 rounded-full border-4 border-transparent hover:border-green-500 transition" />
              <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white text-center">{first.user.full_name}</h3>
              <div className="flex items-center justify-center space-x-2 text-yellow-500 mt-4">
                <Star className="w-7 h-7 fill-current" />
                <span className="text-2xl font-bold text-gray-800 dark:text-white">{first.final_rating}</span>
              </div>
            </motion.div>
          )}

          {third && (
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.15 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md pt-16 pb-6 px-6 flex flex-col items-center order-3 md:order-3">
              {getPodiumBadge(3)}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-4 ${getRankColor(3)} mb-4`}>3</div>
              <img src={third.profile_picture_url || "/placeholder.svg"} alt={third.user.full_name} className="w-24 h-24 rounded-full border-4 border-transparent hover:border-green-500 transition" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white text-center">{third.user.full_name}</h3>
              <div className="flex items-center justify-center space-x-2 text-yellow-500 mt-2">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-lg font-semibold text-gray-800 dark:text-white">{third.final_rating}</span>
              </div>
            </motion.div>
          )}
        </div>

        <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-12">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-purple-500 to-pink-500 mb-6 text-center">
            Other Top Project Owners
          </h2>

          <ul className="flex flex-col gap-4">
            {rest.map((owner, index) => (
              <motion.li key={owner.id} whileHover={{ scale: 1.03 }} transition={{ duration: 0.15 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-gray-100 dark:bg-gray-700 shadow-sm">
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold text-lg ${getRankColor(index + 4)}`}>
                    {index + 4}
                  </span>
                  <img src={owner.profile_picture_url || "/placeholder.svg"} alt={owner.user.full_name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600" />
                  <span className="text-lg font-medium text-gray-900 dark:text-white">{owner.user.full_name}</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-500 font-semibold text-lg">
                  <Star className="w-6 h-6 fill-current" />
                  <span>{owner.final_rating}</span>
                </div>
              </motion.li>
            ))}
            {rest.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No more project owners to show.
              </p>
            )}
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProjectOwnerLeaderboard
