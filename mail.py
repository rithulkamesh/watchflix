import os
from sendgrid import SendGridAPIClient

try:
    sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
except Exception as e:
    print(e.message)

def send(email, verifyCode):
    mail = ""
    with open(r"views\verify.html") as f:
        mail=f.read()
    mail=mail.replace(r"{{verifyLink}}", f"http://localhost:3000/verify?code={verifyCode}") 
    try:
        response = sg.client.mail.send.post(request_body={
            "personalizations": [
                {
                    "to": [
                        {
                            "email": email
                        }
                    ],
                    "subject": "Verify your email"
                }
            ],
            "from": {
                "email": "watchflix@rithul.dev"
            },
            "content": [
                {
                    "type": "text/html",
                    "value": mail
                }
            ]
        })

    except Exception as e:
        print(e.message)
