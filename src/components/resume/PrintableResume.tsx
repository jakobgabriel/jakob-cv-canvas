import { forwardRef } from 'react';
import { getResumeData } from '@/data/resume';

interface PrintableResumeProps {
  language: string;
}

export const PrintableResume = forwardRef<HTMLDivElement, PrintableResumeProps>(
  ({ language }, ref) => {
    const resumeData = getResumeData(language);
    
    if (!resumeData) return null;

    const { basics, work, education, skills, languages, certificates } = resumeData;

    return (
      <div
        ref={ref}
        className="printable-resume"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '15mm 20mm',
          backgroundColor: '#ffffff',
          color: '#000000',
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: '10pt',
          lineHeight: '1.4',
          position: 'absolute',
          left: '-9999px',
          top: 0,
        }}
      >
        {/* Header */}
        <header style={{ marginBottom: '12px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
          <h1 style={{ 
            fontSize: '22pt', 
            fontWeight: 'bold', 
            margin: 0,
            letterSpacing: '-0.5px'
          }}>
            {basics.name}
          </h1>
          <p style={{ 
            fontSize: '12pt', 
            margin: '4px 0 8px 0',
            color: '#333'
          }}>
            {basics.label}
          </p>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '12px', 
            fontSize: '9pt',
            color: '#444'
          }}>
            {basics.email && <span>✉ {basics.email}</span>}
            {basics.phone && <span>☎ {basics.phone}</span>}
            {basics.location && (
              <span>📍 {basics.location.city}{basics.location.region ? `, ${basics.location.region}` : ''}</span>
            )}
            {basics.url && <span>🌐 {basics.url}</span>}
          </div>
        </header>

        {/* Summary */}
        {basics.summary && (
          <section style={{ marginBottom: '12px' }}>
            <h2 style={{ 
              fontSize: '11pt', 
              fontWeight: 'bold', 
              borderBottom: '1px solid #ccc',
              paddingBottom: '3px',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Professional Summary
            </h2>
            <p style={{ margin: 0, textAlign: 'justify' }}>{basics.summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {work && work.length > 0 && (
          <section style={{ marginBottom: '12px' }}>
            <h2 style={{ 
              fontSize: '11pt', 
              fontWeight: 'bold', 
              borderBottom: '1px solid #ccc',
              paddingBottom: '3px',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Professional Experience
            </h2>
            {work.slice(0, 4).map((job, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '10pt' }}>{job.position}</strong>
                  <span style={{ fontSize: '9pt', color: '#555' }}>
                    {job.startDate} — {job.endDate || 'Present'}
                  </span>
                </div>
                <div style={{ fontSize: '9pt', color: '#333', marginBottom: '3px' }}>
                  {job.name}{job.location ? `, ${job.location}` : ''}
                </div>
                {job.highlights && job.highlights.length > 0 && (
                  <ul style={{ 
                    margin: '3px 0 0 0', 
                    paddingLeft: '16px',
                    fontSize: '9pt'
                  }}>
                    {job.highlights.slice(0, 3).map((highlight, hIndex) => (
                      <li key={hIndex} style={{ marginBottom: '2px' }}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section style={{ marginBottom: '12px' }}>
            <h2 style={{ 
              fontSize: '11pt', 
              fontWeight: 'bold', 
              borderBottom: '1px solid #ccc',
              paddingBottom: '3px',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Education
            </h2>
            {education.map((edu, index) => (
              <div key={index} style={{ marginBottom: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '10pt' }}>{edu.studyType} in {edu.area}</strong>
                  <span style={{ fontSize: '9pt', color: '#555' }}>
                    {edu.startDate} — {edu.endDate || 'Present'}
                  </span>
                </div>
                <div style={{ fontSize: '9pt', color: '#333' }}>{edu.institution}</div>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section style={{ marginBottom: '12px' }}>
            <h2 style={{ 
              fontSize: '11pt', 
              fontWeight: 'bold', 
              borderBottom: '1px solid #ccc',
              paddingBottom: '3px',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.map((skill, index) => (
                <div key={index} style={{ fontSize: '9pt' }}>
                  <strong>{skill.name}:</strong>{' '}
                  {skill.keywords?.join(', ')}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two-column footer: Languages and Certifications */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Languages */}
          {languages && languages.length > 0 && (
            <section style={{ flex: 1 }}>
              <h2 style={{ 
                fontSize: '11pt', 
                fontWeight: 'bold', 
                borderBottom: '1px solid #ccc',
                paddingBottom: '3px',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Languages
              </h2>
              <div style={{ fontSize: '9pt' }}>
                {languages.map((lang, index) => (
                  <span key={index}>
                    {lang.language} ({lang.fluency}){index < languages.length - 1 ? ' • ' : ''}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certificates && certificates.length > 0 && (
            <section style={{ flex: 1 }}>
              <h2 style={{ 
                fontSize: '11pt', 
                fontWeight: 'bold', 
                borderBottom: '1px solid #ccc',
                paddingBottom: '3px',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Certifications
              </h2>
              <div style={{ fontSize: '9pt' }}>
                {certificates.slice(0, 4).map((cert, index) => (
                  <div key={index} style={{ marginBottom: '2px' }}>
                    {cert.name} ({cert.date})
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }
);

PrintableResume.displayName = 'PrintableResume';
