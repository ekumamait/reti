import { useGetUserProfileQuery } from '../services/profiles';

export const useProfiles = (conversations) => {
  const userIds = conversations?.map(conv => conv.userId);
  const { data: profiles, isLoading } = useGetUserProfileQuery(userIds);
  
  return { profiles, isLoading };
};