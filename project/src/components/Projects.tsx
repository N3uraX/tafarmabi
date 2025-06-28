import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  github_url: string;
  live_url: string;
  tech_stack: string[];
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback projects for when database is empty
  const fallbackProjects = [
    {
      id: '1',
      title: 'Traffic Analysis System',
      description: 'Computer vision pipeline using YOLO and DeepSORT for analyzing drone footage and visualizing traffic patterns.',
      tech_stack: ['PyTorch', 'OpenCV', 'YOLO', 'Python'],
      image_url: 'https://images.pexels.com/photos/2882234/pexels-photo-2882234.jpeg?auto=compress&cs=tinysrgb&w=800',
      github_url: '#',
      live_url: '#'
    },
    {
      id: '2',
      title: 'AI-Powered Portfolio',
      description: 'Responsive portfolio website built with Next.js, featuring smooth animations and modern design principles.',
      tech_stack: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'TypeScript'],
      image_url: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
      github_url: '#',
      live_url: '#'
    },
    {
      id: '3',
      title: 'Deep Learning Model API',
      description: 'FastAPI-based REST API for serving computer vision models with automatic scaling and monitoring.',
      tech_stack: ['FastAPI', 'Docker', 'PyTorch', 'Redis'],
      image_url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      github_url: '#',
      live_url: '#'
    }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

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

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-neon-green font-mono">Loading projects...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Explore my{' '}
            <span className="text-neon-green font-mono">{'{Projects}'}</span>
          </h2>
          <p className="text-xl text-gray-400 font-mono max-w-3xl mx-auto">
            A collection of AI and machine learning projects showcasing real-world applications and technical expertise.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
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
                  <h3 className="text-xl font-bold text-white mb-3 font-mono group-hover:text-neon-green transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 font-mono text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech_stack.map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 bg-neon-green/10 text-neon-green text-xs font-mono rounded-full border border-neon-green/20"
                      >
                        {tech}
                      </span>
                    ))}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.a
            href="/projects"
            className="inline-flex items-center space-x-2 bg-transparent border-2 border-neon-green text-neon-green px-8 py-3 rounded-lg font-mono font-semibold hover:bg-neon-green hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-5 h-5" />
            <span>View All Projects</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;