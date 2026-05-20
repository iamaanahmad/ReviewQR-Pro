import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Settings, Printer, Image as ImageIcon, Link as LinkIcon, Type, Palette, LayoutTemplate, Download, Share2, Facebook, Twitter, Linkedin, Link2, Globe } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PosterSettings } from './types';

const translations = {
  en: {
    headline: "Review us on Google",
    instructions: "Scan the QR code to leave a review",
    reviewBadge: "Reviews",
    seoDesc: "Generate a free, beautiful, and printable QR code poster for your Google Business Profile."
  },
  hi: {
    headline: "Google पर हमारी समीक्षा करें",
    instructions: "समीक्षा देने के लिए QR कोड को स्कैन करें",
    reviewBadge: "समीक्षाएँ",
    seoDesc: "अपने Google व्यवसाय प्रोफ़ाइल के लिए मुफ़्त और प्रिंट करने योग्य QR कोड पोस्टर बनाएँ।"
  },
  ur: {
    headline: "Google پر ہمارا جائزہ لیں",
    instructions: "جائزہ چھوڑنے کے لیے QR کوڈ اسکین کریں",
    reviewBadge: "جائزے",
    seoDesc: "اپنے گوگل بزنس پروفائل کے لیے ایک مفت اور پرنٹ کے قابل کیو آر کوڈ پوسٹر بنائیں۔"
  },
  es: {
    headline: "Califícanos en Google",
    instructions: "Escanea el código QR para dejar una reseña",
    reviewBadge: "Reseñas",
    seoDesc: "Genera un póster de código QR gratuito e imprimible para tu Perfil de Negocio de Google."
  },
  ar: {
    headline: "قيمنا على جوجل",
    instructions: "امسح رمز الاستجابة السريعة لترك مراجعة",
    reviewBadge: "المراجعات",
    seoDesc: "أنشئ ملصق رمز استجابة سريعة مجاني وقابل للطباعة لملف تعريف نشاطك التجاري على جوجل."
  },
  pt: {
    headline: "Avalie-nos no Google",
    instructions: "Escaneie o código QR para deixar uma avaliação",
    reviewBadge: "Avaliações",
    seoDesc: "Gere um pôster de código QR gratuito e imprimível para o seu Perfil de Empresa do Google."
  }
};

