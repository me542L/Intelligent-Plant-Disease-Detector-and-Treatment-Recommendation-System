// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
/*import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import ResultCard from "./components/ResultCard";

function App() {
  const [results, setResults] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-green-800 mb-4">🍃 Leaf Disease Detector</h1>
      <UploadForm setResults={setResults} />
      {results && <ResultCard results={results} />}
    </div>
  );
}

export default App;*/



import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import ResultCard from "./components/ResultCard";

function App() {
  const [results, setResults] = useState(null);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-green-200 via-green-100 to-green-300 bg-fixed">
      {/* Header Section */}
      <header className="bg-green-700 text-white py-6 shadow-lg">
        <h1 className="text-4xl font-extrabold text-center tracking-wide">
          🍃 Leaf Disease Detector
        </h1>
        <p className="text-center text-green-100 mt-2 text-lg">
          Upload a leaf image to detect disease and get treatment recommendations.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-col lg:flex-row flex-grow justify-evenly items-center px-8 py-10 gap-8">
        {/* Upload Section */}
        <section className="bg-white w-full lg:w-1/3 rounded-2xl shadow-xl p-8">
          <UploadForm setResults={setResults} />
        </section>

        {/* Results Section */}
        <section className="bg-white w-full lg:w-1/2 rounded-2xl shadow-xl p-8 overflow-auto">
          {results ? (
            <ResultCard results={results} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600 text-lg italic">
              🌱 Your detection results will appear here after uploading an image.
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-green-100 text-center py-4 text-sm">
      </footer>
    </div>
  );
}

export default App;
