import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Send, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/dyglo', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/tafar-m-b46337259/', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:tafartechlabs@gmail.com', label: 'Email' }
  ];

  return (
    <section id="contact" className="py-20 bg-dark-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Let's Connect &{' '}
            <span className="text-neon-green font-mono">{'{Collaborate}'}</span>
          </h2>
          <p className="text-xl text-gray-400 font-mono max-w-3xl mx-auto">
            Ready to discuss your next AI project or explore collaboration opportunities? 
            Let's build something amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-mono text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors duration-200"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-mono text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors duration-200"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-mono text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors duration-200 resize-none"
                  placeholder="Tell me about your project or collaboration idea..."
                />
              </div>
              
              <motion.button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-neon-green text-black px-6 py-3 rounded-lg font-mono font-semibold hover:bg-neon-green/90 transition-all duration-300 animate-glow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-neon-green mt-1" />
                <div>
                  <h3 className="text-white font-mono font-semibold mb-2">Location</h3>
                  <p className="text-gray-400 font-mono text-sm">
                    Available for remote work worldwide
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-neon-green mt-1" />
                <div>
                  <h3 className="text-white font-mono font-semibold mb-2">Response Time</h3>
                  <p className="text-gray-400 font-mono text-sm">
                    Usually within 24 hours
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-neon-green mt-1" />
                <div>
                  <h3 className="text-white font-mono font-semibold mb-2">Email</h3>
                  <a 
                    href="mailto:tafartechlabs@gmail.com"
                    className="text-gray-400 hover:text-neon-green font-mono text-sm transition-colors duration-200"
                  >
                    tafartechlabs@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-dark-border pt-8">
              <h3 className="text-white font-mono font-semibold mb-6">Connect on Social</h3>
              <div className="flex space-x-6">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-dark-bg border border-dark-border rounded-lg text-gray-400 hover:text-neon-green hover:border-neon-green/50 transition-all duration-200"
                    whileHover={{ scale: 1.1, y: -2 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="bg-dark-bg border border-dark-border rounded-xl p-6">
              <h3 className="text-white font-mono font-semibold mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a 
                  href="/projects"
                  className="block text-gray-400 hover:text-neon-green font-mono text-sm transition-colors duration-200"
                >
                  → View My Projects
                </a>
                <a 
                  href="/blog"
                  className="block text-gray-400 hover:text-neon-green font-mono text-sm transition-colors duration-200"
                >
                  → Read Technical Blog
                </a>
                <a 
                  href="https://github.com/dyglo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-neon-green font-mono text-sm transition-colors duration-200"
                >
                  → GitHub Profile
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;