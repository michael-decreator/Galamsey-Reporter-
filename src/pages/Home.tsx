import ReportedSitesMap from "../components/ReportedSitesMap"

function Home() {
  return (
    <main className="min-h-screen bg-gray-100 px-3 py-6 sm:px-4 sm:py-12">
      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-4 shadow-lg sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Report Illegal Mining
        </h1>

        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          Help protect Ghana&apos;s land &amp; water. Your report is anonymous.
        </p>

        <section className="mt-8 sm:mt-10">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            Reported Sites Nearby
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Sample locations shown below. Live reports will appear here soon.
          </p>

          <div className="mt-4">
            <ReportedSitesMap />
          </div>
        </section>
      </div>
    </main>
  )
}

export default Home