import { useState } from "react";
import { Link } from "react-router-dom";
import RoleToggle from "../components/RoleToggle";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  const [role, setRole] = useState<"candidate" | "employer">("candidate");

  return (
    <main className="bg-surface font-sans text-base text-on-surface min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-secondary text-2xl font-semibold">Hire</span>
          </div>

          <header className="mb-8 text-center">
            <h2 className="text-primary text-3xl font-bold mb-1">Create your account</h2>
            <p className="text-on-surface-variant text-base">Start your professional transformation today.</p>
          </header>

          <RoleToggle value={role} onChange={setRole} />

          <RegisterForm role={role} />

          <footer className="mt-8 text-center">
            <p className="text-on-surface-variant text-base">
              Already have an account?
              <Link className="text-secondary font-bold hover:underline ml-1" to="/login">Sign In</Link>
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
