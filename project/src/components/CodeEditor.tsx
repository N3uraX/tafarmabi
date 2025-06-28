import React from 'react';
import { motion } from 'framer-motion';
import { Folder, File, Terminal, Play } from 'lucide-react';

const CodeEditor = () => {
  const pythonCode = `import torch
import torch.nn as nn
from torchvision import transforms
import cv2
import numpy as np

class ObjectDetector:
    def __init__(self, model_path):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = self.load_model(model_path)
        self.transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((640, 640)),
            transforms.ToTensor(),
        ])
    
    def load_model(self, path):
        """Load YOLOv8 model for object detection"""
        model = torch.hub.load('ultralytics/yolov5', 'custom', path)
        model.to(self.device)
        return model
    
    def detect_objects(self, frame):
        """Detect objects in video frame"""
        results = self.model(frame)
        detections = results.pandas().xyxy[0]
        return self.process_detections(detections)
    
    def process_detections(self, detections):
        """Process and filter detections"""
        filtered = detections[detections['confidence'] > 0.5]
        return filtered[['xmin', 'ymin', 'xmax', 'ymax', 'class', 'confidence']]

# Initialize detector for drone footage analysis
detector = ObjectDetector('models/traffic_detection.pt')`;

  const terminalOutput = [
    '$ python traffic_analyzer.py --input drone_footage.mp4',
    '✓ Loading YOLOv8 model...',
    '✓ CUDA device detected: Tesla V100',
    '✓ Processing video frames...',
    '',
    '🎯 Detection Results:',
    '  - Cars detected: 47',
    '  - Trucks detected: 12', 
    '  - Pedestrians detected: 23',
    '',
    '📊 Traffic Analysis:',
    '  - Peak traffic: 14:30-15:00',
    '  - Average speed: 35 km/h',
    '  - Congestion level: Medium',
    '',
    '💾 Saving results to output/',
    '✓ Generated visualization video',
    '✓ Exported tracking data (CSV)',
    '✓ Created heatmap analysis',
    '',
    '🚀 Analysis complete!',
    '   View results: ./output/analysis.mp4',
  ];

  return (
    <div className="relative w-full">
      {/* Main Editor Window */}
      <motion.div
        className="bg-code-bg border border-code-border rounded-lg overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Editor Header */}
        <div className="flex items-center justify-between bg-dark-card border-b border-code-border px-3 md:px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-400 text-xs md:text-sm font-mono ml-2 md:ml-4 truncate">
              traffic_analyzer.py
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              className="text-gray-400 hover:text-neon-green transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <Play className="w-3 h-3 md:w-4 md:h-4" />
            </motion.button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* File Explorer - Hidden on mobile, compact on tablet */}
          <div className="hidden md:block w-32 lg:w-48 bg-dark-card border-r border-code-border p-2 lg:p-3">
            <div className="space-y-1 text-xs lg:text-sm font-mono">
              <div className="flex items-center space-x-1 lg:space-x-2 text-gray-300">
                <Folder className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="truncate">ai-projects</span>
              </div>
              <div className="ml-2 lg:ml-4 space-y-1">
                <div className="flex items-center space-x-1 lg:space-x-2 text-gray-400">
                  <Folder className="w-2 h-2 lg:w-3 lg:h-3" />
                  <span className="truncate">models</span>
                </div>
                <div className="flex items-center space-x-1 lg:space-x-2 text-gray-400">
                  <Folder className="w-2 h-2 lg:w-3 lg:h-3" />
                  <span className="truncate">data</span>
                </div>
                <div className="flex items-center space-x-1 lg:space-x-2 text-neon-green">
                  <File className="w-2 h-2 lg:w-3 lg:h-3" />
                  <span className="truncate">traffic_analyzer.py</span>
                </div>
                <div className="flex items-center space-x-1 lg:space-x-2 text-gray-400">
                  <File className="w-2 h-2 lg:w-3 lg:h-3" />
                  <span className="truncate">requirements.txt</span>
                </div>
                <div className="flex items-center space-x-1 lg:space-x-2 text-gray-400">
                  <File className="w-2 h-2 lg:w-3 lg:h-3" />
                  <span className="truncate">config.yaml</span>
                </div>
              </div>
            </div>
          </div>

          {/* Code Content */}
          <div className="flex-1 p-2 md:p-3 lg:p-4 h-48 md:h-64 lg:h-80 overflow-auto">
            <div className="overflow-x-auto">
              <pre className="text-xs md:text-sm lg:text-sm font-mono text-gray-300 leading-relaxed whitespace-pre">
                <code>
                  {pythonCode.split('\n').map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="flex min-w-max"
                    >
                      <span className="text-gray-600 w-6 md:w-8 text-right mr-2 md:mr-4 select-none flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-300 break-all md:break-normal">{line}</span>
                    </motion.div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Terminal Window - Responsive positioning */}
      <motion.div
        className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 w-64 md:w-80 bg-code-bg border border-code-border rounded-lg overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center bg-dark-card border-b border-code-border px-2 md:px-3 py-1.5 md:py-2">
          <Terminal className="w-3 h-3 md:w-4 md:h-4 text-neon-green mr-1 md:mr-2" />
          <span className="text-gray-400 text-xs md:text-sm font-mono">Terminal</span>
        </div>
        <div className="p-2 md:p-3 h-40 md:h-64 overflow-y-auto">
          <div className="space-y-0.5 md:space-y-1 text-xs font-mono">
            {terminalOutput.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`break-words ${
                  line.startsWith('$') ? 'text-neon-green' :
                  line.startsWith('✓') ? 'text-green-400' :
                  line.startsWith('🎯') || line.startsWith('📊') || line.startsWith('💾') || line.startsWith('🚀') ? 'text-yellow-400' :
                  'text-gray-300'
                }`}
              >
                {line}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CodeEditor;