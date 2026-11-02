QURAN OFFLINE VIEWER - INSTALLABLE (PWA)

1. Upload the CONTENTS of this folder (not the folder itself) to any free HTTPS static host:
   - Netlify Drop: go to app.netlify.com/drop and drag the folder in. Gives you an https URL in seconds.
   - or GitHub Pages / Cloudflare Pages.
   (SharePoint/OneDrive cannot host this - they will not serve the page as a website.)

2. On your Android phone, open the URL in Chrome and let it finish loading (about 6 MB, first time only).

3. Chrome menu (three dots) > "Install app" (or "Add to Home screen"). It then opens full screen like an app and works offline.

Updating: replace the files on the host and change VERSION in sw.js (e.g. 'v2') so phones refresh their copy.
