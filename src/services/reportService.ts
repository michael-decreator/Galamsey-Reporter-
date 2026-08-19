import { addDoc, collection, Timestamp } from "firebase/firestore"
import { db } from "./firebase"
import type { ReportData } from "../types/report"


export const createReport = async (report: ReportData) => {
  const reportRef = await addDoc(collection(db, "reports"), {
    ...report,
    createdAt: Timestamp.now(),
  })

  return reportRef.id
}