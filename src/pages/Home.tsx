import { useState } from "react"
import { submitReport } from "../services/reportService"

function Home() {
  const [testFile, setTestFile] = useState<File | null>(null)

  const handleTestSubmit = async () => {
    if (!testFile) {
      alert("Pick a photo first")
      return
    }

    try {
      const reportId = await submitReport(
        testFile,
        "Test Report",
        "Test report from Home.tsx",
        "5.6037,-0.1870"
      )
      console.log("Report created with ID:", reportId)
      alert(`Success! Report ID: ${reportId}`)
    } catch (error) {
      console.error("Test failed:", error)
      alert("Something went wrong — check the console")
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-start pt-12 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-12 shadow-lg min-h-[400px]">
        <h1 className="text-3xl font-bold text-gray-900">
          Report Illegal Mining
        </h1>

        <p className="mt-2 text-gray-600">
          Help protect Ghana's land & water. Your report is anonymous.
        </p>
      </div>
    </main>
  )
}

export default Home