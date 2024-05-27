import smtplib
import sys

def send_email(subject, body, to_email, from_email, password, attachment_paths):
    server = smtplib.SMTP("smtp.gmail.com", 465)
    server.starttls()

    try:
        server.login(from_email, password)
        server.sendmail(from_email, to_email, body)
        print("Email was sent successfully to:", to_email)
    except Exception as e:
        print("Error:", e)
    finally:
        server.quit()

if __name__ == "__main__":
    subject = sys.argv[1]
    body = sys.argv[2]
    to_email = sys.argv[3]
    from_email = sys.argv[4]
    password = sys.argv[5]
    attachment_paths = sys.argv[6:]

    send_email(subject, body, to_email, from_email, password, attachment_paths)