from flask import Flask, request, jsonify
import openai
import os

# Initialize Flask app
app = Flask(__name__)

# Set your OpenAI API key from environment variables for security
openai.api_key = os.getenv("OPENAI_API_KEY")

# Route to handle the chatbot API request
@app.route("/ask", methods=["POST"])
def ask():
    user_input = request.json.get("message")
    
    # Call the OpenAI API with the GPT model you created
    response = openai.Completion.create(
        engine="gpt-3.5-turbo",  # or your specific GPT model
        prompt=user_input,
        max_tokens=150
    )
    
    # Return the generated text as a response
    return jsonify({"response": response.choices[0].text.strip()})

# Run the app
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)