from flask import Flask, request, jsonify
from flask_cors import CORS  # Make sure this is imported
import joblib
import string
import re
import os

app = Flask(__name__)

# Allow requests from all origins (for development)
CORS(app)  # <-- this enables CORS

# Load model and vectorizer
model_path = os.path.join(os.path.dirname(__file__), "spam_model.pkl")
vectorizer_path = os.path.join(os.path.dirname(__file__), "tfidf_vectorizer.pkl")
model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)

def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = re.sub(r"\d+", "", text)
    text = text.strip()
    return text

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)
    message = data.get("Message", "")
    msg_vec = vectorizer.transform([clean_text(message)])
    
    # Get prediction and confidence
    pred_class = model.predict(msg_vec)[0]
    pred_prob = model.predict_proba(msg_vec)[0]  # returns [prob_ham, prob_spam]
    
    confidence = round(max(pred_prob) * 100, 2)  # e.g., 90.34%
    
    label = "Spam" if pred_class == 1 else "Ham"
    return jsonify({
        "prediction": label,
        "confidence": confidence
    })

@app.route("/")
def home():
    return "Flask server is running"


if __name__ == "__main__":
    app.run(debug=True, port=5000)
