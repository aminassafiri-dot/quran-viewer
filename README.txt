UPDATE PACK - fixes "this app cannot be installed"

Upload these 7 files into the TOP LEVEL of your GitHub repository (Add file > Upload files),
replacing the existing manifest.webmanifest and sw.js. Do NOT upload a folder.
Leave index.html, the PDF and the pdf*.js files as they are.

   manifest.webmanifest   sw.js   check.html
   icon-192.png   icon-512.png   icon-maskable-512.png

Then on your phone:
1. Open  https://<your-username>.github.io/<repo>/check.html  in Chrome (normal tab, not Incognito).
2. Fix anything marked with a red cross. If it says Chrome can install, tap "Install app now".
3. If you had the old version installed or tried before: Chrome menu > Settings > Site settings > All sites >
   your github.io site > Clear & reset, then reload.
