---
title: Getting Started with Self-Hosting TinaCMS
id: /docs/self-hosted/getting-started
last_edited: '2023-02-01T04:00:00.000Z'
---

## Introduction

This doc will guide you through setting up our pre-configured self-hosted starter repository. This implementation uses our NextJS starter, Vercel KV for its data-storage, and NextAuth for its authentication.

## Deploy The Starter Template

Deploy the [the self-hosted starter](https://github.com/tinacms/tina-self-hosted-demo) using our preconfigured Vercel template:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftinacms%2Ftina-self-hosted-demo&env=GITHUB_PERSONAL_ACCESS_TOKEN,GITHUB_BRANCH,NEXTAUTH_SECRET,KV_REST_API_JAMES_REST_API_URL,KV_REST_API_JAMES_REST_API_TOKEN,NEXTAUTH_CREDENTIALS_KEY&envDescription=See%20the%20self-hosted%20demo%20README%20for%20more%20information&envLink=https%3A%2F%2Fgithub.com%2Ftinacms%2Ftina-self-hosted-demo%2Fblob%2Fmain%2FREADME.md&project-name=tina-self-hosted-demo&repository-name=tina-self-hosted-demo&stores=%5B%7B%22type%22%3A%22kv%22%7D%5D&)

### Setup KV Store

In the initial Vercel project setup. You will be prompted to setup your Vercel KV store in a few clicks. Use the default `KV_` environment variables prefix.

### Setup Environment Variables

You will be prompted to enter values for the following environment variables:

#### `GITHUB_PERSONAL_ACCESS_TOKEN`

A GitHub Personal access token can be generated in your [GitHub developer settings](https://github.com/settings/personal-access-tokens/new). Make sure to assign it `repo` access to your new repository.

#### `GITHUB_OWNER`

Your GitHub account name in which this repository lives.

#### `GITHUB_REPO`

The name of the new repo

#### `GITHUB_BRANCH`

The branch name of your content (e.g: "main")

#### `NEXTAUTH_SECRET`

Assign this a private value used for your JWT encryption

#### `NEXTAUTH_CREDENTIALS_KEY`

The key you want to use for storing user credentials in the KV database (i.e. `tinacms_users`).

### Test Out Your New Deployment

At this point you'll be able to poke around with your new starter. If you add `/admin` to the URL, you'll see that you'll be prompted to login. We'll configure out users in the following steps.

## Clone your repo locally

(Replace the URL with your newly forked repo)

```bash
git clone https://github.com/<YOUR_GITHUB_ACCOUNT>/tina-self-hosted-demo self-hosted-demo
```

## Local Development

Setup the .env file:

```bash
cp .env.example .env
```

Use the same values locally that you setup with the Vercel project earlier.
You will also need to add some environment variables that are applied automatically in Vercel for your Vercel KV Store.

```env
# These can be found in your Vercel KV store settings.
KV_REST_API_URL="https://<REPLACE-THIS-VALUE>.kv.vercel-storage.com"
KV_REST_API_TOKEN="<REPLACE-THIS-VALUE>"
```

Install the project's dependencies:

```bash
yarn install
```

Run the project locally:

```bash
yarn dev
```

You will be able to view your starter on http://localhost:3000. To play around with TinaCMS and edit some content, you can go to http://localhost:3000/admin

## Add Users to Your Project

When you are testing TinaCMS locally, you don't need to be logged in to access the CMS.
When you navigate to /admin on your Vercel deployment, or if you run `yarn build` & `yarn start`, you will be prompted to login.

To setup users for your project, you can run:

```bash
yarn setup:users
```

Once you have created a user with a password, they will be able to login to your production site, make changes, and have those updates persisted to your live site.
