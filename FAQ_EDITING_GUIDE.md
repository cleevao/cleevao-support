# FAQ Editing Guide

## How to Edit FAQ Content

Your FAQ content is now dynamically loaded from the `FAQ.md` file. This makes it super easy to update questions and answers without touching any HTML or JavaScript code!

## 📝 Editing FAQ Content

### 1. Open the FAQ.md file

- The file is located in your root directory: `FAQ.md`
- You can edit it with any text editor

### 2. FAQ Format

Each FAQ item should follow this format:

```markdown
### Your Question Here?

Your answer content goes here. You can use:

- **Bold text** with double asterisks
- Bullet points with dashes
- `Code snippets` with backticks
- Multiple paragraphs

Separate paragraphs with empty lines.
```

### 3. What gets displayed

- **Questions**: Any line starting with `### ` becomes a question
- **Answers**: All content after a question until the next question becomes the answer
- **Formatting**: Basic markdown formatting is supported

## ✅ Supported Markdown Features

- **Bold text**: `**bold**` → **bold**
- _Bullet points_: `- item` → • item
- `Code`: `` `code` `` → `code`
- Line breaks and paragraphs
- Numbered lists (formatting is simplified)

## 🚫 What's Ignored

The script automatically ignores:

- Main headers (`# ` and `## `)
- Table of contents
- Navigation links
- Divider lines (`---`)
- Footer information

## 📊 Example

```markdown
### How do I contact support?

You can reach us at **cleevao@gmail.com**. We typically respond within:

- 24 hours for general questions
- 48 hours for technical issues

Please include your device information when reporting bugs.

### Is the app free?

The app offers both free and premium content:

- **Free**: Basic exercises and activities
- **Premium**: Full access to all content
```

## 🔄 How to Update

1. **Edit** the `FAQ.md` file
2. **Save** your changes
3. **Refresh** your website - the FAQ will update automatically!

## 🛠️ Technical Details

- The FAQ loader fetches `FAQ.md` when the page loads
- Content is parsed and converted to interactive FAQ items
- If the file fails to load, fallback content is shown
- All existing functionality (expand/collapse) works automatically

## 💡 Tips

- Keep questions concise and clear
- Use formatting to make answers easy to read
- Group related questions in the same section of the file
- Test your changes by refreshing the website

Now you can easily manage your FAQ content by simply editing the markdown file! 🎉
