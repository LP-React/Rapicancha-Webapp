"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";

interface LocationPickerProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export function LocationPicker({
  lat,
  lng,
  onLocationChange,
}: LocationPickerProps) {
  return (
    <div className="h-74 w-full rounded-xl overflow-hidden border border-outline/20">
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      >
        <Map
          defaultCenter={{ lat, lng }}
          defaultZoom={15}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId="DEMO_MAP_ID" // Necesario para AdvancedMarker
        >
          <AdvancedMarker
            position={{ lat, lng }}
            draggable={true}
            onDragEnd={(e) => {
              if (e.latLng) {
                onLocationChange(e.latLng.lat(), e.latLng.lng());
              }
            }}
          >
            <Pin
              background={"#455a64"}
              borderColor={"#ffffff"}
              glyphColor={"#ffffff"}
            />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
}
