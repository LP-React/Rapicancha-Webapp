"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";

interface VenueMapProps {
  latitude: number;
  longitude: number;
}

export function VenueMap({ latitude, longitude }: VenueMapProps) {
  const position = { lat: latitude, lng: longitude };

  return (
    <div className="w-full h-full">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        <Map
          defaultZoom={15}
          defaultCenter={position}
          disableDefaultUI={true} // Oculta controles de zoom, street view, etc. para un look más limpio
          gestureHandling="cooperative" // Permite hacer scroll en la página sin quedarse atrapado en el mapa
          mapId="VENUE_DETAILS_MAP" // Requerido para usar AdvancedMarker
        >
          <AdvancedMarker position={position}>
            {/* Marcador personalizado con los colores de tu UI */}
            <Pin
              background={"#abd600"}
              borderColor={"#111508"}
              glyphColor={"#111508"}
            />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
}
