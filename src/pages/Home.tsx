import ReportedSitesMap from "../components/ReportedSitesMap"

function Home() {
  return (
    <main className="min-h-screen bg-gray-100 px-3 py-6 sm:px-4 sm:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-6">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Reported Sites Nearby
          </h1>

          <p className="mb-5 text-sm text-gray-600">
            View reported environmental sites around your location.
          </p>

          <ReportedSitesMap />
        </div>
      </div>
    </main>
  )
}

export default Home