import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

def send_email(to_email: str, subject: str, body_html: str):
    """
    Sends an HTML email using SMTP (Gmail).
    """
    sender_email = settings.EMAIL_SENDER
    password = settings.EMAIL_PASSWORD
    
    if not sender_email or not password:
        print(f"⚠️ Email credentials not set. Would have sent email to {to_email}")
        return False

    msg = MIMEMultipart()
    msg['From'] = f"Secret Santa Matcher <{sender_email}>"
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body_html, 'html'))

    try:
        # Connect to Gmail SMTP (standard)
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as server:
            server.login(sender_email, password)
            server.send_message(msg)
        print(f"✅ Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")
        return False

def send_match_email(participant, giftee_name, party_details):
    """
    Formats and sends the Secret Santa match email.
    """
    subject = f"🎅 Your Secret Santa Match for {party_details['name']}!"
    
    # Simple nice HTML template
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #fff;">
        <h1 style="color: #d42426; text-align: center;">Secret Santa Match!</h1>
        <p>Ho Ho Ho, <strong>{participant['name']}</strong>!</p>
        
        <p>You have been chosen to be the Secret Santa for:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border-left: 5px solid #d42426;">
            <h2 style="margin: 0; color: #333; font-size: 24px;">🎁 {giftee_name} 🎁</h2>
        </div>
        
        <h3>Party Details:</h3>
        <ul style="list-style: none; padding: 0;">
            <li style="padding: 5px 0;"><strong>🎉 Party:</strong> {party_details['name']}</li>
            <li style="padding: 5px 0;"><strong>📅 When:</strong> {party_details['event_date']} @ {str(party_details['event_time'])[:5]}</li>
            <li style="padding: 5px 0;"><strong>💰 Budget:</strong> {party_details['budget']} {party_details['currency']}</li>
        </ul>
        
        <p>{party_details.get('description', '')}</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #666; font-size: 12px; text-align: center;">
            Powered by <a href="https://dhrvm.github.io/SecretSanta/" style="color: #d42426; text-decoration: none;">Secret Santa Matcher</a>
        </p>
    </div>
    """
    
    return send_email(participant['email'], subject, html)

def send_host_email(host, party_details, room_code, room_link):
    """
    Sends the host their unique room code + room link.
    """
    subject = f"🎄 Your Secret Santa Room Is Ready, {host['name']}!"

    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #fff;">
        <h1 style="color: #d42426; text-align: center;">Your Secret Santa Room is Ready!</h1>
        
        <p>Hi <strong>{host['name']}</strong>,</p>
        <p>Your Secret Santa party has been created successfully. Here are your host details:</p>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 5px solid #d42426; margin: 20px 0;">
            <p><strong>🎉 Party:</strong> {party_details['name']}</p>
            <p><strong>📅 Date:</strong> {party_details['event_date']} @ {str(party_details['event_time'])[:5]}</p>
            <p><strong>💰 Budget:</strong> {party_details['budget']} {party_details['currency']}</p>
        </div>

        <h3>Your Room Access</h3>
        <p><strong>🔐 Passcode:</strong> <span style="font-size: 18px;">{room_code}</span></p>
        
        <p><strong>🔗 Room Link:</strong><br>
            <a href="{room_link}" style="color: #d42426; text-decoration: none; font-size: 18px;">
                {room_link}
            </a>
        </p>

        <p>You can share this link + passcode with your participants so they can join the room.</p>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #666; font-size: 12px; text-align: center;">
            Powered by <a href="https://dhrvm.github.io/SecretSanta/" style="color: #d42426; text-decoration: none;">Secret Santa Matcher</a>
        </p>
    </div>
    """

    return send_email(host['email'], subject, html)
