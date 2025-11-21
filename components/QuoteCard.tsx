import React, { forwardRef, useEffect, useState, useLayoutEffect, useRef } from 'react';
import { QuoteData } from '../types';

interface QuoteCardProps {
  data: QuoteData;
  scale?: number;
}

const useBase64Image = (url: string | null) => {
  const [dataSrc, setDataSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!url) {
      setDataSrc(undefined);
      return;
    }
    if (url.startsWith('data:')) {
      setDataSrc(url);
      return;
    }
    let isMounted = true;
    const loadImage = async () => {
      try {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('Network error');
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (isMounted) setDataSrc(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        if (isMounted) setDataSrc(url);
      }
    };
    loadImage();
    return () => { isMounted = false; };
  }, [url]);

  return dataSrc;
};

// Helper para renderizar texto com suporte a negrito via asteriscos
// Agora com forwardRef para permitir medição de altura
interface RenderRichTextProps {
    text: string;
    className?: string;
    style?: React.CSSProperties;
}

const RenderRichText = forwardRef<HTMLParagraphElement, RenderRichTextProps>(({ text, className, style }, ref) => {
  if (!text) return null;

  const parts = text.split(/(\*[^*]+\*)/g);
  
  return (
    <p ref={ref} className={className} style={style}>
      {parts.map((part, index) => {
        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <span key={index} className="font-bold">
              {part.slice(1, -1)}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </p>
  );
});

RenderRichText.displayName = 'RenderRichText';

export const QuoteCard = forwardRef<HTMLDivElement, QuoteCardProps>(({ data, scale = 1 }, ref) => {
  const backgroundSrc = useBase64Image("https://metarh.com.br/wp-content/uploads/2025/11/Fundo-Frases.jpg");
  const authorImageSrc = useBase64Image(data.authorImage);
  
  const textRef = useRef<HTMLParagraphElement>(null);

  // Lógica de redimensionamento automático
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // Configurações base
    // Reduzido de 63px para 59px conforme solicitado (-3pts)
    const MAX_FONT_SIZE = 59; 
    const LINE_HEIGHT = 1.1; 
    const MAX_LINES = 4;
    
    // Reseta para o tamanho máximo para iniciar a medição
    let currentSize = MAX_FONT_SIZE;
    el.style.fontSize = `${currentSize}px`;
    el.style.lineHeight = `${LINE_HEIGHT}`;

    // Função para verificar se excede o limite de linhas
    // Altura máxima permitida = Tamanho da Fonte * Line Height * Número de Linhas
    // Adicionamos uma pequena tolerância (+5px) para arredondamentos de renderização
    const exceedsLimit = (size: number) => {
        return el.scrollHeight > (size * LINE_HEIGHT * MAX_LINES) + 5;
    };

    // Loop para reduzir o tamanho se necessário
    while (exceedsLimit(currentSize) && currentSize > 20) {
        currentSize -= 1;
        el.style.fontSize = `${currentSize}px`;
    }

  }, [data.quote]); // Re-executa sempre que a frase muda

  return (
    <div 
      ref={ref}
      className="relative overflow-hidden bg-white flex flex-col font-sans"
      style={{
        width: '1080px',
        height: '1350px',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        flexShrink: 0,
      }}
    >
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 w-full h-full z-0">
        {backgroundSrc && (
            <img src={backgroundSrc} alt="Background" className="w-full h-full object-cover" />
        )}
      </div>

      {/* --- CONTENT STRUCTURE --- */}
      <div className="relative z-10 w-full h-full">
        
        {/* 1. Top Social Handle (@metarhconsultoria) - Y: 140px */}
        <div className="absolute top-[140px] w-full text-center">
            <span className="font-sans font-medium text-[28px] text-black tracking-wide">
                {data.socialHandle}
            </span>
        </div>

        {/* 2. Foto Redonda (Posicionada no Shape Esquerdo Inferior) - X:94, Y:750 */}
        <div 
            className="absolute rounded-full overflow-hidden bg-gray-200 z-20"
            style={{ 
                width: '287px', 
                height: '287px',
                left: '94px', 
                top: '750px'
            }}
        >
            {authorImageSrc ? (
                <img src={authorImageSrc} alt="Autor" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl bg-gray-100">?</div>
            )}
        </div>

        {/* 3. Conteúdo de Texto (Frase + Nome) */}
        {/* Largura 700px, Y: 306px */}
        <div 
            className="absolute flex flex-col items-center z-30"
            style={{
                top: '306px',
                width: '700px',
                left: '50%',
                transform: 'translateX(-50%)'
            }}
        >
             
             {/* Frase com tamanho dinâmico */}
             <RenderRichText 
                ref={textRef}
                text={data.quote} 
                className="font-sans font-normal text-black text-center transition-all duration-200 w-full break-words"
                // O style inicial é sobrescrito pelo useLayoutEffect, mas mantemos um padrão
                style={{ fontSize: '59px', lineHeight: '1.1' }}
             />
             
             {/* Cápsula Rosa com Nome */}
             <div className="mt-[50px] bg-brand-pink rounded-full px-8 py-3 shadow-md inline-block transform hover:scale-105 transition-transform">
                <span className="font-sans font-bold text-white text-[24px] uppercase tracking-wide">
                    {data.authorName}
                </span>
            </div>
        </div>

      </div>
    </div>
  );
});

QuoteCard.displayName = 'QuoteCard';