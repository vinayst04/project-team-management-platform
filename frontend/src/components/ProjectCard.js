'use client';

import Link from 'next/link';
import { btnPrimary, btnSecondary, roleBadge } from '@/utils/styles';
import { confirmAction } from '@/utils/api-helpers';

export default function ProjectCard({ project, onDelete, canEdit }) {
  const handleDelete = () => {
    if (confirmAction(`Are you sure you want to delete "${project.name}"?`)) onDelete(project.id);
  };

  const MemberItem = ({ pu }) => (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
      <div className="flex items-center space-x-2">
        <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white text-xs font-medium">
          {pu.user?.email?.[0].toUpperCase()}
        </div>
        <span className="text-sm text-gray-700 truncate max-w-[150px]">{pu.user?.email}</span>
      </div>
      <span className={roleBadge(pu.role)}>{pu.role}</span>
    </div>
  );

  const members = project.projectUsers || [];
  const memberCount = members.length;

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-200">
      <div className="bg-gradient-to-r from-gray-900 to-black h-2"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{project.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {project.description || <span className="italic text-gray-400">No description</span>}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Team Members</span>
            <span className="text-xs bg-gray-900 text-white px-2 py-1 rounded-full font-medium">
              {memberCount} {memberCount === 1 ? 'member' : 'members'}
            </span>
          </div>

          {memberCount > 0 ? (
            <div className="space-y-2">
              {members.slice(0, 3).map((pu) => <MemberItem key={pu.id} pu={pu} />)}
              {memberCount > 3 && <p className="text-xs text-gray-500 text-center">+{memberCount - 3} more</p>}
            </div>
          ) : (
            <div className="text-center py-3">
              <svg className="w-8 h-8 mx-auto text-gray-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-xs text-gray-400">No members assigned</p>
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex gap-2">
          <Link href={`/projects/${project.id}`} className={`flex-1 text-center ${btnPrimary} font-medium text-sm`}>View Details</Link>
          {canEdit && <button onClick={handleDelete} className={`${btnSecondary} font-medium text-sm`}>Delete</button>}
        </div>
      </div>
    </div>
  );
}
