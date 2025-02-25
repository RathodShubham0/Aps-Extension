 import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { fetchToken } from './services/AuthToken'; // Import the service function

const modelUrn =  'dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLk5mdVFhX296UVplMzFwd3lKSGZzaEE_dmVyc2lvbj0x'
const root = ReactDOM.createRoot(document.getElementById('root'));

function RootComponent() {
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch the APS access token
        const getToken = async () => {
            try {
                const token = await fetchToken(); // Call the service function
                setToken(token);
            } catch (err) {
                setError(err.message);
            }
        };

        getToken();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!token) {
        return <div>Loading...</div>;
    }

    if (!modelUrn) {
        return (
            <div>
                Please specify <code>Model URN </code> in the source code.
            </div>
        );
    }

    return <App token={token} urn={modelUrn} />;
}

root.render(<RootComponent />);

reportWebVitals();
