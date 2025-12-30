#!/bin/bash

# Deploy AppSync Resolvers for CloudWatch Live
# This script compiles TypeScript resolvers and prepares them for deployment

set -e  # Exit on any error

echo "========================================="
echo "CloudWatch Live - Resolver Deployment"
echo "========================================="

# Set up environment variables for AWS deployment
echo "Loading AWS credentials from .env..."
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Create a .env file with AWS credentials:"
    echo "  AWS_ACCESS_KEY_ID=your_key"
    echo "  AWS_SECRET_ACCESS_KEY=your_secret"
    echo "  AWS_REGION=ap-southeast-2"
    echo "  AWS_ACCOUNT_ID=your_account_id"
    exit 1
fi

source ./set-aws-env.sh

# Navigate to the backend directory
echo ""
echo "Navigating to backend directory..."
cd backend

# Compile TypeScript resolvers to JavaScript
echo ""
echo "Compiling TypeScript resolvers..."
npx tsc

if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    exit 1
fi

echo ""
echo "========================================="
echo "Resolver compilation complete!"
echo "========================================="
echo ""
echo "⚠️  Note: This script only compiles resolvers."
echo "    Full deployment requires CloudFormation deployment."
echo ""
echo "Next steps:"
echo "  1. Add deployment script/command to package.json"
echo "  2. Or manually deploy using AWS CLI/CDK/CloudFormation"
echo "  3. Reference: Check mono-repo deploy package for deployment logic"
