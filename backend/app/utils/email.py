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
        # Switch to port 587 with STARTTLS
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls(context=context)
            server.login(sender_email, password)
            server.send_message(msg)
        print(f"✅ Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")
        return False

def send_match_email(participant, giftee_name, giftee_email, party_details):
    """
    Formats and sends the Secret Santa match email.
    """
    subject = f"Your Secret Santa Match for {party_details['name']}!"
    
    template = """<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secret Santa Match</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
    <style>
        /* Client-specific resets */
        body, table, td, a {{ text-size-adjust: 100%; }}
        table, td {{ mso-table-lspace: 0pt; mso-table-rspace: 0pt; }}
        img {{ -ms-interpolation-mode: bicubic; }}
        
        /* Web Font Fallbacks */
        h1, h2, h3 {{ font-family: 'Instrument Serif', 'Times New Roman', serif; }}
        body, p, td, div, span {{ font-family: 'Geist', 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }}
        
        .glass-container {{
            background-color: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
        }}
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #931621; color: #ffffff;">
    <div style="background: linear-gradient(180deg, #931621 0%, #c52233 100%); width: 100%; min-height: 100vh; padding: 40px 0; position: relative;">
        <!-- Dark Overlay with Blur -->
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.2); backdrop-filter: blur(8px); z-index: 0;"></div>

        <div style="max-width: 600px; margin: 0 auto; padding: 20px; position: relative; z-index: 1;">
            
            <!-- Logo / Title -->
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="margin: 0; color: #ffffff; font-size: 48px; font-weight: 400; line-height: 1; text-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                    Secret Santa
                </h1>
                <p style="margin: 0; font-family: 'Instrument Serif', serif; font-style: italic; font-size: 24px; color: rgba(255,255,255,0.9);">
                    Matcher
                </p>
            </div>

            <!-- Main Card -->
            <div class="glass-container" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 24px; padding: 40px 30px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); text-align: center;">
                
                <p style="font-size: 18px; color: #ffffff; margin-top: 0;">Hello, <strong>{participant_name}</strong>!</p>
                
                <p style="color: rgba(255,255,255,0.8); line-height: 1.6; margin-bottom: 30px;">
                    The magic has happened. You have been chosen to be the Secret Santa for:
                </p>

                <!-- Match Reveal -->
                <div style="background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; padding: 30px; margin: 30px 0;">
                    <span style="font-size: 12px; text-transform: uppercase; color: rgba(255,255,255,0.6); letter-spacing: 2px; font-weight: 600;">Your Match</span>
                    <h2 style="margin: 15px 0 5px 0; color: #ffffff; font-size: 36px; font-weight: 400; letter-spacing: 0.5px;">{giftee_name}</h2>
                    <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 16px;">{giftee_email}</p>
                </div>

                <!-- Party Details Table -->
                <div style="background-color: rgba(0, 0, 0, 0.2); border-radius: 16px; padding: 20px; margin-top: 30px;">
                    <h3 style="margin: 0 0 15px 0; color: rgba(255,255,255,0.9); font-size: 20px; font-weight: 400; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">Party Details</h3>
                    
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <tr>
                            <td style="padding: 10px; color: rgba(255,255,255,0.6); width: 40%; font-size: 14px;">Event</td>
                            <td style="padding: 10px; color: #ffffff; font-weight: 600; font-size: 15px;">{party_name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; color: rgba(255,255,255,0.6); font-size: 14px;">When</td>
                            <td style="padding: 10px; color: #ffffff; font-weight: 600; font-size: 15px;">{party_date} @ {party_time}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; color: rgba(255,255,255,0.6); font-size: 14px;">Budget</td>
                            <td style="padding: 10px; color: #ffffff; font-weight: 600; font-size: 15px;">{party_budget} {party_currency}</td>
                        </tr>
                    </table>

                    <!-- Description -->
                    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.6; font-style: italic;">
                        "{party_description}"
                    </div>
                </div>

                <p style="margin-top: 30px; color: rgba(255,255,255,0.5); font-size: 14px;">
                    Remember, it's a secret!
                </p>

            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px;">
                <p style="margin: 0; color: rgba(255,255,255,0.4); font-size: 12px;">
                    Powered by <a href="https://dhrvm.github.io/SecretSanta/" style="color: rgba(255,255,255,0.6); text-decoration: none;">Secret Santa Matcher</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>"""
        
    html = template.format(
        participant_name=participant['name'],
        giftee_name=giftee_name,
        giftee_email=giftee_email,
        party_name=party_details['name'],
        party_date=party_details['event_date'],
        party_time=str(party_details['event_time'])[:5],
        party_budget=party_details['budget'],
        party_currency=party_details['currency'],
        party_description=party_details.get('description', '')
    )
    
    return send_email(participant['email'], subject, html)

