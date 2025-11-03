import React, { useState } from "react";

const UploadForm = ({ setResults }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("🧠 API Response:", data);

      // ✅ store full result including both images
      setResults({
        detections: data.detections,
        original_image_url: data.original_image_url,
        annotated_image_url: data.annotated_image_url,
      });
    } catch (error) {
      console.error("❌ Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg p-6 rounded-xl flex flex-col items-center space-y-4 w-full max-w-md"
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="p-2 border rounded w-full"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
      >
        {loading ? "Analyzing..." : "Detect Disease"}
      </button>
    </form>
  );
};

export default UploadForm;

