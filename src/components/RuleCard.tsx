
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Rule } from '../utils/llmService';

interface RuleCardProps {
  rule: Rule;
  onDelete: (id: string) => void;
}

const RuleCard: React.FC<RuleCardProps> = ({ rule, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="rule-card animate-slide-in">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center">
            <button
              onClick={toggleExpanded}
              className="mr-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={isExpanded ? "Collapse rule" : "Expand rule"}
            >
              {isExpanded ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            <h3 className="font-medium text-lg">{rule.title}</h3>
          </div>
        </div>
        <button
          onClick={() => onDelete(rule.id)}
          className="text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Delete rule"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-border text-muted-foreground animate-fade-in">
          {rule.description}
        </div>
      )}
    </div>
  );
};

export default RuleCard;
