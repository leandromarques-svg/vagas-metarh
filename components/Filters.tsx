
import React, { useState, useRef, useEffect } from 'react';
import { JobFilterState } from '../types';
import { Search, MapPin, Briefcase, ChevronDown, Check, Hash } from 'lucide-react';

interface FiltersProps {
  filters: JobFilterState;
  setFilters: React.Dispatch<React.SetStateAction<JobFilterState>>;
  locations: string[];
  departments: string[];
}

// Custom Select Component to replace native Select and avoid default blue highlight
interface CustomSelectProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  defaultText: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, icon, value, options, onChange, defaultText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-full pl-11 pr-10 py-3 border rounded-full text-left transition-all focus:outline-none
            ${isOpen 
              ? 'border-[#aa3ffe] ring-2 ring-[#aa3ffe] bg-white shadow-md' 
              : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-brand-300'
            }
          `}
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {icon}
          </div>
          <span className={`block truncate ${value ? 'text-slate-900 font-medium' : 'text-slate-700'}`}>
            {value || defaultText}
          </span>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#aa3ffe]' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 max-h-64 overflow-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
            <ul className="py-2">
              <li 
                onClick={() => handleSelect('')}
                className={`px-4 py-2.5 cursor-pointer flex items-center justify-between text-sm transition-colors
                  ${value === '' 
                    ? 'bg-brand-50 text-brand-700 font-bold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-brand-600'
                  }
                `}
              >
                <span>{defaultText}</span>
                {value === '' && <Check className="w-4 h-4 text-brand-600" />}
              </li>
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`px-4 py-2.5 cursor-pointer flex items-center justify-between text-sm transition-colors
                    ${value === option 
                      ? 'bg-brand-50 text-brand-700 font-bold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-brand-600'
                    }
                  `}
                >
                  <span className="truncate">{option}</span>
                  {value === option && <Check className="w-4 h-4 text-brand-600" />}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export const Filters: React.FC<FiltersProps> = ({ filters, setFilters, locations, departments }) => {
  
  const handleChange = (field: keyof JobFilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
        
        {/* Top Row: Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          {/* Keyword Search - Increased span to 4 */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">O que busca?</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-brand-400" />
              </div>
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => handleChange('keyword', e.target.value)}
                placeholder="Analista, Vendas..."
                className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-full bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#aa3ffe] focus:border-[#aa3ffe] transition-all"
              />
            </div>
          </div>

          {/* Job Code Filter - Reduced span to 1 */}
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Cód. Vaga</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-4 w-4 text-brand-400" />
              </div>
              <input
                type="text"
                value={filters.jobCode}
                onChange={(e) => handleChange('jobCode', e.target.value)}
                placeholder="#"
                className="block w-full pl-9 pr-2 py-3 border border-slate-200 rounded-full bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#aa3ffe] focus:border-[#aa3ffe] transition-all"
              />
            </div>
          </div>

          {/* Location Filter - Custom Select */}
          <div className="md:col-span-3">
            <CustomSelect 
                label="Localização"
                icon={<MapPin className="h-5 w-5 text-brand-400" />}
                value={filters.location}
                options={locations}
                onChange={(val) => handleChange('location', val)}
                defaultText="Todas as cidades"
            />
          </div>

          {/* Department Filter - Custom Select */}
          <div className="md:col-span-3">
            <CustomSelect 
                label="Departamento"
                icon={<Briefcase className="h-5 w-5 text-brand-400" />}
                value={filters.department}
                options={departments}
                onChange={(val) => handleChange('department', val)}
                defaultText="Todos"
            />
          </div>
          
          {/* Clear Filters Mobile/Small Button */}
          <div className="md:col-span-1 flex justify-end">
             <button 
               onClick={() => setFilters({ keyword: '', location: '', department: '', jobCode: '' })}
               className="p-3 rounded-full text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
               title="Limpar filtros"
             >
               <Search className="w-5 h-5 md:hidden" />
               <span className="hidden md:block text-xs font-bold uppercase tracking-wide text-center">Limpar</span>
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};
