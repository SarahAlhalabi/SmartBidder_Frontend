"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Upload, User, Check } from "lucide-react"
import { useLocation } from "react-router-dom"
import { useEffect } from "react"
import { useTheme } from "../../contexts/ThemeContext"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const RegisterPage = ({ darkMode, direction }) => {
  const location = useLocation()
const [hasCompany, setHasCompany] = useState(false)

useEffect(() => {
  if (location.state?.role) {
    setFormData((prev) => ({
      ...prev,
      role: location.state.role,
    }))
  }
}, [location.state])
const { isDarkMode, toggleTheme } = useTheme()
const logoSrc = isDarkMode ? "/logo-dark2.png" : "/logo1.png"

  const [showPassword, setShowPassword] = useState(false)
const [formData, setFormData] = useState({
  role: "entrepreneur",
  fullName: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  bio: "",
  profilePicture: null,
  idCardPicture: null,
  termsAccepted: false,
  company_name: "",  
  commercial_register: "",
  commercial_register_image: null,
})

  const [profilePreview, setProfilePreview] = useState(null)
  const [idCardPreview, setIdCardPreview] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target

    if (type === "file") {
      const file = files[0]
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }))
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (name === "profilePicture") {
            setProfilePreview(reader.result)
          } else if (name === "idCardPicture") {
            setIdCardPreview(reader.result)
          }
        }
        reader.readAsDataURL(file)
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

const handleSubmit = async (e) => {
  e.preventDefault()

  const form = new FormData()
  form.append("username", formData.username)
  form.append("email", formData.email)
  form.append("password", formData.password)
  form.append("phone_number", formData.phone)
  form.append("bio", formData.bio)
  form.append("full_name", formData.fullName)
  form.append("terms_agreed", formData.termsAccepted ? "true" : "false")
  if (formData.profilePicture) {
    form.append("profile_picture", formData.profilePicture)
  }
  if (formData.idCardPicture) {
    form.append("id_card_picture", formData.idCardPicture)
  }
  if (formData.role === "investor" && hasCompany === true) {
    if (formData.company_name) {
      form.append("company_name", formData.company_name)
    }
    if (formData.commercial_register) {
      form.append("commercial_register", formData.commercial_register)
    }
    if (
      formData.commercial_register_image &&
      formData.commercial_register_image instanceof File
    ) {
      form.append("commercial_register_image", formData.commercial_register_image)
    }
  }
  const endpoint =
    formData.role === "investor"
      ? "http://127.0.0.1:8000/accounts/register/investor/"
      : "http://127.0.0.1:8000/accounts/register/project-owner/"

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: form,
    })

    const data = await response.json()

    if (response.ok) {
      toast.success(
        "Your account has been created. It will be reviewed and approval will be sent to your email.",
        {
          position: "top-center",
          autoClose: 5000,
        }
      )
      setTimeout(() => {
        navigate("/login", { replace: true })
      }, 3000)
    } else {
      console.error("Registration error:", data)
      alert("Registration failed. Please check your input.")
    }
  } catch (error) {
    console.error("Network error:", error)
    alert("Something went wrong. Please try again later.")
  }
}
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const navigate = useNavigate()
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
      <div className="text-center">
  <Link to="/" className="inline-block">
    <img
      src={logoSrc}
      alt="Smart Bidder Logo"
      className="h-20 w-auto mx-auto mb-1 object-contain"
    />
  </Link>
  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Where Ideas Meet Investors</p>
