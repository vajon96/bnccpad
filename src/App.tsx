import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Plus, 
  Calendar, 
  Hash, 
  Settings2, 
  FileJson,
  Layout,
  History,
  ChevronRight,
  Save,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DocumentPreview } from './components/DocumentPreview';
import { RichTextEditor } from './components/RichTextEditor';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// --- Types ---
interface Template {
  id: string;
  name: string;
  category: 'Application' | 'BNCC' | 'Official';
  content: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'leave',
    name: 'ছুটির আবেদন',
    category: 'Application',
    content: `
      <p>প্রতি,</p>
      <p>অধ্যক্ষ মহোদয়,</p>
      <p>কক্সবাজার সিটি কলেজ।</p>
      <p><strong>বিষয়: ছুটির আবেদন।</strong></p>
      <p>জনাব,</p>
      <p>বিনীত নিবেদন এই যে, আমি আপনার কলেজের বিএনসিসি প্লাটুন এর একজন ক্যাডেট। পারিবারিক সমস্যার কারণে আগামী [তারিখ] থেকে [তারিখ] তারিখ পর্যন্ত মোট [দিন] দিন আমার পক্ষে প্যারেডে উপস্থিত থাকা সম্ভব হবে না।</p>
      <p>অতএব, প্রার্থনা এই যে, আমাকে উক্ত দিনগুলোর জন্য ছুটি মঞ্জুর করে বাধিত করবেন।</p>
      <p>বিনীত,</p>
      <p>আপনার অনুগত ক্যাডেট,</p>
      <p>[আপনার নাম]</p>
      <p>ক্যাডেট নং: [নং]</p>
    `,
  },
  {
    id: 'parade',
    name: 'প্যারেড রিপোর্ট',
    category: 'BNCC',
    content: `
      <h3 style="text-align: center;">প্যারেড রিপোর্ট</h3>
      <p><strong>তারিখ:</strong> [তারিখ]</p>
      <p><strong>সময়:</strong> [সময়]</p>
      <p><strong>প্লাটুন:</strong> কক্সবাজার সিটি কলেজ প্লাটুন</p>
      <hr>
      <p><strong>কর্মসূচী:</strong></p>
      <ul>
        <li>ড্রিল প্র্যাকটিস</li>
        <li>তাত্ত্বিক ক্লাস</li>
        <li>শারীরিক কসরত</li>
      </ul>
      <p><strong>উপস্থিতি:</strong> মোট ক্যাডেট [সংখ্যা], উপস্থিত [সংখ্যা]</p>
      <p><strong>মন্তব্য:</strong> আজকের প্যারেড অত্যন্ত সফলভাবে সম্পন্ন হয়েছে।</p>
    `,
  },
  {
    id: 'recommendation',
    name: 'সুপারিশ পত্র',
    category: 'Official',
    content: `
      <p><strong>বিষয়: সুপারিশ পত্র।</strong></p>
      <p>এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, [নাম], পিতা: [পিতার নাম], এই কলেজের একজন নিয়মিত ক্যাডেট। তার ক্যাডেট নং [নং]। সে অত্যন্ত দক্ষ এবং সুশৃঙ্খল।</p>
      <p>আমি তার উজ্জল ভবিষ্যৎ কামনা করি।</p>
    `,
  }
];

