import os
from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

# ===============================
# MAIL CONFIGURATION
# ===============================
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get("EMAIL_USER")
app.config['MAIL_PASSWORD'] = os.environ.get("EMAIL_PASS")
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get("EMAIL_USER")

mail = Mail(app)

# ===============================
# HOME PAGE
# ===============================
@app.route('/')
def home():
    return render_template("index.html")

# ===============================
# CONTACT FORM ROUTE (AJAX)
# ===============================
@app.route('/contact', methods=['POST'])
def contact():

    name = request.form.get('name')
    email = request.form.get('email')
    subject = request.form.get('subject')
    message = request.form.get('message')

    try:
        msg = Message(
            subject=f"New Contact Form: {subject}",
            recipients=['smartlokesh0123@gmail.com']
        )

        msg.body = f"""
Name: {name}
Email: {email}

Message:
{message}
"""

        mail.send(msg)

        # ✅ Send success response for popup
        return jsonify({"status": "success"})

    except Exception as e:
        print("Mail Error:", e)

        # ❌ Send error response
        return jsonify({"status": "error"})


# ===============================
# RUN APP
# ===============================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
