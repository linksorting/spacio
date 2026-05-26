import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { NewProjectProvider } from '@/lib/NewProjectContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Page imports
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Planner from './pages/Planner';
import Packages from './pages/Packages';
import ThreeDView from './pages/ThreeDView';
import Clients from './pages/Clients';
import Inspiration from './pages/Inspiration';
import Gallery from './pages/Gallery';
import Account from './pages/Account';
import Login from './pages/Login';
import SpacioEditor from './pages/SpacioEditor';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dp-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/10 border-t-dp-blue rounded-full animate-spin" />
          <div className="text-white/30 text-sm font-medium">Loading Designer Pro...</div>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required' && location.pathname !== '/login') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/planner" element={<Planner />} />
      <Route path="/editor/:projectId" element={<SpacioEditor />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/3d-view" element={<ThreeDView />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/inspiration" element={<Inspiration />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/account" element={<Account />} />
      <Route path="/pricing" element={<Account />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router future={{ v7_relativeSplatPath: true }}>
          <NewProjectProvider>
            <AuthenticatedApp />
          </NewProjectProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
