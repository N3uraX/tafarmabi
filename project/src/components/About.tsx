import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Zap } from 'lucide-react';

const About = () => {
  const skills = [
    {
      icon: Brain,
      title: 'Machine Learning & AI',
      description: 'Deep expertise in computer vision, neural networks, and model deployment with PyTorch and TensorFlow.'
    },
    {
      icon: Code,
      title: 'Full-Stack Development',
      description: 'Building responsive web applications with React, Next.js, and modern development practices.'
    },
    {
      icon: Zap,
      title: 'MLOps & Automation',
      description: 'Streamlining ML workflows with Docker, CI/CD pipelines, and cloud deployment strategies.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-dark-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                About{' '}
                <span className="text-neon-green font-mono">{'{Tafar M}'}</span>
              </h2>
              <div className="space-y-4 text-gray-400 font-mono leading-relaxed">
                <p>
                  I'm a Machine Learning and AI Engineer practitioner. Over the past years I've architected 
                  end-to-end computer vision pipelines—leveraging YOLO, DeepSORT, and custom tracking—to 
                  analyze drone footage, visualize traffic patterns, and deliver polished demo videos for 
                  LinkedIn showcases.
                </p>
                <p>
                  I'm also proficient in full-stack web development (Next.js + Tailwind CSS + Framer Motion), 
                  building responsive interfaces, integrating CI/CD, and automating deployments. My work bridges 
                  the gap between research-grade models and production-ready applications.
                </p>
                <p>
                  When I'm not coding, you'll find me writing technical blogs, exploring new AI frameworks, 
                  or contributing to open-source projects. Let's connect and build something amazing together—one 
                  model at a time.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="bg-dark-bg border border-dark-border rounded-xl p-6 hover:border-neon-green/50 transition-all duration-300"
              >
                <skill.icon className="w-8 h-8 text-neon-green mb-4" />
                <h3 className="text-xl font-bold text-white mb-3 font-mono">{skill.title}</h3>
                <p className="text-gray-400 font-mono text-sm leading-relaxed">
                  {skill.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;