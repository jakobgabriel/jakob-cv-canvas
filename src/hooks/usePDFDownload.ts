import { useState, useCallback } from 'react';
import html2pdf from 'html2pdf.js';
import { getResumeData } from '@/data/resume';

interface UsePDFDownloadOptions {
  language: string;
}

export const usePDFDownload = ({ language }: UsePDFDownloadOptions) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = useCallback(async () => {
    const resumeData = getResumeData(language);
    
    if (!resumeData) {
      setError('Resume data not available');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const { basics, work, education, skills, languages, certificates } = resumeData;
      const fileName = `${basics.name.replace(/\s+/g, '_')}_Resume.pdf`;

      // Create a temporary container for PDF generation
      const container = document.createElement('div');
      container.style.cssText = `
        width: 210mm;
        min-height: 297mm;
        padding: 15mm 20mm;
        background-color: #ffffff;
        color: #000000;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 10pt;
        line-height: 1.4;
        position: fixed;
        left: 0;
        top: 0;
        z-index: -9999;
      `;

      // Build the HTML content
      container.innerHTML = `
        <header style="margin-bottom: 12px; border-bottom: 2px solid #000; padding-bottom: 10px;">
          <h1 style="font-size: 22pt; font-weight: bold; margin: 0; letter-spacing: -0.5px;">
            ${basics.name}
          </h1>
          <p style="font-size: 12pt; margin: 4px 0 8px 0; color: #333;">
            ${basics.label}
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 9pt; color: #444;">
            ${basics.email ? `<span>✉ ${basics.email}</span>` : ''}
            ${basics.phone ? `<span>☎ ${basics.phone}</span>` : ''}
            ${basics.location ? `<span>📍 ${basics.location.city}${basics.location.region ? `, ${basics.location.region}` : ''}</span>` : ''}
            ${basics.url ? `<span>🌐 ${basics.url}</span>` : ''}
          </div>
        </header>

        ${basics.summary ? `
          <section style="margin-bottom: 12px;">
            <h2 style="font-size: 11pt; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">
              Professional Summary
            </h2>
            <p style="margin: 0; text-align: justify;">${basics.summary}</p>
          </section>
        ` : ''}

        ${work && work.length > 0 ? `
          <section style="margin-bottom: 12px;">
            <h2 style="font-size: 11pt; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">
              Professional Experience
            </h2>
            ${work.slice(0, 4).map(job => `
              <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <strong style="font-size: 10pt;">${job.position}</strong>
                  <span style="font-size: 9pt; color: #555;">${job.startDate} — ${job.endDate || 'Present'}</span>
                </div>
                <div style="font-size: 9pt; color: #333; margin-bottom: 3px;">
                  ${job.name}${job.location ? `, ${job.location}` : ''}
                </div>
                ${job.highlights && job.highlights.length > 0 ? `
                  <ul style="margin: 3px 0 0 0; padding-left: 16px; font-size: 9pt;">
                    ${job.highlights.slice(0, 3).map(h => `<li style="margin-bottom: 2px;">${h}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}

        ${education && education.length > 0 ? `
          <section style="margin-bottom: 12px;">
            <h2 style="font-size: 11pt; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">
              Education
            </h2>
            ${education.map(edu => `
              <div style="margin-bottom: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <strong style="font-size: 10pt;">${edu.studyType} in ${edu.area}</strong>
                  <span style="font-size: 9pt; color: #555;">${edu.startDate} — ${edu.endDate || 'Present'}</span>
                </div>
                <div style="font-size: 9pt; color: #333;">${edu.institution}</div>
              </div>
            `).join('')}
          </section>
        ` : ''}

        ${skills && skills.length > 0 ? `
          <section style="margin-bottom: 12px;">
            <h2 style="font-size: 11pt; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">
              Skills
            </h2>
            <div style="font-size: 9pt;">
              ${skills.map(skill => `
                <div style="margin-bottom: 4px;">
                  <strong>${skill.name}:</strong> ${skill.keywords?.join(', ') || ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <div style="display: flex; gap: 20px;">
          ${languages && languages.length > 0 ? `
            <section style="flex: 1;">
              <h2 style="font-size: 11pt; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">
                Languages
              </h2>
              <div style="font-size: 9pt;">
                ${languages.map((lang, i) => `${lang.language} (${lang.fluency})${i < languages.length - 1 ? ' • ' : ''}`).join('')}
              </div>
            </section>
          ` : ''}

          ${certificates && certificates.length > 0 ? `
            <section style="flex: 1;">
              <h2 style="font-size: 11pt; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">
                Certifications
              </h2>
              <div style="font-size: 9pt;">
                ${certificates.slice(0, 4).map(cert => `
                  <div style="margin-bottom: 2px;">${cert.name} (${cert.date})</div>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </div>
      `;

      document.body.appendChild(container);

      const options = {
        margin: 0,
        filename: fileName,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' as const
        },
        pagebreak: { mode: 'avoid-all' }
      };

      await html2pdf().set(options).from(container).save();
      
      // Clean up
      document.body.removeChild(container);
    } catch (err) {
      console.error('PDF generation error:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [language]);

  return {
    generatePDF,
    isGenerating,
    error
  };
};