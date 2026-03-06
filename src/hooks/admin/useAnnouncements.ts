import { useInfiniteQuery } from "@tanstack/react-query";
import { getAnnouncements } from "@/api/announcement";

export const useAnnouncements = (limit = 10) => {
	return useInfiniteQuery({
		queryKey: ["announcements", limit],
		queryFn: ({ pageParam = 1 }) => getAnnouncements(pageParam, limit),
		getNextPageParam: (lastPage) => {
			if (lastPage.page * lastPage.limit < lastPage.total) {
				return lastPage.page + 1;
			}
			return undefined;
		},
		initialPageParam: 1,
		staleTime: 1000 * 60 * 2, // 2 minutes
	});
};
