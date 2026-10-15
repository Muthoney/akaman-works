
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs/promises");

const app = express();
const PORT = process.env.PORT || 3000;

// Path to your main website folder
const websiteFolder = path.join(__dirname, "..");

// File where project inquiries will be stored
const inquiriesFile = path.join(__dirname, "inquiries.json");

// Middleware
app.use(express.json({ limit: "20kb" }));

// Allow local development requests.
// Your website is served from this same server, so CORS
// is not normally needed for the contact form.
if (process.env.ALLOW_CORS === "true") {
  app.use(cors());
}

// Serve HTML, CSS, JavaScript, and images
app.use(express.static(websiteFolder));

// Backend health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Akaman Works backend is running!"
  });
});

// Receive a project inquiry
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, projectType, message } = req.body || {};

    // Check that every field is a string
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof projectType !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all fields."
      });
    }

    // Clean the submitted values
    const inquiry = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      projectType: projectType.trim(),
      message: message.trim(),
      receivedAt: new Date().toISOString()
    };

    // Validate required fields and email
    if (
      !inquiry.name ||
      !inquiry.projectType ||
      !inquiry.message ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid details and an email address."
      });
    }

    // Limit field lengths
    if (
      inquiry.name.length > 100 ||
      inquiry.email.length > 254 ||
      inquiry.projectType.length > 100 ||
      inquiry.message.length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more fields exceed the allowed length."
      });
    }

    // Read existing inquiries
    let inquiries = [];

    try {
      const fileContents = await fs.readFile(inquiriesFile, "utf8");
      inquiries = JSON.parse(fileContents);

      if (!Array.isArray(inquiries)) {
        inquiries = [];
      }
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    // Save the new inquiry
    inquiries.push(inquiry);

    await fs.writeFile(
      inquiriesFile,
      JSON.stringify(inquiries, null, 2),
      "utf8"
    );

    return res.status(201).json({
      success: true,
      message: "Thank you! Your project inquiry has been received."
    });
  } catch (error) {
    console.error("Contact form error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save your inquiry. Please try again later."
    });
  }
});

// Handle invalid API endpoints
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found."
  });
});

// Start the server
app.listen(PORT, () => {
  console.log("----------------------------------------");
  console.log("       AKAMAN WORKS BACKEND");
  console.log("----------------------------------------");
  console.log(`Website: http://localhost:${PORT}`);
  console.log(`API test: http://localhost:${PORT}/api/health`);
  console.log("Server is ready.");
  console.log("----------------------------------------");
});
