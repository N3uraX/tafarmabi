import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Search, Filter, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

const ProjectPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [allTechnologies, setAllTechnologies] = useState<string[]>([]);

  // Fallback projects for when database is empty
  const fallbackProjects = [
    {
      id: '1',
      title: 'Traffic Analysis System',
      description: 'Computer vision pipeline using YOLO and DeepSORT for analyzing drone footage and visualizing traffic patterns. This system processes real-time video feeds to detect vehicles, track their movements, and generate comprehensive traffic analytics including congestion levels, speed analysis, and flow patterns.',
      tech_stack: ['PyTorch', 'OpenCV', 'YOLO', 'Python', 'DeepSORT'],
      image_url: 'https://images.pexels.com/photos/2882234/pexels-photo-2882234.jpeg?auto=compress&cs=tinysrgb&w=800',
      github_url: 'https://github.com',
      live_url: 'https://demo.example.com',
      created_at: '2024-01-15'
    },
    {
      id: '2',
      title: 'AI-Powered Portfolio',
      description: 'Responsive portfolio website built with Next.js, featuring smooth animations and modern design principles. Includes dynamic content management, blog functionality, and seamless integration with various APIs for showcasing projects and technical articles.',
      tech_stack: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'TypeScript', 'Supabase'],
      image_url: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
      github_url: 'https://github.com',
      live_url: 'https://portfolio.example.com',
      created_at: '2024-01-08'
    },
    {
      id: '3',
      title: 'Deep Learning Model API',
      description: 'FastAPI-based REST API for serving computer vision models with automatic scaling and monitoring. Features include model versioning, A/B testing capabilities, real-time inference, and comprehensive logging for production deployment.',
      tech_stack: ['FastAPI', 'Docker', 'PyTorch', 'Redis', 'PostgreSQL'],
      image_url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      github_url: 'https://github.com',
      live_url: 'https://api.example.com',
      created_at: '2023-12-20'
    },
    {
      id: '4',
      title: 'Real-Time Chat Application',
      description: 'Modern chat application with real-time messaging, file sharing, and video calling capabilities. Built with React and Socket.io, featuring end-to-end encryption, message history, and responsive design for all devices.',
      tech_stack: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'WebRTC'],
      image_url: 'https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=800',
      github_url: 'https://github.com',
      live_url: 'https://chat.example.com',
      created_at: '2023-12-10'
    },
    {
      id: '5',
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard. Features include product catalog, shopping cart, order tracking, and comprehensive analytics for business insights.',
      tech_stack: ['React', 'Express.js', 'Stripe', 'MySQL', 'AWS'],
      image_url: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
      github_url: 'https://github.com',
      live_url: 'https://shop.example.com',
      created_at: '2023-11-25'
    },
    {
      id: '6',
      title: 'Data Visualization Dashboard',
      description: 'Interactive dashboard for visualizing complex datasets with real-time updates and customizable charts. Built with D3.js and React, featuring multiple chart types, filtering capabilities, and export functionality.',
      tech_stack: ['React', 'D3.js', 'Python', 'Flask', 'Chart.js'],
      image_url: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
      github_url: 'https://github.com',
      live_url: 'https://dashboard.example.com',
      created_at: '2023-11-15'
    }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedTech]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        setProjects(fallbackProjects);
      } else {
        setProjects(data && data.length > 0 ? data : fallbackProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects(fallbackProjects);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by technology
    if (selectedTech) {
      filtered = filtered.filter(project =>
        project.tech_stack && project.tech_stack.includes(selectedTech)
      );
    }

    setFilteredProjects(filtered);

    // Extract all unique technologies
    const technologies = new Set<string>();
    projects.forEach(project => {
      if (project.tech_stack) {
        project.tech_stack.forEach(tech => technologies.add(tech));
      }
    });
    setAllTechnologies(Array.from(technologies));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-neon-green font-mono">Loading projects...</div>
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
            My{' '}
            <span className="text-neon-green font-mono">{'{Projects}'}</span>
          </h1>
          <p className="text-xl text-gray-400 font-mono max-w-3xl mx-auto mb-8">
            A collection of AI and machine learning projects showcasing real-world applications and technical expertise.
          </p>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="pl-10 pr-8 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="">All Technologies</option>
                {allTechnologies.map((tech) => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 font-mono text-lg">
              {searchTerm || selectedTech ? 'No projects found matching your criteria.' : 'No projects available.'}
            </p>
            {(searchTerm || selectedTech) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTech('');
                }}
                className="mt-4 text-neon-green hover:text-neon-green/80 font-mono text-sm transition-colors"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-neon-green/50 transition-all duration-300 group"
              >
                <Link to={`/project/${project.id}`} className="block">
                  <div className="relative overflow-hidden">
                    <img 
                      src={project.image_url} 
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-3 font-mono group-hover:text-neon-green transition-colors duration-200">
                      {project.title}
                    </h2>
                    <p className="text-gray-400 font-mono text-sm mb-4 leading-relaxed">
                      {project.description.substring(0, 120)}...
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech_stack.slice(0, 3).map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 bg-neon-green/10 text-neon-green text-xs font-mono rounded-full border border-neon-green/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <span className="px-3 py-1 bg-gray-600/20 text-gray-400 text-xs font-mono rounded-full">
                          +{project.tech_stack.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                
                <div className="px-6 pb-6">
                  <div className="flex space-x-4">
                    {project.github_url && (
                      <motion.a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-gray-400 hover:text-neon-green transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-4 h-4" />
                        <span className="font-mono text-sm">Code</span>
                      </motion.a>
                    )}
                    {project.live_url && (
                      <motion.a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-gray-400 hover:text-neon-green transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="font-mono text-sm">Demo</span>
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <p className="text-gray-400 font-mono text-sm">
              Showing {filteredProjects.length} of {projects.length} projects
              {(searchTerm || selectedTech) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTech('');
                  }}
                  className="ml-4 text-neon-green hover:text-neon-green/80 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-16 pt-12 border-t border-dark-border"
        >
          <h3 className="text-2xl font-bold text-white font-mono mb-4">
            Interested in collaborating?
          </h3>
          <p className="text-gray-400 font-mono mb-6">
            Let's discuss your next project and build something amazing together.
          </p>
          <motion.a
            href="/#contact"
            className="inline-flex items-center space-x-2 bg-neon-green text-black px-8 py-3 rounded-lg font-mono font-semibold hover:bg-neon-green/90 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Code2 className="w-5 h-5" />
            <span>Get in Touch</span>
          </motion.a>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectPage;