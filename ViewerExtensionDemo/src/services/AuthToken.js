 
 export async function fetchToken() {
    const url = 'https://developer.api.autodesk.com/authentication/v2/token';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': 'Basic YzdJSkRPa1d5b1VNenZtQWlISmkxQjlIdXlxM1oxMVA6M1Q4dlBRSmxNbEFLa2ZNMA=='
    };

    const body = new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'data:read'
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body
        });

        if (!response.ok) {
            throw new Error(`Error fetching token: ${response.statusText}`);
        }

        const data = await response.json();
        return data.access_token; // Return the token directly
    } catch (err) {
        throw new Error(`Failed to fetch token: ${err.message}`);
    }
}
