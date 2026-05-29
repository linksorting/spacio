import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DesignCanvas from '@/components/design/DesignCanvas';
import { PROJECT_START_MODES } from '@/lib/projectStart';
import { formatProjectSlug, getProjectName } from '@/lib/projectRegistry';
import { getActiveProjectName } from '@/lib/project-session';

export default function SpacioEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const projectName = location.state?.projectName
    || getProjectName(projectId)
    || getActiveProjectName()
    || formatProjectSlug(projectId);

  const startConfig = location.state?.isNewProject
    ? {
        mode: location.state.startMode || PROJECT_START_MODES.BLANK,
        templateId: location.state.templateId,
      }
    : null;

  return (
    <DesignCanvas
      projectId={projectId}
      projectName={projectName}
      startConfig={startConfig}
      onBack={() => navigate('/dashboard')}
    />
  );
}
