# CloudWatch Live - Development Guide

## 🔗 Cross-Project Reference

**IMPORTANT**: Before planning or implementing any feature, ALWAYS check other projects for similar implementations to ensure consistency across the codebase.

### Related Projects

All projects share common patterns for auth, routing, components, and AWS infrastructure:

- **CloudWatch Live** (this project): `/home/liqk1ugzoezh5okwywlr_/dev/cloudwatchlive/`
  - AWS monitoring and log visualization tool
  - AWS AppSync/GraphQL backend with Cognito auth
  - Reference this for: AWS monitoring patterns, real-time data visualization

- **The Story Hub**: `/home/liqk1ugzoezh5okwywlr_/dev/the-story-hub/`
  - Full-stack AWS AppSync/GraphQL application with Cognito auth
  - Complex AWS infrastructure (CloudFormation, AppSync, DynamoDB, CloudFront, Cognito)
  - Reference this for: GraphQL patterns, AWS deployment, authentication flows

- **Card Counting Trainer**: `/home/liqk1ugzoezh5okwywlr_/dev/card-counting-trainer/`
  - Next.js frontend-focused application with complex game state management
  - Reference this for: React hooks patterns, complex UI state, animations

- **Lawn Order**: `/home/liqk1ugzoezh5okwywlr_/dev/lawn-order/`
  - Simpler Next.js application
  - Reference this for: Basic Next.js patterns, simple architectures

- **App Builder Studio**: `/home/liqk1ugzoezh5okwywlr_/dev/app-builder-studio/`
  - Landing page / marketing site
  - Reference this for: Static Next.js patterns, UI/UX components

### When to Check Other Projects

1. **Authentication & Authorization**
   - Check: The Story Hub, CloudWatch Live (Cognito patterns, auth hooks, protected routes)
   - Example: `frontend/src/hooks/useLoginController.tsx`, `frontend/src/lib/auth/`

2. **Form Handling & Validation**
   - Check: All projects for input validation, form submission patterns
   - Example: Registration forms, login forms, settings forms

3. **Next.js Routing & Layouts**
   - Check: All Next.js projects for consistent routing patterns
   - Example: `frontend/src/app/layout.tsx`, protected route wrappers

4. **AWS Infrastructure**
   - Check: The Story Hub (primary reference), CloudWatch Live (alternative patterns)
   - Example: CloudFormation templates, AppSync resolvers, Lambda functions

5. **Component Patterns**
   - Check: All projects for reusable UI components
   - Example: Buttons, modals, forms, navigation

6. **State Management**
   - Check: Card Counting Trainer (complex state), The Story Hub (GraphQL state)
   - Example: React hooks, context providers, custom hooks

7. **Styling & UI**
   - Check: All projects for Tailwind patterns, NextUI usage
   - Example: Consistent class naming, theme configuration

### Best Practices

- **Before creating new components**: Search other projects for similar functionality
- **Before implementing auth flows**: Check existing auth patterns in TSH/CWL
- **Before writing AWS infrastructure**: Reference existing CloudFormation templates
- **Before adding npm packages**: Check if other projects already use similar packages
- **Document deviations**: If you must deviate from patterns, document why in this file

---

# CloudWatch Live - Project Notes

## AppSync Resolver Build & Deployment Process

### Resolver Structure

AppSync resolvers in CloudWatch Live use the same pattern as The Story Hub - TypeScript files that export `request()` and `response()` functions:

```typescript
import { util, Context } from "@aws-appsync/utils";
import { MyType } from "gqlTypes";

export function request(ctx) {
  // Build DynamoDB operation, Lambda invocation, etc.
  return { operation: "GetItem", key: {...} };
}

export function response(ctx) {
  // Process result and return to client
  return ctx.result;
}
```

**Location**: `backend/resolvers/<domain>/<type>/<Type>.<operationName>.ts`

### Build Process

1. **TypeScript Compilation**
   - Resolvers are written in TypeScript with `@aws-appsync/utils` imports
   - TSConfig: `backend/tsconfig.json` includes the `resolvers` directory
   - Compilation: `npx tsc` in backend directory compiles resolvers to JavaScript

2. **Deployment to AppSync**
   - Compiled JavaScript is uploaded to AppSync
   - Each resolver must be registered in CloudFormation AppSync configuration
   - Without CloudFormation registration, resolver code exists but isn't used

### Quick Resolver Deployment

Use the `deploy-resolver.sh` script to quickly deploy updated resolvers:

```bash
# From project root
./deploy-resolver.sh
```

This script:
1. Sources AWS credentials from `.env` (via `set-aws-env.sh`)
2. Navigates to `backend/` and runs `npx tsc` to compile TypeScript
3. Deploys the stack with updated resolvers

**Note**: For full deployment including infrastructure changes, use the standard deployment commands.

### AWS CLI Requirements

- **AWS CLI** is installed system-wide at `/usr/bin/aws`
- **Credentials**: Set via `.env` file in project root (loaded by `set-aws-env.sh`)
- **Template file**: `set-aws-creds.sh` is available for manual credential setting if needed

## Project Conventions

### Package Manager

- **ALWAYS use `yarn` exclusively** - never use npm
- Examples: `yarn install`, `yarn add`, `yarn workspace <name> <command>`

### Development Commands

- `yarn dev` - Start CloudWatch Live frontend dev server (from root)
- `yarn build` - Build CloudWatch Live frontend (from root)
- `yarn lint` - Run linter
- `yarn tsc` - Type check TypeScript without emitting files

### Git Commit Process

- **ALWAYS run these commands BEFORE staging and committing**:
  1. `yarn lint` - Run linter to check for code style issues
  2. `yarn tsc` - Type check TypeScript without emitting files
  3. Format with Prettier if available
- Only proceed with `git add` and `git commit` after all checks pass
- This ensures code quality and catches errors before deployment
- Never skip these steps even for "simple" changes

---

## Notes for Future Sessions

- Always read this file at the start of a new session for context
- Update this file with significant changes, decisions, and pending work
- User prefers concise, technical communication
- Focus on facts and problem-solving over validation
