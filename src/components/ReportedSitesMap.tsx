import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { subscribeToReports } from "../services/reportService"
import type { ReportData } from "../types/report"

type ReportWithId = ReportData & {
  id: string
}

type Coordinates = {
  lat: number
  lng: number
}

type SelectedReport = ReportWithId & Coordinates

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

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null
  }

  return { lat, lng }
}

// Leaflet's default marker icons don't bundle cleanly with Vite, so we
// build simple colored pin icons ourselves instead of relying on
// external image assets or a CDN.
function createIcon(color: "blue" | "red") {
  const fillColor = color === "blue" ? "#2563EB" : "#DC2626"

  return L.divIcon({
    className: "",
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
        <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26c0-7.7-6.3-14-14-14z" fill="${fillColor}"/>
        <circle cx="14" cy="14" r="5.5" fill="white"/>
      </svg>
    `,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
  })
}

const userIcon = createIcon("blue")
const reportIcon = createIcon("red")

// react-leaflet's MapContainer only reads `center`/`zoom` on first
// render, so this helper re-centers the map whenever those values
// change (e.g. once the user's location is detected).
function RecenterMap({ center, zoom }: { center: Coordinates; zoom: number }) {
  const map = useMap()

  useEffect(() => {
    map.setView([center.lat, center.lng], zoom)
  }, [center.lat, center.lng, zoom, map])

  return null
}

// Grabs the underlying Leaflet map instance so the parent component can
// call imperative methods on it (here, invalidateSize on fullscreen toggle).
function MapInstanceSetter({ onMap }: { onMap: (map: L.Map) => void }) {
  const map = useMap()

  useEffect(() => {
    onMap(map)
  }, [map, onMap])

  return null
}

function ReportedSitesMap() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null)
  const [reports, setReports] = useState<ReportWithId[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<SelectedReport | null>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)

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

  // Keep isFullscreen in sync with the actual browser fullscreen state
  // (handles the Esc key and any other way the user exits fullscreen),
  // and resize the map once the container's dimensions change.
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = document.fullscreenElement === containerRef.current
      setIsFullscreen(isNowFullscreen)

      // Wait for the fullscreen transition to finish before Leaflet
      // recalculates tile layout, or it measures the old size.
      window.setTimeout(() => {
        mapRef.current?.invalidateSize()
      }, 100)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current.requestFullscreen()
    }
  }

  const nearbyReports = userLocation
    ? reports.filter((report) => {
        const reportLocation = parseLocation(report.location)

        if (!reportLocation) {
          return false
        }

        const distance = calculateDistance(userLocation, reportLocation)

        return distance <= NEARBY_RADIUS_KM
      })
    : []

  const center = userLocation ?? mapCenter
  const zoom = userLocation ? 13 : 8

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? "relative h-full w-full bg-white"
          : "relative h-56 w-full overflow-hidden rounded-xl sm:h-72 md:h-96 lg:h-[550px]"
      }
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={center} zoom={zoom} />
        <MapInstanceSetter onMap={(map) => (mapRef.current = map)} />

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
            title="Your current location"
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
              position={[reportLocation.lat, reportLocation.lng]}
              icon={reportIcon}
              title={report.title}
              eventHandlers={{
                click: () =>
                  setSelectedReport({ ...report, ...reportLocation }),
              }}
            />
          )
        })}
      </MapContainer>

      {/* Centered top so it never overlaps Leaflet's top-left zoom controls */}
      <div className="absolute left-1/2 top-3 z-[1000] -translate-x-1/2 rounded-lg bg-white px-3 py-2 text-center shadow-md">
        <p className="text-sm font-semibold text-gray-900">
          {nearbyReports.length} reported site
          {nearbyReports.length !== 1 ? "s" : ""} nearby
        </p>

        <p className="text-xs text-gray-500">
          Within {NEARBY_RADIUS_KM} km
        </p>
      </div>

      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
        className="absolute right-3 top-3 z-[1000] flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-md hover:bg-gray-50"
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3" />
            <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
            <path d="M3 16h3a2 2 0 0 1 2 2v3" />
            <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
        )}
      </button>

      {/* Report Detail Modal — matches ReportsDashboard's modal styling */}
      {selectedReport && (
        <div
          onClick={() => setSelectedReport(null)}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4"
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
            <p className="mb-2 text-sm text-gray-600">
              Latitude: {selectedReport.lat} &nbsp;|&nbsp; Longitude: {selectedReport.lng}
            </p>

            <a
              href={`https://www.google.com/maps?q=${selectedReport.lat},${selectedReport.lng}`}
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

export default ReportedSitesMap