
import React, { useState, useRef, useEffect } from 'react';
import { SelectyJobResponse, LibraryImage, ImageTag } from '../types';
import { toPng } from 'html-to-image';
import { Download, RefreshCw, ChevronLeft, Monitor, Hash, Type, Loader2, Link as LinkIcon, Copy, CheckCircle, ChevronDown, Check, HeartHandshake, Filter, Shuffle, Trash2 } from 'lucide-react';

interface JobImageGeneratorProps {
  job: SelectyJobResponse;
  onClose: () => void;
  onSuccess?: () => void;
  libraryImages: LibraryImage[];
}

const AVAILABLE_TAGS: ImageTag[] = ['Homem', 'Mulher', 'Negros', '50+', 'LGBTQIAPN+', 'PCD', 'Indígenas'];

// Helper para hashtags padrão
const getTags = (job: SelectyJobResponse) => {
    const cityTag = job.city ? `#${job.city.replace(/\s+/g, '').toLowerCase()}` : '';
    const deptTag = job.department ? `#${job.department.replace(/\s+/g, '').toLowerCase()}` : '';
    return [...new Set(['#vagas', '#emprego', '#METARH', '#carreira', '#oportunidade', cityTag, deptTag])].filter(Boolean).join(' ');
};

// Templates de Legenda (Genéricos)
const CAPTION_TEMPLATES = [
    (job: SelectyJobResponse, link: string) => `🚀 OPORTUNIDADE DE CARREIRA\n\nEstamos buscando talentos para atuar como ${job.title}!\n\n📍 Local: ${job.city || 'Brasil'} (${job.remote ? 'Remoto' : 'Presencial'})\n💼 Tipo: ${job.contract_type || 'CLT'}\n🏢 Setor: ${job.department || 'Geral'}\n\nSe você busca desenvolvimento profissional e novos desafios, essa vaga é para você.\n\n🔗 Inscreva-se agora: ${link}\n\n${getTags(job)}`,
    (job: SelectyJobResponse, link: string) => `🌟 VEM PRO TIME!\n\nTem vaga nova na área para ${job.title}. Se você é apaixonado pelo que faz e quer crescer em um ambiente dinâmico, queremos te conhecer!\n\n✅ O que oferecemos:\n- Ambiente colaborativo\n- Oportunidade de crescimento\n- Atuação ${job.remote ? '100% Remota' : `em ${job.city}`}\n\n👉 Curtiu? Corre pra se inscrever: ${link}\n\n${getTags(job)}`,
    (job: SelectyJobResponse, link: string) => `Vaga aberta: ${job.title} 🎯\n\nEstamos contratando profissionais para compor o time de um de nossos parceiros.\n\n📍 ${job.city || 'Local a definir'}\n📝 ${job.contract_type || 'Contrato'}\n\nLink para aplicação nos comentários e abaixo:\n🔗 ${link}\n\n${getTags(job)}`,
    (job: SelectyJobResponse, link: string) => `Você é um ${job.title} em busca de novos desafios? 🤔\n\nEstamos com uma posição aberta que pode ser o próximo passo na sua carreira! \n\nBuscamos alguém proativo para atuar em ${job.city || 'nossa sede'}.\n\nConfira os detalhes completos e aplique aqui:\n👉 ${link}\n\nMarque um amigo que manda bem nessa área! 👇\n${getTags(job)}`,
    (job: SelectyJobResponse, link: string) => `🚨 PROCESSO SELETIVO ABERTO\n\nVaga: ${job.title}\nRegime: ${job.contract_type || 'CLT'}\nLocal: ${job.remote ? 'Remoto 🏠' : `${job.city} 🏢`}\n\nNão perca tempo! As inscrições estão abertas e queremos fechar essa vaga com alguém incrível (você?).\n\nAcesse o link e cadastre seu currículo:\n📲 ${link}\n\n${getTags(job)}`,
    (job: SelectyJobResponse, link: string) => `A METARH conecta você às melhores oportunidades! 🌐\n\nNova posição disponível para: ${job.title}.\n\nFaça parte de empresas que valorizam o capital humano.\n📍 Atuação: ${job.city || 'Brasil'}\n\nDetalhes e inscrição:\n${link}\n\n${getTags(job)}`,
    (job: SelectyJobResponse, link: string) => `Networking é tudo! 🤝\n\nEstamos com vaga aberta para ${job.title}.\n\nVocê é essa pessoa ou conhece alguém com esse perfil? Ajude essa oportunidade chegar no talento certo marcando nos comentários.\n\n🔗 Link da vaga: ${link}\n\n${getTags(job)}`,
    (job: SelectyJobResponse, link: string) => `OPORTUNIDADE: ${job.title} 💼\n\n📌 Detalhes da vaga:\n▪️ Setor: ${job.department || 'Geral'}\n▪️ Modelo: ${job.remote ? 'Remoto' : 'Presencial'}\n▪️ Contrato: ${job.contract_type || 'A combinar'}\n▪️ Cidade: ${job.city || 'Não informado'}\n\nBuscamos profissionais engajados e prontos para somar.\n\nInscreva-se: ${link}\n\n${getTags(job)}`,
    (job: SelectyJobResponse, link: string) => `VAGA NO RADAR! 🎯\n\nOportunidade para ${job.title} em ${job.city || 'aberto'}.\n\nSe você busca uma recolocação ou um novo desafio profissional, essa é a hora. Processo seletivo ágil conduzido pela METARH.\n\nAcesse e candidate-se:\n${link}\n\n${getTags(job)}`,
    (job: SelectyJobResponse, link: string) => `A METARH conecta você a grandes empresas! 🌐\n\nEstamos selecionando ${job.title} para atuar em um de nossos clientes parceiros.\n\nUma excelente chance de alavancar sua carreira no mercado.\n\n📍 ${job.city || 'Brasil'}\n🔗 Candidate-se: ${link}\n\n${getTags(job)}`
];

