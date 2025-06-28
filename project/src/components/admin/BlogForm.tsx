import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Blog {
  id: string;
  title: string;
  body: string;
  created_at: string;
  tags: string[];
}

interface BlogFormData {
  title: string;
  body: string;
  tags: string;
}

interface BlogFormProps {
  blog?: Blog | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ blog, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError } = useForm<BlogFormData>({
    defaultValues: {
      title: blog?.title || '',
      body: blog?.body || '',
      tags: blog?.tags?.join(', ') || ''
    }
  });

  const onSubmit = async (data: BlogFormData) => {
    setIsLoading(true);
    try {
      const blogData = {
        title: data.title,
        body: data.body,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      if (blog) {
        // Update existing blog
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', blog.id);
        
        if (error) throw error;
      } else {
        // Create new blog
        const { error } = await supabase
          .from('blogs')
          .insert([blogData]);
        
        if (error) throw error;
      }

      onSuccess();
    } catch (error: any) {
      setError('root', { message: error.message || 'Failed to save blog post' });
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
          {blog ? 'Edit Blog Post' : 'New Blog Post'}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-mono text-gray-300 mb-2">
            Title
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            type="text"
            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors"
            placeholder="Enter blog post title"
          />
          {errors.title && (
            <p className="text-red-400 text-sm font-mono mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-mono text-gray-300 mb-2">
            Content
          </label>
          <textarea
            {...register('body', { required: 'Content is required' })}
            rows={12}
            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors resize-none"
            placeholder="Write your blog post content here..."
          />
          {errors.body && (
            <p className="text-red-400 text-sm font-mono mt-1">{errors.body.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-mono text-gray-300 mb-2">
            Tags (comma-separated)
          </label>
          <input
            {...register('tags')}
            type="text"
            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors"
            placeholder="e.g., AI, Machine Learning, Python"
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
            <span>{isLoading ? 'Saving...' : 'Save Post'}</span>
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

export default BlogForm;