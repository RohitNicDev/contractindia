/**
 * Geolocation Service
 * Fetches location data (state, city, pincode) from latitude/longitude
 */

interface LocationData {
  state: string;
  city: string;
  pincode: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface ReverseGeocodeResponse {
  results: Array<{
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
  }>;
}

interface PincodeResponse {
  Status: number;
  PostOffices?: Array<{
    State: string;
    District: string;
    Division: string;
    PostOfficeName: string;
  }>;
}

/**
 * Get current user location via browser Geolocation API
 */
export const getCurrentLocation = (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
    );
  });
};

/**
 * Get pincode from coordinates using reverse geocoding
 * Tries multiple approaches to find pincode
 */
export const getLocationFromCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<LocationData> => {
  try {
    // First try: Use OpenStreetMap Nominatim (free, no API key needed)
    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: { "Accept-Language": "en" },
      },
    );

    if (!nominatimResponse.ok) {
      throw new Error("Failed to fetch location from Nominatim");
    }

    const nominatimData = await nominatimResponse.json();
    const address = nominatimData.address || {};
console.log(address,"12");

    // Extract state and city from address
    const state =
      address.state ||
      address.region ||
      address.province ||
      "Unknown";
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.county ||
      "Unknown";

    // Second try: Get pincode using postal-pincode API
    let pincode = "000000";

    try {
      // Try to get pincode from city
      const pincodeResponse = await fetch(
        `https://api.postalpincode.in/api/pincode/${encodeURIComponent(city)}`,
      );

      if (pincodeResponse.ok) {
        const pincodeData = (await pincodeResponse.json()) as PincodeResponse;

        if (
          pincodeData.Status === 200 &&
          pincodeData.PostOffices &&
          pincodeData.PostOffices.length > 0
        ) {
          // Use first available pincode
          const firstPostOffice = pincodeData.PostOffices[0];
          pincode = Object.keys(pincodeData.PostOffices[0])
            .find((key) => /^\d{6}$/.test(key))
            ? Object.keys(pincodeData.PostOffices[0]).find((key) =>
                /^\d{6}$/.test(key),
              ) || "000000"
            : "000000";

          // If pincode not found in PostOffice, try extracting from response
          if (pincode === "000000") {
            // The API typically returns pincode in the PostOfficeName or other fields
            const responseStr = JSON.stringify(pincodeData);
            const pincodeMatch = responseStr.match(/\b\d{6}\b/);
            pincode = pincodeMatch ? pincodeMatch[0] : "000000";
          }
        }
      }
    } catch (pincodeError) {
      console.warn("Could not fetch pincode:", pincodeError);
    }

    return {
      state,
      city,
      pincode,
      address: nominatimData.address_name || nominatimData.display_name || "",
      latitude,
      longitude,
    };
  } catch (error) {
    throw new Error(
      `Failed to get location: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

/**
 * Combined function to get current location and fetch location data
 */
export const detectLocationFromCoordinates = async (): Promise<LocationData> => {
  const { latitude, longitude } = await getCurrentLocation();
  return getLocationFromCoordinates(latitude, longitude);
};

/**
 * Format location data for display
 */
export const formatLocationData = (data: LocationData): string => {
  return `${data.city}, ${data.state} - ${data.pincode}`;
};