// Templates Específicos por Diversidade
const AFFIRMATIVE_CAPTIONS: Record<string, Array<(job: SelectyJobResponse, link: string) => string>> = {
    'Mulheres': [
        (job, link) => `👩‍💼 VAGA AFIRMATIVA PARA MULHERES\n\nBuscamos impulsionar a carreira de mulheres talentosas! Temos uma oportunidade para ${job.title}.\n\nAcreditamos na força e na liderança feminina para transformar o mercado. Se você é mulher e busca crescimento profissional, venha fazer parte!\n\n🔗 Candidate-se aqui: ${link}\n\n#MulheresNaLiderança #VagaAfirmativa #EquidadeDeGênero #MetaRH ${getTags(job)}`,
        (job, link) => `🚀 LUGAR DE MULHER É ONDE ELA QUISER!\n\nEstamos com vaga afirmativa aberta para ${job.title} exclusivamente para mulheres (cis e trans).\n\nQueremos construir times mais equânimes e plurais. Junte-se a nós nessa jornada.\n\n📍 ${job.city || 'Brasil'}\n💼 ${job.contract_type || 'CLT'}\n\n👉 Inscreva-se: ${link}\n\n#VagaParaMulheres #Diversidade #MetaRH ${getTags(job)}`,
        (job, link) => `VAGA PARA ELAS! 🌟\n\nOportunidade de ${job.title} - Vaga Afirmativa para Mulheres.\n\nValorizamos o potencial feminino e queremos você no nosso time. Venha somar com sua experiência e visão.\n\n🔗 Link na bio e aqui: ${link}\n\nMarque uma amiga que precisa ver essa vaga! 👇\n\n#CarreiraFeminina #VagaAfirmativa #MetaRH ${getTags(job)}`
    ],
    'Pessoas Negras': [
        (job, link) => `✊🏿 VAGA AFIRMATIVA PARA PESSOAS NEGRAS\n\nA diversidade racial impulsiona a inovação. Estamos com vaga aberta para ${job.title} focada em talentos negros (pretos e pardos).\n\nVenha construir uma carreira de sucesso em um ambiente que valoriza a pluralidade.\n\n🔗 Aplique agora: ${link}\n\n#VagaAfirmativa #VidasNegrasImportam #DiversidadeRacial #MetaRH ${getTags(job)}`,
        (job, link) => `🌍 DIVERSIDADE É POTÊNCIA!\n\nBuscamos ${job.title} para integrar nosso time. Esta é uma vaga afirmativa para pessoas negras.\n\nSe você busca uma empresa comprometida com a inclusão e o combate ao racismo estrutural, seu lugar é aqui.\n\n📍 Local: ${job.city || 'Remoto'}\n\n👉 Candidate-se: ${link}\n\n#EquidadeRacial #TalentosNegros #MetaRH ${getTags(job)}`,
        (job, link) => `OPORTUNIDADE AFIRMATIVA 💼\n\nEstamos contratando ${job.title} (Vaga para Pessoas Negras).\n\nAcreditamos que times diversos constroem melhores resultados. Venha fazer a diferença conosco!\n\n🔗 Detalhes e inscrição: ${link}\n\n#Inclusão #Carreira #VagaAfirmativa #MetaRH ${getTags(job)}`
    ],
    'Pessoas com Deficiência': [
        (job, link) => `♿ VAGA AFIRMATIVA PARA PCD\n\nEstamos em busca de ${job.title}. Esta oportunidade é exclusiva para Pessoas com Deficiência.\n\nValorizamos a competência e o potencial de cada indivíduo, promovendo um ambiente acessível e inclusivo.\n\n🔗 Saiba mais e candidate-se: ${link}\n\n#VagaPCD #Inclusão #Acessibilidade #MetaRH ${getTags(job)}`,
        (job, link) => `INCLUSÃO EM AÇÃO! 🌟\n\nTem vaga nova para ${job.title} (Foco em Profissionais com Deficiência).\n\nSe você busca uma empresa que respeita e valoriza a diversidade, venha trabalhar conosco!\n\n📍 ${job.city || 'Brasil'}\n\n👉 Inscreva-se no link: ${link}\n\n#PCD #Oportunidade #Diversidade #MetaRH ${getTags(job)}`,
        (job, link) => `TALENTO SEM BARREIRAS 🚀\n\nOportunidade para ${job.title} - Vaga Afirmativa PCD.\n\nEstamos expandindo nosso time e queremos conhecer você. Junte-se a nós!\n\n🔗 Link para candidatura: ${link}\n\nCompartilhe com quem precisa ver essa vaga! 👇\n\n#VagaAfirmativaPCD #MercadoDeTrabalho #MetaRH ${getTags(job)}`
    ],
    'LGBTQIA+': [
        (job, link) => `🏳️‍🌈 VAGA AFIRMATIVA LGBTQIA+\n\nOrgulho de ser quem você é! Estamos contratando ${job.title}.\n\nBuscamos criar um ambiente seguro, respeitoso e acolhedor para todas as identidades e orientações.\n\n🔗 Venha brilhar conosco: ${link}\n\n#VagaLGBT #Diversidade #Orgulho #MetaRH ${getTags(job)}`,
        (job, link) => `🌈 DIVERSIDADE GERA VALOR\n\nOportunidade para ${job.title} - Foco na comunidade LGBTQIA+.\n\nAcreditamos que a pluralidade de vozes enriquece nosso trabalho. Se você quer fazer parte de um time inclusivo, candidate-se!\n\n👉 Link: ${link}\n\n#LGBTQIA #Carreira #Inclusão #MetaRH ${getTags(job)}`,
        (job, link) => `VEM SER VOCÊ! ✨\n\nVaga aberta para ${job.title} (Afirmativa LGBTQIA+).\n\nAqui, respeitamos e celebramos a diversidade. Traga seu talento e sua autenticidade.\n\n🔗 Inscreva-se: ${link}\n\n#Pridework #VagaAfirmativa #MetaRH ${getTags(job)}`
    ],
    '50+': [
        (job, link) => `👵👴 VAGA AFIRMATIVA 50+\n\nExperiência vale ouro! Estamos em busca de ${job.title} com foco em profissionais com mais de 50 anos.\n\nValorizamos a maturidade, a vivência e o conhecimento que você tem a oferecer.\n\n🔗 Candidate-se aqui: ${link}\n\n#Geração50Mais #MaturidadeNoTrabalho #VagaAfirmativa #MetaRH ${getTags(job)}`,
        (job, link) => `🚀 CARREIRA NÃO TEM IDADE\n\nTem vaga para ${job.title} (Afirmativa 50+).\n\nQueremos somar a sua experiência com a nossa inovação. Venha fazer parte do nosso time!\n\n📍 ${job.city || 'Brasil'}\n\n👉 Aplique agora: ${link}\n\n#Longevidade #Profissionais50Mais #MetaRH ${getTags(job)}`,
        (job, link) => `OPORTUNIDADE SÊNIOR 🌟\n\nEstamos contratando ${job.title} - Vaga voltada para talentos 50+.\n\nAcreditamos na troca de gerações e no valor da experiência. Junte-se a nós!\n\n🔗 Link da vaga: ${link}\n\n#Vaga50Mais #DiversidadeEtária #MetaRH ${getTags(job)}`
    ],
    'Pessoas Indígenas': [
        (job, link) => `🏹 VAGA AFIRMATIVA PARA PESSOAS INDÍGENAS\n\nValorizamos a ancestralidade e a pluralidade. Estamos com vaga aberta para ${job.title} exclusiva para talentos indígenas.\n\nVenha somar com sua visão de mundo e cultura.\n\n🔗 Inscreva-se: ${link}\n\n#VagaAfirmativa #PovosOriginários #Diversidade #MetaRH ${getTags(job)}`,
        (job, link) => `🌿 DIVERSIDADE E INCLUSÃO\n\nOportunidade para ${job.title} (Foco em Pessoas Indígenas).\n\nQueremos construir um futuro onde todas as histórias têm espaço. Junte-se a nós!\n\n📍 ${job.city || 'Brasil'}\n\n👉 Link: ${link}\n\n#Indígenas #Oportunidade #MetaRH ${getTags(job)}`,
        (job, link) => `TALENTO E IDENTIDADE ✨\n\nEstamos contratando ${job.title} - Vaga Afirmativa para Indígenas.\n\nTraga sua potência para nosso time. Respeito e valorização em primeiro lugar.\n\n🔗 Detalhes: ${link}\n\n#VagaIndígena #Inclusão #Carreira #MetaRH ${getTags(job)}`
    ],
    'Afirmativa (Geral)': [
        (job, link) => `🤝 VAGA AFIRMATIVA\n\nEstamos com oportunidade para ${job.title} focada em aumentar a diversidade do nosso time.\n\nSe você faz parte de grupos sub-representados, queremos conhecer seu talento!\n\n🔗 Candidate-se: ${link}\n\n#DiversidadeeInclusão #VagaAfirmativa #MetaRH ${getTags(job)}`,
        (job, link) => `🌟 DIVERSIDADE IMPORTA\n\nBuscamos ${job.title} para somar ao nosso time (Vaga Afirmativa).\n\nValorizamos diferentes perspectivas e vivências. Venha crescer com a gente!\n\n👉 Inscreva-se: ${link}\n\n#Inclusão #Oportunidade #MetaRH ${getTags(job)}`,
        (job, link) => `VEM TRANSFORMAR! 🚀\n\nVaga aberta: ${job.title} - Vaga Afirmativa.\n\nEstamos construindo um futuro mais inclusivo e precisamos de você. Candidate-se!\n\n🔗 Link: ${link}\n\n#Carreira #Diversidade #MetaRH ${getTags(job)}`
    ]
};

