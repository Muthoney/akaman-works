
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    if (!contactForm || !formStatus) return;

    const receivingEmail = "rachaelmuthoni247@gmail.com";
    const submitButton = contactForm.querySelector(
        'button[type="submit"]'
    );
    const submitButtonText = submitButton?.querySelector(
        ".submit-btn-text"
    );

    let isSubmitting = false;

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = type;
        formStatus.setAttribute("role", "status");
        formStatus.setAttribute("aria-live", "polite");
    }

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (isSubmitting) return;

        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const projectType = document.getElementById("projectType");
        const message = document.getElementById("message");
        const honeypot = contactForm.querySelector('[name="_honey"]');

        // Confirm that all expected fields exist.
        if (!name || !email || !projectType || !message) {
            showStatus(
                "A form field is missing. Please check contact.html.",
                "error"
            );
            return;
        }

        // Use the browser's built-in required-field validation.
        if (!contactForm.reportValidity()) return;

        // Additional email validation.
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.value.trim())) {
            showStatus(
                "Please enter a valid email address.",
                "error"
            );
            email.focus();
            return;
        }

        // Ignore automated spam submissions that fill the hidden field.
        if (honeypot && honeypot.value.trim() !== "") {
            showStatus(
                "Your inquiry could not be submitted. Please try again.",
                "error"
            );
            return;
        }

        isSubmitting = true;

        if (submitButton) {
            submitButton.disabled = true;
        }

        if (submitButtonText) {
            submitButtonText.textContent = "Sending inquiry...";
        }

        showStatus("Sending your project inquiry...", "success");

        try {
            const response = await fetch(
                `https://formsubmit.co/ajax/${encodeURIComponent(receivingEmail)}`,
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/json"
                    },
                    body: new FormData(contactForm)
                }
            );

            const result = await response.json();

            if (
                !response.ok ||
                result.success === false ||
                result.success === "false"
            ) {
                throw new Error(
                    result.message || "The form service rejected the request."
                );
            }

            contactForm.reset();

            showStatus(
                "Thank you! Your inquiry has been submitted. " +
                "We'll get back to you soon.",
                "success"
            );

        } catch (error) {
            console.error("Akaman Works form submission error:", error);

            showStatus(
                "We couldn't submit your inquiry. Please try again, " +
                "or contact us through WhatsApp at 0110981470.",
                "error"
            );

        } finally {
            isSubmitting = false;

            if (submitButton) {
                submitButton.disabled = false;
            }

            if (submitButtonText) {
                submitButtonText.textContent = "Send project inquiry";
            }
        }
    });
});
