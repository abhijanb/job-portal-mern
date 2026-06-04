import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { authRoutes } from "./shared/router/auth.route";
import { appRoutes } from "./shared/router/app.route";
import AuthInit from "./shared/components/AuthInit";

const router = createBrowserRouter([
  ...authRoutes,
  ...appRoutes,
]);

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "text-sm font-medium",
          duration: 4000,
        }}
      />
      <AuthInit>
        <RouterProvider router={router} />
      </AuthInit>
    </>
  );
}

export default App;
