# 🎨 Raga Designers

> A modern, responsive, and performance-optimized homepage built with **HTML, CSS & JavaScript** for the Raga Designers Frontend Developer role assignment.

---

## 🔗 Live Demo

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge&logo=netlify)](https://ragadesigner.netlify.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/kavisudar/rd)

---


## 📋 Table of Contents

- [Sections](#-sections)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Design Decisions](#-design-decisions)
- [Challenges Faced](#-challenges-faced)
- [Future Improvements](#-future-improvements)

---

## 📄 Sections

| # | Section | Description |
|---|---------|-------------|
| 1 | **Header** | Fixed navbar with logo, nav links, dark/light toggle, mobile hamburger drawer |
| 2 | **Hero** | Full-screen image slider, typewriter effect (Typed.js), social sidebar |
| 3 | **About** | Company intro, floating experience badge, stats row |
| 4 | **Services** | 5 service cards — Web Design, Development, E-Commerce, SEO, App Dev |
| 5 | **Mobile Showcase** | Phone mockup with floating UI animation |
| 6 | **Portfolio** | Filterable project grid — dynamically loaded from `data.json` |
| 7 | **Testimonials** | Auto-sliding client cards — dynamically loaded from `data.json` |
| 8 | **Contact** | Async form submission via Formspree |
| 9 | **Footer** | Links, social icons, legal pages, copyright year |

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 (Semantic) | Page structure & accessibility |
| CSS3 (Custom Properties, Grid, Flexbox) | Styling & layout |
| Vanilla JavaScript (ES6+) | Interactivity & dynamic rendering |
| [Typed.js](https://github.com/mattboldt/typed.js/) | Hero typewriter animation |
| [Lucide Icons](https://lucide.dev/) | Icon library |
| [Font Awesome 6](https://fontawesome.com/) | Social media icons |
| [Formspree](https://formspree.io/) | Contact form backend |
| Google Fonts (Inter) | Typography |

---

## ✨ Features

### Responsive Design
- **Mobile** `< 480px` — single column, hidden social sidebar, stacked buttons
- **Tablet** `481–768px` — hamburger drawer, 2-col layouts
- **Desktop** `769px+` — full navbar, multi-column grids

### Performance
- `loading="lazy"` on all below-fold images
- `IntersectionObserver` for scroll-reveal (no scroll event listeners)
- Parallax effect conditionally disabled on touch devices (`hover: none` media query)
- CSS `clamp()` for fluid typography — scales without extra breakpoints

### Dynamic Content Loading
- Portfolio projects and testimonials are loaded from **`data.json`** via `fetch()`
- Zero hardcoded cards in HTML — adding a new project only requires editing the JSON file
- Includes a pulsing loading state while data fetches

### UI/UX
- 🌙 **Dark mode by default** — persisted in `localStorage`
- ☀️ One-click light/dark theme toggle
- Animated hamburger → X transition on mobile
- Portfolio filter buttons (All / Web / App / E-Commerce)
- Auto-advancing testimonial slider with manual prev/next controls
- Scroll-reveal animations on all major sections

---

## 📁 Project Structure

```
raga-designers/
│
├── index.html          # Main HTML — semantic structure, empty dynamic containers
├── style.css           # All styles — variables, layout, responsive breakpoints
├── script.js           # All JS — theme, nav, slider, fetch, render, form
├── data.json           # Content source — portfolio items & testimonials
│
└── assets/             # Local images
    ├── rd.jpg
    ├── office.jpg
    ├── fitness.png
    ├── ecom.webp
    ├── webdesign.jpeg
    └── gadget.png
```

---

## 🚀 Getting Started

### Prerequisites
- A code editor (VS Code recommended)
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension  
  *(required because `fetch('data.json')` needs an HTTP server — won't work with `file://`)*

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/your-username/raga-designers.git

# 2. Open the folder in VS Code
cd raga-designers
code .

# 3. Right-click index.html → "Open with Live Server"
#    OR press  Go Live  in the bottom status bar
```

The site will open at `http://127.0.0.1:5500/index.html`

### Deploy to Netlify (Free)

```bash
# Drag and drop the project folder at:
# https://app.netlify.com/drop
```
Or connect your GitHub repo for automatic deploys on every push.

---

## 🎨 Design Decisions

### Dark Theme as Default
A premium agency like Raga Designers suits a dark, sophisticated palette. Dark-first CSS (`:root` holds dark values, `[data-theme="light"]` overrides) is cleaner than the reverse and avoids a flash of light on load.

### CSS Custom Properties (Variables)
All colors, spacing, transitions, and shadows are stored as CSS variables. This powers the instant theme switch and makes global style changes a one-line edit.

### `clamp()` for Fluid Typography
Instead of defining the same font-size at 5 different breakpoints, `clamp(min, preferred, max)` handles everything in one declaration. Example: `font-size: clamp(2.2rem, 7vw, 4.5rem)` scales the hero heading naturally across all screen sizes.

### JSON-Driven Content
Separating content (`data.json`) from structure (`index.html`) follows the single-responsibility principle. A developer can add a new portfolio item or testimonial by editing one JSON file — no touching HTML required.

### IntersectionObserver over Scroll Events
The scroll event fires hundreds of times per second and forces layout recalculation. `IntersectionObserver` is browser-native, runs off the main thread, and fires only when elements enter the viewport.

---

## ⚡ Challenges Faced

### Nav Overlap at Tablet Width
At ~600px the desktop nav links overlapped the logo. The fix was raising the hamburger breakpoint from `640px` to `768px` so the mobile drawer activates for all tablets — a common real-world oversight when designing only for "mobile" and "desktop."

### Dynamic DOM & Lucide Icons
Lucide icons are initialized once on page load (`lucide.createIcons()`). Icons inside dynamically rendered cards were invisible until I added a second `lucide.createIcons()` call after each render function injected HTML into the DOM.

### IntersectionObserver Scope
The `revealObserver` was originally declared inside `DOMContentLoaded`, making it inaccessible to `renderPortfolio()`. Hoisting it to module scope let both the initial page load and dynamically rendered cards share the same observer.

### Parallax on Touch Devices
The hero parallax (`transform: translateY`) caused visible jank on mobile. Wrapping the scroll listener in `window.matchMedia('(hover: none)')` disables it on touch devices while keeping it on desktop.

---

## 🔮 Future Improvements

With more time, I would:

- **Real API integration** — Replace `data.json` with a CMS (Contentful / Sanity) or a Spring REST API so content editors can update the site without touching code
- **Skeleton loading screens** — Replace the pulsing text loader with skeleton card placeholders matching the actual card shape
- **CSS Scroll-Driven Animations** — Use the new native `@scroll-timeline` API instead of `IntersectionObserver` for scroll-reveal effects
- **Image optimisation pipeline** — Convert all assets to WebP with `srcset` for responsive images, saving 30–50% bandwidth
- **Accessibility audit** — Full keyboard navigation testing, focus traps in the mobile drawer, `prefers-reduced-motion` for all animations
- **Blog / Case Studies section** — Individual project pages with detailed breakdowns
- **Unit tests** — Jest tests for the render functions (`renderPortfolio`, `renderTestimonials`)

---

## 📬 Contact

Built by **Kavisudar**

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-blue?style=flat-square)](https://kavisudar.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/kavisudar)
[![Email](https://img.shields.io/badge/Email-Say%20Hi-red?style=flat-square&logo=gmail)](mailto:kavisudar.be14@email.com)

---

<p align="center">Made with ❤️ for the Raga Designers Frontend Developer Assignment</p>
