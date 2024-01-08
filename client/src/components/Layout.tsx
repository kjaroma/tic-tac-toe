import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <main className="min-h-screen flex justify-center bg-gray-100">
            <Outlet />
        </main>
    )
}

export default Layout