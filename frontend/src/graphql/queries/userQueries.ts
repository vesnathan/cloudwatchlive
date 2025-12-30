/**
 * User GraphQL Queries and Mutations
 * Contains ONLY query/mutation strings and query keys.
 * API functions are in /lib/api/user.ts
 */

// Query Keys for React Query
export const userQueryKeys = {
  getCWLUser: "getCWLUser",
};

// Query key factory
export const getCWLUserQueryKey = (userId: string) => [
  userQueryKeys.getCWLUser,
  userId,
];

// GraphQL Query String
export const GET_CWL_USER_QUERY = /* GraphQL */ `
  query GetCWLUser($userId: String!) {
    getCWLUser(userId: $userId) {
      userId
      userAddedById
      privacyPolicy
      termsAndConditions
      userFirstName
      userLastName
      userEmail
      userPhone
      userTitle
      userCreated
      organizationId
      userRole
      clientType
    }
  }
`;

// GraphQL Mutation String
export const CREATE_CWL_USER_MUTATION = /* GraphQL */ `
  mutation CreateCWLUser($input: CWLUserInput!) {
    createCWLUser(input: $input) {
      userId
      userAddedById
      privacyPolicy
      termsAndConditions
      userFirstName
      userLastName
      userEmail
      userPhone
      userTitle
      userCreated
      organizationId
      userRole
    }
  }
`;
