# Personal-website

Source for [jeriljohnson.com](https://jeriljohnson.com), a single-page portfolio covering my experience, skills, education and a contact form.

Built with plain HTML, CSS and a little JavaScript. There's no framework and no build step, so GitHub Pages serves the `main` branch as-is.

## Structure

- `index.html`: all page content
- `css/styles.css`: layout and theme colors (dark by default, light via the sun/moon toggle in the header)
- `js/main.js`: theme toggle, mobile menu and the active-section highlight in the menu
- `images/`: profile photo, browser-tab and home-screen icons, link-preview image, company logos

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Contact form

Messages are sent through [FormSubmit](https://formsubmit.co) and arrive in my inbox.
