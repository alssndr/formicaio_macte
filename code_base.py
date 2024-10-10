import os
from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

openai.api_key = os.getenv("OPENAI_API_KEY")  # Use environment variable

@app.route("/ask", methods=["POST"])
def ask():
    user_input = request.json.get("message")
    response = openai.Completion.create(
        engine="gpt-3.5-turbo",
        prompt=user_input,
        max_tokens=150
    )
    return jsonify({"response": response.choices[0].text.strip()})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))