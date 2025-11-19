import React, { useState, useEffect, useMemo, useRef } from 'react';
import { fetchJobs } from './services/selectyService';
import { SelectyJobResponse, JobFilterState } from './types';
import { JobCard } from './components/JobCard';
import { JobModal } from './components/JobModal';
import { Filters } from './components/Filters';
import { Loader2, Briefcase, CircleAlert, RefreshCw, Plus } from 'lucide-react';

const ITEMS_PER_PAGE = 3;

export default function App() {
  const [jobs, setJobs] = useState<SelectyJobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<SelectyJobResponse | null>(null);
  
  // Ref para a área de scroll principal (conteúdo das vagas)
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Filter State
  const [filters, setFilters] = useState<JobFilterState>({
    keyword: '',
    location: '',
    department: '',
    jobCode: ''
  });

  // Visible Count State (Load More logic)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJobs();
      setJobs(data || []);
    } catch (err: any) {
      console.error("Error loading jobs", err);
      setError(err.message || "Erro desconhecido ao conectar com Selecty");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Reset visible count to initial when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [filters]);

  // Derive unique filter options
  const locations = useMemo(() => {
    const locs = new Set<string>();
    jobs.forEach(job => {
      if(job.remote) locs.add("Trabalho Remoto");
      else if(job.city) locs.add(job.state ? `${job.city} - ${job.state}` : job.city || "Local não informado");
    });
    return Array.from(locs).sort();
  }, [jobs]);

  const departments = useMemo(() => {
    const depts = new Set<string>();
    jobs.forEach(job => {
      if(job.department) depts.add(job.department);
    });
    return Array.from(depts).sort();
  }, [jobs]);

  // Filter logic
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const searchMatch = filters.keyword === '' || 
        job.title.toLowerCase().includes(filters.keyword.toLowerCase()) || 
        (job.summary && job.summary.toLowerCase().includes(filters.keyword.toLowerCase()));
        
      const deptMatch = filters.department === '' || job.department === filters.department;
      
      const locMatch = filters.location === '' || 
        (filters.location === "Trabalho Remoto" ? job.remote : 
         (job.city && filters.location.includes(job.city)));

      const codeMatch = filters.jobCode === '' || 
        String(job.id).toLowerCase().includes(filters.jobCode.toLowerCase());

      return searchMatch && deptMatch && locMatch && codeMatch;
    });
  }, [jobs, filters]);

  // Slicing logic for "Load More"
  const visibleJobs = useMemo(() => {
    return filteredJobs.slice(0, visibleCount);
  }, [filteredJobs, visibleCount]);

  const hasMore = visibleCount < filteredJobs.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="bg-transparent font-sans h-screen flex flex-col w-full text-slate-900 overflow-hidden">
      
      {/* Header Fixo: Filtros (Sem contador, fundo branco) */}
      <div className="shrink-0 w-full z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
            <Filters 
            filters={filters}
            setFilters={setFilters}
            locations={locations}
            departments={departments}
            />
            
            <div className="flex items-baseline justify-between mt-2 px-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Oportunidades
            </h2>
            </div>
        </div>
      </div>

      {/* Área de Conteúdo com Scroll */}
      <main ref={scrollAreaRef} className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto h-full pb-10">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-white/50 rounded-3xl border border-slate-100/50">
                    <Loader2 className="w-10 h-10 text-brand-600 animate-spin mb-4" />
                    <p className="text-slate-600 font-semibold">Carregando oportunidades...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto my-10">
                    <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
                    <CircleAlert className="h-7 w-7 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-red-900 mb-2">Não foi possível carregar as vagas</h3>
                    <p className="text-red-700 mb-6 text-sm max-w-md mx-auto">
                    Houve um problema ao conectar com a plataforma de vagas.
                    </p>
                    <button 
                    onClick={loadData}
                    className="inline-flex items-center justify-center bg-white text-red-700 border border-red-200 hover:bg-red-50 font-bold py-3 px-8 rounded-full transition-colors shadow-sm"
                    >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tentar Novamente
                    </button>
                </div>
            ) : filteredJobs.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                        {visibleJobs.map(job => (
                        <JobCard 
                            key={job.id} 
                            job={job} 
                            onShowDetails={setSelectedJob}
                        />
                        ))}
                    </div>
                    
                    {hasMore && (
                        <div className="flex justify-center pb-6">
                            <button 
                                onClick={handleLoadMore}
                                className="group flex items-center px-8 py-4 bg-white border border-brand-200 text-brand-700 font-bold rounded-full shadow-sm hover:shadow-md hover:border-brand-400 hover:bg-brand-50 transition-all duration-300"
                            >
                                <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                Carregar mais vagas
                            </button>
                        </div>
                    )}

                    {!hasMore && filteredJobs.length > ITEMS_PER_PAGE && (
                        <div className="text-center pb-6 text-slate-400 text-sm font-medium">
                            Você visualizou todas as vagas disponíveis.
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-white/50 rounded-3xl border border-slate-100 border-dashed">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white shadow-sm mb-5">
                        <Briefcase className="h-7 w-7 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Nenhuma vaga encontrada</h3>
                    <p className="mt-2 text-slate-500 max-w-sm mx-auto text-center">
                    Tente ajustar os filtros de busca acima.
                    </p>
                    <button 
                    onClick={() => setFilters({ keyword: '', location: '', department: '', jobCode: '' })}
                    className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-full text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-md"
                    >
                    Limpar filtros
                    </button>
                </div>
            )}
          </div>
      </main>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}
    </div>
  );
}