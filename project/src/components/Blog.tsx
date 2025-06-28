import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Blog {
  id: string;
  title: string;
  body: string;
  created_at: string;
  tags: string[];
  cover_image_url?: string;
}

const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback blog posts for when database is empty
  const fallbackBlogs = [
    {
      id: '1',
      title: 'Building Real-Time Object Detection with YOLOv8',
      body: 'A comprehensive guide to implementing YOLOv8 for real-time object detection in video streams, including optimization techniques and deployment strategies.',
      created_at: '2024-01-15',
      tags: ['Computer Vision'],
      cover_image_url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '2',
      title: 'From Research to Production: ML Model Deployment',
      body: 'Best practices for deploying machine learning models in production environments, covering Docker, API design, and monitoring strategies.',
      created_at: '2024-01-08',
      tags: ['MLOps'],
      cover_image_url: 'https://images.pexels.com/photos/2882234/pexels-photo-2882234.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '3',
      title: 'Modern Web Development with Next.js and AI',
      body: 'Exploring how to integrate AI capabilities into modern web applications using Next.js, including API routes and real-time inference.',
      created_at: '2024-01-01',
      tags: ['Web Development'],
      cover_image_url: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching blogs:', error);
        setBlogs(fallbackBlogs);
      } else {
        setBlogs(data && data.length > 0 ? data : fallbackBlogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs(fallbackBlogs);
    } finally {
      setLoading(false);
    }
  };

  const getReadTime = (body: string) => {
    const wordsPerMinute = 200;
    const wordCount = body.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-neon-green font-mono">Loading blog posts...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Technical{' '}
            <span className="text-neon-green font-mono">{'{Blog}'}</span>
          </h2>
          <p className="text-xl text-gray-400 font-mono max-w-3xl mx-auto">
            Sharing insights on AI, machine learning, and modern web development through detailed technical articles.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-neon-green/50 transition-all duration-300 group cursor-pointer"
            >
              <Link to={`/blog/${post.id}`} className="block">
                {/* Cover Image */}
                {post.cover_image_url && (
                  <div className="relative overflow-hidden">
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-neon-green/10 text-neon-green text-xs font-mono rounded-full border border-neon-green/20">
                        {post.tags && post.tags.length > 0 ? post.tags[0] : 'Article'}
                      </span>
                      <BookOpen className="w-5 h-5 text-gray-400 group-hover:text-neon-green transition-colors duration-200" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white font-mono leading-tight group-hover:text-neon-green transition-colors duration-200">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-400 font-mono text-sm leading-relaxed">
                      {post.body.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                      <div className="flex items-center space-x-4 text-gray-500 text-xs font-mono">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <span>{getReadTime(post.body)}</span>
                      </div>
                      
                      <motion.div
                        className="flex items-center space-x-1 text-gray-400 group-hover:text-neon-green transition-colors duration-200"
                        whileHover={{ x: 5 }}
                      >
                        <span className="font-mono text-xs">Read More</span>
                        <ArrowRight className="w-3 h-3" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.a
            href="/blog"
            className="inline-flex items-center space-x-2 bg-transparent border-2 border-neon-green text-neon-green px-8 py-3 rounded-lg font-mono font-semibold hover:bg-neon-green hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="w-5 h-5" />
            <span>View All Articles</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;