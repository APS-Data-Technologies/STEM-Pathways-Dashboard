# Deployment status - B-15

**Live dashboard:** https://stem-pathways-dashboard.vercel.app/

Vercel production deployment is READY. Deployment ID: dpl_DkDpAGyXkmtRCYE4QcsrMrZdMQ72. Project: stem-pathways-dashboard. Verified public HTML and metadata JSON return HTTP 200 without authentication. Browser verification showed 187,386 default awards and 3,617 for computer science / bachelor's / 2023; reset restored the default total.

This deployment was uploaded from source files through the authorized Vercel account. **It is not connected to GitHub auto-deploy.** The GitHub app still rejects branch creation (403: Resource not accessible by integration), the feature branch was published through the signed-in browser. Main protection and APS hosting ownership remain to confirm.

## Remaining acceptance for B-15
1. Review the browser-published feature branch and integration PR; the app’s API permission issue does not prevent browser contributions.
2. Connect GitHub to this Vercel project through the owner's normal account flow. Confirm APS organization installation approval and ownership/transfer requirements.
3. Use Vite / Node 24 / npm ci / npm run build / dist; no application secrets are needed.
4. Obtain the required teammate review before merging to main.
5. Verify an approved merge triggers deployment and each PR receives a preview link. Record actual evidence here.

B-15 is partial: public hosting succeeds, Git integration is unverified. 
