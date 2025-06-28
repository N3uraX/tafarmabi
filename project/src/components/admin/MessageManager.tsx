import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Trash2, Calendar, User, MessageSquare, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

const MessageManager = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessages(messages.filter(message => message.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-neon-green font-mono">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white font-mono">Contact Messages</h2>
        <div className="text-sm text-gray-400 font-mono">
          {messages.length} total messages
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-mono">No messages yet.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-dark-card border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  selectedMessage?.id === message.id
                    ? 'border-neon-green/50 bg-neon-green/5'
                    : 'border-dark-border hover:border-gray-600'
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-mono font-semibold mb-1">
                      {message.name}
                    </h3>
                    <p className="text-gray-400 font-mono text-sm">
                      {message.email}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 font-mono">
                      {formatDate(message.created_at)}
                    </span>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(message.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                
                {message.subject && (
                  <p className="text-neon-green font-mono text-sm mb-2">
                    Subject: {message.subject}
                  </p>
                )}
                
                <p className="text-gray-400 font-mono text-sm line-clamp-2">
                  {message.message}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Message Detail */}
          <div className="lg:sticky lg:top-6">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-dark-card border border-dark-border rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white font-mono mb-2">
                      {selectedMessage.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 font-mono">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{selectedMessage.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(selectedMessage.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <motion.a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`}
                      className="p-2 text-gray-400 hover:text-neon-green transition-colors"
                      whileHover={{ scale: 1.1 }}
                      title="Reply via email"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                    <motion.button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {selectedMessage.subject && (
                  <div className="mb-4">
                    <h4 className="text-sm font-mono text-gray-300 mb-1">Subject:</h4>
                    <p className="text-neon-green font-mono">{selectedMessage.subject}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-mono text-gray-300 mb-3 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message:
                  </h4>
                  <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                    <p className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-dark-border">
                  <motion.a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}&body=Hi ${selectedMessage.name},%0D%0A%0D%0AThank you for reaching out!%0D%0A%0D%0ABest regards,%0D%0ATafar M`}
                    className="inline-flex items-center space-x-2 bg-neon-green text-black px-4 py-2 rounded-lg font-mono font-semibold hover:bg-neon-green/90 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Reply</span>
                  </motion.a>
                </div>
              </motion.div>
            ) : (
              <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-mono">
                  Select a message to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageManager;