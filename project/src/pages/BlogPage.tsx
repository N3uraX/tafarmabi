import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Blog {
  id: string;
  title: string;
  body: string;
  created_at: string;
  tags: string[];
  cover_image_url?: string;
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);

  // Fallback blog posts for when database is empty
  const fallbackBlogs = [
    {
      id: '1',
      title: 'Building Real-Time Object Detection with YOLOv8',
      body: 'A comprehensive guide to implementing YOLOv8 for real-time object detection in video streams, including optimization techniques and deployment strategies. This tutorial covers everything from setting up your development environment to deploying your model in production. We\'ll explore the latest advances in computer vision and how to leverage them for practical applications.',
      created_at: '2024-01-15',
      tags: ['Computer Vision', 'AI', 'Python'],
      cover_image_url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '2',
      title: 'From Research to Production: ML Model Deployment',
      body: 'Best practices for deploying machine learning models in production environments, covering Docker, API design, and monitoring strategies. Learn how to bridge the gap between research notebooks and scalable production systems. This guide includes real-world examples and common pitfalls to avoid when deploying ML models.',
      created_at: '2024-01-08',
      tags: ['MLOps', 'DevOps', 'Machine Learning'],
      cover_image_url: 'https://images.pexels.com/photos/2882234/pexels-photo-2882234.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '3',
      title: 'Modern Web Development with Next.js and AI',
      body: 'Exploring how to integrate AI capabilities into modern web applications using Next.js, including API routes and real-time inference. Discover how to build intelligent web applications that can process images, understand text, and provide personalized experiences. We\'ll cover both client-side and server-side AI integration patterns.',
      created_at: '2024-01-01',
      tags: ['Web Development', 'Next.js', 'AI Integration'],
      cover_image_url: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '4',
      title: 'Deep Learning for Computer Vision: A Practical Guide',
      body: 'An in-depth exploration of deep learning techniques for computer vision applications. From convolutional neural networks to transformer architectures, learn how to build and train models that can see and understand visual content. Includes hands-on examples with PyTorch and practical tips for improving model performance.',
      created_at: '2023-12-20',
      tags: ['Deep Learning', 'Computer Vision', 'PyTorch']
    },
    {
      id: '5',
      title: 'Building Scalable APIs with FastAPI and Python',
      body: 'Learn how to create high-performance, scalable APIs using FastAPI. This comprehensive guide covers everything from basic setup to advanced features like dependency injection, background tasks, and automatic API documentation. Perfect for building backends for AI applications and microservices.',
      created_at: '2023-12-10',
      tags: ['Python', 'FastAPI', 'Backend Development']
    },
    {
      id: '6',
      title: 'The Future of AI: Trends and Predictions for 2024',
      body: 'An analysis of emerging trends in artificial intelligence and machine learning. Explore the latest developments in large language models, computer vision, and AI ethics. This article provides insights into where the field is heading and what developers should prepare for in the coming year.',
      created_at: '2023-12-01',
      tags: ['AI Trends', 'Future Tech', 'Industry Analysis']
    }
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, selectedTag]);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

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

  const filterBlogs = () => {
    let filtered = blogs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(blog =>
        blog.tags && blog.tags.includes(selectedTag)
      );
    }

    setFilteredBlogs(filtered);

    // Extract all unique tags
    const tags = new Set<string>();
    blogs.forEach(blog => {
      if (blog.tags) {
        blog.tags.forEach(tag => tags.add(tag));
      }
    });
    setAllTags(Array.from(tags));
  };

  const getReadTime = (body: string) => {
    const wordsPerMinute = 200;
    const wordCount = body.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-neon-green font-mono">Loading blog posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Technical{' '}
            <span className="text-neon-green font-mono">{'{Blog}'}</span>
          </h1>
          <p className="text-xl text-gray-400 font-mono max-w-3xl mx-auto mb-8">
            Sharing insights on AI, machine learning, and modern web development through detailed technical articles.
          </p>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                aria-label="Filter by tag"
                className="pl-10 pr-8 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="">All Topics</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 font-mono text-lg">
              {searchTerm || selectedTag ? 'No articles found matching your criteria.' : 'No blog posts available.'}
            </p>
            {(searchTerm || selectedTag) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag('');
                }}
                className="mt-4 text-neon-green hover:text-neon-green/80 font-mono text-sm transition-colors"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-neon-green/50 transition-all duration-300 group"
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
                      
                      <h2 className="text-xl font-bold text-white font-mono leading-tight group-hover:text-neon-green transition-colors duration-200">
                        {post.title}
                      </h2>
                      
                      <p className="text-gray-400 font-mono text-sm leading-relaxed">
                        {post.body.substring(0, 150)}...
                      </p>
                      
                      {post.tags && post.tags.length > 1 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(1, 4).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs font-mono rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 4 && (
                            <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs font-mono rounded">
                              +{post.tags.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                      
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
        )}

        {/* Results Count */}
        {filteredBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <p className="text-gray-400 font-mono text-sm">
              Showing {filteredBlogs.length} of {blogs.length} articles
              {(searchTerm || selectedTag) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTag('');
                  }}
                  className="ml-4 text-neon-green hover:text-neon-green/80 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </p>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;