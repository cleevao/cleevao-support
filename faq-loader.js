// FAQ Loader - Loads and renders FAQ content from FAQ.md
class FAQLoader {
	constructor() {
		this.faqContainer = null;
	}

	// Initialize the FAQ loader
	async init() {
		this.faqContainer = document.querySelector(".faq-list");
		if (!this.faqContainer) {
			console.error("FAQ container not found");
			return;
		}

		try {
			await this.loadAndRenderFAQ();
		} catch (error) {
			console.error("Failed to load FAQ:", error);
			this.showFallback();
		}
	}

	// Fetch and parse the FAQ.md file
	async loadAndRenderFAQ() {
		// Check if we're running from file:// protocol
		if (window.location.protocol === 'file:') {
			console.warn('Running from file:// protocol. Please use a local web server for full functionality.');
			throw new Error('CORS policy prevents loading FAQ.md from file:// protocol. Please use a local web server.');
		}

		const response = await fetch("FAQ.md");
		if (!response.ok) {
			throw new Error(`Failed to fetch FAQ.md: ${response.status}`);
		}

		const markdownContent = await response.text();
		const faqItems = this.parseMarkdownToFAQ(markdownContent);
		this.renderFAQItems(faqItems);
	}

	// Parse markdown content and extract FAQ items
	parseMarkdownToFAQ(markdown) {
		const faqItems = [];
		const lines = markdown.split("\n");
		let currentQuestion = null;
		let currentAnswer = [];
		let inAnswerSection = false;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();

			// Skip empty lines and main headers
			if (
				!line ||
				line.startsWith("# ") ||
				line.startsWith("## ") ||
				line.startsWith("---") ||
				line.startsWith("_Last Updated")
			) {
				continue;
			}

			// Check if this is a question (starts with ###)
			if (line.startsWith("### ")) {
				// Save previous FAQ item if exists
				if (currentQuestion && currentAnswer.length > 0) {
					faqItems.push({
						question: currentQuestion,
						answer: currentAnswer.join("\n").trim(),
					});
				}

				// Start new FAQ item
				currentQuestion = line.replace("### ", "").trim();
				currentAnswer = [];
				inAnswerSection = true;
				continue;
			}

			// If we're in an answer section, collect the content
			if (inAnswerSection && currentQuestion) {
				// Skip table of contents and navigation elements
				if (
					(line.includes("[") && line.includes("](#")) ||
					line.startsWith("1.") ||
					line.startsWith("2.") ||
					line.includes("Table of Contents")
				) {
					continue;
				}

				currentAnswer.push(line);
			}
		}

		// Don't forget the last item
		if (currentQuestion && currentAnswer.length > 0) {
			faqItems.push({
				question: currentQuestion,
				answer: currentAnswer.join("\n").trim(),
			});
		}

		return faqItems;
	}

	// Render FAQ items in the HTML
	renderFAQItems(faqItems) {
		// Clear existing content
		this.faqContainer.innerHTML = "";

		faqItems.forEach((item, index) => {
			const faqItem = this.createFAQItem(item.question, item.answer, index);
			this.faqContainer.appendChild(faqItem);
		});

		console.log(`Loaded ${faqItems.length} FAQ items from FAQ.md`);
	}

	// Create individual FAQ item HTML
	createFAQItem(question, answer, index) {
		const faqItem = document.createElement("div");
		faqItem.className = "faq-item";

		// Create question button
		const questionButton = document.createElement("button");
		questionButton.className = "faq-question";
		questionButton.onclick = () => toggleFaq(questionButton);

		questionButton.innerHTML = `
            <span>${question}</span>
            <svg class="faq-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 8L10 13L5 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

		// Create answer div
		const answerDiv = document.createElement("div");
		answerDiv.className = "faq-answer";

		// Convert markdown-style formatting to HTML
		const formattedAnswer = this.formatAnswerText(answer);
		answerDiv.innerHTML = `<p>${formattedAnswer}</p>`;

		faqItem.appendChild(questionButton);
		faqItem.appendChild(answerDiv);

		return faqItem;
	}

	// Format answer text (convert basic markdown to HTML)
	formatAnswerText(text) {
		return (
			text
				// Convert **bold** to <strong>
				.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
				// Convert bullet points
				.replace(/^- (.*$)/gm, "• $1")
				// Convert numbered lists
				.replace(/^\d+\. (.*$)/gm, "$1")
				// Convert line breaks to <br> but preserve paragraphs
				.replace(/\n\n/g, "</p><p>")
				.replace(/\n/g, "<br>")
				// Clean up any empty paragraphs
				.replace(/<p><\/p>/g, "")
				// Handle special formatting
				.replace(/`([^`]+)`/g, "<code>$1</code>")
		);
	}

	    // Show fallback content if loading fails
    showFallback() {
        const isFileProtocol = window.location.protocol === 'file:';
        const troubleshootingMessage = isFileProtocol 
            ? 'To see the full FAQ content, please start a local web server. Run <code>python3 -m http.server 8000</code> in your terminal and visit <strong>http://localhost:8000</strong>'
            : 'We\'re having trouble loading the FAQ content. Please try refreshing the page, or contact us directly for assistance.';

        this.faqContainer.innerHTML = `
            <div class="faq-item">
                <button class="faq-question" onclick="toggleFaq(this)">
                    <span>How do I contact support?</span>
                    <svg class="faq-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 8L10 13L5 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="faq-answer">
                    <p>If you have any questions or need assistance, please contact us at <strong>cleevao@gmail.com</strong>. We aim to respond within 24 hours.</p>
                </div>
            </div>
            <div class="faq-item">
                <button class="faq-question" onclick="toggleFaq(this)">
                    <span>What grade levels does Cleevao support?</span>
                    <svg class="faq-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 8L10 13L5 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="faq-answer">
                    <p>Cleevao is designed for students in grades K through 8, covering essential subjects and skills appropriate for elementary and middle school learning levels.</p>
                </div>
            </div>
            <div class="faq-item">
                <button class="faq-question" onclick="toggleFaq(this)">
                    <span>${isFileProtocol ? 'How to see full FAQ content?' : 'Unable to load FAQ content'}</span>
                    <svg class="faq-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 8L10 13L5 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="faq-answer">
                    <p>${troubleshootingMessage}</p>
                </div>
            </div>
        `;
    }
}

// Initialize FAQ loader when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
	const faqLoader = new FAQLoader();
	faqLoader.init();
});
