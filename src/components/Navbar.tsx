import { useState } from "react"
import { NavLink } from "react-router"
import GhanaFlag from "../assets/images/ghana-flag.png"

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/report", label: "Report Activity" },
  { to: "/about", label: "About" },
  { to: "/dashboard", label: "Reports Dashboard" },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "font-semibold text-green-800"
      : "text-gray-700 transition hover:text-green-800"

  return (
    <nav className="sticky top-0 z-50 border-b bg-white px-4 py-4 sm:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={GhanaFlag}
            alt="Ghana flag"
            className="h-6 w-9 rounded-sm object-cover"
          />

          <h2 className="text-lg font-bold text-green-800 sm:text-xl">
            Galamsey Reporter
          </h2>
        </div>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClassName}>
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 md:hidden"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div className="mt-4 flex flex-col gap-1 border-t pt-4 md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-base ${
                  isActive
                    ? "bg-green-50 font-semibold text-green-800"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar