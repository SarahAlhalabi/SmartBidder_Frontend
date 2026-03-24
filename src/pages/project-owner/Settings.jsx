"use client"

import { useState, useEffect } from "react"
import { Mail, Phone, Lock, Bell, Globe, Check, Edit, Settings } from "lucide-react"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import { useLanguage } from "../../contexts/LanguageContext"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const SettingsPage = () => {
  const { t, language, changeLanguage } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/login") 
    }
  }, [user])

  const [formData, setFormData] = useState({
    email: user?.email || "",
    phone: user?.phone || "",
    language: language,
  })

  const [notifications, setNotifications] = useState({
    email_notifications: true,
    sms_notifications: false,
    in_app_notifications: true,
  })

  const [editing, setEditing] = useState({
    email: false,
    phone: false,
  })

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (["current_password", "new_password", "confirm_password"].includes(name)) {
      setPasswordData({ ...passwordData, [name]: value })
    } else if (name in notifications) {
      setNotifications({ ...notifications, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSave = (field) => {
    setEditing({ ...editing, [field]: false })
    console.log(`Saving ${field}:`, formData[field])
    // TODO: API call
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/accounts/change-password/",
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ " + res.data.detail);
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setShowPasswordForm(false);
    } catch (error) {
      console.error("Server error:", error.response?.data || error.message);
      const message =
        error.response?.data?.detail || "❌ Failed to update password.";
      alert(message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex-grow flex flex-col">
        <div className="max-w-3xl mx-auto px-4 py-12 flex-grow w-full">
          <div>
            <div className="w-full max-w-6xl -mt-10 px-2 py-6 md:py-8 flex items-center gap-4 bg-transparent">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white"> Settings</h1>
                <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
              </div>
            </div>
            <p className="text-m text-gray-500 -mt-6 mb-6 px-16">Manage your account preferences and security settings</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6">
            <SettingRow icon={<Mail />} label="email" value={formData.email} editing={editing.email}
              onEdit={() => setEditing({ ...editing, email: true })}
              onSave={() => handleSave("email")}
              input={
                <input name="email" value={formData.email} onChange={handleChange} className="input" />
              }
            />
            <SettingRow icon={<Phone />} label="phone" value={formData.phone} editing={editing.phone}
              onEdit={() => setEditing({ ...editing, phone: true })}
              onSave={() => handleSave("phone")}
              input={
                <input name="phone" value={formData.phone} onChange={handleChange} className="input" />
              }
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">Change Password</span>
              </div>
              <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="text-sm text-emerald-600 hover:underline">
                {showPasswordForm ? "Cancel" : "Update"}
              </button>
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="current_password" type="password" placeholder="Current Password" value={passwordData.current_password} onChange={handleChange} className="input col-span-2" required />
                <input name="new_password" type="password" placeholder="New Password" value={passwordData.new_password} onChange={handleChange} className="input" required />
                <input name="confirm_password" type="password" placeholder="Confirm Password" value={passwordData.confirm_password} onChange={handleChange} className="input" required />
                <div className="md:col-span-2 text-right">
                  <button type="submit" className="btn-primary">Save Password</button>
                </div>
              </form>
            )}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white text-lg font-medium">Notification Preferences</span>
              </div>
              <div className="space-y-2 ml-7">
                {["email_notifications", "sms_notifications", "in_app_notifications"].map((key) => (
                  <label key={key} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                    <input type="checkbox" name={key} checked={notifications[key]} onChange={handleChange} />
                    {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
const SettingRow = ({ icon, label, value, editing, onEdit, onSave, input }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      {icon}
      {editing ? input : <span className="text-gray-900 dark:text-white">{value}</span>}
    </div>
    <button onClick={editing ? onSave : onEdit} className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
      {editing ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
      {editing ? "Save" : "Edit"}
    </button>
  </div>
)

export default SettingsPage