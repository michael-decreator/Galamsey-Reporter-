import { useNavigate } from "react-router-dom"

function ReportSuccess() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-md">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span className="text-3xl">✓</span>
          </div>
        </div>

        <h1 className="mb-3 text-2xl font-bold text-gray-900">
          Report Submitted Successfully
        </h1>

        <p className="mb-8 text-gray-600">
          Thank you for speaking up. Every report helps protect Ghana's land,
          water, and communities from illegal mining. Your courage makes a
          real difference.
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
        >
          Okay
        </button>
      </div>
    </div>
  )
}

export default ReportSuccess