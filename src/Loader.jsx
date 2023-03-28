import React from 'react'

function Loader() {
    return (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="flex items-center justify-center bg-white p-8 rounded-md shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="animate-spin h-8 w-8 text-gray-500 mr-2">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="15 60" />
                </svg>

                <span className="text-gray-800 text-base font-semibold">Loading Stations...</span>
            </div>
        </div>
    );
}
export default Loader