# Endlytic: Effortless API Understanding

**Endlytic** is an AI powered platform that transforms Postman collections and API specifications into natural language answers and ready to use code snippets. It helps developers understand, test and integrate APIs instantly.

**Live Site:** [https://endlytic.vercel.app](https://endlytic.vercel.app)

## Demo
https://github.com/user-attachments/assets/c0510294-5c74-429c-a511-8ed97438f29b





## Application Preview

<div align="center">
  <img src="./landing.png" alt="Landing Page" width="100%" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
  <br/><br/>
  <img src="./chat.jpg" alt="Chat Interface" width="100%" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
</div>


## Features

- **Natural Language API Search**: Ask questions in plain English to find endpoints, parameters and request details.
- **AI Teammate**: Turns complex API specs into clear, actionable answers.
- **Instant Code Generation**: Generate snippets in multiple languages (JS, Python, Go, etc.) directly from your collections.
- **Upload & Explore**: Easily import Postman collections to start chatting with your documentation.
- **Turbo-Powered Monorepo**: Built for speed and scalability using Turborepo.


## Architecture

Endlytic follows a modern Service Oriented Architecture (SOA) powered by gRPC for efficient internal communication.

![Architecture](./architecture.jpg)


## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4, Framer Motion
- **State Management**: Zustand
- **UI Components**: Radix UI, Lucide React

### Backend & Services
- **Runtime**: Node.js 18+
- **Communication**: gRPC & Protocol Buffers
- **Gateway**: Express.js
- **Messaging**: RabbitMQ

### AI & Data
- **LLM**: Google Gemini AI
- **Orchestration**: LangChain
- **Vector Database**: Pinecone
- **Database**: PostgreSQL with Prisma ORM


## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v9 (recommended)
- **Docker**: For running PostgreSQL and RabbitMQ
- **PostgreSQL**: Local or Docker container
- **RabbitMQ**: Local or Docker container

### 1. Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/Sagar-1103/endlytic.git
cd endlytic
pnpm install
```

### 2. Infrastructure Setup

Start the required services using Docker Compose:

```sh
docker-compose up -d
```
*This spins up a PostgreSQL database and a RabbitMQ instance.*

### 3. Environment Configuration

Create a `.env` file in each of the following app/service directories and add the necessary variables.

#### **`packages/db/.env`**
| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:secret@localhost:5432/endlytic` |

#### **`apps/web/.env`**
| Variable | Description |
| :--- | :--- |
| `AUTH_SECRET` | Secret for NextAuth |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `AUTH_GITHUB_ID` | GitHub OAuth Client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth Client Secret |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `DISCORD_CLIENT_ID` | Discord OAuth Client ID |
| `DISCORD_CLIENT_SECRET` | Discord OAuth Client Secret |
| `GITLAB_CLIENT_ID` | GitLab OAuth Client ID |
| `GITLAB_CLIENT_SECRET` | GitLab OAuth Client Secret |

#### **`apps/gateway/.env`**
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | API Gateway Port | `3001` |
| `CORS_ORIGIN` | Allowed Frontend Origin | `http://localhost:3000` |

#### **`services/query-server/.env`** & **`services/index-worker/.env`**
| Variable | Description |
| :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini AI API Key |
| `PINECONE_INDEX` | Pinecone Index Name |
| `DATABASE_URL` | PostgreSQL connection string |
| `RABBITMQ_URL` | RabbitMQ connection URL |

#### **`services/media-service/.env`**
| Variable | Description |
| :--- | :--- |
| `AWS_REGION` | AWS Region (S3) |
| `AWS_ACCESS_KEY_ID` | AWS Access Key |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key |
| `AWS_BUCKET_NAME` | S3 Bucket Name |
| `RABBITMQ_URL` | RabbitMQ URL |
| `DATABASE_URL` | PostgreSQL connection string |

### 4. Database Setup

Push the Prisma schema to your database:

```sh
cd packages/db
npx prisma db push
npx prisma generate
cd ../..
```

### 5. Running the Project

Start the development server for all apps and services simultaneously:

```sh
pnpm dev
```

- **Frontend**: `http://localhost:3000`
- **Gateway**: `http://localhost:3001`


## Project Structure

```text
.
├── apps/
│   ├── web/          # Next.js Frontend
│   └── gateway/      # API Gateway (Express + gRPC)
├── services/
│   ├── query-server/ # AI Query Engine (LangChain + Gemini)
│   ├── index-worker/ # Vector Indexing Background Worker
│   └── media-service/# Media Handling Service
└── packages/
    ├── db/           # Prisma Client & Schema
    ├── proto/        # gRPC Protobuf Definitions
    └── ui/           # Shared React Components
```
