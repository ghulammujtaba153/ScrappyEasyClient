import React from "react";

const Loader = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
                <p className="mt-4 text-gray-700 font-semibold">Loading...</p>
            </div>
        </div>
    );
};

export default Loader;