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

  // Remove photo function
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
      const locationString = `${location.latitude},${location.longitude}`

      await submitReport(
        photoFile,
        title,
        description,
        locationString
      )

      navigate("/success")
    } catch (error) {
      console.error("Submission failed:", error)
      setFormError(
        "Something went wrong submitting your report. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-3 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-4 shadow-md sm:p-6">
        <h1 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
          Report Illegal Mining
        </h1>

        <p className="mb-6 text-gray-600">
          Your report can be submitted anonymously.
        </p>

        {/* Photo Section */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Photo Evidence
          </h2>

          <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 sm:min-h-48 sm:p-6">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Selected evidence"
                className="mb-4 max-h-64 w-full rounded-lg object-cover"
              />
            ) : (
              <p className="mb-4 text-center text-gray-500">
                Take a photo or select one from your device
              </p>
            )}

            {photoPreview ? (
              <div className="flex w-full gap-3 sm:w-auto">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 rounded-lg bg-green-700 px-5 py-3 font-medium text-white transition hover:bg-green-800 sm:flex-none"
                >
                  Change Photo
                </button>

                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="flex-1 rounded-lg border border-red-300 px-5 py-3 font-medium text-red-600 transition hover:bg-red-50 sm:flex-none"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-lg bg-green-700 px-5 py-3 font-medium text-white transition hover:bg-green-800 sm:w-auto"
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
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Location
          </h2>

          <div className="rounded-xl border border-gray-300 bg-gray-50 p-4">
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isDetectingLocation}
              className="w-full rounded-lg border border-green-700 px-5 py-3 font-medium text-green-700 transition hover:bg-green-50 disabled:opacity-50 sm:w-auto"
            >
              {isDetectingLocation
                ? "Detecting..."
                : "Auto Detect Location"}
            </button>

            {location && (
              <p className="mt-3 break-words text-sm text-gray-600">
                Location detected: {location.latitude.toFixed(6)},{" "}
                {location.longitude.toFixed(6)}
              </p>
            )}

            {locationError && (
              <p className="mt-3 text-sm text-red-600">
                {locationError}
              </p>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Description
          </h2>

          <textarea
            value={description}
            onChange={(event) => {
              setDescription(event.target.value)
              setFormError("")
            }}
            placeholder="Describe what you observed..."
            rows={5}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 p-4 text-gray-800 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
          />

          <div className="mt-2 flex justify-end">
            <span className="text-sm text-gray-500">
              {description.length}/500
            </span>
          </div>
        </div>

        {/* Form Error */}
        {formError && (
          <p className="mb-4 text-sm font-medium text-red-600">
            {formError}
          </p>
        )}

        {/* Send Report Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800 disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Report"}
        </button>
      </div>
    </div>
  )
}

export default ReportActivity