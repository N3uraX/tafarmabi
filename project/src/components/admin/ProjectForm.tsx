import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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

interface ProjectFormData {
  title: string;
  description: string;
  image_url: string;
  github_url: string;
  live_url: string;
  tech_stack: string;
}

interface ProjectFormProps {
  project?: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError } = useForm<ProjectFormData>({
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      image_url: project?.image_url || '',
      github_url: project?.github_url || '',
      live_url: project?.live_url || '',
      tech_stack: project?.tech_stack?.join(', ') || ''
    }
  });

  const onSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    try {
      const projectData = {
        title: data.title,
        description: data.description,
        image_url: data.image_url,
        github_url: data.github_url,
        live_url: data.live_url,
        tech_stack: data.tech_stack.split(',').map(tech => tech.trim()).filter(Boolean)
      };

      if (project) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id);
        
        if (error) throw error;
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);
        
        if (error) throw error;
      }

      onSuccess();
    } catch (error: any) {
      setError('root', { message: error.message || 'Failed to save project' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-card border border-dark-border rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white font-mono">
          {project ? 'Edit Project' : 'New Project'}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-mono text-gray-300 mb-2">
              Title
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors"
              placeholder="Project title"
            />
            {errors.title && (
              <p className="text-red-400 text-sm font-mono mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-mono text-gray-300 mb-2">
              Image URL
            </label>
            <input
              {...register('image_url')}
              type="url"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-mono text-gray-300 mb-2">
            Description
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={4}
            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors resize-none"
            placeholder="Describe your project..."
          />
          {errors.description && (
            <p className="text-red-400 text-sm font-mono mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-mono text-gray-300 mb-2">
              GitHub URL
            </label>
            <input
              {...register('github_url')}
              type="url"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors"
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-gray-300 mb-2">
              Live URL
            </label>
            <input
              {...register('live_url')}
              type="url"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors"
              placeholder="https://project-demo.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-mono text-gray-300 mb-2">
            Tech Stack (comma-separated)
          </label>
          <input
            {...register('tech_stack')}
            type="text"
            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors"
            placeholder="e.g., React, TypeScript, Node.js"
          />
        </div>

        {errors.root && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm font-mono">{errors.root.message}</p>
          </div>
        )}

        <div className="flex space-x-4">
          <motion.button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2 bg-neon-green text-black px-6 py-3 rounded-lg font-mono font-semibold hover:bg-neon-green/90 transition-colors disabled:opacity-50"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Saving...' : 'Save Project'}</span>
          </motion.button>
          
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-dark-border text-gray-400 hover:text-white hover:border-gray-400 rounded-lg font-mono transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProjectForm;