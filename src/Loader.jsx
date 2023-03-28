import React from 'react'
import ScaleLoader from "react-spinners/ScaleLoader";

function Loader() {
    return (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-md shadow-lg bg-gray-800">
                <ScaleLoader color="#36d7b7" />
                <p className="text-gray-700 mt-2 text-lg font-medium">Loading Stations...</p>
            </div>
        </div>

    );
}
export default Loader