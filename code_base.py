import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from openai import OpenAI

# Initialize the OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # Ensure your API key is properly set

# Ensure Flask points to the right directories (for templates and static files like CSS)
app = Flask(__name__, 
            template_folder='.',  # Where index.html and other templates are located
            static_folder='asset'  # Where CSS and JS files are located
           )
CORS(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    user_input = data.get("message")

    try:
        # Use the correct API method with `client.chat.completions.create`
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Replace with gpt-4 if needed
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_input},
            ],
            max_tokens=150
        )
        # Correct access of message content
        return jsonify({"response": response.choices[0].message.content.strip()})
    except Exception as e:
        # Return the error as a response for debugging
        return jsonify({"response": f"Error: {str(e)}"})

if __name__ == "__main__":
    # Run Flask on port 5050
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5052)))