import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { GridViewIcon, Menu01Icon } from '@hugeicons/core-free-icons';

import PageTitleArea from '../../components/shared/PageTitleArea';
import CatalogCard from '../../components/shared/CatalogCard';
import Button from '../../components/shared/Button';
import Toggle from '../../components/shared/Toggle';
import Tabs from '../../components/shared/Tabs';
import ToggleCatalogType from '../../components/shared/ToggleCatalogType';
import { useUserContext } from '../../providers/user';
import { getProjects, createProject, type Project } from '../../services/canvasAPI';
import { Spin, message } from 'antd';
import CreateProjectModal from '../../components/shared/modals/CreateProjectModal';

export default function CanvasCatalogPage() {
  const navigate = useNavigate();
  const { catalogListType } = useUserContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects(1, 100);
      setProjects(response.projects || []);
    } catch (error: any) {
      console.error('Error loading projects:', error);
      message.error(error?.message || 'Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (data: {
    title: string;
    metadata: {
      subject?: string;
      course?: string;
      goal?: string;
      deadline?: string;
      description?: string;
    };
  }) => {
    try {
      const newProject = await createProject(data);
      message.success('Project created successfully!');
      await loadProjects(); // Refresh list
      navigate(`/canvas/${newProject.id}`);
    } catch (error: any) {
      console.error('Error creating project:', error);
      message.error(error?.message || 'Failed to create project. Please try again.');
      throw error; // Re-throw so modal can handle it
    }
  };

  const getAssetTypeColor = (assetType?: string) => {
    switch (assetType) {
      case 'TEXT_DOC':
        return 'blue';
      case 'FLASHCARDS':
        return 'green';
      case 'WALKTHROUGH':
        return 'orange';
      case 'QUIZ':
        return 'red';
      default:
        return 'blue';
    }
  };

  const getProjectSubtitle = (project: Project) => {
    if (project.assets && project.assets.length > 0) {
      const assetTypes = project.assets.map(a => a.asset_type);
      const uniqueTypes = [...new Set(assetTypes)];
      return `${project.assets.length} ${project.assets.length === 1 ? 'asset' : 'assets'}`;
    }
    return 'No assets yet';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <PageTitleArea title={'Canvas - AI Learning Workspace'} className={'shrink-0'}>
        <div className={'flex items-center'}>
          <ToggleCatalogType className={'ml-16'} />
          <Button
            className={'ml-24'}
            onClick={() => setShowCreateModal(true)}
          >
            Create Project
          </Button>
        </div>
      </PageTitleArea>

      <div
        className={`grid gap-12 px-24 pb-32 max-md:px-16 ${catalogListType === 'Grid' ? 'md:grid-cols-4' : ''}`}
      >
        {projects.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-32">
            <p className="text-textSecondary text-body-m mb-16">
              No projects yet. Create your first learning project to get started!
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create Your First Project
            </Button>
          </div>
        ) : (
          projects.map((project) => (
            <CatalogCard
              key={project.id}
              to={`/canvas/${project.id}`}
              previewColor={getAssetTypeColor(project.assets?.[0]?.asset_type)}
              title={project.title}
              subtitle={getProjectSubtitle(project)}
              isListType={catalogListType === 'List'}
            />
          ))
        )}
      </div>

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateProject}
        />
      )}
    </>
  );
}
