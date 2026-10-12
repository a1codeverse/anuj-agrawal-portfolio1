# Anuj Agrawal — Portfolio Website

A responsive, warm cream / walnut brown / caramel gold portfolio built with plain HTML, CSS and JavaScript. No package installation or build process is required.

## Start here

Open `index.html` in a current browser. For local development, VS Code with Live Server is convenient. Keep the full folder structure together.

## Main portfolio

- `index.html` — hero, about, skills, education, uploaded certificates, four Indian-school demo links, three other project concepts, services, quote enquiry, work process, FAQ, contact and the scripted English/Hinglish assistant preview.
- `privacy.html` — starter privacy notice for the static demo.

## Four standalone Indian-school demos

These are separate front-end sample school websites using fictional/sample school information; their forms only show a demo message and do not send or store personal data.

- `school-modern.html` — modern CBSE-style school.
- `school-hindi.html` — Hindi-first / state-board style school.
- `school-preschool.html` — preschool / play school.
- `school-premium.html` — premium Indian private-school style.

Each school demo links to its case-study page. Each demo is clearly labelled as a concept, not an official school website.

## Project case studies / concepts

- `case-school-modern.html` — CBSE-style school concept case study.
- `case-school-hindi.html` — Hindi-first school concept case study.
- `case-school-preschool.html` — preschool concept case study.
- `case-school-premium.html` — premium school concept case study.
- `project-business.html` — local business concept.
- `project-ecommerce.html` — e-commerce storefront demo.
- `project-student-portal.html` — student management dashboard concept.

## Interactions included

- Responsive main navigation and mobile menus for school demos.
- Scroll-in reveal effects with reduced-motion support, a thin scroll-progress line, gentle hero/orb movement, animated school illustrations, and refined hover transitions on projects, services, skills and certificate cards.
- Filter buttons for the three additional portfolio projects.
- Project enquiry form validation; it prepares a WhatsApp message for review and sending. It does not submit to a server.
- Email and LinkedIn links; WhatsApp chat links do not render the number as visible page text.
- Certificate preview images linked to the original PDFs.
- Scripted English/Hinglish portfolio assistant that matches common questions from a local knowledge base.
- School demo enquiry forms validate sample inputs and explain that no data was sent or stored.

## Important implementation boundaries

- The four school mini-sites are front-end demos with fictional school names and sample content. Replace it with verified, client-approved content before presenting any school-specific page as real.
- The assistant is a **scripted preview, not a live LLM / generative-AI integration**. A real AI service needs a secure backend endpoint and an API key stored on the server, never in browser JavaScript.
- The quote form only builds a prefilled WhatsApp message. The visitor reviews and sends it; the site does not store enquiries.
- Student login, databases, live results, payments, real shopping-cart/order processing, booking, content management and notice administration are not implemented by the concepts. Those need appropriate backend/security work and testing.
- Fonts are loaded from Google Fonts when online; fallback fonts are included.

## Before publishing

1. Decide whether the original certificate PDFs should be public. They contain certificate identifiers and QR codes.
2. Verify the WhatsApp, email and LinkedIn links and test WhatsApp on a phone and desktop.
3. Replace all fictional school names, sample notices, admission text and sample imagery/content for any actual client.
4. For secure, server-backed enquiries or a live AI assistant, add an appropriate backend, validation, anti-spam controls, privacy notice and secure secret management.
5. Test all pages at mobile and desktop sizes, inspect accessibility/keyboard navigation and review performance before deployment.
6. Add the final domain, hosting configuration, social preview image and domain-specific SEO settings.
7. Update `privacy.html` if analytics, cookies, server storage or third-party AI services are added.

## Files

- `style.css` — global portfolio styling.
- `project-page.css` — case-study layouts.
- `school-demo.css` — four school demo visual styles.
- `script.js` — portfolio navigation, reveal effects, project filters, quote form and scripted assistant.
- `school-demo.js` — school demo navigation and non-submitting sample enquiry forms.
- `assets/anuj-agrawal.jpg` — uploaded portrait, used only inside the hero laptop screen on the main portfolio.
- `assets/certificates/` — certificate preview images and original PDFs.
