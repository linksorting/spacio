import React from 'react';
import AppLayout from '../components/app/AppLayout';
import ClientManagement from '../components/clients/ClientManagement';

export default function Clients() {
  return (
    <AppLayout>
      <ClientManagement />
    </AppLayout>
  );
}