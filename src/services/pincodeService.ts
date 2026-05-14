/**
 * Postal Pincode Service
 * Fetches state and city from pincode
 */

interface PostOffice {
    Name: string;
    State: string;
    District: string;
    Division: string;
    Region: string;
    [key: string]: string;
}

interface PostalPincodeResponse {
    Status: string;
    Message: string;
    PostOffice: PostOffice[];
}

export interface PincodeLocationData {
    state: string;
    city: string;
    pincode: string;
}

/**
 * Get state and city from pincode using postal API
 * 492003 is a valid pincode (Betul, Madhya Pradesh)
 */
export const getLocationFromPincode = async (
    pincode: string,
): Promise<PincodeLocationData> => {
    // Validate pincode format (6 digits starting with 1-9)
    if (!pincode || !/^\d{6}$/.test(pincode.trim())) {
        throw new Error("Please enter a valid 6-digit pincode");
    }

    try {
        const response = await fetch(
            `https://api.postalpincode.in/pincode/${pincode.trim()}`,
        );
        console.log(response);

        if (!response.ok) {
            throw new Error("Failed to fetch pincode details");
        }

        const [data] = (await response.json()) as PostalPincodeResponse[];
       
console.log(data,"data");



        // Check if API returned success
        if (data?.Status !== "Success") {
            throw new Error(
                `Pincode ${pincode} not found in database. Try another pincode.`,
            );
        }

        console.log(data.PostOffice, "data");

        // Get first post office details
        const firstPostOffice = data.PostOffice  [0];
        const state = firstPostOffice.State || "";
        const city = firstPostOffice.District || "";

        if (!state || !city) {
            throw new Error("Could not extract state/city from pincode");
        }

        return {
            state,
            city,
            pincode: pincode.trim(),
        };
    } catch (error) {
        console.log(error,"12");
        
        if (error instanceof TypeError) {
            throw new Error(
                "Network error. Please check your internet connection.",
            );
        }
        throw error;
    }
};

/**
 * Validate pincode format (6 digits)
 */
export const isValidPincode = (pincode: string): boolean => {
    return /^\d{6}$/.test(pincode.trim());
};
