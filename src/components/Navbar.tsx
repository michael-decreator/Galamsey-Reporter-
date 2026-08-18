import { NavLink } from "react-router"
import GhanaFlag from "../assets/images/ghana-flag.png"

function Navbar() {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 border-b bg-white px-4 py-4 sm:px-8">
      <div className="flex items-center gap-3">
  <img src={GhanaFlag} alt="Ghana flag" className="h-6 w-9 rounded-sm object-cover" />

  <h2 className="text-xl font-bold text-green-800">
    Galamsey Reporter
  </h2>
</div>

      <div className="flex gap-6">
        <NavLink to="/" className="text-gray-700 hover:text-green-800">
          Home
        </NavLink>

        <NavLink to="/report" className="text-gray-700 hover:text-green-800">
          Report Activity
        </NavLink>

        <NavLink to="/about" className="text-gray-700 hover:text-green-800">
          About
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar



// function Navbar() {
//     return (
//         <nav>
//             <h2>Galamsey Reporter</h2>

//             <div>
//                 <a href="/">Home</a>
//                 <a href="/report">Report Activity</a>
//                 <a href="/about">About</a>
//             </div>
//         </nav>
//     )
// }

// export default Navbar
