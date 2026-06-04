import { Outlet } from "react-router-dom";
import HomeNav from "../../features/home/components/HomeNav";

export default function PublicLayout() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans">
      <HomeNav />
      <main className="grow">
        <Outlet />
      </main>
    </div>
  );
}