// Cores da Especificação
const COLORS = {
  purple: '#481468', // Roxo Institucional (Texto)
  vibrantPurple: '#aa3ffe', // Roxo Vibrante (Marca Padrão)
  
  // Cores Específicas Vaga Afirmativa
  affirmativePurple: '#b24eec', // Fundo Roxo
  affirmativeText1: '#9c5cf5', // "Trabalhe..."
  affirmativeText2: '#7b28bb', // "Multinacional"
  affirmativeBox: '#b25af6', // Box do Setor
  affirmativeContract: '#ed2bf4', // Contrato
  affirmativeModality: '#9932d8', // Modalidade
  affirmativeLocation: '#7730d8', // Local
  
  pink: '#F42C9F', 
  green: '#a3e635', 
  orange: '#ff6b00', 
  black: '#1a1a1a',
  white: '#FFFFFF'
};

const CONTRACT_OPTIONS = ['CLT (Efetivo)', 'PJ', 'Estágio', 'Temporário', 'Freelance', 'Trainee'];
const MODALITY_OPTIONS = ['Presencial', 'Híbrido', 'Remoto'];
const DIVERSITY_OPTIONS = ['Mulheres', 'Pessoas Negras', 'Pessoas com Deficiência', 'LGBTQIAPN+', '50+', 'Pessoas Indígenas', 'Afirmativa (Geral)'];

