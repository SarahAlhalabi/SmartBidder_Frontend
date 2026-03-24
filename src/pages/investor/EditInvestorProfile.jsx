"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"

const EditInvestorProfile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    commercial_register: "",
    profile_picture: null,
    id_card_picture: null,
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const response = await axios.get("http://127.0.0.1:8000/investor/profileInvestor/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setFormData((prev) => ({ ...prev, ...response.data }))
      } catch (error) {
        toast.error("Failed to fetch profile data.")
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setFormData({ ...formData, [name]: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("accessToken")
    const form = new FormData()
    for (let key in formData) {
      if (formData[key]) {
        form.append(key, formData[key])
      }
    }

    try {
      await axios.patch("http://127.0.0.1:8000/investor/profileInvestor/", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      toast.success("Profile updated successfully!")
      setTimeout(() => navigate("/investor/investor-profile"), 1500)
    } catch (error) {
      toast.error("Failed to update profile.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Edit Investor Profile</h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6">
          <div className="flex items-center space-x-6">
            <div className="shrink-0">
             <img
  className="h-16 w-16 object-cover rounded-full"
  src={
    formData.profile_picture instanceof File
      ? URL.createObjectURL(formData.profile_picture)
      : formData.profile_picture || user?.profile_picture || "/placeholder.svg"
  }
  alt="Current profile"
/>

            </div>
            <label className="block">
              <span className="text-sm text-gray-700 dark:text-gray-300">Upload New Picture</span>
              <input
                type="file"
                name="profile_picture"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} />
            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
            <InputField label="Phone Number" name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} />
            <InputField label="Company Name" name="company_name" value={formData.company_name} onChange={handleChange} />
            <InputField label="Commercial Register" name="commercial_register" value={formData.commercial_register} onChange={handleChange} />
          </div>

         
          <div className="text-right">
            <button type="submit"   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-2xl shadow transition"
>

              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-900 dark:text-white"
    />
  </div>
)

const InputFile = ({ label, name, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      type="file"
      name={name}
      accept="image/*"
      onChange={onChange}
      className="mt-1 w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
    />
    <Footer/>
  </div>
)

export default EditInvestorProfile