export default function App() {
  // --- State ---
  const [content, setContent] = useState<string>(TEMPLATES[0].content);
  const [memoNo, setMemoNo] = useState<string>('');
  const [date, setDate] = useState<string>('____/____/________');
  const [fontSize, setFontSize] = useState<number>(14);
  const [lineHeight, setLineHeight] = useState<number>(1.6);
  const [marginTop, setMarginTop] = useState<number>(15);
  const [marginBottom, setMarginBottom] = useState<number>(15);
  const [pageSize, setPageSize] = useState<'a4' | 'legal' | 'letter'>('a4');
  const [pageCount, setPageCount] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'templates' | 'settings'>('templates');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  // Bengali Number Conversion
  const toBengaliNumber = (str: string) => {
    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(str).replace(/\d/g, (digit) => bengaliNumbers[parseInt(digit)]);
  };

  // --- Handlers ---
  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);
    
    try {
      const { jsPDF } = await import('jspdf');
      
      let dimensions: [number, number];
      switch(pageSize) {
        case 'legal': dimensions = [215.9, 355.6]; break;
        case 'letter': dimensions = [215.9, 279.4]; break;
        default: dimensions = [210, 297];
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: pageSize === 'a4' ? 'a4' : dimensions,
      });
      
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: dimensions[0] * 3.78,
        height: dimensions[1] * 3.78
      });
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, dimensions[0], dimensions[1]);

      // Add extra pages if needed
      for(let i = 1; i < pageCount; i++) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, dimensions[0], dimensions[1]);
      }
      
      pdf.save(`BNCC_Pad_${date.replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAutoDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear());
    const formattedDate = `${toBengaliNumber(day)}/${toBengaliNumber(month)}/${toBengaliNumber(year)}`;
    setDate(formattedDate);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-['Hind_Siliguri']">
      <div className="container mx-auto p-4 lg:p-8">
        <header className="text-center mb-8 no-print">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-700">BNCC Pad Generator</h1>
          <p className="text-sm lg:text-md text-gray-500">Cox's Bazar City College Platoon</p>
        </header>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex justify-between items-center mb-4 no-print">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 border border-gray-300 rounded-md bg-white"
          >
            <div className="flex flex-col gap-1 w-6">
              <span className="h-0.5 w-full bg-gray-600"></span>
              <span className="h-0.5 w-full bg-gray-600"></span>
              <span className="h-0.5 w-full bg-gray-600"></span>
            </div>
          </button>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="bg-blue-600 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-1 text-sm">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={handleExportPDF} className="bg-green-600 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-1 text-sm">
              <Download className="w-4 h-4" /> PDF
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Controls */}
          <aside className={`lg:w-1/3 bg-white p-4 lg:p-6 rounded-lg shadow-lg no-print transition-all ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-semibold">Controls</h2>
              <button onClick={() => setSidebarTab(sidebarTab === 'templates' ? 'settings' : 'templates')} className="text-xs font-bold text-[#2D5016] uppercase underline">
                {sidebarTab === 'templates' ? 'Go to Settings' : 'Go to Templates'}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {sidebarTab === 'templates' ? (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-2">Templates</div>
                  {TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setContent(template.content)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50 hover:border-[#2D5016] transition-all"
                    >
                      <div className="text-left font-bold text-sm">{template.name}</div>
                      <ChevronRight className="w-4 h-4 text-zinc-400" />
                    </button>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Document Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Page Size</label>
                      <select 
                        value={pageSize}
                        onChange={(e) => setPageSize(e.target.value as any)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="a4">A4 (Default)</option>
                        <option value="legal">Legal</option>
                        <option value="letter">Letter</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Page Count</label>
                      <select 
                        value={pageCount}
                        onChange={(e) => setPageCount(Number(e.target.value))}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                      >
                        {[1, 2, 4, 8].map(n => <option key={n} value={n}>{n} Page{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">সূত্র নং</label>
                      <input 
                        type="text" 
                        value={memoNo}
                        onChange={(e) => setMemoNo(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">তারিখ</label>
                      <div className="flex gap-2 mt-1">
                        <input 
                          type="text" 
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          placeholder="dd/mm/yyyy"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        <button onClick={handleAutoDate} className="p-2 bg-blue-500 text-white rounded-md">
                          <Calendar className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Font Size</label>
                      <input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Line Spacing</label>
                      <input type="number" step="0.1" value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Actions */}
            <div className="mt-8 space-y-3">
              <button onClick={handlePrint} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                <Printer className="w-5 h-5" /> Print Document
              </button>
              <button 
                onClick={handleExportPDF} 
                disabled={isGenerating}
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : <><Download className="w-5 h-5" /> Download as PDF</>}
              </button>
            </div>
          </aside>

          {/* Editor & Preview */}
          <div className="lg:w-2/3 space-y-8 flex flex-col items-center">
            {/* Editor */}
            <div className="w-full bg-white p-6 rounded-lg shadow-lg no-print">
              <h2 className="text-xl font-bold mb-4">Document Content</h2>
              <RichTextEditor value={content} onChange={setContent} />
            </div>

            {/* Preview Area */}
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="text-center no-print">
                <h3 className="text-lg font-bold">Live Preview</h3>
                <p className="text-xs text-gray-500 capitalize">{pageSize} | {pageCount} Page(s)</p>
              </div>

              <div className="overflow-auto w-full flex flex-col items-center gap-4 pb-10">
                <div className="origin-top" style={{ transform: 'scale(var(--preview-scale, 1))' }}>
                  <DocumentPreview 
                    innerRef={previewRef}
                    content={content}
                    memoNo={memoNo}
                    date={date}
                    fontSize={fontSize}
                    lineHeight={lineHeight}
                    marginTop={marginTop}
                    marginBottom={marginBottom}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Overlay */}
      <div className="hidden print:block bg-white h-screen w-screen absolute inset-0">
        {[...Array(pageCount)].map((_, i) => (
          <DocumentPreview 
            key={i}
            content={content}
            memoNo={memoNo}
            date={date}
            fontSize={fontSize}
            lineHeight={lineHeight}
            marginTop={marginTop}
            marginBottom={marginBottom}
          />
        ))}
      </div>
    </div>
  );
}
