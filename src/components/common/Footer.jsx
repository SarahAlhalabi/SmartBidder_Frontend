import { Link } from "react-router-dom"
import { MountainIcon } from "lucide-react"

export default function Footer({ onOpenContact }) {
  return (
    <footer className="flex flex-col sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 bg-gray-900 text-gray-300 justify-between">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center justify-center text-gray-100">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Smart Bidder</span>
        </Link>
        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Smart Bidder. All rights reserved.</p>
      </div>
   <nav className="flex flex-1 justify-center gap-6 sm:gap-8">
  <Link to="/about#about" className="text-m hover:text-primary transition-colors">About</Link>
  <Link to="/about#services" className="text-m hover:text-primary transition-colors">Services</Link>
  <Link to="/about#privacy" className="text-m hover:text-primary transition-colors">Privacy Policy</Link>
  <Link to="/about#terms" className="text-m hover:text-primary transition-colors">Terms of Service</Link>
  <button
    type="button"
    onClick={onOpenContact}
    className="text-m hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
  >
    Contact
  </button>
</nav>
      <div className="flex flex-col text-sm text-gray-400 space-y-1 ml-auto text-right">
        <p>Phone: <a href="tel:+1234567890" className="hover:text-primary">+963945455907</a></p>
        <p>Email: <a href="mailto:support@smartbidder.com" className="hover:text-primary">support@smartbidder.com</a></p>
      </div>
    </footer>
  )
}
