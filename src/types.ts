export interface PosterSettings {
  url: string;
  businessName: string;
  headline: string;
  subheadline: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  logoUrl: string | null;
  qrForegroundColor: string;
  qrBackgroundColor: string;
  template: 'google' | 'modern' | 'elegant';
  language: 'en' | 'hi' | 'ur' | 'es' | 'ar' | 'pt';
}
