
import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Download, Upload, Layout, Quote, BookOpen, Image as ImageIcon, X } from 'lucide-react';
import { QuoteCard } from './components/QuoteCard';
import { BookCard } from './components/BookCard';
import { QuoteData, BookData, INITIAL_QUOTE_DATA, INITIAL_BOOK_DATA } from './types';

const PREVIEW_SCALE = 0.45;

type AppMode = 'quote' | 'book';

export default function App() {
  const [mode, setMode] = useState<AppMode>('quote');
  const [quoteData, setQuoteData] = useState<QuoteData>(INITIAL_QUOTE_DATA);
  const [bookData, setBookData] = useState<BookData>(INITIAL_BOOK_DATA);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const quoteCardRef = useRef<HTMLDivElement>(null);
  const bookCardRef = useRef<HTMLDivElement>(null);
  
  const quoteImageInputRef = useRef<HTMLInputElement>(null);
  const bookCoverInputRef = useRef<HTMLInputElement>(null);

  const handleQuoteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuoteData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuoteFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof QuoteData) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQuoteData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBookFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof BookData) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBookData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = useCallback(async () => {
    let targetRef: HTMLElement | null = null;
    let filename = '';

    if (mode === 'quote') {
        targetRef = quoteCardRef.current;
        filename = `METARH-frase.png`;
    } else if (mode === 'book') {
        targetRef = bookCardRef.current;
        filename = `METARH-livro-${bookData.bookTitle.slice(0, 10)}.png`;
    }

    if (!targetRef) return;

    setIsDownloading(true);
    try {
      const dataUrl = await toPng(targetRef, { 
          quality: 1.0,
          width: 1080,
          height: 1350,
          pixelRatio: 1,
          cacheBust: true, 
          style: {
             transform: 'scale(1)',
             transformOrigin: 'top left',
          }
      });
      
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Falha ao gerar imagem', err);
      alert('Erro ao baixar a imagem. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  }, [mode, bookData.bookTitle]);

  const inputClass = "w-full px-5 h-[54px] bg-gray-50 border border-gray-200 rounded-[2rem] focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none text-sm font-medium text-gray-700 transition-all placeholder-gray-400 flex items-center";
  const textAreaClass = "w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-[2rem] focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none text-sm font-medium text-gray-700 transition-all placeholder-gray-400 min-h-[120px] resize-none";

  const getActiveColor = () => {
    if (mode === 'quote') return 'bg-brand-pink';
    return 'bg-indigo-600'; // Book Color
  };

  const getHoverColor = () => {
    if (mode === 'quote') return 'hover:bg-pink-600';
    return 'hover:bg-indigo-500';
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row font-sans">
      
      {/* Sidebar - Controls */}
      <div className="w-full lg:w-[420px] bg-white shadow-xl flex flex-col h-screen border-r border-gray-200 z-20 relative">
        
        {/* Header & Menu */}
        <div className="px-8 pt-6 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h1 className="font-condensed font-bold text-3xl text-brand-purple flex items-center gap-2 mb-4">
            <Layout className="w-7 h-7 text-brand-pink" />
            Criador de Posts
          </h1>
          
          {/* Tabs Navigation */}
          <div className="flex bg-gray-100 p-1 rounded-full">
             <button 
                onClick={() => setMode('quote')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${mode === 'quote' ? 'bg-white text-brand-pink shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
             >
                <Quote size={14} />
                Frase
             </button>
             <button 
                onClick={() => setMode('book')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${mode === 'book' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
             >
                <BookOpen size={14} />
                Livro
             </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* --- QUOTE FORM --- */}
          {mode === 'quote' && (
             <>
                <section>
                    <h3 className="flex items-center gap-2 text-brand-pink font-condensed font-bold text-xl uppercase mb-5 border-b border-gray-100 pb-2">
                        <Quote className="w-5 h-5" /> Conteúdo da Frase
                    </h3>
                    
                    <div className="space-y-5">
                        <div>
                            <div className="flex justify-between items-center mb-1 px-3">
                                <label className="block text-xs font-bold text-gray-500 uppercase">Rede Social</label>
                            </div>
                            <input
                                type="text"
                                name="socialHandle"
                                value={quoteData.socialHandle}
                                onChange={handleQuoteChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1 px-3">
                                <label className="block text-xs font-bold text-gray-500 uppercase">A Frase</label>
                                <span className="text-[10px] text-brand-pink font-bold bg-pink-50 px-2 py-1 rounded-full">
                                    Use *asteriscos* para negrito
                                </span>
                            </div>
                            <textarea
                                name="quote"
                                value={quoteData.quote}
                                onChange={handleQuoteChange}
                                className={textAreaClass}
                                placeholder="Digite a frase inspiradora aqui..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 px-3">Nome do Autor</label>
                            <input
                                type="text"
                                name="authorName"
                                value={quoteData.authorName}
                                onChange={handleQuoteChange}
                                className={inputClass}
                                placeholder="Ex: Steve Jobs"
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="flex items-center gap-2 text-brand-pink font-condensed font-bold text-xl uppercase mb-5 border-b border-gray-100 pb-2">
                        <ImageIcon className="w-5 h-5" /> Foto do Autor
                    </h3>

                    <div 
                        className="border-2 border-dashed border-gray-300 rounded-[2rem] p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-50 hover:border-brand-pink transition group bg-white"
                        onClick={() => quoteImageInputRef.current?.click()}
                    >
                        <Upload className="w-8 h-8 text-gray-300 mb-2 group-hover:text-brand-pink transition-colors" />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-brand-pink">Carregar foto manualmente</span>
                        <input 
                            ref={quoteImageInputRef}
                            type="file" 
                            accept="image/*" 
                            className="hidden"
                            onChange={(e) => handleQuoteFileUpload(e, 'authorImage')}
                        />
                    </div>
                </section>
             </>
          )}

          {/* --- BOOK FORM --- */}
          {mode === 'book' && (
             <>
                <section>
                    <h3 className="flex items-center gap-2 text-indigo-600 font-condensed font-bold text-xl uppercase mb-5 border-b border-gray-100 pb-2">
                        <BookOpen className="w-5 h-5" /> Dica de Livro
                    </h3>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 px-3">Nome do Livro</label>
                            <input
                                type="text"
                                name="bookTitle"
                                value={bookData.bookTitle}
                                onChange={handleBookChange}
                                className={inputClass}
                            />
                        </div>

                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 px-3">Nome do Autor</label>
                            <input
                                type="text"
                                name="bookAuthor"
                                value={bookData.bookAuthor}
                                onChange={handleBookChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 px-3">Comentário / Dica</label>
                            <textarea
                                name="review"
                                value={bookData.review}
                                onChange={handleBookChange}
                                className={textAreaClass}
                                placeholder="Digite um breve comentário..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 px-3">Rede Social</label>
                            <input
                                type="text"
                                name="socialHandle"
                                value={bookData.socialHandle}
                                onChange={handleBookChange}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="flex items-center gap-2 text-indigo-600 font-condensed font-bold text-xl uppercase mb-5 border-b border-gray-100 pb-2">
                        <ImageIcon className="w-5 h-5" /> Capa do Livro
                    </h3>

                    <div 
                        className="border-2 border-dashed border-gray-300 rounded-[2rem] p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-500 transition group bg-white"
                        onClick={() => bookCoverInputRef.current?.click()}
                    >
                        <Upload className="w-8 h-8 text-gray-300 mb-2 group-hover:text-indigo-600 transition-colors" />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">Carregar Capa do Livro</span>
                        <input 
                            ref={bookCoverInputRef}
                            type="file" 
                            accept="image/*" 
                            className="hidden"
                            onChange={(e) => handleBookFileUpload(e, 'coverImage')}
                        />
                    </div>
                </section>
             </>
          )}

        </div>

        {/* Sidebar Footer */}
        <div className="p-6 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] space-y-4">
             <div className="flex gap-3">
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`w-full text-white font-condensed font-bold uppercase text-lg py-4 rounded-[2rem] shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2
                        ${getActiveColor()}
                        ${getHoverColor()}
                    `}
                >
                    {isDownloading ? (
                        <span className="animate-pulse">Processando...</span>
                    ) : (
                        <>
                            <Download className="w-5 h-5" />
                            {mode === 'quote' ? 'Baixar Frase' : 'Baixar Dica'}
                        </>
                    )}
                </button>
             </div>

             <div className="flex flex-col items-center justify-center pt-2 opacity-80">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Desenvolvido por</span>
                <img 
                    src="https://metarh.com.br/wp-content/uploads/2025/11/logo-metarh-azul.png" 
                    alt="METARH" 
                    className="h-6 w-auto"
                />
             </div>
        </div>
      </div>

      {/* Main Live Preview Area */}
      <div className="hidden lg:flex flex-1 bg-neutral-900 overflow-auto items-center justify-center p-8">
        <div 
            className="relative shadow-2xl bg-white shrink-0" 
            style={{ 
                width: `${1080 * PREVIEW_SCALE}px`, 
                height: `${1350 * PREVIEW_SCALE}px` 
            }}
        >
            {/* Conditional Rendering based on Mode */}
            <div className={mode === 'quote' ? 'block' : 'hidden'}>
                <QuoteCard ref={quoteCardRef} data={quoteData} scale={PREVIEW_SCALE} />
            </div>
            <div className={mode === 'book' ? 'block' : 'hidden'}>
                <BookCard ref={bookCardRef} data={bookData} scale={PREVIEW_SCALE} />
            </div>
        </div>
      </div>

      {/* Mobile/Modal Preview */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
            <button 
                onClick={() => setIsPreviewOpen(false)}
                className="absolute top-4 right-4 bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition"
            >
                <X className="w-6 h-6" />
            </button>
            
            <div className="relative overflow-auto max-h-full custom-scrollbar rounded-[2rem]">
                <div style={{ transform: 'scale(0.6)', transformOrigin: 'center', width: '1080px', height: '1350px' }}>
                    {mode === 'quote' ? (
                        <QuoteCard data={quoteData} scale={1} />
                    ) : (
                        <BookCard data={bookData} scale={1} />
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
}
