import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CWLUserInput } from "@shared/types/gqlTypes";
import { createCWLUserAPI } from "@/lib/api/user";

export const useSaveSuperAdminClientMutation = (options?: {
  onSuccess?: () => void;
  getSuccessMessage?: () => string;
  invalidate?: boolean;
  additionalInvalidationKeys?: string[];
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CWLUserInput) => createCWLUserAPI(input),
    onSuccess: () => {
      if (options?.invalidate !== false) {
        queryClient.invalidateQueries({ queryKey: ["getCWLUser"] });
        queryClient.invalidateQueries({ queryKey: ["listOrganizations"] });
        options?.additionalInvalidationKeys?.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      options?.onSuccess?.();
    },
  });
};