</div>

        <div
          className={`mt-8 bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 ${
            direction === "rtl" ? "text-right" : "text-left"
          }`}
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            {direction === "rtl" ? "إنشاء حساب جديد" : "Create a New Account"}
          </h2>

         <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {direction === "rtl" ? "اختر دورك" : "Choose Your Role"}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`
                  flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all
                  ${
                    formData.role === "entrepreneur"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                      : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }
                `}
                >
                  <input
                    type="radio"
                    name="role"
                    value="entrepreneur"
                    checked={formData.role === "entrepreneur"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-2">
                      <svg
                        className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {direction === "rtl" ? "رائد أعمال" : "Entrepreneur"}
                    </div>
                  </div>
                </label>

                <label
                  className={`
                  flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all
                  ${
                    formData.role === "investor"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                      : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }
                `}
                >
                  <input
                    type="radio"
                    name="role"
                    value="investor"
                    checked={formData.role === "investor"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-2">
                      <svg
                        className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {direction === "rtl" ? "مستثمر" : "Investor"}
                    </div>
                  </div>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {direction === "rtl" ? "الاسم الكامل" : "Full Name"}
                </label>
                <div className="mt-1">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder={direction === "rtl" ? "أدخل اسمك الكامل" : "Enter your full name"}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {direction === "rtl" ? "اسم المستخدم" : "Username"}
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder={direction === "rtl" ? "أدخل اسم المستخدم" : "Enter your username"}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {direction === "rtl" ? "البريد الإلكتروني" : "Email"}
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder={direction === "rtl" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {direction === "rtl" ? "رقم الهاتف" : "Phone Number"}
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder={direction === "rtl" ? "أدخل رقم هاتفك" : "Enter your phone number"}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {direction === "rtl" ? "كلمة المرور" : "Password"}
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder={direction === "rtl" ? "أدخل كلمة المرور" : "Enter your password"}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {direction === "rtl"
                  ? "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل"
                  : "Password must be at least 8 characters long"}
              </p>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {direction === "rtl" ? "نبذة عنك" : "Bio"}
              </label>
              <div className="mt-1">
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder={
                    direction === "rtl"
                      ? formData.role === "entrepreneur"
                        ? "اكتب نبذة عن مشروعك أو فكرتك"
                        : "اكتب نبذة عن خبرتك الاستثمارية"
                      : formData.role === "entrepreneur"
                        ? "Write about your project or idea"
                        : "Write about your investment experience"
                  }
                />
              </div>
            </div>
{formData.role === "investor" && (
  <>
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {direction === "rtl" ? "هل لديك شركة؟" : "Do you have a company?"}
      </label>
      <div className="flex space-x-4 rtl:space-x-reverse">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="hasCompany"
            value="yes"
            checked={hasCompany === true}
            onChange={() => setHasCompany(true)}
            className="text-emerald-600 focus:ring-emerald-500"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            {direction === "rtl" ? "نعم" : "Yes"}
          </span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="hasCompany"
            value="no"
            checked={hasCompany === false}
            onChange={() => setHasCompany(false)}
            className="text-emerald-600 focus:ring-emerald-500"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            {direction === "rtl" ? "لا" : "No"}
          </span>
        </label>
      </div>
    </div>
    {hasCompany && (
      <>
        <div className="mt-4">
          <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {direction === "rtl" ? "اسم الشركة" : "Company Name"}
          </label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            value={formData.company_name || ""}
            onChange={handleChange}
            required={hasCompany}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            placeholder={direction === "rtl" ? "أدخل اسم الشركة" : "Enter company name"}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="commercial_register" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {direction === "rtl" ? "رقم السجل التجاري" : "Commercial Register Number"}
          </label>
          <input
            type="text"
            id="commercial_register"
            name="commercial_register"
            value={formData.commercial_register || ""}
            onChange={handleChange}
            required={hasCompany}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            placeholder={direction === "rtl" ? "أدخل رقم السجل التجاري" : "Enter commercial register number"}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="commercial_register_image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {direction === "rtl" ? "صورة السجل التجاري" : "Commercial Register Image"}
          </label>
          <input
            type="file"
            id="commercial_register_image"
            name="commercial_register_image"
            accept="image/*"
            onChange={handleChange}
            required={hasCompany}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-emerald-50 file:text-emerald-700
              hover:file:bg-emerald-100"
          />
        </div>
      </>
    )}
  </>
)}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
  <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    {direction === "rtl" ? "الصورة الشخصية" : "Profile Picture"}
  </label>

  <label
    htmlFor="profilePicture"
    className="cursor-pointer flex justify-center items-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 transition-all hover:border-emerald-500"
  >
    {profilePreview ? (
      <div className="relative w-full h-32">
        <img
          src={profilePreview}
          alt="Profile preview"
          className="w-full h-full object-cover rounded-lg"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setProfilePreview(null)
            setFormData((prev) => ({ ...prev, profilePicture: null }))
          }}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1..." clipRule="evenodd" />
          </svg>
        </button>
      </div>
    ) : (
      <div className="text-center">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {direction === "rtl" ? "انقر هنا لاختيار صورة" : "Click here to select an image"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
      </div>
    )}
    <input
      id="profilePicture"
      name="profilePicture"
      type="file"
      accept="image/*"
      onChange={handleChange}
      className="sr-only"
    />
  </label>
</div>
<div>
  <label htmlFor="idCardPicture" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    {direction === "rtl" ? "صورة الهوية" : "ID Card Picture"}
  </label>

  <label
    htmlFor="idCardPicture"
    className="cursor-pointer flex justify-center items-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 transition-all hover:border-emerald-500"
  >
    {idCardPreview ? (
      <div className="relative w-full h-32">
        <img
          src={idCardPreview}
          alt="ID preview"
          className="w-full h-full object-cover rounded-lg"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIdCardPreview(null)
            setFormData((prev) => ({ ...prev, idCardPicture: null }))
          }}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1..." clipRule="evenodd" />
          </svg>
        </button>
      </div>
    ) : (
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {direction === "rtl" ? "انقر هنا لاختيار صورة" : "Click here to select an image"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
      </div>
    )}
    <input
      id="idCardPicture"
      name="idCardPicture"
      type="file"
      accept="image/*"
      onChange={handleChange}
      className="sr-only"
    />
  </label>
</div>
              </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="termsAccepted"
                  name="termsAccepted"
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  required
                  className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="termsAccepted" className="font-medium text-gray-700 dark:text-gray-300">
                  {direction === "rtl"
                    ? "أوافق على الشروط والأحكام وسياسة الخصوصية"
                    : "I agree to the Terms and Conditions and Privacy Policy"}
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  {direction === "rtl"
                    ? "بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بنا."
                    : "By registering, you agree to our Terms of Service and Privacy Policy."}
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!formData.termsAccepted}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  formData.termsAccepted
                    ? "bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Check
                    className={`h-5 w-5 ${
                      formData.termsAccepted ? "text-emerald-500 group-hover:text-emerald-400" : "text-gray-300"
                    }`}
                    aria-hidden="true"
                  />
                </span>
                {direction === "rtl" ? "إنشاء حساب" : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {direction === "rtl" ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
              <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                {direction === "rtl" ? "تسجيل الدخول" : "Login"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
