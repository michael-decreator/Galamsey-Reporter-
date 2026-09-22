import { useRef, useState, type ChangeEvent } from "react"
import { submitReport } from "../services/reportService"
import { useNavigate } from "react-router-dom"

function ReportActivity() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  const [locationError, setLocationError] = useState("")
  const [description, setDescription] = useState("")

  const [formError, setFormError] = useState("")
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview)
      }

      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
      setFormError("")
    }
  }

  const handleRemovePhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview)
    }

    setPhotoFile(null)
    setPhotoPreview(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location is not supported by your browser.")
      return
    }

    setLocationError("")
    setFormError("")
    setIsDetectingLocation(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })

        setLocationError("")
        setIsDetectingLocation(false)
      },
      (error) => {
        setIsDetectingLocation(false)

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "Location permission was denied. Please allow location access and try again."
            )
            break

          case error.POSITION_UNAVAILABLE:
            setLocationError(
              "Your location could not be determined. Please check your GPS or network connection and try again."
            )
            break

          case error.TIMEOUT:
            setLocationError(
              "Location detection timed out. Please try again."
            )
            break

          default:
            setLocationError(
              "Unable to detect your location. Please try again."
            )
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const handleSubmit = async () => {
    setFormError("")

    if (!photoFile) {
      setFormError("Please take or select a photo.")
      return
    }

    if (!location) {
      setFormError("Please detect your location.")
      return
    }

    if (!description.trim()) {
      setFormError("Please describe what you observed.")
      return
    }

    setIsSubmitting(true)

    try {
      const title = `Report - ${new Date().toLocaleDateString()}`

      await submitReport(
        photoFile,
        title,
        description.trim(),
        location.latitude,
        location.longitude
      )

      navigate("/success")
    } catch (error) {
      console.error("Submission failed:", error)

      setFormError(
        error instanceof Error
          ? error.message
          : "Something went wrong submitting your report. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-4 shadow-md sm:p-6">

        {/* Welcome Heading */}
        <div className="mb-5 text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Welcome to Ghana's First Guided Report App
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Help us document suspected illegal mining activities by providing
            a photo, your location, and a short description.
          </p>
        </div>

        {/* Report Heading */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Send a Report
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Follow the steps below to submit your report.
          </p>
        </div>

        {/* Photo Section */}
        <div className="mb-4">
          <h3 className="mb-2 text-base font-semibold text-gray-800">
            📸 Photo Evidence
          </h3>

          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-3 sm:p-4">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Selected evidence"
                className="mb-3 h-40 w-full rounded-lg object-cover sm:h-48"
              />
            ) : (
              <p className="mb-3 text-center text-sm text-gray-500">
                Take a photo or select one from your device
              </p>
            )}

            {photoPreview ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-800"
                >
                  Change Photo
                </button>

                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="flex-1 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-800"
              >
                Take Photo
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="mb-4">
          <h3 className="mb-2 text-base font-semibold text-gray-800">
            📍 Your Location
          </h3>

          <div className="rounded-xl border border-gray-300 bg-gray-50 p-3">
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isDetectingLocation}
              className="w-full rounded-lg border border-green-700 px-4 py-2.5 text-sm font-medium text-green-700 transition hover:bg-green-50 disabled:opacity-50 sm:w-auto"
            >
              {isDetectingLocation
                ? "Detecting..."
                : "Auto Detect Location"}
            </button>

            {location && (
              <p className="mt-2 text-sm text-green-700">
                ✓ Location detected
              </p>
            )}

            {locationError && (
              <p className="mt-2 text-sm text-red-600">
                {locationError}
              </p>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-4">
          <h3 className="mb-2 text-base font-semibold text-gray-800">
            📝 Describe What You Observed
          </h3>

          <textarea
            value={description}
            onChange={(event) => {
              setDescription(event.target.value)
              setFormError("")
            }}
            placeholder="Briefly describe what you observed..."
            rows={3}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm text-gray-800 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
          />

          <div className="mt-1 flex justify-end">
            <span className="text-xs text-gray-500">
              {description.length}/500
            </span>
          </div>
        </div>

        {/* Form Error */}
        {formError && (
          <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
            {formError}
          </p>
        )}

        {/* Send Report Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full rounded-xl bg-green-700 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Report"}
        </button>

        <p className="mt-2 text-center text-xs text-gray-500">
          Your report can be submitted anonymously.
        </p>
      </div>
    </div>
  )
}

export default ReportActivity
