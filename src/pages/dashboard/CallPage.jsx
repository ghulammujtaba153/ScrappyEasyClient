import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/URL";


const CallPage = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleStartCall = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            await axios.post(`${BASE_URL}/api/call/start`, { phoneNumber });
            setMessage("Call started successfully!");
        } catch (error) {
            console.error(error);
            setMessage("Failed to start call. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Start a Call</h1>
            <form onSubmit={handleStartCall} className="space-y-4 max-w-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                    </label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+923..."
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? "Starting Call..." : "Start Call"}
                </button>
                {message && <p className="mt-2 text-sm">{message}</p>}
            </form>
        </div>
    );
};

export default CallPage;

