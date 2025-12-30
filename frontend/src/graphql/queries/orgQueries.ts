/**
 * Organization GraphQL Queries
 * Contains ONLY query strings and query keys.
 * API functions are in /lib/api/organization.ts
 */

// Query Keys for React Query
export const orgQueryKeys = {
  listOrganizations: "listOrganizations",
};

// Query key factory
export const listOrganizationsQueryKey = () => [orgQueryKeys.listOrganizations];

// GraphQL Query String
export const LIST_ORGANIZATIONS_QUERY = /* GraphQL */ `
  query ListOrganizations {
    listOrganizations {
      organizationId
      organizationName
      organizationType
      organizationCreated
      mainAdminUserId
      adminUserIds
      staffUserIds
    }
  }
`;
