# Vatsal Maisuria — Systems & Full-Stack Portfolio

> High-throughput distributed systems, autonomous AI pipelines, and reactive full-stack web applications.

---

## 🚀 GitHub Pages Deployment Guide

If you encountered a blank screen or 404 error when opening the repository on GitHub Pages (`https://vatsal031177.github.io/vatsalmaisuria-portfolio/`), this occurs because:
1. **GitHub Pages is a static host**: A Vite React app requires a build step (`npm run build`) that bundles TypeScript into optimized HTML/JS/CSS placed in `dist/`. Pushing raw source code to GitHub and pointing GitHub Pages to the root directory will fail because browsers cannot execute raw `.tsx` files directly.
2. **Repository Subpath**: GitHub Pages serves from `/<repo-name>/`. We configured `base: './'` in `vite.config.ts` so all assets use relative paths.
3. **Automated GitHub Actions Workflow**: We added `.github/workflows/deploy.yml` which automatically builds and deploys your site to GitHub Pages whenever you push code!

### Step-by-Step Setup on GitHub (Takes 1 Minute):

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment and relative assets"
   git push origin main
   ```

2. **Enable GitHub Pages via Actions**:
   - Go to your repository on GitHub: `https://github.com/Vatsal031177/vatsalmaisuria-portfolio`
   - Click on **Settings** (top navigation tab)
   - In the left sidebar, click on **Pages**
   - Under **Build and deployment** > **Source**, change the dropdown from **"Deploy from a branch"** to **"GitHub Actions"**
   - Click **Save**

3. **That's it!**
   - Under the **Actions** tab of your repository, you will see the `Deploy Portfolio to GitHub Pages` workflow running.
   - Within 60 seconds, your site will be live at:
     👉 **`https://vatsal031177.github.io/vatsalmaisuria-portfolio/`**

---

## 💻 Local Development

To run the complete full-stack environment with Node.js/Express backend on your computer:

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

To create a static production build:
```bash
npm run build
```

---

## 🔐 Admin Console & Dynamic CV Replacement

The portfolio features a secure Owner Transmission Console:
- **How to Open**: Click the **Lock icon** in the top navigation bar, or press `⌘ + K` (or `Ctrl + K`) to open the Command Palette and select **"Open Admin Console"**.
- **Master Password**: Protected with your private access key (`V@tsal.0311`). No password hints or reminders are displayed in the UI.
- **Real Visitor Inquiries**:
  - Displays genuine contact submissions from people who reach out through the Smart Contact Terminal.
  - Zero fake inquiries.
  - Works on both the full-stack server and statically on GitHub Pages (using secure browser persistence).
  - Search, star high-priority messages, mark read/unread, delete, and one-click export to CSV.
- **Live CV Replacement**:
  - In the **CV & Resume Replacement** tab, upload any new PDF resume.
  - The previous CV is removed and all download links across the website ("Download Verified CV", Navbar badge, etc.) instantly serve the new document.
