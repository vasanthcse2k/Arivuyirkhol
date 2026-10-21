# Publish Arivuyirkhol on Netlify

The project now hosts React and the Express API together: React is served from `client/dist`, `/api/*` routes are rewritten to the Express Netlify Function. MongoDB remains a separate database service. Local development commands still work.

## Required account configuration

1. Sign in at https://app.netlify.com/ using your own account.
2. Use MongoDB Atlas or another authenticated MongoDB server reachable from Netlify. The local URI `mongodb://127.0.0.1:27017/arivuyirkhol` cannot work in the cloud. Existing local enquiries are not migrated by deployment.
3. In the Netlify project's environment variables, securely set `MONGODB_URI` to your remote database connection string, including the `arivuyirkhol` database name. Do not put it in `VITE_API_URL`, source code, or Git. Set the variable for the Functions/runtime scope and the deployment contexts you will use.
4. Leave `VITE_API_URL` unset/blank so the frontend uses its own `/api` endpoint. Optionally set `CLIENT_ORIGIN` to your exact published site URL for cross-origin policy; same-origin requests do not require a separate host.
5. Configure your remote database's network access to permit Netlify Functions. Use the provider's supported restricted network/static-egress arrangement when available. Review any broader network access choice yourself before changing it.

## Console deployment

Open PowerShell:

```powershell
Set-Location -LiteralPath 'C:\Users\Vasanth\Documents\Codex\2026-10-10\hi\outputs\arivuyirkhol'
npm.cmd install
npm.cmd run setup
npm.cmd test
npm.cmd run build
npx.cmd netlify-cli login
npx.cmd netlify-cli deploy --build
```

Follow the CLI to create a new project, or deliberately select the existing project you wish to update. Add the database environment variable through Netlify's project settings, not a console command containing your password. After the preview works, publish:

```powershell
npx.cmd netlify-cli deploy --build --prod
```

`netlify.toml` supplies build, publish and functions paths. Uploading only `client/dist` using drag-and-drop publishes the frontend but does not include this backend; use the CLI or connect the complete source repository.

## Verify publication

- Open the URL returned by Netlify and confirm the logo, About Us and eight services.
- Open `https://YOUR-SITE.netlify.app/api/health`: expect HTTP 200, status `ok`, database `connected`.
- Submit a synthetic enquiry, verify a success reference, then inspect `arivuyirkhol.enquiries` in Compass connected to the REMOTE database. Local Compass connections still show only your local records.
- If the health endpoint returns 503, check the runtime variable, database user permissions and network access. The form will not report success unless persistence succeeds.

Netlify Functions reuse a cached database connection when possible. The current request rate limit is per warm function instance and is not a global distributed spam limit. No public enquiry read endpoint exists.

Official Express deployment guide: https://docs.netlify.com/build/frameworks/framework-setup-guides/express/
Official CLI guide: https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/

Deployment status: prepared locally; account sign-in and remote database configuration are required before a working publication can be confirmed.
