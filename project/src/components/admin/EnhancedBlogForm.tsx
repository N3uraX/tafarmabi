import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Save, X, Eye, Code, Image, Type, List, Quote, Link, Bold, Italic, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MarkdownRenderer from '../MarkdownRenderer';

interface Blog {
  id: string;
  title: string;
  body: string;
  created_at: string;
  tags: string[];
  cover_image_url?: string;
}

interface BlogFormData {
  title: string;
  body: string;
  tags: string;
  cover_image_url: string;
}

interface EnhancedBlogFormProps {
  blog?: Blog | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const EnhancedBlogForm: React.FC<EnhancedBlogFormProps> = ({ blog, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, formState: { errors }, setError, watch, setValue } = useForm<BlogFormData>({
    defaultValues: {
      title: blog?.title || '',
      body: blog?.body || '',
      tags: blog?.tags?.join(', ') || '',
      cover_image_url: blog?.cover_image_url || ''
    }
  });

  const watchedBody = watch('body');
  const watchedCoverImage = watch('cover_image_url');

  const onSubmit = async (data: BlogFormData) => {
    setIsLoading(true);
    try {
      const blogData = {
        title: data.title,
        body: data.body,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        cover_image_url: data.cover_image_url
      };

      if (blog) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', blog.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([blogData]);
        
        if (error) throw error;
      }

      onSuccess();
    } catch (error: any) {
      setError('root', { message: error.message || 'Failed to save blog post' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('cover_image_url', { message: 'Please select an image file' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('cover_image_url', { message: 'Image size must be less than 5MB' });
      return;
    }

    setUploadingImage(true);
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `blog-covers/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      setValue('cover_image_url', publicUrl);
    } catch (error: any) {
      setError('cover_image_url', { message: error.message || 'Failed to upload image' });
    } finally {
      setUploadingImage(false);
    }
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;
    
    const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
    setValue('body', newValue);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const wrapSelection = (before: string, after: string = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;
    const selectedText = currentValue.substring(start, end);
    
    const newText = before + selectedText + after;
    const newValue = currentValue.substring(0, start) + newText + currentValue.substring(end);
    setValue('body', newValue);
    
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start, start + newText.length);
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length);
      }
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: Bold,
      label: 'Bold',
      action: () => wrapSelection('**'),
    },
    {
      icon: Italic,
      label: 'Italic',
      action: () => wrapSelection('*'),
    },
    {
      icon: Code,
      label: 'Inline Code',
      action: () => wrapSelection('`'),
    },
    {
      icon: Type,
      label: 'Heading',
      action: () => insertAtCursor('\n## '),
    },
    {
      icon: List,
      label: 'List',
      action: () => insertAtCursor('\n- '),
    },
    {
      icon: Quote,
      label: 'Quote',
      action: () => insertAtCursor('\n> '),
    },
    {
      icon: Link,
      label: 'Link',
      action: () => insertAtCursor('[link text](https://example.com)'),
    },
    {
      icon: Image,
      label: 'Image',
      action: () => insertAtCursor('![alt text](https://example.com/image.jpg "Optional caption")'),
    },
  ];

  const codeSnippetTemplates = [
    {
      name: 'JavaScript',
      template: '\n```javascript\n// Your JavaScript code here\nconsole.log("Hello, World!");\n```\n'
    },
    {
      name: 'Python',
      template: '\n```python\n# Your Python code here\nprint("Hello, World!")\n```\n'
    },
    {
      name: 'TypeScript',
      template: '\n```typescript\n// Your TypeScript code here\nconst message: string = "Hello, World!";\nconsole.log(message);\n```\n'
    },
    {
      name: 'CSS',
      template: '\n```css\n/* Your CSS code here */\n.example {\n  color: #00FF99;\n}\n```\n'
    },
    {
      name: 'HTML',
      template: '\n```html\n<!-- Your HTML code here -->\n<div class="example">Hello, World!</div>\n```\n'
    },
    {
      name: 'Bash',
      template: '\n```bash\n# Your bash commands here\necho "Hello, World!"\n```\n'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-card border border-dark-border rounded-xl overflow-hidden"
    >
      <div className="flex items-center justify-between p-6 border-b border-dark-border">
        <h3 className="text-xl font-bold text-white font-mono">
          {blog ? 'Edit Blog Post' : 'New Blog Post'}
        </h3>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-mono text-sm transition-colors ${
              showPreview 
                ? 'bg-neon-green text-black' 
                : 'text-gray-400 hover:text-white border border-dark-border hover:border-gray-400'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{showPreview ? 'Edit' : 'Preview'}</span>
          </button>
          <button
            onClick={onCancel}
            title="Cancel"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-mono text-gray-300 mb-2">
            Title
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            type="text"
            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors"
            placeholder="Enter blog post title"
          />
          {errors.title && (
            <p className="text-red-400 text-sm font-mono mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Cover Image Section */}
        <div>
          <label className="block text-sm font-mono text-gray-300 mb-2">
            Cover Image
          </label>
          
          {/* Cover Image Preview */}
          {watchedCoverImage && (
            <div className="mb-4">
              <div className="relative overflow-hidden rounded-lg border border-dark-border">
                <img
                  src={watchedCoverImage}
                  alt="Cover preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {/* URL Input */}
            <div>
              <input
                {...register('cover_image_url')}
                type="url"
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors"
                placeholder="https://example.com/image.jpg"
              />
              {errors.cover_image_url && (
                <p className="text-red-400 text-sm font-mono mt-1">{errors.cover_image_url.message}</p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="cover-image-upload" className="sr-only">Upload cover image</label>
              <input
                id="cover-image-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                title="Upload cover image"
                aria-label="Upload cover image"
              />
              <motion.button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-gray-400 hover:text-neon-green hover:border-neon-green/50 transition-all duration-200 disabled:opacity-50"
                whileHover={{ scale: uploadingImage ? 1 : 1.02 }}
                whileTap={{ scale: uploadingImage ? 1 : 0.98 }}
              >
                {uploadingImage ? (
                  <>
                    <div className="w-4 h-4 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
                    <span className="font-mono text-sm">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span className="font-mono text-sm">Upload Image</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-mono text-gray-300 mb-2">
            Tags (comma-separated)
          </label>
          <input
            {...register('tags')}
            type="text"
            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors"
            placeholder="e.g., AI, Machine Learning, Python"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-mono text-gray-300">
              Content (Markdown)
            </label>
            <div className="flex items-center space-x-2">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    insertAtCursor(e.target.value);
                    e.target.value = '';
                  }
                }}
                aria-label="Insert Code Block"
                className="text-xs bg-dark-bg border border-dark-border rounded px-2 py-1 text-gray-300 font-mono"
              >
                <option value="">Insert Code Block</option>
                {codeSnippetTemplates.map((template) => (
                  <option key={template.name} value={template.template}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 p-2 bg-dark-bg border border-dark-border rounded-t-lg border-b-0">
            {toolbarButtons.map((button) => (
              <motion.button
                key={button.label}
                type="button"
                onClick={button.action}
                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-neon-green hover:bg-dark-card rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={button.label}
              >
                <button.icon className="w-4 h-4" />
              </motion.button>
            ))}
          </div>

          {showPreview ? (
            <div className="min-h-[400px] p-4 bg-dark-bg border border-dark-border rounded-b-lg border-t-0">
              <MarkdownRenderer content={watchedBody || ''} />
            </div>
          ) : (
            <textarea
              {...register('body', { required: 'Content is required' })}
              ref={textareaRef}
              rows={20}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-b-lg border-t-0 text-white font-mono focus:border-neon-green focus:outline-none transition-colors resize-none"
              placeholder="Write your blog post content here using Markdown...

Examples:
# Heading 1
## Heading 2

**Bold text** and *italic text*

```javascript
console.log('Code with syntax highlighting');
```

![Image](https://example.com/image.jpg 'Optional caption')

- List item 1
- List item 2

> Blockquote

[Link text](https://example.com)"
            />
          )}
          {errors.body && (
            <p className="text-red-400 text-sm font-mono mt-1">{errors.body.message}</p>
          )}
        </div>

        {errors.root && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm font-mono">{errors.root.message}</p>
          </div>
        )}

        <div className="flex space-x-4 pt-4 border-t border-dark-border">
          <motion.button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2 bg-neon-green text-black px-6 py-3 rounded-lg font-mono font-semibold hover:bg-neon-green/90 transition-colors disabled:opacity-50"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Saving...' : 'Save Post'}</span>
          </motion.button>
          
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-dark-border text-gray-400 hover:text-white hover:border-gray-400 rounded-lg font-mono transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EnhancedBlogForm;