# backend/app/utils/email.py

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings


def send_giftee_email(to_email, giver_name, receiver_name, party):
    subject = f"Your Secret Santa Match for {party['name']}!"

    html = f"""
    <h2>Hi {giver_name}!</h2>
    <p>Your Secret Santa assignment is:</p>

    <h3>🎁 {receiver_name}</h3>

    <p><strong>Party Details:</strong></p>
    <p>Date: {party['event_date']}</p>
    <p>Time: {party['event_time']}</p>
    <p>Budget: {party['budget']} {party['currency']}</p>
    <p>Description: {party['description']}</p>
    """

    msg = MIMEMultipart()
    msg["From"] = settings.SMTP_EMAIL
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_EMAIL, to_email, msg.as_string())
