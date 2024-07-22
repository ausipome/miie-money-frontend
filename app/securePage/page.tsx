// pages/dashboard.tsx

import React from 'react';
import PrivateRoute from '../../components/PrivateRoute';

const Dashboard = () => {
    return (
        <PrivateRoute>
            <div>
                <h1>Dashboard</h1>
                <p>Welcome to the dashboard!</p>
            </div>
        </PrivateRoute>
    );
};

export default Dashboard;
