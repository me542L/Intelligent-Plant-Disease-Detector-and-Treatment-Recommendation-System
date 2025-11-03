import React from "react";

const ResultCard = ({ results }) => {
  if (!results || !results.detections || results.detections.length === 0)
    return <div className="mt-6 text-gray-600">No disease detected.</div>;

  return (
    <div className="mt-6 bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
      <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
        🍃 Detection Summary
      </h2>

      {/* Disease summary */}
      <ul className="space-y-4 mb-8">
        {results.detections.map((res, i) => (
          <li key={i} className="border-b pb-3">
            <p className="text-lg font-semibold text-green-700">
              {res.disease}
            </p>
            <p className="text-gray-700">
              <strong>Infection:</strong> {res.infection_percent}%
            </p>
            <p className="italic text-gray-600">
              <strong>Treatment:</strong> {res.treatment}
            </p>
          </li>
        ))}
      </ul>

      {/* Display both original and detected images */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        {results.original_image_url && (
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              Original Image
            </h3>
            <img
              src={results.original_image_url}
              alt="Original Leaf"
              className="rounded-lg shadow-md max-w-sm"
            />
          </div>
        )}
        {results.annotated_image_url && (
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              Detected Image
            </h3>
            <img
              src={results.annotated_image_url}
              alt="Detected Leaf"
              className="rounded-lg shadow-md max-w-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
