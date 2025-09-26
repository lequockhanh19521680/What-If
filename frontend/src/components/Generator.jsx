import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import apiService from '../services/api';

const Generator = ({ onProjectGenerated }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState('');

  const generationSteps = [
    { key: 'analyzing', duration: 2000 },
    { key: 'creating', duration: 3000 },
    { key: 'images', duration: 15000 },
    { key: 'video', duration: 8000 },
    { key: 'finishing', duration: 2000 }
  ];

  const simulateProgress = () => {
    let stepIndex = 0;
    const nextStep = () => {
      if (stepIndex < generationSteps.length) {
        const step = generationSteps[stepIndex];
        setCurrentStep(t(`generator.steps.${step.key}`));
        setTimeout(nextStep, step.duration);
        stepIndex++;
      }
    };
    nextStep();
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError('');
    simulateProgress();

    try {
      const result = await apiService.generateContent(
        prompt,
        i18n.language,
        user?.userId
      );

      if (result.success) {
        onProjectGenerated(result.project);
      } else {
        throw new Error(result.message || 'Generation failed');
      }
    } catch (err) {
      console.error('Generation error:', err);
      
      if (err.message === 'AUTH_REQUIRED') {
        setError(t('auth.freeLimit'));
      } else {
        setError(err.message || t('errors.generation'));
      }
    } finally {
      setIsGenerating(false);
      setCurrentStep('');
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
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholder}
              className="input-field h-32 resize-none"
              disabled={isGenerating}
            />
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
              className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4 disabled:opacity-50"
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

          {/* Progress indicator */}
          {isGenerating && (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
              </div>
              <p className="text-gray-700 font-medium">{currentStep}</p>
              <div className="mt-4 bg-gray-200 rounded-full h-2">
                <div className="gradient-bg h-2 rounded-full transition-all duration-1000 animate-pulse-slow w-1/2"></div>
              </div>
            </div>
          )}

          {/* Usage info for non-authenticated users */}
          {!user && !isGenerating && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-800 text-sm">
                Free users get 5 generations. 
                <button className="font-medium underline ml-1">
                  Sign in for unlimited access
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Generator;