import { useEffect, useState } from "react"
import { subscribeToReports } from "../services/reportService"
import type { ReportData } from "../types/report"

const ReportsDashboard = () => {
  const [reports, setReports] = useState<(ReportData & { id: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToReports((liveReports) => {
      setReports(liveReports)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading reports...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 px-3 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
          Report Activity
        </h1>

        {reports.length === 0 ? (
          <p className="text-gray-600">No reports yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {reports.map((report) => (
              <div
                key={report.id}
                className="rounded-2xl bg-white p-4 shadow-md"
              >
                {report.photoUrl && (
                  <img
                    src={report.photoUrl}
                    alt={report.title}
                    className="mb-3 h-48 w-full rounded-lg object-cover"
                  />
                )}

                <h2 className="mb-1 text-lg font-semibold text-gray-900">
                  {report.title}
                </h2>

                <p className="mb-2 text-sm text-gray-600">
                  {report.description}
                </p>

                <a
                  href={`https://www.google.com/maps?q=${report.location}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-green-700 hover:underline"
                >
                  View on map
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportsDashboard