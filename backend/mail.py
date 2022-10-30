import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

try:
    sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
except Exception as e:
    print(e.message)

def send_verify(email,name, verifyCode):
    mail = ""
    with open(os.path.join(os.getcwd(), "views", "verify.html")) as f:
        mail=f.read().replace(r"{{verifyLink}}", f"http://localhost:3000/verify?code={verifyCode}").replace("{{name}}", name)

    from_email = Email("watchflix@rithul.dev")
    to_email = To(email)
    subject = "Verify your Watchflix account"
    content = Content("text/html", mail)
    mail = Mail(from_email, to_email, subject, content)
    response = sg.client.mail.send.post(request_body=mail.get())

def send_forgot(email, name, resetCode):
    mail = ""
    with open(os.path.join(os.getcwd(), "views", "forgot.html")) as f:
        mail=f.read().replace(r"{{resetLink}}", f"http://localhost:3000/reset?code={resetCode}").replace("{{name}}", name)
    from_email = Email("watchflix@rithul.dev")
    to_email = To(email)
    subject = "Reset your password"
    content = Content("text/html", mail)
    mail = Mail(from_email, to_email, subject, content)
    response = sg.client.mail.send.post(request_body=mail.get())


movies = {
    "comedy": {
        
    }
}