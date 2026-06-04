import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { logout as logoutAction } from "../authSlice";
import { authApi, useLogoutMutation } from "../api/authApi";
import toast from "react-hot-toast";

export function useAuth() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [logoutMutation] = useLogoutMutation();

  const isAuthenticated = !!user;
  const isCandidate = user?.role === "CANDIDATE";
  const isCompanyAdmin = user?.role === "COMPANY_ADMIN";

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      toast.error("Failed to sign out. Please try again.");
    } finally {
      dispatch(authApi.util.resetApiState());
      dispatch(logoutAction());
    }
  };

  return { user, loading, isAuthenticated, isCandidate, isCompanyAdmin, logout };
}
