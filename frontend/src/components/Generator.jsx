import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  Brain,
  Image,
  Video,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import apiService from '../services/api';

const Generator = ({ onProjectGenerated, onAuthRequired }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepOutput, setStepOutput] = useState({});
  const [error, setError] = useState('');

  const generationSteps = [
    { 
      key: 'analyzing', 
      icon: Brain,
      title: 'AI Analysis',
      description: 'Analyzing your hypothesis with scientific reasoning',
      duration: 3000 
    },
    { 
      key: 'creating', 
      icon: Sparkles,
      title: 'Scenario Creation',
      description: 'Generating detailed scenario and storyline',
      duration: 4000 
    },
    { 
      key: 'images', 
      icon: Image,
      title: 'Visual Content',
      description: 'Creating concept art with Stable Diffusion',
      duration: 15000 
    },
    { 
      key: 'video', 
      icon: Video,
      title: 'Video Production',
      description: 'Combining images into engaging slideshow',
      duration: 8000 
    },
    { 
      key: 'finishing', 
      icon: CheckCircle,
      title: 'Finalizing',
      description: 'Saving and preparing your project',
      duration: 2000 
    }
  ];

  const simulateProgress = () => {
    let stepIndex = 0;
    setCurrentStep(0);
    setStepOutput({});
    
    const nextStep = () => {
      if (stepIndex < generationSteps.length) {
        setCurrentStep(stepIndex);
        
        // Simulate step completion with mock output
        setTimeout(() => {
          const step = generationSteps[stepIndex];
          setStepOutput(prev => ({
            ...prev,
            [stepIndex]: {
              completed: true,
              output: getStepOutput(step.key),
              timestamp: new Date().toLocaleTimeString()
            }
          }));
          
          stepIndex++;
          if (stepIndex < generationSteps.length) {
            setTimeout(nextStep, 500); // Small delay before next step
          }
        }, step.duration);
      }
    };
    
    nextStep();
  };

  const getStepOutput = (stepKey) => {
    switch (stepKey) {
      case 'analyzing':
        return 'Scientific framework identified • Key variables analyzed • Hypothesis validated';
      case 'creating':
        return 'Narrative structure complete • 4 key scenes outlined • Scientific accuracy verified';
      case 'images':
        return '4 concept art images generated • Style consistency maintained • High resolution output';
      case 'video':
        return 'MP4 slideshow created • Smooth transitions applied • Optimized for sharing';
      case 'finishing':
        return 'Project saved • Metadata generated • Ready for sharing';
      default:
        return 'Processing complete';
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError('');
    setCurrentStep(0);
    setStepOutput({});
    simulateProgress();

    try {
      const result = await apiService.generateContent(
        prompt,
        null, // Let backend auto-detect language
        user?.userId
      );

      if (result.success) {
        // Mark all steps as completed
        const completedSteps = {};
        generationSteps.forEach((_, index) => {
          completedSteps[index] = {
            completed: true,
            output: getStepOutput(generationSteps[index].key),
            timestamp: new Date().toLocaleTimeString()
          };
        });
        setStepOutput(completedSteps);
        setCurrentStep(generationSteps.length);
        
        setTimeout(() => {
          onProjectGenerated(result.project);
        }, 1000);
      } else {
        throw new Error(result.message || 'Generation failed');
      }
    } catch (err) {
      console.error('Generation error:', err);
      
      if (err.message === 'AUTH_REQUIRED') {
        setError(t('auth.freeLimit'));
        onAuthRequired && onAuthRequired();
      } else {
        setError(err.message || t('errors.generation'));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const placeholder = i18n.language === 'vi' 
    ? t('generator.placeholder')
    : t('generator.placeholderVi');

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="card p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('generator.title')}
          </h2>
          <p className="text-gray-600">
            {t('app.tagline')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Input area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Creative Hypothesis
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholder}
              className="input-field h-32 resize-none"
              disabled={isGenerating}
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Be specific! Include context, timeframes, or conditions for better results.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Generate button */}
          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t('generator.generating')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{t('generator.generate')}</span>
                </>
              )}
            </button>
          </div>

          {/* Detailed Progress Display */}
          {isGenerating && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Creating Your Content
                </h3>
                <p className="text-gray-600 text-sm">
                  Please wait while our AI generates your scenario...
                </p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-4">
                {generationSteps.map((step, index) => {
                  const isActive = currentStep === index;
                  const isCompleted = stepOutput[index]?.completed;
                  const isPending = index > currentStep;
                  
                  return (
                    <div 
                      key={index} 
                      className={`card p-4 transition-all duration-500 ${
                        isActive ? 'ring-2 ring-blue-500 bg-white' : 
                        isCompleted ? 'bg-green-50 border-green-200' :
                        'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Step Icon */}
                        <div className={`p-2 rounded-lg transition-colors ${
                          isActive ? 'bg-blue-500 text-white' :
                          isCompleted ? 'bg-green-500 text-white' :
                          'bg-gray-300 text-gray-600'
                        }`}>
                          {isActive ? (
                            <Loader2 size={20} className="animate-spin" />
                          ) : isCompleted ? (
                            <CheckCircle size={20} />
                          ) : (
                            <step.icon size={20} />
                          )}
                        </div>
                        
                        {/* Step Info */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${
                              isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {step.title}
                            </h4>
                            {isCompleted && (
                              <div className="flex items-center space-x-1 text-green-600 text-xs">
                                <Clock size={12} />
                                <span>{stepOutput[index]?.timestamp}</span>
                              </div>
                            )}
                          </div>
                          <p className={`text-sm ${
                            isActive || isCompleted ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {step.description}
                          </p>
                          
                          {/* Step Output */}
                          {isCompleted && stepOutput[index]?.output && (
                            <div className="mt-2 text-xs text-green-700 bg-green-100 p-2 rounded">
                              ✓ {stepOutput[index].output}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress bar for active step */}
                      {isActive && (
                        <div className="mt-3 bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 animate-pulse-slow w-3/4"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Overall Progress */}
              <div className="mt-6 text-center">
                <div className="text-sm text-gray-600 mb-2">
                  Overall Progress: {Math.round((Object.keys(stepOutput).length / generationSteps.length) * 100)}%
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(Object.keys(stepOutput).length / generationSteps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Usage info for non-authenticated users */}
          {!user && !isGenerating && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Free Trial Available</h4>
                <p className="text-blue-800 text-sm mb-3">
                  Try 5 generations for free! No credit card required.
                </p>
                <button 
                  onClick={onAuthRequired}
                  className="text-blue-600 font-medium text-sm underline hover:text-blue-700"
                >
                  Sign up for unlimited access →
                </button>
              </div>
            </div>
          )}

          {/* Feature highlights */}
          {!isGenerating && (
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 text-sm">AI Analysis</h4>
                <p className="text-xs text-gray-600">Scientific reasoning</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Image className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 text-sm">Visual Content</h4>
                <p className="text-xs text-gray-600">4 concept art images</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Video className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 text-sm">Video Export</h4>
                <p className="text-xs text-gray-600">MP4 slideshow</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Generator;