const useBase64Image = (url: string | null) => {
  const [dataSrc, setDataSrc] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!url) { setDataSrc(undefined); return; }
    if (url.startsWith('data:')) { setDataSrc(url); return; }
    let isMounted = true;
    const loadImage = async () => {
      try {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => { if (isMounted) setDataSrc(reader.result as string); };
        reader.readAsDataURL(blob);
      } catch (error) { if (isMounted) setDataSrc(url); }
    };
    loadImage();
    return () => { isMounted = false; };
  }, [url]);
  return dataSrc;
};

interface GeneratorSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

const GeneratorSelect: React.FC<GeneratorSelectProps> = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{label}</label>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={`relative w-full pl-4 pr-8 py-2.5 border rounded-full text-left transition-all focus:outline-none text-xs bg-white ${isOpen ? 'border-[#aa3ffe] ring-2 ring-[#aa3ffe]/20 shadow-sm' : 'border-slate-200 hover:border-brand-300'}`}>
        <span className="block truncate font-medium text-slate-700">{value || "Selecione..."}</span>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500"><ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#aa3ffe]' : ''}`} /></div>
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-xl border border-slate-100 max-h-48 overflow-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
          <ul className="py-1">{options.map((option) => (<li key={option} onClick={() => { onChange(option); setIsOpen(false); }} className={`px-4 py-2 cursor-pointer flex items-center justify-between text-xs transition-colors ${value === option ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-600'}`}><span className="truncate">{option}</span>{value === option && <Check className="w-3 h-3 text-brand-600" />}</li>))}</ul>
        </div>
      )}
    </div>
  );
};

