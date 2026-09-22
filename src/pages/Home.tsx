import { NavLink } from "react-router-dom"
import ReportedSitesMap from "../components/ReportedSitesMap"

function Home() {
  return (
    <main className="min-h-screen bg-gray-100 px-3 py-4 sm:px-4 sm:py-8">
      <div className="mx-auto w-full max-w-5xl">

        {/* Welcome Section */}
        <section className="mb-4 rounded-2xl bg-white p-5 text-center shadow-lg sm:mb-6 sm:p-8">
          <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
            Welcome to Ghana's First Galamsey Reporter
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Help protect Ghana's environment by reporting suspected illegal
            mining activities. Our guided reporting process helps you capture
            evidence, detect your location, and submit your report easily.
          </p>

          <NavLink
            to="/report"
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-green-800 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-green-900 sm:w-auto"
          >
            Send a Report
          </NavLink>
        </section>

        {/* Map Section */}
        <section className="rounded-2xl bg-white p-3 shadow-lg sm:p-6">
          <div className="mb-3 sm:mb-5">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Reported Sites Nearby
            </h2>

            <p className="mt-1 text-xs text-gray-600 sm:text-sm">
              View reported environmental sites and their locations on the map.
            </p>
          </div>

          <div className="h-[360px] overflow-hidden rounded-xl sm:h-[450px] lg:h-[550px]">
            <ReportedSitesMap />
          </div>
        </section>

        {/* About Section */}
        <section className="mt-4 rounded-2xl bg-white p-5 shadow-lg sm:mt-6 sm:p-6">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            About Galamsey Reporter
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
            Galamsey Reporter is a guided web application designed to make it
            easier for people to report suspected illegal mining activities in
            Ghana. Users can provide photo evidence, automatically detect their
            location, and submit a description of what they observed.
          </p>
        </section>

      </div>
    </main>
  )
}

export default Home
