import { NavLink } from "react-router"

function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b bg-white px-8 py-4">
      <h2 className="text-xl font-bold text-green-800">
        Galamsey Reporter
      </h2>

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
