import { addDoc, collection, Timestamp, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "./firebase"
import type { ReportData } from "../types/report"

export const createReport = async (report: ReportData) => {
  const reportRef = await addDoc(collection(db, "reports"), {
    ...report,
    createdAt: Timestamp.now(),
  })

  return reportRef.id
}

export const uploadReportPhoto = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "galamsey_reports")

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/fi6umbdy/image/upload",
    {
      method: "POST",
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error("Photo upload failed")
  }

  const data = await response.json()
  return data.secure_url
}

export const submitReport = async (
  file: File,
  title: string,
  description: string,
  location: string
): Promise<string> => {
  const photoUrl = await uploadReportPhoto(file)

  const reportId = await createReport({
    title,
    description,
    location,
    photoUrl,
  })

  return reportId
}

export function subscribeToReports(
  callback: (reports: (ReportData & { id: string })[]) => void
) {
  const reportsQuery = query(collection(db, "reports"), orderBy("createdAt", "desc"))

  const unsubscribe = onSnapshot(reportsQuery, (snapshot) => {
    const reports = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as ReportData),
    }))
    callback(reports)
  })

  return unsubscribe
}