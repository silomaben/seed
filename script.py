# script.py
import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os

def send_email(subject, body, to_email, from_email, password, attachment_paths):
    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['From'] = from_email
    msg['To'] = to_email

    msg.attach(MIMEText(body, 'plain'))

    for path in attachment_paths:
        attachment = open(path, 'rb')
        part = MIMEBase('application', 'octet-stream')
        part.set_payload((attachment).read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', "attachment; filename= " + os.path.basename(path))
        msg.attach(part)

    with smtplib.SMTP_SSL('smtp.example.com', 465) as server:
        server.login(from_email, password)
        server.sendmail(from_email, [to_email], msg.as_string())

if __name__ == "__main__":
    subject = sys.argv[1]
    body = sys.argv[2]
    to_email = sys.argv[3]
    from_email = sys.argv[4]
    password = sys.argv[5]
    attachment_paths = sys.argv[6:]

    send_email(subject, body, to_email, from_email, password, attachment_paths)
