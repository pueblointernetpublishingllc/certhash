# certhash.com

Product site for CertHash, a learning management system whose completion
certificates are fingerprinted (SHA-256) and stamped on the Monad blockchain
through RecordStamp, so they can be verified without the LMS.

Deployed with Cloudflare Pages straight from this repo. No build step.

- `index.html` – the page.
- `styles.css` – all styling.
- `app.js` – computes the sample certificate's hash and runs the in-browser
  hashing demo with the Web Crypto API. Nothing is uploaded anywhere.
- `_headers` – security headers for Pages; the `*.pages.dev` hostname is noindexed.
- `favicon.svg`, `og-image.png` – icon and link preview.

Cloudflare Pages settings: framework preset **None**, build command empty,
output directory `/`.


## Holding page (2026-10-20)

The site was replaced by a neutral holding page while Pueblo Internet Publishing LLC is not yet licensed to conduct business. The full site is preserved on branch `archive/pre-holding-20261020` and tag `pre-holding-20261020`; restore with `git checkout archive/pre-holding-20261020 -- .` (keeping this note) and push.
