import React, { useState, useEffect } from 'react';
import { Search, X, Check, ChevronDown, Minus } from 'lucide-react';

const SkillSelector = ({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Search skills...',
  maxDisplay = 6,
  emptyMessage = 'No options available for this department',
  allowNone = false,
  noneLabel = 'None / No skills yet',
  required = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasSelectedNone, setHasSelectedNone] = useState(false);

  // Check if "None" is selected
  useEffect(() => {
    if (selected.includes('__NONE__')) {
      setHasSelectedNone(true);
    } else {
      setHasSelectedNone(false);
    }
  }, [selected]);

  // Filter options based on search
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle selection
  const toggleSelection = (item) => {
    if (item === '__NONE__') {
      // If "None" is selected, clear all selections and select None
      if (hasSelectedNone) {
        onChange([]);
        setHasSelectedNone(false);
      } else {
        onChange(['__NONE__']);
        setHasSelectedNone(true);
      }
      return;
    }

    // If "None" is currently selected, remove it when selecting a real skill
    let newSelection = [...selected];
    if (hasSelectedNone) {
      newSelection = newSelection.filter(s => s !== '__NONE__');
      setHasSelectedNone(false);
    }

    if (newSelection.includes(item)) {
      onChange(newSelection.filter(s => s !== item));
    } else {
      onChange([...newSelection, item]);
    }
  };

  // Clear all selections
  const clearAll = () => {
    onChange([]);
    setHasSelectedNone(false);
  };

  // Get display items
  const getDisplayItems = () => {
    if (isExpanded || searchTerm) {
      return filteredOptions;
    }
    const selectedItems = selected.filter(s => options.includes(s));
    const remaining = options.filter(o => !selected.includes(o));
    const display = [...selectedItems, ...remaining];
    return display.slice(0, maxDisplay);
  };

  const displayItems = getDisplayItems();
  const noneSelected = hasSelectedNone;

  // Get selected skills (excluding __NONE__)
  const selectedSkills = selected.filter(s => s !== '__NONE__');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-primary-dark">
          {label}
          {!required && (
            <span className="text-xs text-text-muted ml-2">
              ({selectedSkills.length} selected)
            </span>
          )}
          {required && selectedSkills.length === 0 && !noneSelected && (
            <span className="text-xs text-status-error ml-2">* Required</span>
          )}
        </label>
        {(selectedSkills.length > 0 || noneSelected) && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-status-error hover:text-status-error/80 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Selected Skills Tags - Show "None" if selected */}
      {noneSelected ? (
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-text-muted/10 text-text-muted text-sm rounded-full">
            <Minus className="w-3.5 h-3.5" />
            {noneLabel}
            <button
              type="button"
              onClick={() => clearAll()}
              className="hover:text-status-error transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        </div>
      ) : selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary-dark text-sm rounded-full"
            >
              {skill}
              <button
                type="button"
                onClick={() => toggleSelection(skill)}
                className="hover:text-status-error transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Input - Hide if None is selected */}
      {!noneSelected && options.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
            onFocus={() => setIsExpanded(true)}
          />
        </div>
      )}

      {/* Skills Grid - Hide if None is selected */}
      {!noneSelected && options.length > 0 && (
        <div className="relative">
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((skill) => {
                const isSelected = selected.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSelection(skill)}
                    className={`
                      px-3 py-1.5 text-sm rounded-full transition-all
                      ${isSelected
                        ? 'bg-primary text-white hover:bg-primary-dark'
                        : 'bg-background-light text-text-secondary hover:bg-primary-light/20 hover:text-primary-dark'
                      }
                      border ${isSelected ? 'border-primary' : 'border-transparent'}
                    `}
                  >
                    <span className="flex items-center gap-1.5">
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      {skill}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="w-full text-center py-4 text-sm text-text-muted">
                No matching skills found
              </div>
            )}
          </div>

          {/* Show more/less toggle */}
          {options.length > maxDisplay && !searchTerm && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
            >
              {isExpanded ? 'Show less' : `Show ${options.length - maxDisplay} more`}
              <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      )}

      {/* None Option - Only show if allowNone is true */}
      {allowNone && !noneSelected && options.length > 0 && (
        <button
          type="button"
          onClick={() => toggleSelection('__NONE__')}
          className="w-full py-2 text-sm text-text-muted hover:text-primary-dark hover:bg-background-light rounded-lg border border-dashed border-border-light transition-all flex items-center justify-center gap-2"
        >
          <Minus className="w-4 h-4" />
          {noneLabel}
        </button>
      )}

      {/* Empty state when no options */}
      {options.length === 0 && (
        <div className="text-center py-4 text-sm text-text-muted bg-background-light rounded-lg">
          {emptyMessage}
        </div>
      )}

      {/* Counter - Hide if None is selected */}
      {!noneSelected && (
        <div className="text-xs text-text-muted">
          {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
        </div>
      )}
      {noneSelected && (
        <div className="text-xs text-text-muted">
          No skills selected - you'll be learning from scratch
        </div>
      )}
    </div>
  );
};

export default SkillSelector;