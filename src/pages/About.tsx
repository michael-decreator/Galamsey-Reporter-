function About() {
  return (
    <main className="min-h-screen bg-gray-100 px-3 py-6 sm:px-4 sm:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl bg-white p-5 shadow-lg sm:p-8">
          <h1 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
            About Galamsey Reporter
          </h1>

          <p className="mb-6 text-sm leading-6 text-gray-600 sm:text-base">
            Galamsey Reporter is a web application designed to help people
            report suspected illegal mining activities in Ghana and bring
            attention to their impact on the environment.
          </p>

          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Our Purpose
            </h2>

            <p className="text-sm leading-6 text-gray-600 sm:text-base">
              Illegal mining can have serious effects on Ghana&apos;s forests,
              rivers, farmland, and communities. Galamsey Reporter provides a
              simple way for users to document and report suspected illegal
              mining activities by submitting a photo, location, and
              description of what they observe.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              How It Works
            </h2>

            <p className="text-sm leading-6 text-gray-600 sm:text-base">
              Users can take or select a photo, automatically detect their
              location, describe what they observed, and submit the report.
              Submitted reports are stored digitally and can be viewed on the
              reported-sites map.
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-4">
            <h2 className="mb-2 text-lg font-semibold text-green-800">
              Help Protect Ghana&apos;s Environment
            </h2>

            <p className="text-sm leading-6 text-gray-700 sm:text-base">
              By documenting and reporting suspected illegal mining activities,
              users can help create greater awareness and support efforts to
              protect Ghana&apos;s natural resources.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default About