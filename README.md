# theia-cloud-lab

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Deployment

### Using Docker

1. Install Docker on your machine.
2. To build your container, run the following command on terminal from the root folder of the project(where the Dockerfile is): `docker build -t nextjs-docker .`
3. Run your container locally for testing purposes: `docker run -p 3000:3000 nextjs-docker`
4. Additionally, you can view your images created with `docker images`

## Prettier

This repo has Prettier formatter as development dependency. Please install the appropriate extension for your editor from this link, and set it prioritize the config file in root folder of the project. Lastly, make sure to set auto-format on save. https://prettier.io/docs/en/editors.html#visual-studio-code

## Tailwind CSS

For all our CSS needs, we will be using TailwindCSS. To get started on how to use TailwindCSS, head over to this link for Core Concepts: https://tailwindcss.com/docs/utility-first
