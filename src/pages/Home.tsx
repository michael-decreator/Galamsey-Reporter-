import { NavLink } from "react-router"
import ReportedSitesMap from "../components/ReportedSitesMap"

function Home() {
  return (
    <main className="min-h-screen bg-gray-100 px-3 py-6 sm:px-4 sm:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                Reported Sites Nearby
              </h1>

              <p className="text-sm text-gray-600">
                View reported environmental sites around your location.
              </p>
            </div>

            <NavLink
              to="/report"
              className="inline-flex items-center rounded-lg bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-green-900"
            >
              Report Activity
            </NavLink>
          </div>

          <ReportedSitesMap />
        </div>
      </div>
    </main>
  )
}

export default Home