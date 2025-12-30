# CloudWatch Live

Live event agenda platform where users can watch live-streamed event plenaries, keynotes, and breakout sessions via YouTube. Users can browse the event schedule and click on any item to view the live stream.

## Features

- **Live Event Schedule**: Browse upcoming and live events
- **YouTube Integration**: Embedded YouTube live streams
- **Event Categories**: Plenaries, keynotes, and breakout sessions
- **User Authentication**: Cognito-based authentication
- **Responsive UI**: Modern interface built with Next.js
- **Real-time Updates**: See which events are currently live

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- AWS Amplify (GraphQL client)

**Backend:**
- AWS AppSync (GraphQL API)
- DynamoDB (Event data & user preferences)
- AWS Cognito (Authentication)
- AWS Lambda (Event management & YouTube integration)
- CloudFront (CDN)

## Prerequisites

- Node.js 18+
- Yarn (package manager)
- AWS Account with CloudWatch access
- AWS CLI (installed locally via `./install-aws-cli-local.sh`)

## Setup

### 1. Install Dependencies

```bash
yarn install
```

### 2. Configure AWS Credentials

Copy `.env.example` to `.env` and fill in your AWS credentials:

```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-southeast-2
AWS_ACCOUNT_ID=your_account_id
```

### 3. Install AWS CLI Locally

```bash
./install-aws-cli-local.sh
```

### 4. Load AWS Credentials

```bash
source ./set-aws-env.sh
```

## Development

### Run Frontend Dev Server

```bash
yarn dev
```

### Type Checking

```bash
yarn tsc
```

### Linting

```bash
yarn lint
```

## Deployment

### Deploy to Development

```bash
yarn deploy:dev
```

### Deploy to Production

```bash
yarn deploy:prod
```

### Update Deployment

```bash
yarn deploy:dev:update
```

## Project Structure

```
cloudwatchlive/
├── frontend/           # Next.js application
│   ├── src/
│   │   ├── app/       # App router pages
│   │   ├── components/
│   │   ├── lib/       # API clients & utilities
│   │   └── types/     # TypeScript types
│   └── package.json
├── backend/           # AppSync & Lambda code
│   ├── schema/        # GraphQL schema files
│   ├── resolvers/     # AppSync resolver functions
│   └── lambda/        # Lambda functions
├── deploy/            # Deployment infrastructure
│   ├── resources/     # CloudFormation templates
│   └── utils/         # Deployment utilities
└── documents/         # Project documentation
```

## AppSync Resolvers

Resolvers are TypeScript files that manage events, schedules, and YouTube stream integration:

```bash
./deploy-resolver.sh
```

### Key GraphQL Operations

- **Queries**: Get event schedule, filter by category, search events
- **Mutations**: Create/update events, manage live stream URLs
- **Subscriptions**: Real-time updates when events go live

## Related Projects

See `CLAUDE.md` for cross-project references:

- **The Story Hub**: Collaborative storytelling platform (reference for GraphQL patterns)
- **Card Counting Trainer**: Blackjack training game
- **Lawn Order**: Business management system
- **App Builder Studio**: Visual app builder

## Documentation

See `documents/` folder for setup guides:

- `DOMAIN_SETUP.md` - Custom domain configuration
- `EMAIL_SETUP.md` - AWS SES email setup
- `ARCHITECTURE_FIXES_NEEDED.md` - Known issues

## Bug Reports

Bug reports and issue submissions are welcome! Please open an issue on GitHub if you encounter any problems.

## License

Copyright © 2024. All rights reserved.