def send_host_email(host, party_details, room_code, room_link):
    """
    Sends the host their unique room code + room link.
    """
    subject = f"Your Secret Santa Room Is Ready, {host['name']}!"

    template = """<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Secret Santa Room</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        /* Client-specific resets */
        body, table, td, a {{ text-size-adjust: 100%; }}
        table, td {{ mso-table-lspace: 0pt; mso-table-rspace: 0pt; }}
        img {{ -ms-interpolation-mode: bicubic; }}
        
        /* Web Font Fallbacks */
        h1, h2, h3 {{ font-family: 'Instrument Serif', 'Times New Roman', serif; }}
        body, p, td, div, span {{ font-family: 'Geist', 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }}
        .code-font {{ font-family: 'JetBrains Mono', 'Courier New', monospace; }}
        
        .glass-container {{
            background-color: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
        }}
        .glass-button:hover {{
            background-color: rgba(255, 255, 255, 0.2) !important;
            box-shadow: 0 0 30px rgba(255,255,255,0.2) !important;
        }}
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #931621; color: #ffffff;">
    <div style="background: linear-gradient(180deg, #931621 0%, #c52233 100%); width: 100%; min-height: 100vh; padding: 40px 0; position: relative;">
        <!-- Dark Overlay with Blur -->
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.2); backdrop-filter: blur(8px); z-index: 0;"></div>

        <div style="max-width: 600px; margin: 0 auto; padding: 20px; position: relative; z-index: 1;">
            
            <!-- Logo / Title -->
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="margin: 0; color: #ffffff; font-size: 48px; font-weight: 400; line-height: 1; text-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                    Secret Santa
                </h1>
                <p style="margin: 0; font-family: 'Instrument Serif', serif; font-style: italic; font-size: 24px; color: rgba(255,255,255,0.9);">
                    Room Ready
                </p>
            </div>

            <!-- Main Card -->
            <div class="glass-container" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 24px; padding: 40px 30px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); text-align: center;">
                
                <p style="font-size: 18px; color: #ffffff; margin-top: 0;">Hi <strong>{host_name}</strong>,</p>
                
                <p style="color: rgba(255,255,255,0.8); line-height: 1.6;">
                    Your party <strong>{party_name}</strong> is ready. Invite your friends!
                </p>

                <!-- Room Access Code -->
                <div style="margin: 35px 0;">
                    <div style="margin-bottom: 25px;">
                        <a href="{room_link}" class="glass-button" style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.5); color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 50px; font-weight: 600; font-size: 18px; transition: all 0.3s ease;">
                            Enter Room &rarr;
                        </a>
                    </div>

                    <p style="margin-top: 10px; margin-bottom: 30px; font-size: 12px; color: rgba(255,255,255,0.6); word-break: break-all; font-family: monospace;">
                        <a href="{room_link}" style="color: #ffffff; text-decoration: underline;">{room_link}</a>
                    </p>
                </div>

                <!-- Party Details Summary -->
                <div style="background-color: rgba(0, 0, 0, 0.2); border-radius: 16px; padding: 20px; margin-top: 30px; text-align: left;">
                     <h3 style="margin: 0 0 15px 0; color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 400; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">Party Details</h3>
                    
                     <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 6px 0; color: rgba(255,255,255,0.6); width: 40%; font-size: 14px;">Date</td>
                            <td style="padding: 6px 0; color: #ffffff; font-size: 14px;">{party_date}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: rgba(255,255,255,0.6); font-size: 14px;">Time</td>
                            <td style="padding: 6px 0; color: #ffffff; font-size: 14px;">{party_time}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: rgba(255,255,255,0.6); font-size: 14px;">Budget</td>
                            <td style="padding: 6px 0; color: #ffffff; font-size: 14px;">{party_budget} {party_currency}</td>
                        </tr>
                    </table>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <p style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; color: rgba(255,255,255,0.6); letter-spacing: 2px;">Admin Passcode</p>
                    <span class="code-font" style="display: block; font-size: 20px; color: #ffffff; letter-spacing: 2px; font-weight: 700;">{room_code}</span>
                    <p style="margin: 5px 0 0 0; color: rgba(255,255,255,0.5); font-size: 12px;">
                        Keep this secret. Do not share with guests.
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px;">
                <p style="margin: 0; color: rgba(255,255,255,0.4); font-size: 12px;">
                    Powered by <a href="https://dhrvm.github.io/SecretSanta/" style="color: rgba(255,255,255,0.6); text-decoration: none;">Secret Santa Matcher</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>"""

    html = template.format(
        host_name=host['name'],
        party_name=party_details['name'],
        party_date=party_details['event_date'],
        party_time=str(party_details['event_time'])[:5],
        party_budget=party_details['budget'],
        party_currency=party_details['currency'],
        room_code=room_code,
        room_link=room_link
    )


    return send_email(host['email'], subject, html)