export const JobImageGenerator: React.FC<JobImageGeneratorProps> = ({ job, onClose, onSuccess, libraryImages }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const initialTitle = job.title.split(' - ')[0].trim();
  const [title, setTitle] = useState(initialTitle);
  const [tag1, setTag1] = useState(job.contract_type === 'CLT' ? 'CLT (Efetivo)' : (job.contract_type || 'CLT (Efetivo)'));
  const [tag2, setTag2] = useState(job.remote ? 'Remoto' : 'Presencial');
  const [location, setLocation] = useState(job.city ? `${job.city}-${job.state}` : 'Brasil');
  const [jobId, setJobId] = useState(String(job.id));
  const [category, setCategory] = useState('SETOR ADMINISTRATIVO'); 
  const [companyType, setCompanyType] = useState<'multinacional' | 'nacional' | 'custom'>('multinacional');
  const [tagline, setTagline] = useState('TRABALHE EM UMA EMPRESA MULTINACIONAL');
  const [jobImage, setJobImage] = useState(libraryImages[0]?.url || "");
  const [footerUrl, setFooterUrl] = useState('metarh.com.br/vagas-metarh');
  
  const [isAffirmative, setIsAffirmative] = useState(false);
  const [affirmativeType, setAffirmativeType] = useState(DIVERSITY_OPTIONS[0]);

  const [captionText, setCaptionText] = useState('');
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const [activeTags, setActiveTags] = useState<ImageTag[]>([]);

  const bgImageBase64 = useBase64Image("https://metarh.com.br/wp-content/uploads/2025/11/Fundo_Vagas.jpg");
  const logoBase64 = useBase64Image("https://metarh.com.br/wp-content/uploads/2025/11/metarh-bola-branca.png");
  const jobImageBase64 = useBase64Image(jobImage);

  useEffect(() => {
    if (job.department && job.department !== 'Geral') setCategory(job.department.toUpperCase());
    generateCaption(0);
  }, [job]);

  useEffect(() => { generateCaption(0); }, [isAffirmative, affirmativeType]);

  useEffect(() => {
    if (companyType === 'multinacional') setTagline('TRABALHE EM UMA EMPRESA MULTINACIONAL');
    else if (companyType === 'nacional') setTagline('TRABALHE EM UMA EMPRESA NACIONAL');
  }, [companyType]);

  const generateCaption = (index: number) => {
      const link = job.url_apply || footerUrl;
      let template;
      let maxIndex;
      if (isAffirmative) {
          const templates = AFFIRMATIVE_CAPTIONS[affirmativeType] || AFFIRMATIVE_CAPTIONS['Afirmativa (Geral)'];
          maxIndex = templates.length;
          template = templates[index % maxIndex];
      } else {
          maxIndex = CAPTION_TEMPLATES.length;
          template = CAPTION_TEMPLATES[index % maxIndex];
      }
      setCaptionText(template(job, link));
      setCurrentCaptionIndex(index);
  };

  const handleNextCaption = () => generateCaption(currentCaptionIndex + 1);
  const handleCopyCaption = () => { navigator.clipboard.writeText(captionText); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleDownload = async () => {
    if (cardRef.current === null) return;
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, pixelRatio: 2, width: 1080, height: 1350, skipAutoScale: true, style: { transform: 'none', boxShadow: 'none' }
      });
      const link = document.createElement('a');
      link.download = `${jobId}-vaga-metarh.png`;
      link.href = dataUrl;
      link.click();
      if (onSuccess) onSuccess();
    } catch (err) { console.error('Erro ao gerar imagem:', err); alert('Erro ao gerar imagem. Tente novamente.'); } 
    finally { setIsGenerating(false); }
  };

  const toggleTag = (tag: ImageTag) => setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const filteredImages = libraryImages.filter(img => {
      if (activeTags.length === 0) return true;
      // Logic: Intersection (AND)
      return activeTags.every(tag => img.tags.includes(tag));
  });

  const handleRandomize = () => {
      if (filteredImages.length > 0) {
          const randomIdx = Math.floor(Math.random() * filteredImages.length);
          setJobImage(filteredImages[randomIdx].url);
      }
  };

  const getTitleFontSize = (text: string) => {
    const len = text.length;
    if (len > 100) return '32px';
    if (len > 70) return '40px';
    if (len > 35) return '48px';
    return '56px';
  };
  const getCategoryFontSize = (text: string) => { if (text.length > 25) return '22px'; return '30px'; }
  const getDiversityTitleSize = (text: string) => { if (text.length > 20) return '72px'; return '80px'; }

  const isReady = (bgImageBase64 || isAffirmative) && logoBase64 && jobImageBase64;
  const CANVAS_WIDTH = 1080;
  const CANVAS_HEIGHT = 1350;
  const HEADER_HEIGHT = 569;
  const FOOTER_HEIGHT = 249;
  const PHOTO_WIDTH = 436;
  const PHOTO_TOP = 411;
  const PHOTO_BOTTOM = 1101; 
  const PHOTO_HEIGHT = PHOTO_BOTTOM - PHOTO_TOP;
  const PHOTO_LEFT = 80; 
  const FLOATING_CARD_WIDTH = 424;
  const FLOATING_CARD_HEIGHT = 201;
  const FLOATING_CARD_RIGHT = 60;
  const FLOATING_CARD_TOP = HEADER_HEIGHT - 60 - FLOATING_CARD_HEIGHT; 
  const LOGO_HEIGHT = 100;
  const LOGO_MARGIN_BOTTOM = 60;
  const LOGO_TOP = FLOATING_CARD_TOP - LOGO_MARGIN_BOTTOM - LOGO_HEIGHT; 
  const totalCaptions = isAffirmative ? (AFFIRMATIVE_CAPTIONS[affirmativeType] || AFFIRMATIVE_CAPTIONS['Afirmativa (Geral)']).length : CAPTION_TEMPLATES.length;

  return (
    <div className="flex flex-col lg:flex-row bg-slate-50 min-h-screen relative items-start">
      
      {/* Editor Sidebar */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6 order-2 lg:order-1 p-4 lg:p-8 relative z-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center"><Monitor className="w-6 h-6 mr-2 text-brand-600" />Editor de Post</h2>
            <div className="space-y-6 pr-2">
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título da Vaga</label><textarea value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-4 border border-slate-200 rounded-3xl text-sm font-bold focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none" rows={2}/></div>
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100"><label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center"><Type className="w-3 h-3 mr-1" /> Frase de Efeito</label><div className="flex gap-2 mb-3"><button onClick={() => setCompanyType('multinacional')} className={`flex-1 py-2 px-2 rounded-full text-xs font-bold border transition-colors ${companyType === 'multinacional' ? 'bg-brand-100 border-brand-300 text-brand-800' : 'bg-white border-slate-200 text-slate-500'}`}>Multinacional</button><button onClick={() => setCompanyType('nacional')} className={`flex-1 py-2 px-2 rounded-full text-xs font-bold border transition-colors ${companyType === 'nacional' ? 'bg-brand-100 border-brand-300 text-brand-800' : 'bg-white border-slate-200 text-slate-500'}`}>Nacional</button></div><input type="text" value={tagline} onChange={(e) => { setCompanyType('custom'); setTagline(e.target.value); }} className="w-full p-3 border border-slate-200 rounded-full text-sm font-medium"/></div>
                <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Setor (Pílula)</label><input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border border-slate-200 rounded-full text-sm font-sans font-bold"/></div><div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Código</label><div className="relative"><Hash className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" /><input type="text" value={jobId} onChange={(e) => setJobId(e.target.value)} className="w-full pl-9 p-3 border border-slate-200 rounded-full text-sm"/></div></div></div>
                <div className={`p-4 rounded-3xl border transition-colors duration-300 ${isAffirmative ? 'bg-brand-50 border-brand-200' : 'bg-slate-50 border-slate-100'}`}><div className="flex items-center justify-between mb-2"><label className={`block text-xs font-bold uppercase flex items-center ${isAffirmative ? 'text-brand-600' : 'text-slate-500'}`}><HeartHandshake className="w-3 h-3 mr-1" /> Vaga Afirmativa?</label><div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in"><input type="checkbox" checked={isAffirmative} onChange={(e) => setIsAffirmative(e.target.checked)} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out checked:translate-x-full checked:border-brand-500"/><label className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-200 ${isAffirmative ? 'bg-brand-500' : 'bg-slate-300'}`}></label></div></div>{isAffirmative && (<div className="animate-in fade-in slide-in-from-top-2 duration-200"><GeneratorSelect label="Público da Vaga" value={affirmativeType} options={DIVERSITY_OPTIONS} onChange={setAffirmativeType}/></div>)}</div>
                <div className="grid grid-cols-3 gap-2"><div className="col-span-1"><GeneratorSelect label="Contrato" value={tag1} options={CONTRACT_OPTIONS} onChange={setTag1}/></div><div className="col-span-1"><GeneratorSelect label="Modalidade" value={tag2} options={MODALITY_OPTIONS} onChange={setTag2}/></div><div className="col-span-1"><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Local</label><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-full text-xs"/></div></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link Rodapé</label><div className="relative"><LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" /><input type="text" value={footerUrl} onChange={(e) => setFooterUrl(e.target.value)} className="w-full pl-9 p-3 border border-slate-200 rounded-full text-sm text-slate-600"/></div></div>

                {/* --- IMAGE LIBRARY SECTION --- */}
                <div className="border border-slate-200 rounded-3xl p-4">
                    <div className="block text-xs font-bold text-slate-500 uppercase mb-2 flex justify-between items-center"><span>Banco de Imagens</span></div>
                    
                    {/* Filters */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        <div className="w-full flex justify-between items-center mb-1"><div className="flex items-center gap-1"><Filter className="w-3 h-3 text-slate-400" /><span className="text-[10px] text-slate-400 font-bold uppercase">Filtrar:</span></div><button onClick={handleRandomize} className="text-[10px] text-brand-600 font-bold flex items-center hover:bg-brand-50 px-2 py-0.5 rounded-full transition-colors" title="Escolher imagem aleatória com base nos filtros"><Shuffle className="w-3 h-3 mr-1" /> Surpreenda-me</button></div>
                        {AVAILABLE_TAGS.map(tag => (<button key={tag} onClick={() => toggleTag(tag)} className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${activeTags.includes(tag) ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>{tag}</button>))}
                        {activeTags.length > 0 && (<button onClick={() => setActiveTags([])} className="px-2 py-1 text-[10px] text-red-500 font-bold hover:underline">Limpar</button>)}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                         {filteredImages.map((img) => (
                             <div key={img.id} onClick={() => setJobImage(img.url)} className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 relative group ${jobImage === img.url ? 'border-brand-500 ring-2 ring-brand-200' : 'border-transparent hover:border-slate-300'}`}>
                                 <img src={img.url} className="w-full h-full object-cover" loading="lazy" />
                                 {jobImage === img.url && (<div className="absolute inset-0 bg-brand-500/20 flex items-center justify-center z-10"><CheckCircle className="w-6 h-6 text-white drop-shadow-md" /></div>)}
                             </div>
                         ))}
                    </div>
                     {filteredImages.length === 0 && (<div className="text-center py-4 text-slate-400 text-xs">Nenhuma imagem encontrada para estes filtros.</div>)}
                </div>

                <div className="bg-brand-50 rounded-3xl p-5 border border-brand-100 mt-4">
                    <div className="flex justify-between items-center mb-3"><label className="block text-xs font-bold text-brand-700 uppercase">Legenda ({(currentCaptionIndex % totalCaptions) + 1}/{totalCaptions})</label><button onClick={handleNextCaption} className="px-3 py-1.5 bg-white border border-brand-200 text-brand-700 rounded-full text-[10px] font-bold hover:bg-brand-100 transition-colors flex items-center gap-1"><RefreshCw className="w-3 h-3" />Próxima Ideia</button></div>
                    <textarea value={captionText} onChange={(e) => setCaptionText(e.target.value)} className="w-full p-4 text-xs border border-brand-200 rounded-3xl text-slate-600 h-32 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none bg-white"/>
                    <button onClick={handleCopyCaption} className="mt-3 w-full py-2.5 bg-white border border-brand-200 text-brand-700 rounded-full text-xs font-bold hover:bg-brand-100 transition-colors flex items-center justify-center gap-2">{copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}{copied ? "Copiado!" : "Copiar Legenda"}</button>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                <button onClick={onClose} className="py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-full hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"><ChevronLeft className="w-5 h-5" />Voltar</button>
                <button onClick={handleDownload} disabled={isGenerating || !isReady} className="py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-full shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">{isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" />Gerando...</>) : !isReady ? (<><Loader2 className="w-5 h-5 animate-spin" />Carregando...</>) : (<><Download className="w-5 h-5" />Baixar Imagem</>)}</button>
            </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="w-full lg:w-2/3 flex items-center justify-center bg-slate-200/50 border-b lg:border-b-0 lg:border-l border-slate-300 p-4 order-1 lg:order-2 min-h-[500px] lg:fixed lg:right-0 lg:top-0 lg:h-screen z-20">
        <div style={{ transform: 'scale(0.38)', transformOrigin: 'center center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            {/* ================= CANVAS START ================= */}
            <div ref={cardRef} className="relative overflow-hidden flex flex-col shrink-0 bg-slate-900" style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}>
                {isAffirmative ? (
                    <div className="relative w-full h-full flex flex-col bg-white">
                        {/* 1. Header (Purple) */}
                        <div className="absolute top-0 left-0 w-full z-10" style={{ backgroundColor: COLORS.affirmativePurple, height: `${HEADER_HEIGHT}px`, borderBottomLeftRadius: '80px', borderBottomRightRadius: '80px' }}>
                            <div className="absolute flex items-center justify-center" style={{ right: `${FLOATING_CARD_RIGHT}px`, width: `${FLOATING_CARD_WIDTH}px`, top: `${LOGO_TOP}px`, height: `${LOGO_HEIGHT}px` }}>{logoBase64 && <img src={logoBase64} className="h-full w-auto object-contain opacity-90" />}</div>
                            <div className="absolute bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center p-6" style={{ width: `${FLOATING_CARD_WIDTH}px`, height: `${FLOATING_CARD_HEIGHT}px`, right: `${FLOATING_CARD_RIGHT}px`, top: `${FLOATING_CARD_TOP}px` }}>
                                <h2 className="font-sans font-semibold text-[32px] uppercase leading-tight mb-6 text-center">{companyType === 'custom' ? (<span style={{ color: COLORS.affirmativeText2 }}>{tagline}</span>) : (<><span style={{ color: COLORS.affirmativeText1 }}>Trabalhe em uma<br/>empresa </span><span style={{ color: COLORS.affirmativeText2 }}>{companyType.toUpperCase()}</span></>)}</h2>
                                <div className="rounded-[18px] flex items-center justify-center w-[353px] h-[51px]" style={{ backgroundColor: COLORS.affirmativeBox }}><span className="font-sans font-bold text-white uppercase text-[24px] truncate px-4">{category}</span></div>
                            </div>
                        </div>
                        {/* 2. Photo Section (Left) */}
                        <div className="absolute z-20 overflow-hidden shadow-2xl bg-slate-200" style={{ width: `${PHOTO_WIDTH}px`, height: `${PHOTO_HEIGHT}px`, top: `${PHOTO_TOP}px`, left: `${PHOTO_LEFT}px`, borderRadius: '218px 218px 0 0' }}>{jobImageBase64 && <img src={jobImageBase64} className="w-full h-full object-cover" />}<div className="absolute bottom-[20px] left-0 w-full flex justify-center z-30"><div className="bg-white px-5 py-1 rounded-full shadow-md"><span className="font-sans font-bold text-[24px] text-black">Cód.: {jobId}</span></div></div></div>
                        {/* 3. Diversity Title */}
                        <div className="absolute z-20 flex flex-col items-center justify-center" style={{ width: `${PHOTO_WIDTH}px`, left: `${PHOTO_LEFT}px`, top: `${LOGO_TOP}px` }}><div className="px-6 py-1.5 rounded-full border-2 border-white inline-flex items-center justify-center bg-transparent"><span className="font-sans font-medium text-white text-[39px] tracking-wide">Vaga Afirmativa</span></div></div>
                        <div className="absolute z-20 flex flex-col items-center justify-center" style={{ width: `${PHOTO_WIDTH}px`, left: `${PHOTO_LEFT}px`, top: `${LOGO_TOP + 60 + 30}px` }}><h1 className="font-sans font-black text-white text-center drop-shadow-md" style={{ fontSize: getDiversityTitleSize(affirmativeType), lineHeight: '0.85' }}>{affirmativeType}</h1></div>
                        {/* 4. Body Content */}
                        <div className="absolute z-10 flex flex-col items-center" style={{ top: `${HEADER_HEIGHT}px`, bottom: `${FOOTER_HEIGHT}px`, left: `${PHOTO_LEFT + PHOTO_WIDTH}px`, right: 0, justifyContent: 'center' }}>
                            <h2 className="font-sans font-extrabold text-[#1a1a1a] leading-tight text-center w-full px-8 mb-[60px] mt-[40px]" style={{ fontSize: getTitleFontSize(title) }}>{title}</h2>
                            <div className="flex flex-col items-center gap-[28px]">
                                <div className="flex gap-4">{tag1 && (<div className="px-8 py-3 rounded-full shadow-md flex items-center justify-center min-w-[200px]" style={{ backgroundColor: COLORS.affirmativeContract }}><span className="font-sans font-bold text-[24px] uppercase text-white">{tag1}</span></div>)}{tag2 && (<div className="px-8 py-3 rounded-full shadow-md flex items-center justify-center min-w-[200px]" style={{ backgroundColor: COLORS.affirmativeModality }}><span className="font-sans font-bold text-[24px] uppercase text-white">{tag2}</span></div>)}</div>
                                {location && (<div className="px-12 py-3 rounded-full shadow-md flex items-center justify-center min-w-[300px]" style={{ backgroundColor: COLORS.affirmativeLocation }}><span className="font-sans font-bold text-[24px] uppercase text-white truncate">{location}</span></div>)}
                            </div>
                        </div>
                        {/* 5. Footer */}
                        <div className="absolute bottom-0 left-0 w-full z-30 flex" style={{ backgroundColor: COLORS.affirmativePurple, height: `${FOOTER_HEIGHT}px`, borderTopLeftRadius: '80px', borderTopRightRadius: '80px', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '30px' }}>
                             <div className="flex flex-row items-center justify-center gap-3 text-center px-10 w-full"><div className="flex items-center gap-3"><span className="font-sans font-medium text-[28px] text-white opacity-90">Candidate-se gratuitamente em</span><span className="font-sans font-bold text-[32px] text-white">{footerUrl}</span><div className="transform rotate-12 translate-y-[10px]"><svg width="36" height="36" viewBox="0 0 24 24" fill={COLORS.green} stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path></svg></div></div></div>
                        </div>
                    </div>
                ) : (
                    /* ================= STANDARD LAYOUT ================= */
                    <>
                        {bgImageBase64 && (<img src={bgImageBase64} alt="Background" className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" />)}
                        <div className="relative w-full z-10 bg-white" style={{ height: '42%', borderBottomLeftRadius: '80px', borderBottomRightRadius: '80px' }}>
                            <div className="absolute inset-0 flex justify-between" style={{ paddingTop: '145px', paddingLeft: '135px', paddingRight: '135px', paddingBottom: '40px' }}>
                                <div className="flex flex-col items-start w-full">
                                    <div className="relative leading-none mb-0 flex-shrink-0"><h1 className="font-condensed italic font-bold text-[100px] tracking-tighter text-[#1a1a1a] transform -translate-x-2">#Temos</h1><h1 className="font-condensed italic font-black text-[130px] text-[#1a1a1a] -mt-10 leading-[0.75] transform -translate-x-2 translate-y-[12px]" style={{ letterSpacing: '0.01em' }}>Vagas</h1></div>
                                    <div className="w-full mt-[76px]"><h2 className="font-condensed italic font-bold text-[32px] uppercase leading-tight w-full" style={{ color: COLORS.vibrantPurple }}>{tagline}</h2></div>
                                    <div className="mt-[50px] w-full flex flex-col gap-4 items-start"><div className="px-8 py-3 rounded-full shadow-lg inline-flex items-center justify-center" style={{ backgroundColor: COLORS.pink, minWidth: '200px', maxWidth: '450px' }}><span className="font-sans font-bold text-white uppercase tracking-wide text-center leading-tight truncate" style={{ fontSize: getCategoryFontSize(category) }}>{category}</span></div></div>
                                </div>
                                <div className="flex flex-col items-center relative z-10 flex-shrink-0" style={{ width: '448px' }}><span className="font-sans font-medium text-[27px] text-black mb-3 block text-center w-full">Cód.: {jobId}</span><div className="relative overflow-hidden shadow-2xl shrink-0 flex-shrink-0" style={{ width: '448px', height: '534px', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>{jobImageBase64 && <img src={jobImageBase64} alt="Foto da Vaga" className="w-full h-full object-cover block" />}</div></div>
                            </div>
                        </div>
                        <div className="flex-1 relative flex flex-col items-center w-full z-0">
                            <div className="flex flex-col items-center w-full px-[135px]" style={{ marginTop: '240px' }}>
                                <h1 className="font-sans font-extrabold text-white text-center leading-tight mb-12 drop-shadow-lg w-full" style={{ fontSize: getTitleFontSize(title) }}>{title}</h1>
                                <div className="flex flex-wrap justify-center gap-5 w-full">{tag1 && (<div className="bg-white px-6 py-2 rounded-full shadow-md flex items-center justify-center min-w-[160px]"><span className="font-sans font-extrabold text-[24px] uppercase text-[#F42C9F]">{tag1}</span></div>)}{tag2 && (<div className="bg-white px-6 py-2 rounded-full shadow-md flex items-center justify-center min-w-[160px]"><span className="font-sans font-extrabold text-[24px] uppercase" style={{ color: COLORS.purple }}>{tag2}</span></div>)}{location && (<div className="bg-white px-6 py-2 rounded-full shadow-md flex items-center justify-center min-w-[160px] max-w-[400px]"><span className="font-sans font-extrabold text-[24px] uppercase truncate" style={{ color: COLORS.purple }}>{location}</span></div>)}</div>
                            </div>
                            <div className="absolute bottom-0 w-full px-[135px] pb-[145px]"><div className="w-full h-[1px] bg-white opacity-30 mb-10"></div><div className="flex items-center justify-between w-full"><div className="h-[100px] w-[100px] flex items-center justify-start flex-shrink-0">{logoBase64 && <img src={logoBase64} alt="MetaRH" className="w-full h-full object-contain" />}</div><div className="flex flex-col items-end text-right relative mr-12"><span className="text-white font-sans font-medium text-[24px] opacity-90 mb-1">Candidate-se gratuitamente em</span><span className="text-white font-sans font-bold text-[27px]">{footerUrl}</span><div className="absolute -right-12 top-[52px] transform -rotate-12 drop-shadow-lg"><svg width="42" height="42" viewBox="0 0 24 24" fill={COLORS.green} stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path></svg></div></div></div></div>
                        </div>
                    </>
                )}
            </div>
             {/* ================= CANVAS END ================= */}
        </div>
      </div>
    </div>
  );
}