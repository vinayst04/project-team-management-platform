'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProjectForm from '@/components/ProjectForm';
import UserAssignment from '@/components/UserAssignment';
import api from '@/lib/api';
import { getUser, isAuthenticated } from '@/lib/auth';
import { canEditProject } from '@/utils/permissions';
import { handleApiCall, confirmAction } from '@/utils/api-helpers';
import { btnPrimary } from '@/utils/styles';

export default function ProjectDetails() {
  const router = useRouter();
  const projectId = useParams().id;
  const [project, setProject] = useState(null);
  const [projectUsers, setProjectUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showAssignUser, setShowAssignUser] = useState(false);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchProjectData();
  }, [projectId, router]);

  const fetchProjectData = async () => {
    setLoading(true);
    const [projectData] = await handleApiCall(() => api.get(`/api/projects/${projectId}`), 'Failed to fetch project');
    const [usersData] = await handleApiCall(() => api.get(`/api/projects/${projectId}/users`), 'Failed to fetch users');
    
    if (!projectData) setError('Project not found');
    else {
      setProject(projectData?.data || null);
      setProjectUsers(usersData?.data || []);
    }
    setLoading(false);
  };

  const handleUpdateProject = async (formData) => {
    const [, error] = await handleApiCall(() => api.put(`/api/projects/${projectId}`, formData), 'Failed to update project');
    if (error) alert(error);
    else {
      setEditing(false);
      fetchProjectData();
    }
  };

  const handleAssignUser = async (formData) => {
    const [, error] = await handleApiCall(() => api.post(`/api/projects/${projectId}/users`, formData), 'Failed to assign user');
    if (error) alert(error);
    else {
      setShowAssignUser(false);
      fetchProjectData();
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!confirmAction('Are you sure you want to remove this user from the project?')) return;
    const [, error] = await handleApiCall(() => api.delete(`/api/projects/${projectId}/users/${userId}`), 'Failed to remove user');
    if (error) alert(error);
    else fetchProjectData();
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    const [, error] = await handleApiCall(() => api.put(`/api/projects/${projectId}/users/${userId}`, { role: newRole }), 'Failed to update user role');
    if (error) alert(error);
    else fetchProjectData();
  };

  const UserItem = ({ pu }) => (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
      <div>
        <p className="font-medium text-gray-900">{pu.user.email}</p>
        {pu.user.role && <p className="text-sm text-gray-500">Global Role: {pu.user.role}</p>}
      </div>
      <div className="flex items-center gap-3">
        {userCanEdit ? (
          <select value={pu.role} onChange={(e) => handleUpdateUserRole(pu.user.id, e.target.value)} className="px-3 py-1 border border-gray-300 rounded-md text-sm">
            <option value="owner">Owner</option>
            <option value="developer">Developer</option>
            <option value="viewer">Viewer</option>
          </select>
        ) : (
          <span className="px-3 py-1 bg-black text-white rounded-full text-sm font-medium">{pu.role}</span>
        )}
        {userCanEdit && <button onClick={() => handleRemoveUser(pu.user.id)} className="text-red-600 hover:text-red-800 text-sm">Remove</button>}
      </div>
    </div>
  );

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

  if (error || !project) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-800">{error || 'Project not found'}</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const userCanEdit = canEditProject(project, user);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.push('/dashboard')} className="mb-4 text-indigo-600 hover:text-indigo-800">← Back to Dashboard</button>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          {editing ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Edit Project</h2>
              <ProjectForm initialData={project} onSubmit={handleUpdateProject} onCancel={() => setEditing(false)} />
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                  {project.description && <p className="text-gray-600 mt-2">{project.description}</p>}
                </div>
                {userCanEdit && <button onClick={() => setEditing(true)} className={btnPrimary}>Edit Project</button>}
              </div>
              {project.client && <p className="text-sm text-gray-500">Client: {project.client.name}</p>}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Assigned Users</h2>
            {userCanEdit && <button onClick={() => setShowAssignUser(true)} className={btnPrimary}>Assign User</button>}
          </div>

          {projectUsers.length === 0 ? (
            <p className="text-gray-500">No users assigned to this project</p>
          ) : (
            <div className="space-y-3">
              {projectUsers.map((pu) => <UserItem key={pu.id} pu={pu} />)}
            </div>
          )}
        </div>
      </div>

      {showAssignUser && <UserAssignment onAssign={handleAssignUser} onClose={() => setShowAssignUser(false)} />}
    </div>
  );
}
