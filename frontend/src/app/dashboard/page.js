'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';
import ProjectForm from '@/components/ProjectForm';
import api from '@/lib/api';
import { getUser, isAuthenticated } from '@/lib/auth';
import { canCreateProject, canEditProject } from '@/utils/permissions';
import { handleApiCall } from '@/utils/api-helpers';
import { btnPrimary } from '@/utils/styles';

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchProjects();
  }, [router]);

  const fetchProjects = async () => {
    setLoading(true);
    const [data, error] = await handleApiCall(() => api.get('/api/projects'), 'Failed to fetch projects');
    if (error) setError(error);
    else {
      setProjects(data?.data || []);
      setError('');
    }
    setLoading(false);
  };

  const handleCreateProject = async (formData) => {
    const [, error] = await handleApiCall(() => api.post('/api/projects', formData), 'Failed to create project');
    if (error) alert(error);
    else {
      setShowCreateForm(false);
      fetchProjects();
    }
  };

  const handleDeleteProject = async (projectId) => {
    const [, error] = await handleApiCall(() => api.delete(`/api/projects/${projectId}`), 'Failed to delete project');
    if (error) alert(error);
    else fetchProjects();
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const userCanCreate = canCreateProject(user);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your projects and team members</p>
          </div>
          {userCanCreate && !showCreateForm && (
            <button onClick={() => setShowCreateForm(true)} className={btnPrimary}>Create Project</button>
          )}
        </div>

        {error && <div className="mb-6 bg-red-50 p-4 rounded-md"><p className="text-red-800">{error}</p></div>}


        {showCreateForm && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
            <ProjectForm onSubmit={handleCreateProject} onCancel={() => setShowCreateForm(false)} />
          </div>
        )}


        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects found</p>
            {userCanCreate && (
              <p className="text-gray-400 mt-2">Create your first project to get started</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDeleteProject}
                canEdit={canEditProject(project, user)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
