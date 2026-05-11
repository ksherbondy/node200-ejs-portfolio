import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import sendgrid from "@sendgrid/mail";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

const projects = [
  {
    name: "GitHub",
    description: "My public repositories and software development work.",
    url: "https://github.com/ksherbondy",
  },
  {
    name: "Althing Hall",
    description: "A deployed PWA/SPA built during a 72-hour hackathon.",
    url: "https://althinghall.com",
  },
  {
    name: "RelayDB",
    description: "An experimental compiled read-layer for static relational JSON data.",
    url: "https://github.com/ksherbondy/RelayDB",
  },
];

function cleanContact(body) {
  return {
    firstName: String(body.firstName || "").trim(),
    lastName: String(body.lastName || "").trim(),
    email: String(body.email || "").trim(),
  };
}

function isValidContact(contact) {
  return contact.firstName && contact.lastName && contact.email;
}

async function deliverContact(contact) {
  const hasSendGridConfig =
    process.env.SENDGRID_API_KEY &&
    process.env.CONTACT_TO_EMAIL &&
    process.env.CONTACT_FROM_EMAIL;

  if (!hasSendGridConfig) {
    console.log("Contact delivery skipped. Add SendGrid env variables to enable email delivery.");
    console.log("New contact form submission:", contact);
    return;
  }

  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

  await sendgrid.send({
    to: process.env.CONTACT_TO_EMAIL,
    from: process.env.CONTACT_FROM_EMAIL,
    subject: "New portfolio contact form submission",
    text: `Name: ${contact.firstName} ${contact.lastName}\nEmail: ${contact.email}`,
    html: `
      <h2>New portfolio contact form submission</h2>
      <p><strong>Name:</strong> ${contact.firstName} ${contact.lastName}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
    `,
  });
}

app.get("/", (req, res) => {
  res.render("index", {
    title: "Kristopher Sherbondy | Portfolio",
    projects,
  });
});

app.get("/portfolio", (req, res) => {
  res.render("portfolio", {
    title: "Portfolio",
    projects,
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact",
    error: null,
    formData: {},
  });
});

app.post("/thanks", async (req, res) => {
  const contact = cleanContact(req.body);

  if (!isValidContact(contact)) {
    return res.status(400).render("contact", {
      title: "Contact",
      error: "Please complete all contact fields.",
      formData: contact,
    });
  }

  try {
    await deliverContact(contact);

    return res.render("thanks", {
      title: "Thank You",
      contact,
    });
  } catch (error) {
    console.error("Contact delivery failed:", error);

    return res.status(500).render("contact", {
      title: "Contact",
      error: "Something went wrong while sending your message. Please try again.",
      formData: contact,
    });
  }
});

app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
