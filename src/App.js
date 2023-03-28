import './App.css';
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Loader from './Loader';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    try {
      axios
        .get(`https://de1.api.radio-browser.info/json/stations/topclick`)
        .then(response => {
          const results = response.data;
          //console.log(response.data)

          // filtering duplicate results
          const filteredStations = Object.values(results.reduce((map, station) => {
            const url = station.url;
            if (station.language !== "hindi" || station.country !== "India" || url.startsWith("http://") || url.endsWith(".m3u8")) {
              return map; // skip stations if not hindi/india or having hrl http:// or .m3u8
            }
            
            if (!map[url]) {
              map[url] = station; // add the station to the map if it hasn't been seen before
            }
            return map;
          }, {}))

          // const filteredStations = results.filter( station => station.language === "hindi" || station.language === "Hindi")
          console.log(filteredStations)
          setStations(filteredStations);
          setIsLoading(false);
        });
      } catch (error) {
        console.log({ error });
        setIsLoading(false)
      }
    }, []);
  

  const audioRef = useRef(null);
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false)

  function handleStationClick(station) {
    audioRef.current.src = station.url;
    audioRef.current.play();
    setCurrentStation(station);
    setIsPlaying(true)
  }

  const handlePause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  return (
    <div className="App min-h-screen bg-gray-900 text-gray-100 py-4">
      <h1 className="text-3xl font-bold text-gray-100 pb-4">Trending Hindi Stations</h1>
      <div className="container mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

          {<audio ref={audioRef} />}
          {stations.map((station) => (
            <div
              key={station.stationuuid}
              className={`bg-gray-800 rounded-md flex items-center py-2 px-4 shadow-md border border-gray-700 
      ${currentStation?.url === station.url ? 'bg-green-500' : ''}`}

            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-700 mr-4 cursor-pointer" onClick={() => handleStationClick(station)}>
                {station.favicon && (
                  <img
                    src={station.favicon}
                    alt={station.name}
                    className="w-8 h-8 object-cover object-center rounded-full"
                  />
                )}
                {!station.favicon && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 text-gray-100">
                    <path fill="currentColor" d="M12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0 2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 3 3 0 0 1 0 6 1 1 0 0 1 0-2 1 1 0 0 0 0-2 1 1 0 1 1 0-2zm0-2a3 3 0 0 1 2.519 4.447l-1.414-1.414A1 1 0 1 0 12.707 8.3l1.414 1.414A3 3 0 0 1 12 6z" />
                  </svg>
                )}

              </div>

              <h2 className={`text-sm font-semibold title cursor-pointer ${currentStation?.url === station.url ? 'text-xs text-gray-900 ' : ''}`} onClick={() => handleStationClick(station)}>{station.name}</h2>
              {currentStation?.url === station.url && isPlaying && (
                <button onClick={handlePause} className="ml-auto mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 text-gray-100">
                    <path fill="currentColor" d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                </button>
              )}


            </div>
          ))}


        </div>
      </div>
      {isLoading && <Loader />}
    </div>

  );
}

export default App;
