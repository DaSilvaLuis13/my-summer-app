//src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { TopBar } from "../components/layout/TopBar";

export const MainLayout = () => {
    return (
        <div className='flex flex-col min-h-screen bg-(--color-background)'>

            <TopBar username="Admin" onLogout={() => console.log('logout')} />

            <main className='flex-1 flex flex-col overflow-y-auto'>
                <Outlet />
            </main>

        </div>
    )
}