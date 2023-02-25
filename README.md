# theia-cloud-lab

## Getting Started

### Install Dependencies:

Run the following command at project root folder to install all the dependencies:

```bash
npm install
```

### Set Environment Variables:

Next.js uses environment variables to store sensitive information. To get started, create a file named `.env.local` in the root folder of the project. This file is already added to `.gitignore` so it will not be pushed to the repo. In this file, add the following variables:

```
NEXT_PUBLIC_MINIKUBE_IP="192.168.49.2"
```

Change the NEXT_PUBLIC_MINIKUBE_IP address to the IP address of your minikube cluster. You can get this by running `minikube ip` in your terminal.

### Initialize Database:

We will be using QuestDB as our time-series database. This database is responsible for storing all the data that we will be collecting for statistics.

To run a development instance of QuestDB, run the following command in a new terminal:

```bash
docker run -p 9000:9000 \
-p 9009:9009 \
-p 8812:8812 \
-p 9003:9003 \
questdb/questdb:6.6.1
```

Visit [http://localhost:9000](http://localhost:9000) to view the QuestDB console.

To get started with QuestDB, head over to this link: https://questdb.io/docs/guide/
Then, run the development server:

### Start the Development Server:

Run the following command at project root folder to start up the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Deployment

### Using Docker

1. Install Docker on your machine.
2. To build your container, run the following command on terminal from the root folder of the project(where the Dockerfile is): `docker build -t nextjs-docker .`
3. Run your container locally for testing purposes: `docker run -p 3000:3000 nextjs-docker`
4. Additionally, you can view your images created with `docker images`

### Helm Deployment

This section provides instructions for deploying a Helm chart to a Kubernetes cluster.

### Prerequisites

Before deploying a Helm chart, you must have the following:

- A Kubernetes cluster
- Helm installed on your local machine or server

### Steps

1. Update the Helm chart's values.yaml file to configure the application's settings. You can use a text editor or the `helm upgrade` command with the `--set` flag to update values:

```bash
$ helm upgrade --set <key>=<value> <release-name> ./helm/charts
```

2. Install the Helm chart with the following command:

```bash
$ helm install <release-name> ./helm/charts
```

Replace <release-name> with a unique name for the release. You can use helm list to view a list of deployed releases.

3. Verify that the application is running by checking the status of the Kubernetes resources created by the Helm chart:

```bash
$ kubectl get all -n <namespace>
```

Replace <namespace> with the Kubernetes namespace where the resources were deployed.

4. To upgrade the Helm chart with new settings or configurations, update the values in the values.yaml file and use the following command:

```bash
$ helm upgrade <release-name> ./helm/charts
```

5. To uninstall the Helm chart and remove all associated Kubernetes resources, use the following command:

```bash
$ helm uninstall <release-name>
```

## Development Dependencies

### Prettier

This repo has Prettier formatter as development dependency. Please install the appropriate extension for your editor from this link, and set it prioritize the config file in root folder of the project. Lastly, make sure to set auto-format on save. https://prettier.io/docs/en/editors.html#visual-studio-code

### Tailwind CSS

For all our CSS needs, we will be using TailwindCSS. To get started on how to use TailwindCSS, head over to this link for Core Concepts: https://tailwindcss.com/docs/utility-first

### React-Query and React-Query Dev Tools

React-Query is a library that helps us manage our data fetching and caching. To get started, head over to this link: https://tanstack.com/query/v4/docs/overview

### Next.js Telemetry

Run this command in root folder of the project to opt-out of Next.js telemetry: `npx next telemetry disable`
