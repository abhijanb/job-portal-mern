import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { setCredentials } from "../authSlice";
import { useRegisterMutation } from "../api/authApi";
import type { RegisterRequest } from "../../../shared/schemas/auth";
import toast from "react-hot-toast";

export function useRegister() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [register, { isLoading, error }] = useRegisterMutation();

  const handleRegister = async (data: RegisterRequest) => {
    const result = await register(data).unwrap();
    toast.success("Account created successfully!");
    dispatch(setCredentials({ user: result.user }));
    navigate("/dashboard");
  };

  return { register: handleRegister, isLoading, error };
}
