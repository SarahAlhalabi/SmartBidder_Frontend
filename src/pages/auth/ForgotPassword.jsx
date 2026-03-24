"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { useTheme } from "../../contexts/ThemeContext"
import axios from "axios"

const ForgotPassword = ({ darkMode, direction }) => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const { isDarkMode } = useTheme()
  const logoSrc = isDarkMode ? "/logo-dark2.png" : "/logo1.png"

  const handleChange = (e) => {
    setEmail(e.target.value)
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !email.includes("@") || !email.includes(".")) {
      setError(direction === "rtl" ? "يرجى إدخال بريد إلكتروني صالح" : "Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await axios.post("http://localhost:8000/accounts/reset-password/", { email })
      setIsSubmitted(true)
    } catch (err) {
      const msg =
        err.response?.data?.email?.[0] ||
        err.response?.data?.detail ||
        (direction === "rtl" ? "حدث خطأ ما. الرجاء المحاولة مرة أخرى." : "Something went wrong. Please try again.")
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
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
          {!isSubmitted ? (
            <>
              <h2 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">
                {direction === "rtl" ? "إعادة تعيين كلمة المرور" : "Reset Your Password"}
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                {direction === "rtl"
                  ? "أدخل بريدك الإلكتروني وسنرسل لك كلمة مرور جديدة عشوائية"
                  : "Enter your email and we'll send you a new random password"}
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {direction === "rtl" ? "البريد الإلكتروني" : "Email Address"}
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={handleChange}
                      className={`appearance-none block w-full pl-10 px-3 py-2 border ${
                        error ? "border-red-300 dark:border-red-700" : "border-gray-300 dark:border-gray-600"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white`}
                      placeholder={direction === "rtl" ? "أدخل بريدك الإلكتروني" : "Enter your email address"}
                    />
                  </div>
                  {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-400 disabled:cursor-not-allowed"
                  >
                    {isLoading && (
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    {direction === "rtl"
                      ? isLoading
                        ? "جاري الإرسال..."
                        : "إرسال كلمة المرور الجديدة"
                      : isLoading
                      ? "Sending..."
                      : "Send New Password"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                {direction === "rtl" ? "تم إرسال البريد الإلكتروني!" : "Email Sent!"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {direction === "rtl"
                  ? `تم إرسال كلمة المرور الجديدة إلى البريد الإلكتروني: ${email}`
                  : `A new password has been sent to your email: ${email}`}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {direction === "rtl"
                  ? "إذا لم تستلم البريد الإلكتروني، يرجى التحقق من مجلد الرسائل غير المرغوب فيها أو المحاولة مرة أخرى."
                  : "If you don't receive the email, please check your spam folder or try again."}
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center font-medium text-emerald-600 hover:text-emerald-500">
              <ArrowLeft
                className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"} ${direction === "rtl" ? "transform rotate-180" : ""}`}
              />
              {direction === "rtl" ? "العودة إلى تسجيل الدخول" : "Back to Login"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
