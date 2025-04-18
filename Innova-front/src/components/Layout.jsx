import React from 'react';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
        <Navbar />

        <main>

            <Outlet />

        </main>

        <Footer />
        </>
        
    )
}
export default Layout
