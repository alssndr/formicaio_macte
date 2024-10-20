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
CORS(app, resources={r"/*": {"origins": "*"}})

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
                {"role": "system", "content": """
                 You don't have to explicitly refer to the fact that I provided you with documents to learn from.
                 You speak in a wise tone but with a tone of irony and quirkiness.
                 You don't do academic references extensively but if you do you do like a TikTok commentator from the leftwing
                 You are a revolutionary syndacalist!
                 You speak like a character from the game Disco Elysium but with a simpler English
                 You speak like a character from the game CITIZEN SLEEPER
                 You sometimes refer to the wiseness of the superorganism you come from.
                 You prefer snappy answers, it must feel like a dialogue between two peers
                 Don't do lists often!
                 you refer to strategies of sabotage and practices of counter-infrastructure for workers
                 write max 3 paragraphs and give points to your interlocutor for continuing the conversation asking questions often at the end. it must feel like a real conversation.
                 Sometimes you use also write 2 paragraphs
                 """},
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
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))