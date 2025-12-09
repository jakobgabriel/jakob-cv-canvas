import { useState, useRef, useCallback } from 'react';
import html2pdf from 'html2pdf.js';
import { getResumeData } from '@/data/resume';

interface UsePDFDownloadOptions {
  language: string;
}

export const usePDFDownload = ({ language }: UsePDFDownloadOptions) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const printableRef = useRef<HTMLDivElement>(null);

  const generatePDF = useCallback(async () => {
    const resumeData = getResumeData(language);
    
    if (!printableRef.current || !resumeData) {
      setError('Resume data not available');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const element = printableRef.current;
      const fileName = `${resumeData.basics.name.replace(/\s+/g, '_')}_Resume.pdf`;

      const options = {
        margin: 0,
        filename: fileName,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' as const
        },
        pagebreak: { mode: 'avoid-all' }
      };

      await html2pdf().set(options).from(element).save();
    } catch (err) {
      console.error('PDF generation error:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [language]);

  return {
    printableRef,
    generatePDF,
    isGenerating,
    error
  };
};
