/**
 * Organization API Layer
 * Handles all organization-related GraphQL operations with proper error handling.
 */

import { GraphQLResult, generateClient } from "aws-amplify/api";
import { Organization } from "@shared/types/gqlTypes";
import { LIST_ORGANIZATIONS_QUERY } from "@/graphql/queries/orgQueries";

const amplifyGraphqlClient = generateClient();

/**
 * Fetch all organizations.
 */
export async function listOrganizationsAPI(): Promise<Organization[]> {
  try {
    const result = (await amplifyGraphqlClient.graphql({
      query: LIST_ORGANIZATIONS_QUERY,
      authMode: "userPool",
    })) as GraphQLResult<{ listOrganizations: Organization[] }>;

    if (result.errors && result.errors.length > 0) {
      throw new Error(
        result.errors[0].message || "Failed to fetch organizations",
      );
    }

    return result.data?.listOrganizations ?? [];
  } catch (error) {
    console.error("listOrganizationsAPI error:", error);
    throw error;
  }
}
