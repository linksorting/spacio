import React from 'react';
import AppLayout from '../components/app/AppLayout';
import DashboardHome from '../components/dashboard/DashboardHome';

export default function Dashboard() {
  return (
    <AppLayout>
      <DashboardHome />
    </AppLayout>
  );
}