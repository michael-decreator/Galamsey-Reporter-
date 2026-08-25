import {
  addDoc,
  collection,
  Timestamp,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore"
import { db } from "./firebase"
import type { ReportData } from "../types/report"

export const createReport = async (report: ReportData) => {
  const timestamp = Timestamp.now()

  const reportRef = await addDoc(collection(db, "reports"), {
    title: report.title,
    description: report.description,
    location: report.location,
    latitude: report.latitude,
    longitude: report.longitude,
    photoUrl: report.photoUrl ?? "",
    timestamp,
    createdAt: timestamp,
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

  if (!data.secure_url) {
    throw new Error("Photo URL was not returned")
  }

  return data.secure_url
}

export const submitReport = async (
  file: File,
  title: string,
  description: string,
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const photoUrl = await uploadReportPhoto(file)

    const location = `${latitude},${longitude}`

    const reportId = await createReport({
      title,
      description,
      location,
      latitude,
      longitude,
      photoUrl,
    })

    return reportId
  } catch (error) {
    console.error("Report submission failed:", error)

    if (error instanceof Error) {
      throw error
    }

    throw new Error("Unable to submit report")
  }
}

export function subscribeToReports(
  callback: (reports: (ReportData & { id: string })[]) => void
) {
  const reportsQuery = query(
    collection(db, "reports"),
    orderBy("createdAt", "desc")
  )

  const unsubscribe = onSnapshot(reportsQuery, (snapshot) => {
    const reports = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as ReportData),
    }))

    callback(reports)
  })

  return unsubscribe
}