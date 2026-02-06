import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllSubAdmins, updateSubAdmin } from "@/api/subadmin";
import type { UpdateSubAdminPayload } from "@/types/subadmin";

export const useSubAdmins = () => {
	return useQuery({
		queryKey: ["subadmins"],
		queryFn: getAllSubAdmins,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

export const useUpdateSubAdmin = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: UpdateSubAdminPayload) => updateSubAdmin(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["subadmins"] });
		},
	});
};
