/**
 * User API Layer
 * Handles all user-related GraphQL operations with proper error handling.
 */

import { GraphQLResult, generateClient } from "aws-amplify/api";
import {
  GetCWLUserQuery,
  GetCWLUserQueryVariables,
  CWLUserInput,
  CreateCWLUserMutation,
  CreateCWLUserMutationVariables,
  CWLUser,
} from "@shared/types/gqlTypes";
import {
  GET_CWL_USER_QUERY,
  CREATE_CWL_USER_MUTATION,
} from "@/graphql/queries/userQueries";

const amplifyGraphqlClient = generateClient();

/**
 * Fetch a CWL user by ID.
 */
export async function getCWLUserAPI(
  variables: GetCWLUserQueryVariables,
): Promise<CWLUser | null> {
  try {
    const result = (await amplifyGraphqlClient.graphql({
      query: GET_CWL_USER_QUERY,
      variables,
      authMode: "userPool",
    })) as GraphQLResult<GetCWLUserQuery>;

    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0].message || "Failed to fetch user");
    }

    return result.data?.getCWLUser ?? null;
  } catch (error) {
    console.error("getCWLUserAPI error:", error);
    throw error;
  }
}

/**
 * Create a new CWL user.
 */
export async function createCWLUserAPI(
  input: CWLUserInput,
): Promise<CreateCWLUserMutation> {
  try {
    const result = (await amplifyGraphqlClient.graphql<CreateCWLUserMutation>({
      query: CREATE_CWL_USER_MUTATION,
      variables: { input } as CreateCWLUserMutationVariables,
      authMode: "userPool",
    })) as GraphQLResult<CreateCWLUserMutation>;

    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0].message || "Failed to create user");
    }

    if (!result.data) {
      throw new Error("No data returned from createCWLUser mutation");
    }

    return result.data;
  } catch (error) {
    console.error("createCWLUserAPI error:", error);
    throw error;
  }
}
