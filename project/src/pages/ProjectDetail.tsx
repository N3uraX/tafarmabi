import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Calendar, Code2, Share2, Twitter, Linkedin } from 'lucide-react';
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

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProject();
      fetchRelatedProjects();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Project not found');
        } else {
          throw error;
        }
      } else {
        setProject(data);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .neq('id', id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRelatedProjects(data || []);
    } catch (error) {
      console.error('Error fetching related projects:', error);
    }
  };

  const shareUrl = window.location.href;
  const shareTitle = project?.title || 'Check out this project';

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-neon-green font-mono">Loading project...</div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white font-mono mb-4">
              {error || 'Project not found'}
            </h1>
            <motion.button
              onClick={() => navigate('/projects')}
              className="inline-flex items-center space-x-2 bg-neon-green text-black px-6 py-3 rounded-lg font-mono font-semibold hover:bg-neon-green/90 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects</span>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/projects"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-neon-green transition-colors font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
        </motion.div>

        {/* Project Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono leading-tight">
            {project.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-400 font-mono text-sm mb-8">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(project.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4" />
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-neon-green/10 text-neon-green text-xs rounded border border-neon-green/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {project.github_url && (
              <motion.a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-transparent border-2 border-neon-green text-neon-green px-6 py-3 rounded-lg font-mono font-semibold hover:bg-neon-green hover:text-black transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-5 h-5" />
                <span>View Code</span>
              </motion.a>
            )}
            
            {project.live_url && (
              <motion.a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-neon-green text-black px-6 py-3 rounded-lg font-mono font-semibold hover:bg-neon-green/90 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-5 h-5" />
                <span>Live Demo</span>
              </motion.a>
            )}
          </div>
        </motion.header>

        {/* Project Image */}
        {project.image_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative overflow-hidden rounded-xl border border-dark-border">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/20 to-transparent" />
            </div>
          </motion.div>
        )}

        {/* Project Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-dark-card border border-dark-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white font-mono mb-6">About This Project</h2>
            <div className="prose prose-lg max-w-none">
              {project.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-300 font-mono leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tech Stack Details */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="bg-dark-card border border-dark-border rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white font-mono mb-6">Technologies Used</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {project.tech_stack.map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center justify-center p-4 bg-dark-bg border border-dark-border rounded-lg hover:border-neon-green/50 transition-colors"
                  >
                    <span className="text-gray-300 font-mono font-semibold">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="border-t border-dark-border pt-8 mb-12"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-white font-mono font-semibold">Share this project</h3>
            <div className="flex space-x-4">
              {shareLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-dark-card border border-dark-border rounded-lg text-gray-400 hover:text-neon-green hover:border-neon-green/50 transition-all duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                  aria-label={`Share on ${social.name}`}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
              <motion.button
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="flex items-center justify-center w-10 h-10 bg-dark-card border border-dark-border rounded-lg text-gray-400 hover:text-neon-green hover:border-neon-green/50 transition-all duration-200"
                whileHover={{ scale: 1.1, y: -2 }}
                aria-label="Copy link"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="border-t border-dark-border pt-12"
          >
            <h3 className="text-2xl font-bold text-white font-mono mb-8">More Projects</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((relatedProject, index) => (
                <motion.article
                  key={relatedProject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-neon-green/50 transition-all duration-300"
                >
                  <Link to={`/project/${relatedProject.id}`} className="block">
                    {relatedProject.image_url && (
                      <img
                        src={relatedProject.image_url}
                        alt={relatedProject.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-white font-mono mb-3 leading-tight hover:text-neon-green transition-colors">
                        {relatedProject.title}
                      </h4>
                      
                      <p className="text-gray-400 font-mono text-sm mb-4">
                        {relatedProject.description.substring(0, 100)}...
                      </p>
                      
                      {relatedProject.tech_stack && relatedProject.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {relatedProject.tech_stack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-neon-green/10 text-neon-green text-xs font-mono rounded border border-neon-green/20"
                            >
                              {tech}
                            </span>
                          ))}
                          {relatedProject.tech_stack.length > 3 && (
                            <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs font-mono rounded">
                              +{relatedProject.tech_stack.length - 3}
                            </span>
                          )}
                        </div>
                      )}
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

export default ProjectDetail;