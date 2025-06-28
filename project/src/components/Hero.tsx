import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import CodeEditor from './CodeEditor';

const Hero = () => {
  const [currentWord, setCurrentWord] = useState('World');
  const words = ['World', 'Future', 'Tomorrow'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord(prev => {
        const currentIndex = words.indexOf(prev);
        return words[(currentIndex + 1) % words.length];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-card relative overflow-hidden pt-16">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,153,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-green rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1"
          >
            <div className="space-y-4">
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Helping build a Smarter{' '}
                <span className="relative">
                  <span className="text-neon-green font-mono">
                    {'{'}
                    <motion.span
                      key={currentWord}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="inline-block"
                    >
                      {currentWord}
                    </motion.span>
                    {'}'}
                  </span>
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-gray-400 max-w-lg font-mono mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                I'm Tafar M, a Machine Learning and AI Engineer building real-world solutions using vision, language, and data-driven intelligence.
              </motion.p>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.a
                href="/projects"
                className="flex items-center justify-center space-x-2 bg-transparent border-2 border-neon-green text-neon-green px-6 py-3 rounded-lg font-mono font-semibold hover:bg-neon-green hover:text-black transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>View Projects</span>
              </motion.a>
              
              <motion.a
                href="#contact-form"
                className="flex items-center justify-center space-x-2 bg-neon-green text-black px-6 py-3 rounded-lg font-mono font-semibold hover:bg-neon-green/90 transition-all duration-300 animate-glow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-5 h-5" />
              </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              className="flex space-x-6 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.a
                href="https://github.com/dyglo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-neon-green transition-colors duration-200"
                whileHover={{ scale: 1.2, y: -2 }}
              >
                <Github className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/tafar-m-b46337259/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-neon-green transition-colors duration-200"
                whileHover={{ scale: 1.2, y: -2 }}
              >
                <Linkedin className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="mailto:tafartechlabs@gmail.com"
                className="text-gray-400 hover:text-neon-green transition-colors duration-200"
                whileHover={{ scale: 1.2, y: -2 }}
              >
                <Mail className="w-6 h-6" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Content - Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full max-w-2xl mx-auto order-1 lg:order-2"
          >
            <CodeEditor />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;