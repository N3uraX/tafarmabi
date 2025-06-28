import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState<FormStatus>({
    type: 'idle',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setStatus({ type: 'error', message: 'Name is required' });
      return false;
    }
    if (!formData.email.trim()) {
      setStatus({ type: 'error', message: 'Email is required' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' });
      return false;
    }
    if (!formData.message.trim()) {
      setStatus({ type: 'error', message: 'Message is required' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setStatus({ type: 'loading', message: 'Sending message...' });

    try {
      // Insert message into Supabase
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject.trim() || '',
            message: formData.message.trim()
          }
        ]);

      if (error) {
        throw error;
      }
      
      setStatus({ 
        type: 'success', 
        message: 'Thank you for your message! I\'ll get back to you soon.' 
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatus({ type: 'idle', message: '' });
      }, 5000);
      
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setStatus({ 
        type: 'error', 
        message: error.message || 'Failed to send message. Please try again.' 
      });
    }
  };

  return (
    <section id="contact-form" className="py-20 bg-dark-card">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-dark-bg border border-dark-border rounded-xl p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-mono text-gray-300 mb-2">
                  Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors duration-200 placeholder-gray-500"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-mono text-gray-300 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors duration-200 placeholder-gray-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-mono text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors duration-200 placeholder-gray-500"
                placeholder="What's this about?"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-mono text-gray-300 mb-2">
                Message *
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full pl-10 pr-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors duration-200 resize-none placeholder-gray-500"
                  placeholder="Tell me about your project or collaboration idea..."
                />
              </div>
            </div>

            {/* Status Message */}
            {status.type !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center space-x-2 p-4 rounded-lg border ${
                  status.type === 'success' 
                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : status.type === 'error'
                    ? 'bg-red-500/10 border-red-500/20 text-red-400'
                    : 'bg-neon-green/10 border-neon-green/20 text-neon-green'
                }`}
              >
                {status.type === 'success' && <CheckCircle className="w-5 h-5" />}
                {status.type === 'error' && <AlertCircle className="w-5 h-5" />}
                {status.type === 'loading' && (
                  <div className="w-5 h-5 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
                )}
                <span className="font-mono text-sm">{status.message}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={status.type === 'loading'}
              className="w-full flex items-center justify-center space-x-2 bg-neon-green text-black px-6 py-3 rounded-lg font-mono font-semibold hover:bg-neon-green/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-glow"
              whileHover={{ scale: status.type === 'loading' ? 1 : 1.02 }}
              whileTap={{ scale: status.type === 'loading' ? 1 : 0.98 }}
            >
              {status.type === 'loading' ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-8 border-t border-dark-border"
          >
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <Mail className="w-6 h-6 text-neon-green mx-auto" />
                <h3 className="text-white font-mono font-semibold">Email</h3>
                <p className="text-gray-400 font-mono text-sm">tafartechlabs@gmail.com</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-6 h-6 text-neon-green mx-auto flex items-center justify-center">
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-white font-mono font-semibold">Response Time</h3>
                <p className="text-gray-400 font-mono text-sm">Usually within 24 hours</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-6 h-6 text-neon-green mx-auto flex items-center justify-center font-mono font-bold">
                  🌍
                </div>
                <h3 className="text-white font-mono font-semibold">Location</h3>
                <p className="text-gray-400 font-mono text-sm">Available worldwide</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;