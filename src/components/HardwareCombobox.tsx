'use client';

import { useState, useRef, useEffect, useId, useMemo } from 'react';
import { Search, ChevronDown, Check, X, Cpu, HardDrive } from 'lucide-react';

export interface ComboboxOption {
  id: string;
  name: string;
  brand: string;
  secondaryInfo: string;
  score: number;
  highlight?: boolean;
}

interface HardwareComboboxProps {
  label: string;
  options: ComboboxOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  placeholder?: string;
  typeIcon?: 'gpu' | 'cpu';
  compact?: boolean;
}

export function HardwareCombobox({
  label,
  options,
  selectedId,
  onSelect,
  placeholder = 'Search component...',
  typeIcon = 'gpu',
  compact = false,
}: HardwareComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const selectedOption = useMemo(
    () => options.find((opt) => opt.id === selectedId) || options[0],
    [options, selectedId]
  );

  // Filter options based on query
  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const lower = query.toLowerCase().trim();
    return options.filter(
      (opt) =>
        opt.name.toLowerCase().includes(lower) ||
        opt.brand.toLowerCase().includes(lower) ||
        opt.secondaryInfo.toLowerCase().includes(lower)
    );
  }, [options, query]);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && listRef.current) {
      const activeElement = listRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, activeIndex]);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSelect = (option: ComboboxOption) => {
    onSelect(option.id);
    setIsOpen(false);
    setQuery('');
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
          handleSelect(filteredOptions[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setQuery('');
        break;
      case 'Tab':
        setIsOpen(false);
        setQuery('');
        break;
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className={compact ? 'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-white/75' : 'block text-xs font-medium text-content-secondary mb-1.5'}>
        {label}
      </label>

      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        title={compact ? selectedOption?.name : undefined}
        className={
          compact
            ? 'flex min-h-11 w-full items-center justify-between gap-3 rounded-md border border-white/15 bg-black/50 px-3 py-2 text-left hover:border-white/30'
            : 'w-full min-h-[48px] px-3.5 py-2.5 rounded-lg bg-surface-elevated border border-border-subtle hover:border-border-medium focus:border-border-focus focus:outline-none flex items-center justify-between gap-3 text-left transition-colors duration-fast btn-interactive'
        }
      >
        <div className={compact ? 'min-w-0 flex-1' : 'flex items-center gap-2.5 truncate'}>
          {!compact && (
            <div className="w-6 h-6 rounded bg-surface flex items-center justify-center shrink-0 text-accent-teal border border-border-subtle">
              {typeIcon === 'gpu' ? (
                <HardDrive className="w-3.5 h-3.5" />
              ) : (
                <Cpu className="w-3.5 h-3.5" />
              )}
            </div>
          )}
          <div className={compact ? 'min-w-0' : 'flex flex-col truncate'}>
            <span className={compact ? 'block truncate text-sm font-semibold text-white' : 'text-sm font-semibold text-content-primary truncate'}>
              {selectedOption ? (compact ? selectedOption.name.replace(/\s*\([^)]*\)\s*$/, '') : selectedOption.name) : placeholder}
            </span>
            {selectedOption && !compact && (
              <span className="text-[11px] font-mono text-content-secondary tabular-nums">
                {selectedOption.secondaryInfo}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {selectedOption && !compact && (
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded tabular-nums ${
                selectedOption.highlight
                  ? 'bg-accent-teal/15 text-accent-teal border border-accent-teal/30'
                  : 'bg-surface text-content-secondary border border-border-subtle'
              }`}
            >
              {selectedOption.score}
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-fast ${
              compact
                ? isOpen
                  ? 'rotate-180 text-[#3ec6ff]'
                  : 'text-white/60'
                : isOpen
                  ? 'rotate-180 text-accent-teal'
                  : 'text-content-muted'
            }`}
          />
        </div>
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div
          className={`absolute z-50 left-0 right-0 mt-1.5 p-2 rounded-xl border shadow-surface-subtle origin-top ${
            compact ? 'border-white/15 bg-[#0c121c]' : 'bg-surface border-border-medium'
          }`}
          style={{
            animationDuration: '160ms',
            animationTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {/* Live Search Input */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-surface-elevated border border-border-subtle text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-border-focus font-sans"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Options Listbox */}
          <ul
            id={listboxId}
            ref={listRef}
            role="listbox"
            className="max-h-60 overflow-y-auto space-y-1 pr-1 focus:outline-none custom-scrollbar"
          >
            {filteredOptions.length === 0 ? (
              <li className="p-3 text-center text-xs text-content-muted font-mono">
                No matching hardware found
              </li>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = option.id === selectedId;
                const isActive = index === activeIndex;

                return (
                  <li
                    key={option.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`px-3 py-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors duration-fast ${
                      isActive || isSelected
                        ? 'bg-surface-elevated text-content-primary'
                        : 'text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className={`w-3.5 h-3.5 flex items-center justify-center shrink-0 ${
                          isSelected ? 'text-accent-teal' : 'text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col truncate">
                        <span
                          className={`font-medium truncate ${
                            isSelected ? 'text-accent-teal font-semibold' : ''
                          }`}
                        >
                          {option.name}
                        </span>
                        <span className="text-[10px] font-mono text-content-muted tabular-nums">
                          {option.secondaryInfo}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {option.highlight && typeIcon === 'cpu' && (
                        <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-teal/15 text-accent-teal border border-accent-teal/20">
                          3D V-Cache
                        </span>
                      )}
                      <span className="font-mono text-[11px] font-semibold text-content-muted tabular-nums">
                        {option.score}
                      </span>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
