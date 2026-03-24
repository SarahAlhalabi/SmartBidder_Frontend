"use client"

import React, { useEffect, useState } from "react"
import { Mail, Phone, UserCircle } from "lucide-react"
import Header from "../../components/common/Header"
import axios from "axios"
import { Link } from "react-router-dom"
import Footer from "../../components/common/Footer"

const Profile = () => {
  const [userData, setUserData] = useState(null)
  const [newImage, setNewImage] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const response = await axios.get("http://127.0.0.1:8000/projectowner/project-owner/update-profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUserData(response.data)
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }
    fetchProfile()
  }, [])
  useEffect(() => {
    const uploadImage = async () => {
      if (!newImage) return
      const formData = new FormData()
      formData.append("profile_picture", newImage)

      try {
        const token = localStorage.getItem("accessToken")
        await axios.patch(
          "http://127.0.0.1:8000/projectowner/project-owner/update-profile/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        setUserData((prev) => ({
          ...prev,
          profile_picture: URL.createObjectURL(newImage),
        }))
      } catch (error) {
        console.error("Error uploading profile picture:", error)
      }
    }

    uploadImage()
  }, [newImage])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex-grow flex flex-col">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
          <div>
            <div className="w-full max-w-6xl -mt-10 px-2 py-6 md:py-8 flex items-center gap-4 bg-transparent">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
                <UserCircle className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  My <span className="text-blue-600">Profile</span>
                </h1>
                <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
              </div>
            </div>
            <p className="text-m text-gray-500 -mt-6 mb-6 px-16">Manage your personal profile and public information</p>
          </div>

          {userData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="h-28 bg-gradient-to-r from-green-500 to-emerald-600 relative">
                  <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 absolute left-1/2 transform -translate-x-1/2 -bottom-12 overflow-hidden bg-gray-300">
                    <div className="relative w-full h-full group">
                      <img
                        src={userData.profile_picture || "/placeholder.svg"}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewImage(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        title="Change Profile Picture"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-16 pb-6 px-6 text-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{userData.full_name || "-"}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">@{userData.username || "-"}</p>

                  <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {userData.email || "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {userData.phone_number || "-"}
                    </div>
                  </div>
                  <div className="mt-6 text-left">
                    <p className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-1">ID Card</p>
                    <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img
                        src={userData.id_card_picture || "/id-placeholder.png"}
                        alt="ID Card"
                        className="w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About Me</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {userData.bio || "No bio available."}
                </p>

                <Link
                  to="/project-owner/edit-profile"
                  className="absolute top-6 right-6 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md shadow transition"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">Loading profile...</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Profile