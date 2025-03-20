export interface User {
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

export interface MeditationSession {
  id: string;
  title: string;
  duration: number;
  description: string;
  recommendedAge: [number, number];
  suitable: ('male' | 'female' | 'other')[];
  audioUrl: string;
  imageUrl: string;
}