export default function App() {
  const [settings, setSettings] = useState<PosterSettings>({
    url: 'https://g.page/r/example/review',
    businessName: "Joe's Coffee Shop",
    headline: 'Review us on Google',
    subheadline: '1. Open your phone camera\n2. Point it at the QR code',
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#202124',
    logoUrl: null,
    qrForegroundColor: '#000000',
    qrBackgroundColor: '#ffffff',
    template: 'google',
    language: 'en',
  });

  useEffect(() => {
    document.documentElement.lang = settings.language;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', translations[settings.language].seoDesc);
    }
  }, [settings.language]);

  const convertOklchToRgb = (element: HTMLElement) => {
    const computedStyle = window.getComputedStyle(element);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;
    const borderColor = computedStyle.borderColor;
    
    if (color && color.includes('oklch')) {
      element.style.color = color;
    }
    if (backgroundColor && backgroundColor.includes('oklch')) {
      element.style.backgroundColor = backgroundColor;
    }
    if (borderColor && borderColor.includes('oklch')) {
      element.style.borderColor = borderColor;
    }
  };

  const prepareForExport = (element: HTMLElement) => {
    // Convert all oklch colors to rgb by forcing browser computation
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        convertOklchToRgb(el);
      }
    });
    convertOklchToRgb(element);
  };

  const handlePrint = async () => {
    const printArea = document.getElementById('print-area');
    if (!printArea) return;
    
    try {
      // Clone the element to avoid modifying the original
      const clone = printArea.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      document.body.appendChild(clone);
      
      prepareForExport(clone);
      
      const canvas = await html2canvas(clone, { 
        scale: 3, 
        useCORS: true, 
        allowTaint: true,
        backgroundColor: settings.backgroundColor, 
        logging: false,
        imageTimeout: 0,
        removeContainer: true
      });
      
      document.body.removeChild(clone);
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`review-poster-${settings.businessName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (err) {
      console.error('Error generating PDF', err);
      alert('Error generating PDF. Please try again or use the browser print function.');
    }
  };

  const handleDownloadImage = async () => {
    const printArea = document.getElementById('print-area');
    if (!printArea) return;
    
    try {
      // Clone the element to avoid modifying the original
      const clone = printArea.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      document.body.appendChild(clone);
      
      prepareForExport(clone);
      
      const canvas = await html2canvas(clone, { 
        scale: 3, 
        useCORS: true, 
        allowTaint: true,
        backgroundColor: settings.backgroundColor, 
        logging: false,
        imageTimeout: 0,
        removeContainer: true
      });
      
      document.body.removeChild(clone);
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `review-poster-${settings.businessName.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating image', err);
      alert('Error generating image. Please try again.');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSettings(s => ({ ...s, logoUrl: url }));
    }
  };

  const removeLogo = () => {
    if (settings.logoUrl) {
      URL.revokeObjectURL(settings.logoUrl);
    }
    setSettings(s => ({ ...s, logoUrl: null }));
  };

  const shareUrl = window.location.href;
  const shareTitle = "Free Google Review QR Code Generator - Get more local reviews!";
  
  const shareOnFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  const shareOnTwitter = () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
  const shareOnLinkedIn = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans text-slate-800 overflow-hidden print:overflow-visible">
      {/* Sidebar Controls */}
      <aside className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col flex-shrink-0 print:hidden lg:h-screen lg:sticky top-0 z-20">
        <div className="p-4 lg:p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <LayoutTemplate size={20} />
              </div>
              <h1 className="font-bold text-xl tracking-tight text-slate-900">ReviewQR Pro</h1>
            </div>
            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">QR Generator & Designer</p>
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-6">
          {/* Content Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase border-b pb-2 flex items-center gap-2">
              <Type size={16} /> Content
            </h3>
            
            <div className="space-y-4">
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase">Language / Locale</span>
                <select
                  value={settings.language}
                  onChange={e => {
                    const newLang = e.target.value as PosterSettings['language'];
                    setSettings(s => ({ 
                      ...s, 
                      language: newLang,
                      // Update headline to new language if they haven't customized it, or just always update
                      headline: translations[newLang].headline
                    }));
                  }}
                  className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="en">English</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="pt">Português (Portuguese)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="ur">اردو (Urdu)</option>
                  <option value="ar">العربية (Arabic)</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase">Google Review URL</span>
                <input
                  type="text"
                  value={settings.url}
                  onChange={e => setSettings(s => ({ ...s, url: e.target.value }))}
                  className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-blue-600 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://g.page/..."
                />
              </label>
              
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase">Business Name</span>
                <input
                  type="text"
                  value={settings.businessName}
                  onChange={e => setSettings(s => ({ ...s, businessName: e.target.value }))}
                  className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase">Headline</span>
                <input
                  type="text"
                  value={settings.headline}
                  onChange={e => setSettings(s => ({ ...s, headline: e.target.value }))}
                  className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </label>
            </div>
          </section>

          {/* Design Section */}
          <section className="space-y-4">
             <h3 className="text-xs font-bold text-slate-400 uppercase border-b pb-2 flex items-center gap-2">
              <Palette size={16} /> Appearance
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium">Template Style</span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {(['google', 'modern', 'elegant'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setSettings(s => ({ ...s, template: t }))}
                      className={`px-3 py-2 text-xs rounded-md font-semibold transition-colors capitalize border ${settings.template === t ? 'border-2 border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={e => setSettings(s => ({ ...s, primaryColor: e.target.value }))}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-xs text-slate-500 font-mono uppercase">{settings.primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.textColor}
                      onChange={e => setSettings(s => ({ ...s, textColor: e.target.value }))}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-xs text-slate-500 font-mono uppercase">{settings.textColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">QR Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.qrForegroundColor}
                      onChange={e => setSettings(s => ({ ...s, qrForegroundColor: e.target.value }))}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-xs text-slate-500 font-mono uppercase">{settings.qrForegroundColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.backgroundColor}
                      onChange={e => setSettings(s => ({ ...s, backgroundColor: e.target.value }))}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-xs text-slate-500 font-mono uppercase">{settings.backgroundColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Logo Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase border-b pb-2 flex items-center gap-2">
              <ImageIcon size={16} /> Branding
            </h3>
            
            <div className="space-y-3">
              <span className="block text-sm font-medium">Business Logo</span>
              {settings.logoUrl ? (
                <div className="flex items-center gap-4 p-3 border border-slate-200 rounded-md bg-slate-50 w-full">
                  <img src={settings.logoUrl} alt="Logo" className="w-12 h-12 object-contain bg-white rounded border border-slate-200" />
                  <button 
                    onClick={removeLogo}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                      <ImageIcon className="w-6 h-6 mb-2" />
                      <p className="text-xs font-medium">Click to upload logo</p>
                      <p className="text-[10px]">PNG, JPG up to 2MB</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  </label>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="p-4 lg:p-6 border-t border-slate-100 bg-slate-50 space-y-4 flex-shrink-0">
          <div className="space-y-3">
            <button 
              onClick={handleDownloadImage}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors"
            >
              <Download size={20} />
              Download PNG Image
            </button>
            <button 
              onClick={handlePrint}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors"
            >
              <Printer size={20} />
              Print / Save as PDF
            </button>
          </div>

          {/* Share Section */}
          <div className="pt-2">
            <div className="flex items-center gap-1 justify-center text-slate-500 font-semibold text-xs mb-2">
              <Share2 size={14} />
              <span>Share this Free Tool</span>
            </div>
            <div className="flex items-center justify-center gap-2">
               <button onClick={shareOnFacebook} className="p-2 bg-white rounded-md text-blue-600 hover:bg-blue-100 border border-blue-200 transition-colors shadow-sm" title="Share on Facebook"><Facebook size={18} /></button>
               <button onClick={shareOnTwitter} className="p-2 bg-white rounded-md text-sky-500 hover:bg-sky-100 border border-blue-200 transition-colors shadow-sm" title="Share on Twitter"><Twitter size={18} /></button>
               <button onClick={shareOnLinkedIn} className="p-2 bg-white rounded-md text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors shadow-sm" title="Share on LinkedIn"><Linkedin size={18} /></button>
               <button onClick={copyLink} className="p-2 bg-white rounded-md text-slate-600 hover:bg-slate-100 border border-blue-200 transition-colors shadow-sm" title="Copy Link"><Link2 size={18} /></button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 flex flex-col p-6 sm:p-10 items-center justify-start bg-slate-200 shadow-inner overflow-x-auto overflow-y-auto">
        <div className="mb-6 w-full max-w-[500px] flex items-center justify-between print:hidden">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Live Preview</p>
        </div>

        {/* The Poster Container */}
        <div 
          className="bg-white shadow-2xl overflow-hidden relative flex flex-col w-[500px] h-[707px] flex-shrink-0 rounded-sm print:m-0 print:w-full print:h-[100vh] print:max-w-none print:shadow-none"
          id="print-area"
          style={{ backgroundColor: settings.backgroundColor }}
        >
          {renderTemplate(settings)}
        </div>
        
        {/* Helper Text */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-slate-500 text-xs print:hidden">
          <span className="flex items-center gap-1"><Printer size={14} /> High-Resolution Layout</span>
          <span className="flex items-center gap-1"><ImageIcon size={14} /> Vector Quality Output</span>
        </div>
      </main>
    </div>
  );
}

function renderTemplate(settings: PosterSettings) {
  // Common QR Code props
  const qrProps = {
    value: settings.url,
    size: 280,
    fgColor: settings.qrForegroundColor,
    bgColor: settings.qrBackgroundColor,
    level: 'H' as const,
    includeMargin: true,
    imageSettings: settings.logoUrl ? {
      src: settings.logoUrl,
      x: undefined,
      y: undefined,
      height: 60,
      width: 60,
      excavate: true,
    } : undefined
  };

  const instructionsText = translations[settings.language].instructions;
  const reviewBadgeText = translations[settings.language].reviewBadge;

  const GoogleLogo = () => (
    <svg viewBox="0 0 24 24" className="w-10 h-10">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  const GoogleColorsBand = () => (
    <div className="h-4 w-full flex">
      <div className="w-1/4 bg-[#4285F4]"></div>
      <div className="w-1/4 bg-[#EA4335]"></div>
      <div className="w-1/4 bg-[#FBBC05]"></div>
      <div className="w-1/4 bg-[#34A853]"></div>
    </div>
  );

  const StarRating = () => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className="w-8 h-8 text-[#FBBC05] fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );

  switch (settings.template) {
    case 'modern':
      return (
        <div className="w-full h-full flex flex-col font-outfit relative">
          <GoogleColorsBand />
          <div className="flex-1 flex flex-col p-8 justify-between">
            <div className="text-center pt-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <GoogleLogo />
                <span className="text-xl font-semibold tracking-tight text-slate-700">{reviewBadgeText}</span>
              </div>
              <h1 
                className="text-4xl font-extrabold tracking-tight mb-3 px-4" 
                style={{ color: settings.primaryColor }}
              >
                {settings.headline}
              </h1>
              <p 
                className="text-xl font-medium max-w-lg mx-auto leading-snug whitespace-pre-line px-4" 
                style={{ color: settings.textColor }}
              >
                {instructionsText}
              </p>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center mt-4 mb-4 min-h-0">
              <div className="bg-white rounded-[2rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-[4px]" style={{ borderColor: settings.primaryColor }}>
                <QRCodeCanvas {...qrProps} size={230} />
              </div>
            </div>

            <div className="text-center pb-4 flex flex-col items-center shrink-0">
              <div className="flex items-center justify-center gap-3 opacity-90 mb-3">
                {settings.logoUrl && (
                  <img src={settings.logoUrl} alt="Logo" className="h-12 w-12 object-contain" />
                )}
                <h2 className="text-2xl font-bold" style={{ color: settings.textColor }}>
                  {settings.businessName}
                </h2>
              </div>
              <StarRating />
            </div>
          </div>
        </div>
      );

    case 'elegant':
      return (
        <div className="w-full h-full flex flex-col relative font-serif" style={{ borderColor: settings.primaryColor, borderWidth: '12px' }}>
          <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black to-transparent pointer-events-none"></div>
          
          <GoogleColorsBand />
          
          <div className="flex-1 flex flex-col items-center justify-between p-8 text-center">
            
            <div className="flex flex-col items-center shrink-0 w-full mt-2">
              <div className="flex flex-col items-center gap-2 mb-4">
                <GoogleLogo />
              </div>
              
              {settings.logoUrl && (
                <img src={settings.logoUrl} alt="Logo" className="h-14 w-auto object-contain mb-3 shadow-sm rounded-full bg-white p-2" />
              )}

              <h2 className="text-2xl italic font-medium mb-1 tracking-wide line-clamp-2" style={{ color: settings.textColor }}>
                {settings.businessName}
              </h2>

              <h1 className="text-3xl font-bold mb-2 leading-tight mt-2 px-4 line-clamp-2" style={{ color: settings.primaryColor }}>
                {settings.headline}
              </h1>

              <p className="text-[1rem] max-w-xs mx-auto opacity-80 leading-relaxed font-sans font-light whitespace-pre-line px-4" style={{ color: settings.textColor }}>
                {instructionsText}
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center min-h-0 py-4 w-full">
              <div className="bg-white p-4 shadow-xl rounded-xl border-2 pointer-events-none" style={{ borderColor: settings.primaryColor }}>
                <QRCodeCanvas {...qrProps} size={180} />
              </div>
            </div>

            <div className="shrink-0 mb-2">
              <StarRating />
            </div>
          </div>
        </div>
      );

    case 'google':
    default:
      return (
        <div className="w-full h-full bg-white relative flex flex-col items-center justify-between py-6 px-6 overflow-hidden font-sans box-border" style={{ backgroundColor: settings.backgroundColor }}>
          {/* Google Frame Borders */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-[#4285F4]"></div>
          <div className="absolute top-0 bottom-0 right-0 w-4 bg-[#EA4335]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#FBBC05]"></div>
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-[#34A853]"></div>

          {/* Inside Content Wrapper */}
          <div className="flex-1 flex flex-col items-center justify-between z-10 w-full h-full pt-4 pb-2">
            
            {/* Header (Business Name, Stars & Headline) */}
            <div className="flex flex-col items-center mt-2 w-full px-4 shrink-0">
              <h2 className="text-[2rem] font-extrabold pb-2 w-full text-center break-words leading-tight" style={{ color: settings.textColor !== '#1f2937' ? settings.textColor : '#202124' }}>
                {settings.businessName}
              </h2>
              <StarRating />
              <h1 className="text-[2.25rem] font-bold tracking-tight mt-3 text-center leading-tight px-2 w-full line-clamp-2" style={{ color: settings.textColor !== '#1f2937' ? settings.textColor : '#202124' }}>
                {settings.headline || 'Review us on Google'}
              </h1>
            </div>

            {/* QR Code Section */}
            <div className="flex-1 flex items-center justify-center min-h-0 py-4">
              <QRCodeCanvas 
                {...qrProps} 
                size={230} 
                imageSettings={{
                  src: settings.logoUrl || 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2048%2048%22%3E%3Ccircle%20cx%3D%2224%22%20cy%3D%2224%22%20r%3D%2224%22%20fill%3D%22%23ffffff%22%2F%3E%3Cpath%20fill%3D%22%234285F4%22%20d%3D%22M45.12%2024.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51%202.75-2.06%205.08-4.39%206.64v5.52h7.11c4.16-3.83%206.56-9.47%206.56-16.17z%22%2F%3E%3Cpath%20fill%3D%22%2334A853%22%20d%3D%22M24%2046c5.94%200%2010.92-1.97%2014.56-5.33l-7.11-5.52c-1.97%201.32-4.49%202.1-7.45%202.1-5.73%200-10.58-3.87-12.31-9.07H4.34v5.7C7.96%2041.07%2015.4%2046%2024%2046z%22%2F%3E%3Cpath%20fill%3D%22%23FBBC05%22%20d%3D%22M11.69%2028.18A12.94%2012.94%200%200%201%2011.05%2024c0-1.45.25-2.86.71-4.18v-5.7H4.34A23.95%2023.95%200%200%200%200%2024c0%203.86%201%207.49%202.89%2010.82l7.8-5.64z%22%2F%3E%3Cpath%20fill%3D%22%23EA4335%22%20d%3D%22M24%2010.75c3.23%200%206.13%201.11%208.41%203.29l6.31-6.31C34.91%204.14%2029.93%202%2024%202%2015.4%202%207.96%206.93%204.34%2014.12l7.35%205.7c1.73-5.2%206.58-9.07%2012.31-9.07z%22%2F%3E%3C%2Fsvg%3E',
                  height: 60,
                  width: 60,
                  excavate: true
                }}
              />
            </div>

            {/* Footer (Instructions) */}
            <div className="flex flex-col items-center flex-shrink-0 w-full mt-1 mb-2">
              <div className="text-center font-bold text-[1.1rem] text-slate-500 opacity-90 leading-tight px-4 whitespace-pre-line">
                {instructionsText}
              </div>
            </div>
          </div>
        </div>
      );
  }
}

