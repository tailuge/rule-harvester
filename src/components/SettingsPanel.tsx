
import React, { useState, useEffect } from 'react';
import { X, Lock, Unlock, Save } from 'lucide-react';
import { localStorageService } from '../utils/localStorageService';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(localStorageService.getApiKey());
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorageService.saveApiKey(apiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div 
      className={`settings-panel ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      aria-hidden={!isOpen}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">
            Azure LLM API Key
          </label>
          
          <div className="relative">
            <input
              type={isVisible ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="input-field pr-10"
              placeholder="Enter your API key"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide API key" : "Show API key"}
            >
              {isVisible ? <Lock size={16} /> : <Unlock size={16} />}
            </button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Your API key is stored securely in your browser's local storage.
          </p>
          
          <button
            onClick={handleSave}
            className="btn-primary flex items-center justify-center w-full"
          >
            <Save size={16} className="mr-2" />
            {isSaved ? "Saved!" : "Save API Key"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
