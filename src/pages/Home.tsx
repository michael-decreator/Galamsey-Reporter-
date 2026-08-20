import ReportedSitesMap from "../components/ReportedSitesMap"

function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-start pt-12 px-4 pb-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-12 shadow-lg min-h-[400px]">
        <h1 className="text-3xl font-bold text-gray-900">
          Report Illegal Mining
        </h1>

        <p className="mt-2 text-gray-600">
          Help protect Ghana's land & water. Your report is anonymous.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900">
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