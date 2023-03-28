import './App.css';
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Loader from './Loader';
import { FaPlay, FaPause } from 'react-icons/fa';
import { FiRadio } from 'react-icons/fi';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    try {
      axios
        .get(`https://de1.api.radio-browser.info/json/stations/bycountry/india?order=clickcount&reverse=true`)
        //fetches indian radios in order to most clicked on top
        .then(response => {
          const results = response.data;
          //console.log(response.data)

          // filtering duplicate results
          const filteredStations = Object.values(results.reduce((map, station) => {
            const url = station.url;

            if (
              (station.language !== "hindi" && station.language !== "") ||
              url.startsWith("http://") ||
              url.endsWith(".m3u8") 
            ) {
              return map; // skip stations if not hindi/india or having hrl http:// or .m3u8 or already exists in map
            }

            map[url] = station; // add the station to the map if it hasn't been seen before

            return map;
          }, {}));

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
    setIsLoading(true);
    audioRef.current.src = station.url;
    audioRef.current.play();
    setCurrentStation(station);
    setIsPlaying(true)
  }

  const handlePause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };
  const handlePlay = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="App min-h-screen bg-gray-900 text-gray-100 py-4">
      <h1 className="text-2xl font-bold text-gray-100 pb-4">Trending Indian Stations</h1>
      <div className="container mx-auto px-4 md:px-0 mt-4 sm:mt-10 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10">

          <audio ref={audioRef} onPlay={() => setIsLoading(false)} />

          {isLoading && <Loader />}

          {stations.map((station) => (
            <div
              key={station.stationuuid}
              className={`bg-gray-800 rounded-md flex items-center py-2 px-4 shadow-md border border-gray-700 
              ${currentStation?.url === station.url ? 'bg-green-500' : 'hover:bg-gray-600 hover:border-gray-100`'}`}

            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-700 mr-4 cursor-pointer" onClick={() => handleStationClick(station)}>
                {(currentStation?.url === station.url && isPlaying) ?
                  ( // if element is currently playing then show playing gif
                    <img
                      src="https://i.gifer.com/Nt6v.gif"
                      alt={station.favicon}
                      className="w-8 h-8 object-cover object-center rounded-full"
                    />
                  )
                  :
                  ( // else for rest elements show station's icon
                    station.favicon ? (
                      <img
                        src={station.favicon}
                        alt={station.name}
                        className="w-8 h-8 object-cover object-center rounded-full"
                      />
                    ) :
                      (
                        <FiRadio className="h-6 w-6 text-gray-100" />
                      ))
                }

              </div>

              <h2 className={`text-sm font-semibold title cursor-pointer ${currentStation?.url === station.url ? 'text-xs text-gray-900 ' : ''}`} onClick={() => handleStationClick(station)}>{station.name}</h2>
              {currentStation?.url === station.url && (isPlaying ? (
                <button onClick={handlePause} className="ml-auto mr-4">
                  <FaPause className="h-6 w-6 hover:text-green-200" style={{ strokeWidth: 1 }} />
                </button>
              ) : (
                <button onClick={handlePlay} className="ml-auto mr-4">
                  <FaPlay className="h-6 w-6 hover:text-green-200" style={{ strokeWidth: 1 }} />
                </button>
              ))}

            </div>
          ))}
        </div>
      </div>
      {isLoading && <Loader />}
    </div>

  );
}

export default App;
