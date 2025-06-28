import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, Tag, Eye, Image } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import EnhancedBlogForm from './EnhancedBlogForm';

interface Blog {
  id: string;
  title: string;
  body: string;
  created_at: string;
  tags: string[];
  cover_image_url?: string;
}

const BlogManager = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBlogs(blogs.filter(blog => blog.id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingBlog(null);
    fetchBlogs();
  };

  const getWordCount = (content: string) => {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = getWordCount(content);
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-neon-green font-mono">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white font-mono">Blog Posts</h2>
        <motion.button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-neon-green text-black px-4 py-2 rounded-lg font-mono font-semibold hover:bg-neon-green/90 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </motion.button>
      </div>

      {showForm && (
        <EnhancedBlogForm
          blog={editingBlog}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingBlog(null);
          }}
        />
      )}

      <div className="grid gap-6">
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 font-mono">No blog posts yet. Create your first one!</p>
          </div>
        ) : (
          blogs.map((blog) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-card border border-dark-border rounded-xl overflow-hidden"
            >
              <div className="flex">
                {/* Cover Image */}
                {blog.cover_image_url && (
                  <div className="w-48 h-32 flex-shrink-0">
                    <img
                      src={blog.cover_image_url}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white font-mono mb-2">
                        {blog.title}
                      </h3>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400 font-mono mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{getWordCount(blog.body)} words</span>
                        </div>
                        <span>{getReadTime(blog.body)}</span>
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Tag className="w-4 h-4" />
                            <span>{blog.tags.join(', ')}</span>
                          </div>
                        )}
                        {blog.cover_image_url && (
                          <div className="flex items-center space-x-1">
                            <Image className="w-4 h-4" />
                            <span>Cover</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-400 font-mono text-sm line-clamp-3">
                        {blog.body.substring(0, 200)}...
                      </p>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <motion.button
                        onClick={() => {
                          setEditingBlog(blog);
                          setShowForm(true);
                        }}
                        className="p-2 text-gray-400 hover:text-neon-green transition-colors"
                        whileHover={{ scale: 1.1 }}
                        title="Edit post"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => deleteBlog(blog.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogManager;