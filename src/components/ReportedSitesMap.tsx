import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"

const containerStyle = {
  width: "100%",
  height: "100%",
}

type ReportedSite = {
  id: string
  name: string
  lat: number
  lng: number
}

const reportedSites: ReportedSite[] = [
  {
    id: "prestea-001",
    name: "Prestea, Western Region",
    lat: 5.4372,
    lng: -2.1439,
  },
  {
    id: "dunkwa-001",
    name: "Dunkwa, Central Region",
    lat: 5.9636,
    lng: -1.7822,
  },
]

const mapCenter = {
  lat: 5.7,
  lng: -1.96,
}

function ReportedSitesMap() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })

  if (loadError) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl bg-gray-100 p-4 sm:h-80">
        <p className="text-center text-red-600">
          Unable to load Google Maps.
        </p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl bg-gray-100 sm:h-80">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }

  return (
    <div className="h-64 w-full overflow-hidden rounded-xl sm:h-80">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={8}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {reportedSites.map((site) => (
          <Marker
            key={site.id}
            position={{
              lat: site.lat,
              lng: site.lng,
            }}
            title={site.name}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />
        ))}
      </GoogleMap>
    </div>
  )
}

export default ReportedSitesMap