import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="grow flex items-center justify-center min-h-screen">
      <section className="w-full md:w-2/5 bg-surface-container-lowest flex flex-col justify-center items-center p-4 md:p-8">
        <div className="w-full max-w-md flex flex-col justt items-center">
          <div className="text-center mb-8">
            <span className="text-secondary text-2xl font-semibold">Hire</span>
          </div>
          <header className="mb-8 text-center">
            <h2 className="text-primary text-2xl font-bold mb-1">Sign In</h2>
            <p className="text-on-surface-variant text-base">
              Welcome back! Please enter your details.
            </p>
          </header>

          <LoginForm />

          <footer className="mt-8 text-center">
            <p className="text-on-surface-variant text-base">
              Don't have an account?
              <Link
                className="text-secondary font-bold hover:underline ml-1"
                to="/register"
              >
                Sign Up
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
