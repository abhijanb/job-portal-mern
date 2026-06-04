import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { setCredentials } from "../authSlice";
import { useLoginMutation } from "../api/authApi";
import toast from "react-hot-toast";

export function useLogin() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async (email: string, password: string) => {
    const result = await login({ email, password }).unwrap();
    toast.success("Welcome back!");
    dispatch(setCredentials({ user: result.user }));
    navigate("/dashboard");
  };

  return { login: handleLogin, isLoading, error };
}
