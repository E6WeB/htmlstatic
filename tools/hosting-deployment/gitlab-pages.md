# GitLab Pages

> Free static website hosting directly from GitLab repositories with custom domains and automated SSL.

1. **Official Website**: <a href="https://about.gitlab.com/stages-devops-lifecycle/pages/" target="_blank" rel="noopener noreferrer">about.gitlab.com/stages-devops-lifecycle/pages/</a>
2. **Category**: [Hosting & Deployment](../../README.md#hosting--deployment)
3. **Type**: Static Web Hosting & DevOps Platform
4. **Pricing / License**: Open Source / Freemium

- **Tags**: `gitlab-pages`, `gitlab-ci-cd-hosting`, `free-static-hosting`, `custom-domains`, `devops-static-deploy`, `edge-cdn`, `git-deploy`, `jamstack-hosting`, `serverless-deploy`, `custom-domain`
---

## Overview

GitLab Pages is a built-in static site hosting feature available on GitLab.com and self-hosted GitLab instances. It enables developers to host static HTML, CSS, JavaScript files, and static site generator outputs directly from any GitLab repository at zero cost.

GitLab Pages leverages GitLab CI/CD pipelines to build and deploy your site automatically on every push. It supports custom domains, automatic Let's Encrypt SSL/TLS certificates, redirects, custom 404 pages, and unlimited static sites per account.

---

## Key Highlights & Features

1. **100% Free Static Hosting**: Unlimited static websites and projects on GitLab.com.
2. **Custom Domains & Free SSL**: Seamless custom domain configuration with automatic Let's Encrypt certificate renewal.
3. **CI/CD Driven Deployments**: Complete flexibility to run any build script, linter, or static generator before publishing.
4. **Access Control & Privacy**: Make your static site public or restrict access to GitLab project members.
5. **Redirects & Clean URLs**: Easily configure HTTP redirects and custom routing using a `_redirects` file.

---

## How It Works with Static Websites

To publish a static site with GitLab Pages, add a `.gitlab-ci.yml` file to the root of your repository:

```yaml
pages:
  stage: deploy
  script:
    - mkdir .public
    - cp -r * .public
    - mv .public public
  artifacts:
    paths:
      - public
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
```

Any files placed into the `public/` directory will be published automatically to `https://<username>.gitlab.io/<projectname>`.

---

## When to Use It

1. Open-source and private repositories hosted on GitLab.
2. Projects requiring sophisticated CI/CD pipelines prior to static asset deployment.
3. Teams needing password protection or access-controlled static documentation.

---

## Pricing & Limits

- **Free Plan**: $0/month — includes GitLab Pages with 5 GiB storage, 10 GiB monthly transfer, and 400 CI/CD compute minutes/month
- **Premium / Ultimate**: $29/user/month (Premium) and custom/enterprise Ultimate tiers with higher storage, transfer, and compute quotas
