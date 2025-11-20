import React, { useEffect } from 'react';
import { SelectyJobResponse } from '../types';
import { X, MapPin, Briefcase, Clock, ExternalLink, Building2, Hash } from 'lucide-react';

interface JobModalProps {
  job: SelectyJobResponse;
  onClose: () => void;
}

export const JobModal: React.FC<JobModalProps> = ({ job, onClose }) => {
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Fundo com desfoque extremamente sutil (1px) e leve clareada (white/10) */}
      <div 
        className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl shrink-0">
          <div className="w-full pr-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-block px-3 py-1 bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wide rounded-full">
                {job.department || 'Geral'}
                </span>
                <span className="inline-flex items-center px-2 py-1 text-slate-400 text-xs font-mono border border-slate-200 rounded-full bg-white">
                    <Hash className="w-3 h-3 mr-1" />
                    {job.id}
                </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-4">{job.title}</h2>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-600 font-medium">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1.5 text-brand-500" />
                {job.remote ? 'Trabalho Remoto' : `${job.city}, ${job.state}`}
              </div>
              {job.contract_type && (
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-1.5 text-brand-500" />
                  {job.contract_type}
                </div>
              )}
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-brand-500" />
                {new Date(job.published_at || Date.now()).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 gap-8">
            
            {/* Descrição da Vaga */}
            <div className="prose prose-slate prose-brand max-w-none">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-brand-600" />
                Sobre a vaga
                </h3>
                
                <div 
                className="text-slate-600 leading-relaxed 
                            [&>p]:mb-4 [&>p]:leading-7 
                            [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:pl-5 
                            [&>ol]:mb-6 [&>ol]:list-decimal [&>ol]:pl-5 
                            [&>li]:mb-2 [&>li]:pl-1
                            [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:uppercase [&>h3]:tracking-wide [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:border-b [&>h3]:border-slate-100 [&>h3]:pb-2
                            [&>strong]:text-slate-900 [&>strong]:font-bold
                            [&>br]:content-[''] [&>br]:block [&>br]:my-1"
                dangerouslySetInnerHTML={{ __html: job.description }}
                />
                
                {!job.description && (
                <p className="text-slate-500 italic">
                    Nenhuma descrição detalhada disponível para esta vaga.
                </p>
                )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex flex-col sm:flex-row justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full border border-slate-300 text-slate-700 font-bold hover:bg-white hover:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all order-2 sm:order-1"
          >
            Fechar
          </button>
          
          <a
            href={job.url_apply || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-8 py-3 rounded-full bg-brand-600 text-white font-bold shadow-md hover:bg-brand-700 hover:shadow-lg transform active:scale-95 transition-all order-1 sm:order-2 w-full sm:w-auto"
          >
            Candidatar-se
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};