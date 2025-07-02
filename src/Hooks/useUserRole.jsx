import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";


const useUserRole = () => {
  const { user, loading: authLoading } = useAuth(); // get logged in user
  const axiosSecure = useAxiosSecure();

  const {
    data: role = 'user',
    isLoading : roleLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["role", user?.email],
    enabled: !!user?.email && !authLoading, // only run if email is available and auth loading is done
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data.role;
    },
  });

  return { role, roleLoading: roleLoading || authLoading, isFetching, refetch };
};

export default useUserRole;
