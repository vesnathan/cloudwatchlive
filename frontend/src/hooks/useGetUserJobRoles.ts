import {
  superAdminJobRoles,
  eventManagementCompanyJobRoles,
} from "@/constants/jobRoles";
import { ClientType } from "@shared/types/gqlTypes";

export const useGetUserJobRoles = (clientType: ClientType[]) => {
  return clientType.includes(ClientType.Admin)
    ? [...superAdminJobRoles, ...eventManagementCompanyJobRoles]
    : eventManagementCompanyJobRoles;
};
