# Changelog

## [Latest] - 2026-05-20

### Fixed
- **GitHub Pages Deployment**: Updated base path in `vite.config.ts` to `/ReviewQR-Pro/` to fix blank page issue
- **Download PNG Export**: Fixed OKLCH color parsing error by converting colors before export
- **Export PDF**: Fixed OKLCH color parsing error by converting colors before export
- **Export Functions**: Improved error handling and user feedback for both download and PDF export

### Changed
- **Repository URL**: Updated all references to `iamaanahmad/ReviewQR-Pro`
  - Updated README.md with correct repository links
  - Updated index.html Open Graph meta tags
  - Updated demo links
- **jsPDF Version**: Upgraded from v4.2.1 to v2.5.2 (correct latest version)
- **GitHub Actions Workflow**: Added step to copy `.nojekyll` file to dist folder
- **Package Scripts**: Added `build:prod` and updated `preview` script with port

### Added
- **`.nojekyll` file**: Ensures GitHub Pages serves files correctly
- **`public/404.html`**: Handles client-side routing for GitHub Pages
- **`DEPLOYMENT.md`**: Comprehensive deployment guide
- **Color Conversion Function**: Added `convertOklchToRgb()` and `prepareForExport()` to handle Tailwind CSS 4 OKLCH colors
- **Clone Strategy**: Export functions now clone the DOM element to avoid modifying the original

### Technical Details

#### OKLCH Color Issue
The error "Attempting to parse an unsupported color function 'oklch'" was caused by:
- Tailwind CSS 4 uses OKLCH color space by default
- `html2canvas` library doesn't support OKLCH colors
- Solution: Clone the element and force browser to compute colors to RGB before rendering

#### GitHub Pages Blank Page Issue
The blank page was caused by:
- Incorrect base path in Vite config (was `/repository-name/`, needed `/ReviewQR-Pro/`)
- Missing `.nojekyll` file to prevent Jekyll processing
- Solution: Updated base path and added `.nojekyll` file

### How to Deploy

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Test locally**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build:prod
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

5. **Deploy to GitHub Pages**:
   - Push to `main` branch (automatic deployment via GitHub Actions)
   - Or manually trigger from Actions tab

### Verification Checklist

- [x] Download PNG works without OKLCH errors
- [x] Export PDF works without OKLCH errors
- [x] GitHub Pages deployment configured correctly
- [x] Repository URLs updated everywhere
- [x] Base path set to `/ReviewQR-Pro/`
- [x] `.nojekyll` file present
- [x] 404.html for client-side routing
- [x] No TypeScript errors
- [x] Proper error messages for users
