
export interface QuoteData {
  socialHandle: string;
  quote: string;
  authorName: string;
  authorRole: string; // Opcional agora, dependendo do layout, mas mantido na estrutura
  authorImage: string;
  footerLogoUrl: string | null;
  websiteUrl: string;
}

export interface BookData {
  bookTitle: string;
  bookAuthor: string;
  coverImage: string;
  review: string; // Pequeno texto de recomendação
  socialHandle: string;
  footerLogoUrl: string | null;
}

export interface JobData {
  jobTitle: string;
  imageUrl: string;
  tagline: string;
  sector: string;
  jobCode: string;
  contractType: string;
  modality: string;
  location: string;
  websiteUrl: string;
  footerLogoUrl: string | null;
}

export const INITIAL_QUOTE_DATA: QuoteData = {
  socialHandle: '@metarhconsultoria',
  quote: 'A única maneira de fazer um *excelente trabalho* é amar o que você faz.',
  authorName: 'Steve Jobs',
  authorRole: 'Co-fundador da Apple',
  authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  footerLogoUrl: 'https://metarh.com.br/wp-content/uploads/2025/11/logo_METARH.png',
  websiteUrl: 'www.metarh.com.br'
};

export const INITIAL_BOOK_DATA: BookData = {
  bookTitle: 'Essencialismo',
  bookAuthor: 'Greg McKeown',
  coverImage: 'https://m.media-amazon.com/images/I/71e76RzC7eL._AC_UF1000,1000_QL80_.jpg',
  review: 'Um livro indispensável para quem se sente sobrecarregado e quer focar no que realmente importa.',
  socialHandle: '@metarhconsultoria',
  footerLogoUrl: 'https://metarh.com.br/wp-content/uploads/2025/11/logo_METARH.png',
};

export const INITIAL_JOB_DATA: JobData = {
  jobTitle: 'Analista de RH Sênior',
  imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  tagline: 'Transforme Talentos',
  sector: 'Recursos Humanos',
  jobCode: 'RH-2025',
  contractType: 'CLT',
  modality: 'Híbrido',
  location: 'São Paulo - SP',
  websiteUrl: 'www.metarh.com.br',
  footerLogoUrl: 'https://metarh.com.br/wp-content/uploads/2025/11/logo_METARH.png',
};
