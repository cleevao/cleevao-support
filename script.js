// FAQ Toggle Functionality
function toggleFaq(button) {
	const faqItem = button.closest(".faq-item");
	const isActive = faqItem.classList.contains("active");

	// Close all other FAQ items
	document.querySelectorAll(".faq-item").forEach((item) => {
		if (item !== faqItem) {
			item.classList.remove("active");
		}
	});

	// Toggle current item
	if (isActive) {
		faqItem.classList.remove("active");
	} else {
		faqItem.classList.add("active");
	}
}

// Contact Form Handling with Web3Forms
document.addEventListener("DOMContentLoaded", function () {
	const contactForm = document.getElementById("contactForm");

	if (contactForm) {
		const submitButton = contactForm.querySelector(".submit-button");

		// Function to handle form submission
		async function handleFormSubmission(e) {
			if (e) e.preventDefault();

			// Get form data
			const formData = new FormData(contactForm);
			const formObject = {};
			formData.forEach((value, key) => {
				formObject[key] = value;
			});

			// Validate form
			if (validateForm(formObject)) {
				// Show loading state
				const submitButton = contactForm.querySelector(".submit-button");
				const originalText = submitButton.textContent;
				submitButton.textContent = "Sending...";
				submitButton.disabled = true;

				try {
					// Submit to Web3Forms
					const response = await fetch("https://api.web3forms.com/submit", {
						method: "POST",
						body: formData,
					});

					const result = await response.json();

					if (result.success) {
						// Show success message
						showSuccessMessage();

						// Reset form
						contactForm.reset();
					} else {
						throw new Error(result.message || "Form submission failed");
					}
				} catch (error) {
					console.error("Error submitting form:", error);
					showErrorMessage(
						"Sorry, there was an error sending your message. Please try again or contact us directly at cleevao@gmail.com."
					);
				} finally {
					// Reset button state
					submitButton.textContent = originalText;
					submitButton.disabled = false;
				}
			}
		}

		contactForm.addEventListener("submit", handleFormSubmission);

		// Also add click handler to submit button as backup
		if (submitButton) {
			submitButton.addEventListener("click", function (e) {
				e.preventDefault();
				handleFormSubmission();
			});
		}
	}
});

// Form Validation
function validateForm(formData) {
	const requiredFields = ["name", "email", "topic", "message"];
	let isValid = true;

	// Remove existing error states
	document.querySelectorAll(".form-group").forEach((group) => {
		group.classList.remove("error");
	});

	// Check required fields
	requiredFields.forEach((field) => {
		if (!formData[field] || formData[field].trim() === "") {
			isValid = false;
			const fieldElement = document.getElementById(field);
			if (fieldElement) {
				fieldElement.closest(".form-group").classList.add("error");
			}
		}
	});

	// Validate email format
	if (formData.email && !isValidEmail(formData.email)) {
		isValid = false;
		const emailElement = document.getElementById("email");
		if (emailElement) {
			emailElement.closest(".form-group").classList.add("error");
		}
	}

	if (!isValid) {
		showErrorMessage("Please fill in all required fields correctly.");
	}

	return isValid;
}

// Email validation helper
function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

// Show success message
function showSuccessMessage() {
	// Remove any existing messages
	const existingMessage = document.querySelector(".success-message");
	if (existingMessage) {
		existingMessage.remove();
	}

	// Create success message
	const successMessage = document.createElement("div");
	successMessage.className = "success-message show";
	successMessage.innerHTML = `
        <p>✅ Thank you for your message! We'll get back to you within 24 hours.</p>
    `;

	// Insert before the form
	const form = document.getElementById("contactForm");
	form.parentNode.insertBefore(successMessage, form);

	// Scroll to message
	successMessage.scrollIntoView({ behavior: "smooth", block: "center" });

	// Remove message after 5 seconds
	setTimeout(() => {
		if (successMessage.parentNode) {
			successMessage.remove();
		}
	}, 5000);
}

// Show error message
function showErrorMessage(message) {
	// Remove any existing messages
	const existingMessage = document.querySelector(".error-message");
	if (existingMessage) {
		existingMessage.remove();
	}

	// Create error message
	const errorMessage = document.createElement("div");
	errorMessage.className = "error-message show";
	errorMessage.style.cssText = `
        background: #FED7D7;
        color: #C53030;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 24px;
        text-align: center;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
	errorMessage.innerHTML = `<p>❌ ${message}</p>`;

	// Insert before the form
	const form = document.getElementById("contactForm");
	form.parentNode.insertBefore(errorMessage, form);

	// Remove message after 5 seconds
	setTimeout(() => {
		if (errorMessage.parentNode) {
			errorMessage.remove();
		}
	}, 5000);
}

// Smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", function () {
	const navLinks = document.querySelectorAll('a[href^="#"]');

	navLinks.forEach((link) => {
		link.addEventListener("click", function (e) {
			e.preventDefault();

			const targetId = this.getAttribute("href");
			const targetElement = document.querySelector(targetId);

			if (targetElement) {
				const headerHeight = document.querySelector(".header").offsetHeight;
				const targetPosition = targetElement.offsetTop - headerHeight - 20;

				window.scrollTo({
					top: targetPosition,
					behavior: "smooth",
				});
			}
		});
	});
});

// Add some interactive enhancements
document.addEventListener("DOMContentLoaded", function () {
	// Add loading state to submit button
	const submitButton = document.querySelector(".submit-button");
	if (submitButton) {
		const originalText = submitButton.textContent;

		submitButton.addEventListener("click", function () {
			if (this.form.checkValidity()) {
				this.textContent = "Sending...";
				this.disabled = true;

				// Re-enable after a short delay (in real app, this would be when server responds)
				setTimeout(() => {
					this.textContent = originalText;
					this.disabled = false;
				}, 2000);
			}
		});
	}

	// Add hover effects to contact methods
	const contactMethods = document.querySelectorAll(".contact-method");
	contactMethods.forEach((method) => {
		method.addEventListener("mouseenter", function () {
			this.style.transform = "translateY(-2px)";
			this.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
		});

		method.addEventListener("mouseleave", function () {
			this.style.transform = "translateY(0)";
			this.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
		});
	});
});

// Handle keyboard navigation for FAQ items
document.addEventListener("keydown", function (e) {
	if (e.target.classList.contains("faq-question")) {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			toggleFaq(e.target);
		}
	}
});

// Add form field focus states
document.addEventListener("DOMContentLoaded", function () {
	const formInputs = document.querySelectorAll("input, select, textarea");

	formInputs.forEach((input) => {
		input.addEventListener("focus", function () {
			this.closest(".form-group").classList.add("focused");
		});

		input.addEventListener("blur", function () {
			this.closest(".form-group").classList.remove("focused");

			// Add validation on blur
			if (this.hasAttribute("required") && !this.value.trim()) {
				this.closest(".form-group").classList.add("error");
			} else {
				this.closest(".form-group").classList.remove("error");
			}
		});
	});
});

// Placeholder function for actual server integration
function sendToServer(formData) {
	// This is where you would implement the actual server communication
	// Example using fetch API:
	/*
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessMessage();
        } else {
            showErrorMessage('Sorry, there was an error sending your message. Please try again.');
        }
    })
    .catch(error => {
        showErrorMessage('Sorry, there was an error sending your message. Please try again.');
    });
    */
}
