# NODE200 EJS Personal Portfolio

Personal portfolio website built with Express and EJS.

## Run locally

```sh
npm install
npm start
```

Open:

```txt
http://localhost:3000
```

## Contact delivery with SendGrid

The app will run without SendGrid configured and will log contact submissions to the terminal.

To enable SendGrid email delivery, add these environment variables in Render or your local `.env` setup:

```txt
SENDGRID_API_KEY=your_sendgrid_api_key
CONTACT_TO_EMAIL=your_email@example.com
CONTACT_FROM_EMAIL=your_verified_sendgrid_sender@example.com
```

The `CONTACT_FROM_EMAIL` must be a verified sender in SendGrid.

## Routes

- `/` home page
- `/portfolio` portfolio page
- `/contact` contact form
- `/thanks` POST route for contact form submission
