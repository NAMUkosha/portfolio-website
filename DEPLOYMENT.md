# wenjia.space

Repository: https://github.com/NAMUkosha/portfolio-website

The Pages workflow publishes `visual-exploration/` as the website root. No npm build is needed. Repository-root documents and `content-import/` are not included in the deployment artifact.

## First publication

1. Open https://github.com/NAMUkosha/portfolio-website/settings/pages and set **Build and deployment → Source → GitHub Actions**.
2. Commit and push the reviewed workflow and website changes to `main`. In Actions, wait for **Publish portfolio to GitHub Pages** to finish. If the workflow is already on GitHub, it can also be run manually.
3. In the same Pages settings, save **Custom domain → wenjia.space** before adding DNS records. A CNAME file is not required for Actions-based publishing; configure the domain in Pages settings.
4. In Spaceship Advanced DNS for `wenjia.space`, add the following records. TTL can stay at its default. If the domain uses a different DNS provider's nameservers, edit records there instead.

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | NAMUkosha.github.io |

Replace only conflicting website records for `@` and `www`; retain email and verification records. The www target has no scheme or repository path.

5. Wait for GitHub's DNS check and HTTPS certificate, then enable **Enforce HTTPS**. DNS propagation and certificate availability can each take up to 24 hours.
6. Check https://wenjia.space and https://www.wenjia.space, then Home, Archive, About, reading-window open/close, images and private access.

## Updates

Once enabled, changes pushed to `main` under `visual-exploration/` trigger publication automatically. GitHub Pages domain settings and DNS records do not need to be entered again.

Official references:
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
