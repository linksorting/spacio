import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BathroomPlanner from '../components/planner/BathroomPlanner';
import { getActiveProjectName, setActiveProjectName } from '@/lib/project-session';

export default function Planner() {
  const location = useLocation();
  const projectName = location.state?.projectName || getActiveProjectName() || 'Design';

  useEffect(() => {
    if (location.state?.projectName) {
      setActiveProjectName(location.state.projectName);
    }
  }, [location.state]);

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <BathroomPlanner projectName={projectName} />
    </div>
  );
}
