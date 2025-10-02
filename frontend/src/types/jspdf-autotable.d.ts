declare module 'jspdf-autotable' {
  import type { jsPDF } from 'jspdf';
  interface AutoTableOptions {
    startY?: number;
    head?: any[];
    body?: any[];
    styles?: Record<string, any>;
    headStyles?: Record<string, any>;
  }
  export default function autoTable(doc: jsPDF, options: AutoTableOptions): void;
}


