import os
from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from dotenv import load_dotenv
from threading import Thread   # ⭐ async mail fix

# Load environment variables locally
load_dotenv()

app = Flask(__name__)

# ===============================
# MAIL CONFIGURATION (Render Safe)
# ===============================
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get("EMAIL_USER")
app.config['MAIL_PASSWORD'] = os.environ.get("EMAIL_PASS")
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get("EMAIL_USER")
app.config['MAIL_TIMEOUT'] = 30   # ⭐ VERY IMPORTANT (fix worker timeout)

mail = Mail(app)

# ===============================
# ASYNC MAIL SENDER (Prevents Render Timeout)
# ===============================
def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

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
            sender=os.environ.get("EMAIL_USER"),   # ⭐ REQUIRED FOR GMAIL
            recipients=['smartlokesh0123@gmail.com']
        )

        msg.body = f"""
Name: {name}
Email: {email}

Message:
{message}
"""

        # ⭐ Send mail in background (NO WORKER TIMEOUT)
        Thread(target=send_async_email, args=(app, msg)).start()

        return jsonify({"status": "success"})

    except Exception as e:
        print("Mail Error:", e)
        return jsonify({"status": "error"}), 500


# ===============================
# RUN APP
# ===============================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
