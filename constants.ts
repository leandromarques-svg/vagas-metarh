
import { LibraryImage } from './types';

// Configuration for MetaRH Selecty Integration

export const SELECTY_API_TOKEN = "eyJpdiI6IjlRRENGQ0hVMWkwWDZSYlFsVFRaeEE9PSIsInZhbHVlIjoiaTFkaTd2TnhndHlnb2tNVC9jcU1MWDVvN1hGSVBVcDFiczZqZE9MMHdHRT0iLCJtYWMiOiIwODZhNjAwMDU2ODE0OWMyYTIyMTIxZGYyZGUyMTY3MjQ0MzQyMGQ4NGJlZjNhMTcxZGI3NmVmNzM0ZjVkNDA1IiwidGFnIjoiIn0=";

// API Base URL
export const API_BASE_URL = "https://api.selecty.app/v2";

// MetaRH Configuration
export const COMPANY_NAME = "MetaRH";
export const PORTAL_URL = "https://metarh.selecty.com.br/";

// Initial Image Library
export const INITIAL_LIBRARY_IMAGES: LibraryImage[] = [
    // Mulheres
    { id: '1', tags: ['Mulher'], url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" },
    { id: '2', tags: ['Mulher', 'Negros'], url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80" },
    { id: '3', tags: ['Mulher'], url: "https://images.unsplash.com/photo-1598550832205-d416966b840e?auto=format&fit=crop&w=600&q=80" },
    { id: '4', tags: ['Mulher', 'Negros', '50+'], url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80" },
    { id: '5', tags: ['Mulher'], url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80" },
    // Homens
    { id: '6', tags: ['Homem', 'Negros'], url: "https://images.unsplash.com/photo-1664575602554-2087b04935a5?auto=format&fit=crop&w=600&q=80" },
    { id: '7', tags: ['Homem'], url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80" },
    { id: '8', tags: ['Homem', '50+'], url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80" },
    // LGBTQIAPN+ (Conceitual/Diverso)
    { id: '9', tags: ['LGBTQIAPN+', 'Mulher'], url: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=600&q=80" },
    { id: '10', tags: ['LGBTQIAPN+', 'Homem'], url: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=600&q=80" },
    // 50+
    { id: '11', tags: ['50+', 'Homem'], url: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80" },
    { id: '12', tags: ['50+', 'Mulher'], url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80" },
    // Mistos / Grupos
    { id: '13', tags: ['Negros', 'Mulher'], url: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=600&q=80" },
    { id: '14', tags: ['Negros', 'Homem'], url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80" },
];
