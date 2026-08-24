import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { useEffect, useState } from "react"
import { subscribeToReports } from "../services/reportService"
import type { ReportData } from "../types/report"

const containerStyle = {
  width: "100%",
  height: "100%",
}

type ReportWithId = ReportData & {
  id: string
}

type Coordinates = {
  lat: number
  lng: number
}

const mapCenter: Coordinates = {
  lat: 5.7,
  lng: -1.96,
}

const NEARBY_RADIUS_KM = 5

function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  const earthRadiusKm = 6371

  const lat1 = (point1.lat * Math.PI) / 180
  const lat2 = (point2.lat * Math.PI) / 180

  const deltaLat = ((point2.lat - point1.lat) * Math.PI) / 180
  const deltaLng = ((point2.lng - point1.lng) * Math.PI) / 180

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadiusKm * c
}

function parseLocation(location: string): Coordinates | null {
  const [latString, lngString] = location
    .split(",")
    .map((value) => value.trim())

  const lat = Number(latString)
  const lng = Number(lngString)

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return null
  }

  return { lat, lng }
}

function ReportedSitesMap() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })

  const [userLocation, setUserLocation] =
    useState<Coordinates | null>(null)

  const [reports, setReports] = useState<ReportWithId[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToReports((liveReports) => {
      setReports(liveReports)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        console.log("User latitude:", latitude)
        console.log("User longitude:", longitude)

        setUserLocation({
          lat: latitude,
          lng: longitude,
        })
      },
      (error) => {
        console.error("Unable to get location:", error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }, [])

  const nearbyReports = userLocation
    ? reports.filter((report) => {
        const reportLocation = parseLocation(report.location)

        if (!reportLocation) {
          return false
        }

        const distance = calculateDistance(
          userLocation,
          reportLocation
        )

        return distance <= NEARBY_RADIUS_KM
      })
    : []

  if (loadError) {
    return (
      <div className="flex h-56 w-full items-center justify-center rounded-xl bg-gray-100 p-4 sm:h-72 md:h-96 lg:h-[550px]">
        <p className="text-center text-red-600">
          Unable to load Google Maps.
        </p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex h-56 w-full items-center justify-center rounded-xl bg-gray-100 sm:h-72 md:h-96 lg:h-[550px]">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }

  return (
    <div className="relative h-56 w-full overflow-hidden rounded-xl sm:h-72 md:h-96 lg:h-[550px]">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation ?? mapCenter}
        zoom={userLocation ? 13 : 8}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            title="Your current location"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />
        )}

        {nearbyReports.map((report) => {
          const reportLocation = parseLocation(report.location)

          if (!reportLocation) {
            return null
          }

          return (
            <Marker
              key={report.id}
              position={reportLocation}
              title={report.title}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              }}
            />
          )
        })}
      </GoogleMap>

      <div className="absolute left-3 top-3 rounded-lg bg-white px-3 py-2 shadow-md">
        <p className="text-sm font-semibold text-gray-900">
          {nearbyReports.length} reported site
          {nearbyReports.length !== 1 ? "s" : ""} nearby
        </p>

        <p className="text-xs text-gray-500">
          Within {NEARBY_RADIUS_KM} km
        </p>
      </div>
    </div>
  )
}

export default ReportedSitesMap