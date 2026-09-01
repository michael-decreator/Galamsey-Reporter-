import { NavLink } from "react-router"
import ReportedSitesMap from "../components/ReportedSitesMap"

function Home() {
  return (
    <main className="min-h-screen bg-gray-100 px-3 py-3 sm:px-4 sm:py-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl bg-white p-3 shadow-lg sm:p-6">
          <div className="mb-3 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="mb-1 text-xl font-bold text-gray-900 sm:mb-2 sm:text-2xl">
                Reported Sites Nearby
              </h1>

              <p className="text-xs text-gray-600 sm:text-sm">
                View reported environmental sites around your location.
              </p>
            </div>

            <NavLink
              to="/report"
              className="inline-flex w-full items-center justify-center rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-900 sm:w-auto"
            >
              Report Activity
            </NavLink>
          </div>

          <div className="h-[360px] sm:h-[450px] lg:h-[550px]">
            <ReportedSitesMap />
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home