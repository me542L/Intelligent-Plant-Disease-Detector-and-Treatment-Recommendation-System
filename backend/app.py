from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from ultralytics import YOLO
import os
import cv2
import uuid
import traceback
import numpy as np

# --------------------------------------
# Initialize Flask app and CORS
# --------------------------------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# --------------------------------------
# Model and folder setup
# --------------------------------------
MODEL_PATH = "models/best.pt"
UPLOAD_FOLDER = "uploads"
RESULT_FOLDER = "static/results"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

# Load YOLO model
model = YOLO(MODEL_PATH)

# --------------------------------------
# Home route
# --------------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "🌿 Apple Leaf Disease Detection API is running!"})

# --------------------------------------
# Prediction route
# --------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # ✅ Check for file
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "Empty filename"}), 400

        # ✅ Save uploaded image
        img_name = f"{uuid.uuid4().hex}.jpg"
        img_path = os.path.join(UPLOAD_FOLDER, img_name)
        file.save(img_path)
        print("✅ Image saved:", img_path)

        # ✅ Run YOLO inference
        results = model.predict(img_path, conf=0.05, iou=0.4)
        r = results[0]

        # ✅ Extract detections
        boxes = r.boxes.xyxy.cpu().numpy()
        labels = r.boxes.cls.cpu().numpy()
        class_names = model.names

        # ✅ Read image for infection area calculation
        img = cv2.imread(img_path)
        if img is None:
            raise ValueError("Image could not be read by OpenCV.")
        h, w, _ = img.shape
        total_area = h * w

        # ✅ Compute total area per disease
        disease_areas = {}
        for box, cls_id in zip(boxes, labels):
            x1, y1, x2, y2 = box
            area = float((x2 - x1) * (y2 - y1))
            disease = class_names[int(cls_id)]
            disease_areas[disease] = disease_areas.get(disease, 0) + area

        # ✅ Calculate infection percentage
        infection_percentages = {
            disease: float((area / total_area) * 100)
            for disease, area in disease_areas.items()
        }

        # ✅ Summarize results
        summarized_results = []
        for disease, perc in infection_percentages.items():
            if perc <= 0:
                continue
            if perc < 1:
                level = "🟢 Very Early Stage - Monitor leaf"
            elif perc < 10:
                level = "🟢 Mild - Preventive spray"
            elif perc < 30:
                level = "🟡 Moderate - Apply fungicide lightly"
            elif perc < 60:
                level = "🟠 Severe - Immediate treatment needed"
            else:
                level = "🔴 Critical - Heavy pesticide recommended"

            summarized_results.append({
                "disease": str(disease),
                "infection_percent": round(float(perc), 2),
                "treatment": level
            })

        # ✅ Save output image with bounding boxes
        output_path = os.path.join(RESULT_FOLDER, img_name)
        r.save(filename=output_path)

        # ✅ Return response
        return jsonify({
            "status": "success",
            "detections": summarized_results,
            "original_image_url": f"http://127.0.0.1:5000/uploads/{img_name}",
            "annotated_image_url": f"http://127.0.0.1:5000/static/results/{img_name}"
        })

    except Exception as e:
        print("❌ Exception occurred:")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500

# --------------------------------------
# Serve uploaded (original) images
# --------------------------------------
@app.route('/uploads/<filename>')
def serve_uploaded_image(filename):
    return send_file(os.path.join(UPLOAD_FOLDER, filename), mimetype='image/jpeg')

# --------------------------------------
# Serve annotated images
# --------------------------------------
@app.route('/static/results/<filename>')
def serve_result_image(filename):
    return send_file(os.path.join(RESULT_FOLDER, filename), mimetype='image/jpeg')

# --------------------------------------
# Run Flask app
# --------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
