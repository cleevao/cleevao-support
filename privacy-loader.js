// Privacy Policy Loader - Loads and renders privacy policy content from privacy_policy.md
class PrivacyPolicyLoader {
	constructor() {
		this.contentContainer = null;
	}

	// Initialize the privacy policy loader
	async init() {
		this.contentContainer = document.querySelector(
			".privacy-content-container"
		);
		if (!this.contentContainer) {
			console.error("Privacy policy content container not found");
			return;
		}

		try {
			await this.loadAndRenderPrivacyPolicy();
		} catch (error) {
			console.error("Failed to load privacy policy:", error);
			this.showFallback();
		}
	}

	// Fetch and parse the privacy_policy.md file
	async loadAndRenderPrivacyPolicy() {
		// Check if we're running from file:// protocol
		if (window.location.protocol === "file:") {
			console.warn(
				"Running from file:// protocol. Please use a local web server for full functionality."
			);
			throw new Error(
				"CORS policy prevents loading privacy_policy.md from file:// protocol. Please use a local web server."
			);
		}

		const response = await fetch("privacy_policy.md");
		if (!response.ok) {
			throw new Error(`Failed to fetch privacy_policy.md: ${response.status}`);
		}

		const markdownContent = await response.text();
		const htmlContent = this.convertMarkdownToHTML(markdownContent);
		this.renderContent(htmlContent);
	}

	// Convert markdown content to HTML
	convertMarkdownToHTML(markdown) {
		let html = markdown;

		// Convert headers
		html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>");
		html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>");
		html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>");
		html = html.replace(/^#### (.*$)/gm, "<h4>$1</h4>");

		// Convert bold text
		html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

		// Convert italic text
		html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

		// Convert code snippets
		html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

		// Convert links
		html = html.replace(
			/\[([^\]]+)\]\(([^)]+)\)/g,
			'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
		);

		// Convert bullet points
		html = html.replace(/^- (.*$)/gm, "<li>$1</li>");

		// Wrap consecutive list items in <ul> tags
		html = html.replace(/(<li>.*<\/li>)/gs, function (match) {
			const listItems = match
				.split("</li>")
				.filter((item) => item.trim())
				.map((item) => item + "</li>");
			return "<ul>" + listItems.join("") + "</ul>";
		});

		// Convert line breaks to paragraphs
		const lines = html.split("\n");
		let processedLines = [];
		let inList = false;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();

			// Skip empty lines
			if (!line) {
				continue;
			}

			// Check if we're in a list
			if (line.includes("<ul>") || line.includes("<li>")) {
				inList = true;
				processedLines.push(line);
				continue;
			}

			if (line.includes("</ul>")) {
				inList = false;
				processedLines.push(line);
				continue;
			}

			// If it's a header, add it as is
			if (line.match(/^<h[1-6]>/)) {
				processedLines.push(line);
				continue;
			}

			// If we're not in a list and it's not a header, wrap in paragraph
			if (!inList && !line.includes("<ul>") && !line.includes("<li>")) {
				processedLines.push(`<p>${line}</p>`);
			} else {
				processedLines.push(line);
			}
		}

		return processedLines.join("\n");
	}

	// Render the converted HTML content
	renderContent(htmlContent) {
		this.contentContainer.innerHTML = htmlContent;
		console.log("Privacy policy loaded successfully from privacy_policy.md");
	}

	// Show fallback content if loading fails
	showFallback() {
		const isFileProtocol = window.location.protocol === "file:";
		const troubleshootingMessage = isFileProtocol
			? "To see the full privacy policy content, please start a local web server. Run <code>python3 -m http.server 8000</code> in your terminal and visit <strong>http://localhost:8000</strong>"
			: "We're having trouble loading the privacy policy content. Please try refreshing the page.";

		this.contentContainer.innerHTML = `
            <h1>Privacy Policy</h1>
            <p><strong>Effective Date:</strong> [To be updated]</p>
            
            <h2>Information We Collect</h2>
            <p>[Placeholder content to be updated with actual privacy policy details including what information is collected, how it's used, and how it's protected.]</p>

            <h2>How We Use Your Information</h2>
            <p>[Placeholder content about how collected information is used to provide and improve the service.]</p>

            <h2>Children's Privacy (COPPA)</h2>
            <p>[Placeholder content about COPPA compliance and how children's privacy is protected in the app.]</p>

            <h2>Data Security</h2>
            <p>[Placeholder content about security measures used to protect user data.]</p>

            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p>Email: <a href="mailto:cleevao@gmail.com">cleevao@gmail.com</a></p>

            <div style="background: #FFF5F5; border: 1px solid #FEB2B2; border-radius: 8px; padding: 16px; margin-top: 32px;">
                <p style="color: #C53030; font-weight: 600; margin: 0;">
                    ${troubleshootingMessage}
                </p>
            </div>
        `;
	}
}

// Initialize privacy policy loader when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
	const privacyLoader = new PrivacyPolicyLoader();
	privacyLoader.init();
});
