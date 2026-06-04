import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setCredentials, setLoading, logout } from "../../features/auth/authSlice";
import { useLazyGetMeQuery } from "../../features/auth/api/authApi";

export default function AuthInit({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [getMe] = useLazyGetMeQuery();

  useEffect(() => {
    let active = true;

    const initAuth = async () => {
      dispatch(setLoading(true));
      try {
        const user = await getMe().unwrap();
        if (active) {
          dispatch(setCredentials({ user }));
        }
      } catch {
        if (active) {
          dispatch(logout());
        }
      } finally {
        if (active) {
          dispatch(setLoading(false));
        }
      }
    };

    initAuth();

    return () => {
      active = false;
    };
  }, [dispatch, getMe]);

  return <>{children}</>;
}
