// app/page.tsx (or any other page/component that needs protection)
'use client';

import PrivateRoute from '../../components/PrivateRoute'; // Adjust the import path based on your project structure

const ProtectedPage: React.FC = () => {
    return (
        <PrivateRoute>
            <h1>This is a protected page</h1>
            <p>Only authenticated users can see this.</p>
        </PrivateRoute>
    );
};

export default ProtectedPage;
