import React, { useState } from "react"; 
import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Mountain, Briefcase, Users, Lightbulb, CheckCircle, Info, Edit3, Package, Lock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";
import TermsAndConditionsCard from "./TermsAndConditionsCard";
import PrivacyPolicyCard from "./PrivacyPolicyCard"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};
function OurServices() {
  const services = [
    {
      icon: <Package className="h-12 w-12 text-primary mb-4" />,
      title: "Investment Bidding Platform",
      desc: "User-friendly and secure platform facilitating direct offers and negotiations between investors and project owners.",
    },
    {
      icon: <Lightbulb className="h-12 w-12 text-primary mb-4" />,
      title: "Advanced Analytics & AI Insights",
      desc: "AI-powered tools providing smart recommendations and data-driven decision support for investment opportunities.",
    },
    {
      icon: <Users className="h-12 w-12 text-primary mb-4" />,
      title: "Secure Communication Tools",
      desc: "Integrated channels ensuring seamless and confidential discussions and collaborations.",
    },
    {
      icon: <Briefcase className="h-12 w-12 text-primary mb-4" />,
      title: "Project Feasibility & Evaluation",
      desc: "Detailed feasibility studies and evaluation reports to help investors understand risks and potentials.",
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-primary mb-4" />,
      title: "Complaint & Support System",
      desc: "Dedicated support and complaint management ensuring timely resolutions and enhanced user experience.",
    },
    {
      icon: <Mountain className="h-12 w-12 text-primary mb-4" />,
      title: "Comprehensive Project Monitoring",
      desc: "Real-time tracking and updates for ongoing investment projects to ensure transparency and accountability.",
    },
  ];

  return (
    
    <motion.section
      id= "services" className=" w-full py-12 md:py-24 lg:py-32 bg-muted"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={containerVariants}
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-[900px] mx-auto">
          <div className="space-y-2">
           <div className="w-full max-w-6xl -mt-10 px-2 py-6 md:py-8 flex flex-col items-center bg-transparent text-center">
  <div className="flex items-center justify-center gap-4">
    <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
      <Package className="h-6 w-6" />
    </div>
    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white -my-14 ">
      Our Services
    </h1>
  </div>
  <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 mx-auto" />
</div>

            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We offer a range of cutting-edge solutions designed to streamline the investment process for both project owners and investors.
            </p>
          </div>
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-12 justify-center"
          variants={containerVariants}
        >
          {services.map(({ icon, title, desc }, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="flex flex-col items-center text-center p-6">
                {icon}
                <CardTitle className="text-xl font-bold mb-2">{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default function AboutUsPage() {
  const [showMore, setShowMore] = useState(false);
  const [showFull, setShowFull] = useState(false);
const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  const [modalOpen, setModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [defendantName, setDefendantName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const shortText = "Smart Bidder is an innovative platform designed to streamline and optimize the investment bidding process for project owners and investors...";
  const fullText = `Smart Bidder is an innovative platform designed to streamline and optimize the investment bidding process for project owners and investors. Our mission is to empower entrepreneurs by connecting them with the best investment offers, while providing investors with transparent, data-driven opportunities that maximize returns. With advanced AI-driven analytics and seamless communication tools, Smart Bidder ensures smarter decision-making, faster deal closures, and long-term partnerships built on trust and mutual growth. At Smart Bidder, we believe in transforming the investment landscape to be more accessible, efficient, and beneficial for all stakeholders.`;

 const handleComplaintSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  try {
    const token = localStorage.getItem("accessToken");
    await axios.post(
      "http://127.0.0.1:8000/adminAccounts/submit-complaint/",
      {
        description,
        defendant_username: defendantName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Your complaint was submitted successfully");
    setDescription("");
    setDefendantName("");
    setModalOpen(false);
  } catch (err) {
    if (err.response && err.response.data) {
      const msg =
        err.response.data.defendant_username?.[0] ||
        "Something went wrong while submitting your complaint";
      toast.error(msg);
    } else {
      toast.error("Unable to connect to the server. Please try again later.");
    }
  }
};
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="flex flex-col min-h-[100vh]">
      <Header />
      <main className="flex-1">
        <section id ="about" className="w-full py-16 bg-muted">
          <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex flex-col max-w-xl mx-auto text-center lg:text-left">
              <div className="w-full max-w-6xl -mt-10 px-2 py-6 md:py-8 flex items-center gap-4 bg-transparent">
                <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
                  <Info className="h-6 w-6" />
                </div>
                <div>
                  <h1  className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">About Us</h1>
                  <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
                </div>
              </div>
              <p className="text-lg leading-relaxed text-gray-700 mb-8">{showMore ? fullText : shortText}</p>
              <div className="flex justify-center lg:justify-start gap-4">
                <button className="btn-primary px-6 py-2 rounded" onClick={() => setShowMore(!showMore)}>
                  {showMore ? "Show Less" : "Learn More"}
                </button>
                <button
                  className="px-6 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition font-semibold text-lg shadow-sm"
                  onClick={() => setModalOpen(true)}
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <div className="w-full max-w-6xl -mt-10 px-2 py-6 md:py-8 flex items-center gap-4 bg-transparent">
                <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
                  <Edit3 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Contact Us, We’re Here to Help</h1>
                  <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
                </div>
              </div>

              <div className="mb-4 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                Do you have a problem? Submit a complaint.
              </div>

              <form onSubmit={handleComplaintSubmit}>
                {error && <p className="text-red-600 mb-2">{error}</p>}
                {success && <p className="text-green-600 mb-2">{success}</p>}

                <label className="block text-sm font-medium mb-1 mt-4">Description</label>
                <textarea
                  className="input-field mb-3"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />

                <label className="block text-sm font-medium mb-1">Full name of the defendant</label>
                <input
                  className="input-field mb-3"
                  type="text"
                  value={defendantName}
                  onChange={(e) => setDefendantName(e.target.value)}
                  required
                />

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setDescription("");
                      setDefendantName("");
                      setError("");
                      setSuccess("");
                      setModalOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
        <OurServices />
 <PrivacyPolicyCard/>
             <TermsAndConditionsCard />
      </main>
  <Footer onOpenContact={() => setModalOpen(true)} />
    </div>
   
  );
}
