# flask_model/app.py
from flask import Flask, request, jsonify
from transformers import AutoModel, AutoImageProcessor
from PIL import Image
import torch
from torch.nn.functional import cosine_similarity
import requests
from io import BytesIO

app = Flask(__name__)

# Load the Hugging Face model and processor
model_id = "nateraw/vit-base-beans"  # Pretrained ViT model for image embeddings
processor = AutoImageProcessor.from_pretrained(model_id)
model = AutoModel.from_pretrained(model_id)
model.eval()  # Set model to evaluation mode


def load_image_from_url(image_url):
    """
    Loads an image from a URL, converts to RGB, and returns PIL image.
    """
    try:
        response = requests.get(image_url)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content)).convert("RGB")
        return img
    except Exception as e:
        raise ValueError(f"Error loading image from URL {image_url}: {e}")


def compute_similarity(image1, image2):
    """
    Takes two PIL images, returns cosine similarity score using ViT embeddings.
    """
    inputs = processor(images=[image1, image2], return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)
    
    embeddings = outputs.pooler_output  # shape: [2, hidden_size]
    similarity = cosine_similarity(embeddings[0].unsqueeze(0), embeddings[1].unsqueeze(0))
    return similarity.item()


@app.route("/verify-signature", methods=["POST"])
def verify_signature():
    try:
        data = request.get_json()

        original_path = data.get("original_signature_path")
        verification_path = data.get("uploaded_signature_path")

        if not original_path or not verification_path:
            return jsonify({"error": "Both file paths must be provided."}), 400

        # Load images from URLs
        try:
            image1 = load_image_from_url(original_path)
            image2 = load_image_from_url(verification_path)
        except ValueError as e:
            return jsonify({"error": str(e)}), 400

        # Compute similarity score
        similarity_score = compute_similarity(image1, image2)

        result = "Real" if similarity_score >= 0.8 else "Forged"  # adjust threshold if needed

        return jsonify({
            "result": result,
            "similarity_score": round(similarity_score, 4)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
