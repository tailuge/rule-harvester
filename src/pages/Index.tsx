
import React, { useState, useRef } from 'react';
import { Settings, Download, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import TextInput from '../components/TextInput';
import RuleCard from '../components/RuleCard';
import SettingsPanel from '../components/SettingsPanel';
import ProgressBar from '../components/ProgressBar';
import { llmService, Rule } from '../utils/llmService';

const Index: React.FC = () => {
  const { toast } = useToast();
  const [documentText, setDocumentText] = useState('');
  const [rules, setRules] = useState<Rule[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // References to track processing state
  const paragraphsRef = useRef<string[]>([]);
  const currentIndexRef = useRef(0);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const splitIntoParagraphs = (text: string): string[] => {
    // Split by double newlines to separate paragraphs
    return text
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
  };

  const extractNextRule = async () => {
    try {
      // Initialize paragraphs if it's the first extraction
      if (currentIndexRef.current === 0) {
        paragraphsRef.current = splitIntoParagraphs(documentText);
        
        if (paragraphsRef.current.length === 0) {
          toast({
            title: "No text to process",
            description: "Please enter some text to extract rules from.",
            variant: "destructive"
          });
          return;
        }
      }
      
      if (currentIndexRef.current >= paragraphsRef.current.length) {
        toast({
          title: "Processing complete",
          description: "All paragraphs have been processed."
        });
        return;
      }
      
      setIsProcessing(true);
      
      const paragraph = paragraphsRef.current[currentIndexRef.current];
      const rule = await llmService.extractRule(paragraph);
      
      // Only add the rule if it's not "No rule found"
      if (rule.title !== "No rule found") {
        setRules(prevRules => [...prevRules, rule]);
      }
      
      // Update progress
      currentIndexRef.current += 1;
      const newProgress = (currentIndexRef.current / paragraphsRef.current.length) * 100;
      setProgress(newProgress);
      
    } catch (error) {
      console.error("Error extracting rule:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to extract rule",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const deleteRule = (id: string) => {
    setRules(prevRules => prevRules.filter(rule => rule.id !== id));
  };
  
  const exportRules = () => {
    if (rules.length === 0) {
      toast({
        title: "Nothing to export",
        description: "There are no rules to export.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create a clean version of the rules for export (without ids)
      const exportData = rules.map(({ title, description }) => ({ title, description }));
      const json = JSON.stringify(exportData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `rules-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: `${rules.length} rules exported successfully.`
      });
    } catch (error) {
      console.error("Error exporting rules:", error);
      toast({
        title: "Export failed",
        description: "Failed to export rules.",
        variant: "destructive"
      });
    }
  };
  
  const resetProcess = () => {
    currentIndexRef.current = 0;
    paragraphsRef.current = [];
    setProgress(0);
    setRules([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border py-4 px-6 bg-card">
        <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Rule Harvester</h1>
          <button 
            onClick={toggleSettings}
            className="btn-ghost flex items-center"
            aria-label="Open settings"
          >
            <Settings size={18} className="mr-2" />
            Settings
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 py-8 px-6">
        <div className="max-w-5xl mx-auto w-full space-y-8">
          <section className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-medium">Document Text</h2>
            <p className="text-muted-foreground">
              Enter your policy document text below. Each paragraph will be processed separately to extract rules.
            </p>
            <TextInput 
              value={documentText}
              onChange={(value) => {
                setDocumentText(value);
                resetProcess();
              }}
              placeholder="Paste your policy document here..."
              disabled={isProcessing}
            />
          </section>
          
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Processing</h2>
              <div className="text-sm text-muted-foreground">
                {progress > 0 && progress < 100 ? 
                  `${Math.round(progress)}% complete` : 
                  progress === 100 ? 
                    "Processing complete" : 
                    "Not started"
                }
              </div>
            </div>
            <ProgressBar progress={progress} />
            <div className="flex gap-3">
              <button
                onClick={extractNextRule}
                disabled={isProcessing || !documentText}
                className="btn-primary flex items-center"
              >
                <ArrowRight size={18} className="mr-2" />
                Extract Next Rule
              </button>
              <button
                onClick={exportRules}
                disabled={rules.length === 0}
                className="btn-secondary flex items-center"
              >
                <Download size={18} className="mr-2" />
                Export All
              </button>
            </div>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-medium">Extracted Rules {rules.length > 0 && `(${rules.length})`}</h2>
            {rules.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground bg-card rounded-lg border border-border">
                No rules extracted yet. Click "Extract Next Rule" to begin.
              </div>
            ) : (
              <div className="space-y-4">
                {rules.map(rule => (
                  <RuleCard 
                    key={rule.id} 
                    rule={rule} 
                    onDelete={deleteRule} 
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border py-4 px-6 text-center text-muted-foreground text-sm">
        <div className="max-w-5xl mx-auto">
          <p>Rule Harvester - Policy Rule Extraction Tool</p>
        </div>
      </footer>
      
      {/* Settings panel */}
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
      
      {/* Overlay when settings panel is open */}
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 z-40 animate-fade-in sm:hidden"
          onClick={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;
