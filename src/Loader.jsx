import React from 'react'
import ScaleLoader from "react-spinners/ScaleLoader";

function Loader() {
    return (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="flex items-center justify-center bg-white p-8 rounded-md shadow-lg bg-gray-800">
            <ScaleLoader color="#36d7b7" />
                {/* <span className="text-gray-800 text-base font-semibold">Stations...</span> */}
            </div>
        </div>
    );
}
export default Loader