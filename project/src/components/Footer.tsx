import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Explore',
      links: [
        { name: 'Home', href: '/' },
        { name: 'Projects', href: '/projects' },
        { name: 'About', href: '/about' },
        { name: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Connect',
      links: [
        { name: 'Email', href: 'mailto:tafartechlabs@gmail.com' },
        { name: 'GitHub', href: 'https://github.com/dyglo' },
        { name: 'LinkedIn', href: 'https://www.linkedin.com/in/tafar-m-b46337259/' },
        { name: 'Resume', href: '#' }
      ]
    },
    {
      title: 'Technologies',
      links: [
        { name: 'PyTorch', href: '#' },
        { name: 'TensorFlow', href: '#' },
        { name: 'React', href: '#' },
        { name: 'Next.js', href: '#' },
        { name: 'OpenCV', href: '#' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/dyglo', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/tafar-m-b46337259/', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:tafartechlabs@gmail.com', label: 'Email' }
  ];

  return (
    <footer id="contact" className="bg-dark-bg border-t border-dark-border">
      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Let's Connect &{' '}
            <span className="text-neon-green font-mono">{'{Collaborate}'}</span>
          </h2>
          <p className="text-xl text-gray-400 font-mono max-w-3xl mx-auto mb-8">
            Ready to discuss your next AI project or explore collaboration opportunities? 
            Let's build something amazing together.
          </p>
          
          {/* Contact Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <motion.a
              href="mailto:tafartechlabs@gmail.com"
              className="flex items-center space-x-3 bg-dark-card border border-dark-border rounded-lg px-6 py-4 text-gray-300 hover:text-neon-green hover:border-neon-green/50 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <Mail className="w-6 h-6" />
              <span className="font-mono">tafartechlabs@gmail.com</span>
            </motion.a>
            
            <motion.a
              href="https://www.linkedin.com/in/tafar-m-b46337259/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 bg-dark-card border border-dark-border rounded-lg px-6 py-4 text-gray-300 hover:text-neon-green hover:border-neon-green/50 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <Linkedin className="w-6 h-6" />
              <span className="font-mono">LinkedIn</span>
            </motion.a>
            
            <motion.a
              href="https://github.com/dyglo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 bg-dark-card border border-dark-border rounded-lg px-6 py-4 text-gray-300 hover:text-neon-green hover:border-neon-green/50 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <Github className="w-6 h-6" />
              <span className="font-mono">GitHub</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Footer Links */}
        <div className="grid md:grid-cols-4 gap-8 border-t border-dark-border pt-12">
          {/* Logo and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Code2 className="w-8 h-8 text-neon-green" />
              <span className="text-xl font-bold text-white font-mono">Tafar M</span>
            </div>
            <p className="text-gray-400 font-mono text-sm leading-relaxed mb-6">
              Machine Learning and AI Engineer building intelligent systems and modern web applications.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-neon-green transition-colors duration-200"
                  whileHover={{ scale: 1.2 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-white font-mono font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-gray-400 hover:text-neon-green transition-colors duration-200 font-mono text-sm"
                      whileHover={{ x: 5 }}
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-dark-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 font-mono text-sm">
            © 2025 Tafar M. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-neon-green transition-colors duration-200 font-mono text-sm">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-neon-green transition-colors duration-200 font-mono text-sm">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-neon-green transition-colors duration-200 font-mono text-sm">
              Sitemap
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;