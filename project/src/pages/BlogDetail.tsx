import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, ArrowLeft, BookOpen, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ShareButton from '../components/ShareButton';
import MarkdownRenderer from '../components/MarkdownRenderer';

interface Blog {
  id: string;
  title: string;
  body: string;
  created_at: string;
  tags: string[];
  cover_image_url?: string;
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBlog();
      fetchRelatedBlogs();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Blog post not found');
        } else {
          throw error;
        }
      } else {
        setBlog(data);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .neq('id', id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRelatedBlogs(data || []);
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const getWordCount = (body: string) => {
    return body.split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadTime = (body: string) => {
    const wordsPerMinute = 200;
    const wordCount = getWordCount(body);
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const shareUrl = window.location.href;
  const shareTitle = blog?.title || 'Check out this blog post';
  const shareDescription = blog?.body ? blog.body.substring(0, 150) + '...' : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-neon-green font-mono">Loading blog post...</div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white font-mono mb-4">
              {error || 'Blog post not found'}
            </h1>
            <motion.button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center space-x-2 bg-neon-green text-black px-6 py-3 rounded-lg font-mono font-semibold hover:bg-neon-green/90 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Button and Share */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-neon-green transition-colors font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>
          
          <ShareButton
            url={shareUrl}
            title={shareTitle}
            description={shareDescription}
          />
        </motion.div>

        {/* Cover Image */}
        {blog.cover_image_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-xl border border-dark-border">
              <img
                src={blog.cover_image_url}
                alt={blog.title}
                className="w-full h-64 md:h-96 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/20 to-transparent" />
            </div>
          </motion.div>
        )}

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: blog.cover_image_url ? 0.2 : 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-400 font-mono text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(blog.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{getReadTime(blog.body)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>{getWordCount(blog.body)} words</span>
            </div>
            
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4" />
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-neon-green/10 text-neon-green text-xs rounded border border-neon-green/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.header>

        {/* Article Content with Enhanced Markdown Rendering */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: blog.cover_image_url ? 0.4 : 0.2 }}
          className="mb-12"
        >
          <div className="bg-dark-card border border-dark-border rounded-xl p-8">
            <MarkdownRenderer content={blog.body} />
          </div>
        </motion.div>

        {/* Share Section - Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: blog.cover_image_url ? 0.6 : 0.4 }}
          className="border-t border-dark-border pt-8 mb-12"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-mono font-semibold mb-2">Share this article</h3>
              <p className="text-gray-400 font-mono text-sm">
                Help others discover this content
              </p>
            </div>
            
            <ShareButton
              url={shareUrl}
              title={shareTitle}
              description={shareDescription}
              className="sm:ml-4"
            />
          </div>
        </motion.div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: blog.cover_image_url ? 0.8 : 0.6 }}
            className="border-t border-dark-border pt-12"
          >
            <h3 className="text-2xl font-bold text-white font-mono mb-8">Related Articles</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog, index) => (
                <motion.article
                  key={relatedBlog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-neon-green/50 transition-all duration-300"
                >
                  <Link to={`/blog/${relatedBlog.id}`} className="block">
                    {/* Cover Image for Related Posts */}
                    {relatedBlog.cover_image_url && (
                      <img
                        src={relatedBlog.cover_image_url}
                        alt={relatedBlog.title}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2 py-1 bg-neon-green/10 text-neon-green text-xs font-mono rounded border border-neon-green/20">
                          {relatedBlog.tags && relatedBlog.tags.length > 0 ? relatedBlog.tags[0] : 'Article'}
                        </span>
                        <BookOpen className="w-4 h-4 text-gray-400" />
                      </div>
                      
                      <h4 className="text-lg font-bold text-white font-mono mb-3 leading-tight hover:text-neon-green transition-colors">
                        {relatedBlog.title}
                      </h4>
                      
                      <p className="text-gray-400 font-mono text-sm mb-4">
                        {relatedBlog.body.substring(0, 100)}...
                      </p>
                      
                      <div className="flex items-center justify-between text-gray-500 text-xs font-mono">
                        <span>{new Date(relatedBlog.created_at).toLocaleDateString()}</span>
                        <span>{getReadTime(relatedBlog.body)}</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </motion.section>
        )}
      </article>

      <Footer />
    </div>
  );
};

export default BlogDetail;