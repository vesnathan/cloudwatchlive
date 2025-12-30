/**
 * AppSync Pipeline Function: Create Cognito User
 * This function invokes the Lambda to create a Cognito user before storing in DynamoDB.
 */

import { util, Context } from "@aws-appsync/utils";

interface CreateCognitoUserInput {
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  userPhone?: string;
  userRole: string;
  organizationId: string;
  sendWelcomeEmail?: boolean;
}

export function request(ctx: Context<{ input: CreateCognitoUserInput }>) {
  const { input } = ctx.args;

  return {
    operation: "Invoke",
    payload: {
      userEmail: input.userEmail,
      userFirstName: input.userFirstName,
      userLastName: input.userLastName,
      userPhone: input.userPhone,
      userRole: input.userRole,
      organizationId: input.organizationId,
      sendWelcomeEmail: input.sendWelcomeEmail || false,
    },
  };
}

export function response(ctx: Context) {
  if (ctx.error) {
    console.error("Error creating Cognito user:", ctx.error);
    // Return error to stop pipeline execution
    util.error(ctx.error.message, "CognitoCreationFailed");
  }

  // Return the Cognito sub and timestamp to be used by next pipeline function
  return ctx.result;
}
