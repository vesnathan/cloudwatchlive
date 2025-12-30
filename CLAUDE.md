# CloudWatch Live - Claude Code Guide

## Project Overview

**CloudWatch Live (CWL)** - AWS monitoring and log visualization tool.
- AWS AppSync/GraphQL backend with Cognito authentication
- Real-time data visualization
- Next.js frontend with TypeScript

**Location**: `/home/liqk1ugzoezh5okwywlr_/dev/cloudwatchlive/`

---

## Shared Documentation

**IMPORTANT**: Read the architecture guidelines that apply to ALL projects:

- **Architecture Guidelines**: `/home/liqk1ugzoezh5okwywlr_/dev/ARCHITECTURE_GUIDELINES.md`
  - Includes all standards, patterns, and project compliance status

**Reference Implementation**: Check The Story Hub for patterns:
- `/home/liqk1ugzoezh5okwywlr_/dev/the-story-hub/`

---

## AppSync Resolver Restrictions

AppSync resolvers run in a restricted JavaScript environment.

### Required Patterns

- **Imports**: `import { util, Context } from "@aws-appsync/utils"`
- **IDs**: `util.autoId()` - NOT `uuid`
- **Timestamps**: `util.time.nowISO8601()` - NOT `new Date().toISOString()`
- **DynamoDB**: `util.dynamodb.toMapValues()` for converting objects
- **Errors**: `return util.error(message, type)` - MUST include `return`

### NOT Allowed

- `new Date()`, `Date.now()` - causes deployment failure
- `String()` constructor - use template literal: `` `${value}` ``
- External npm packages (uuid, etc.)
- Node.js built-in modules
- `while`, `do...while` loops
- **ALL traditional `for` loops** - only `for...of` and `for...in` allowed
- **Inline functions** in array methods (`.map()`, `.filter()`, `.sort()`)
- `continue` statements

### util.error() Must Be Called at Top Level

**NEVER call `util.error()` inside helper/utility functions** - AppSync rejects this pattern.

### Resolver Structure

- **Location**: `backend/resolvers/<domain>/<type>/<Type>.<operationName>.ts`
- Uses pipeline resolvers with TypeScript

---

## Quick Resolver Deployment

```bash
# From project root
./deploy-resolver.sh
```

This script:
1. Sources AWS credentials from `.env`
2. Navigates to `backend/` and runs `npx tsc`
3. Deploys the stack with updated resolvers

---

## Commands

### Development

```bash
yarn dev                   # Start frontend dev server
yarn build                 # Build frontend
yarn lint                  # Run linter
yarn tsc                   # Type check TypeScript
```

### Deployment (USER ONLY - NEVER run automatically)

**Claude MUST NEVER run deploy commands directly.**
- Explain what needs to be deployed and what command to run
- You may prepare code and configurations for deployment

---

## Git Commit Process

**ALWAYS run BEFORE staging and committing:**

1. `yarn lint` - Run linter
2. `yarn tsc` - Type check TypeScript
3. Format with Prettier if available

Only proceed with `git add` and `git commit` after all checks pass.

---

## AWS CLI Requirements

- **AWS CLI** is installed system-wide at `/usr/bin/aws`
- **Credentials**: Set via `.env` file (loaded by `set-aws-env.sh`)

```bash
# Source the AWS environment script
source deploy/utils/set-aws-env.sh

# Now you can run AWS CLI commands
aws cloudformation describe-stacks --stack-name cloudwatchlive-dev --region ap-southeast-2
```

---

## Compliance Status

**FULLY COMPLIANT** - All architecture guidelines are met:
- `@cwl/shared` package with shared types
- API layer in `/lib/api/` with domain modules
- All `any` types fixed with proper Context types

---

## Notes for Future Sessions

- Always read this file at the start of a new session
- Update this file with significant changes and lessons learned
- User prefers concise, technical communication
- Focus on facts and problem-solving over validation
