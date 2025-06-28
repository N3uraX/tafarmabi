import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ExternalLink, Github } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ProjectForm from './ProjectForm';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  github_url: string;
  live_url: string;
  tech_stack: string[];
  created_at: string;
}

const ProjectManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProject(null);
    fetchProjects();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-neon-green font-mono">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white font-mono">Projects</h2>
        <motion.button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-neon-green text-black px-4 py-2 rounded-lg font-mono font-semibold hover:bg-neon-green/90 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </motion.button>
      </div>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
        />
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 font-mono">No projects yet. Create your first one!</p>
          </div>
        ) : (
          projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-card border border-dark-border rounded-xl overflow-hidden"
            >
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-white font-mono">
                    {project.title}
                  </h3>
                  <div className="flex space-x-1">
                    <motion.button
                      onClick={() => {
                        setEditingProject(project);
                        setShowForm(true);
                      }}
                      className="p-1 text-gray-400 hover:text-neon-green transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => deleteProject(project.id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                
                <p className="text-gray-400 font-mono text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-neon-green/10 text-neon-green text-xs font-mono rounded border border-neon-green/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex space-x-3">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-gray-400 hover:text-neon-green transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span className="font-mono text-xs">Code</span>
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-gray-400 hover:text-neon-green transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="font-mono text-xs">Live</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectManager;