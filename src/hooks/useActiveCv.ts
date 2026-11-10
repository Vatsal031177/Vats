import { useState, useEffect } from 'react';

export interface CvInfo {
  url: string;
  filename: string;
  uploadedAt: string;
  sizeBytes: number;
}

const DEFAULT_CV: CvInfo = {
  url: './assets/aistudio/all_CV_01171a6c.pdf',
  filename: 'Vatsal_Maisuria_CV.pdf',
  uploadedAt: new Date().toISOString(),
  sizeBytes: 416300,
};

// Global event listener to synchronize CV updates instantly across all components
const CV_UPDATED_EVENT = 'vatsal_cv_updated';

export function notifyCvUpdated(newCv: CvInfo) {
  try {
    localStorage.setItem('vatsal_active_cv', JSON.stringify(newCv));
  } catch {
    // Ignore localStorage errors
  }
  window.dispatchEvent(new CustomEvent(CV_UPDATED_EVENT, { detail: newCv }));
}

export function useActiveCv() {
  const [cvInfo, setCvInfo] = useState<CvInfo>(() => {
    try {
      const stored = localStorage.getItem('vatsal_active_cv');
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return DEFAULT_CV;
  });

  const fetchCvInfo = async () => {
    try {
      const res = await fetch('/api/cv/info');
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          const updated: CvInfo = {
            url: data.url,
            filename: data.filename || 'Vatsal_Maisuria_CV.pdf',
            uploadedAt: data.uploadedAt || new Date().toISOString(),
            sizeBytes: data.sizeBytes || 416300,
          };
          setCvInfo(updated);
          localStorage.setItem('vatsal_active_cv', JSON.stringify(updated));
        }
      }
    } catch {
      // In static GitHub Pages mode, keep using the stored or default relative path
    }
  };

  useEffect(() => {
    fetchCvInfo();

    const handleCvUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<CvInfo>;
      if (customEvent.detail) {
        setCvInfo(customEvent.detail);
      } else {
        fetchCvInfo();
      }
    };

    window.addEventListener(CV_UPDATED_EVENT, handleCvUpdated);
    return () => window.removeEventListener(CV_UPDATED_EVENT, handleCvUpdated);
  }, []);

  return { cvInfo, refreshCv: fetchCvInfo };
}
