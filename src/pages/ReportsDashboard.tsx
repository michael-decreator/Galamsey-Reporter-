import { useEffect, useState } from "react"
import { subscribeToReports } from "../services/reportService"
import type { ReportData } from "../types/report"

type ReportWithId = ReportData & { id: string }

const ReportsDashboard = () => {
  const [reports, setReports] = useState<ReportWithId[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedReport, setSelectedReport] = useState<ReportWithId | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToReports((liveReports) => {
      setReports(liveReports)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const parseCoordinates = (location: string) => {
    const [lat, lng] = location.split(",").map((value) => value.trim())
    return { lat, lng }
  }

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
                onClick={() => setSelectedReport(report)}
                className="cursor-pointer rounded-2xl bg-white p-4 shadow-md transition hover:shadow-lg"
              >
                {report.photoUrl && (
                  <a
                    href={report.photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="mb-3 block"
                  >
                    <img
                      src={report.photoUrl}
                      alt={report.title}
                      className="h-48 w-full cursor-pointer rounded-lg object-cover"
                    />
                  </a>
                )}

                <h2 className="mb-1 text-lg font-semibold text-gray-900">
                  {report.title}
                </h2>

                <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                  {report.description}
                </p>

                <p className="text-xs text-gray-400">
                  Report ID: {report.id}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div
          onClick={() => setSelectedReport(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-lg"
          >
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedReport.title}
              </h2>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {selectedReport.photoUrl && (
              <a
                href={selectedReport.photoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 block"
              >
                <img
                  src={selectedReport.photoUrl}
                  alt={selectedReport.title}
                  className="h-56 w-full cursor-pointer rounded-lg object-cover"
                />
              </a>
            )}

            <h3 className="mb-1 text-sm font-semibold text-gray-800">
              Description
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              {selectedReport.description}
            </p>

            <h3 className="mb-1 text-sm font-semibold text-gray-800">
              Location
            </h3>
            {(() => {
              const { lat, lng } = parseCoordinates(selectedReport.location)
              return (
                <p className="mb-2 text-sm text-gray-600">
                  Latitude: {lat} &nbsp;|&nbsp; Longitude: {lng}
                </p>
              )
            })()}

            <a
              href={`https://www.google.com/maps?q=${selectedReport.location}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 inline-block text-sm font-medium text-green-700 hover:underline"
            >
              View on map
            </a>

            <h3 className="mb-1 text-sm font-semibold text-gray-800">
              Report ID
            </h3>
            <p className="text-xs text-gray-400">{selectedReport.id}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportsDashboard