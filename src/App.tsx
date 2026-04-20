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
  const [date, setDate] = useState<string>(new Date().toLocaleDateString('bn-BD'));
  const [fontSize, setFontSize] = useState<number>(14);
  const [lineHeight, setLineHeight] = useState<number>(1.6);
  const [marginTop, setMarginTop] = useState<number>(15);
  const [marginBottom, setMarginBottom] = useState<number>(15);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'templates' | 'settings'>('templates');

  const previewRef = useRef<HTMLDivElement>(null);

  // --- Handlers ---
  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
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
    setDate(new Date().toLocaleDateString('bn-BD'));
  };

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-['Inter']">
      {/* Sidebar Controls */}
      <aside className="w-80 bg-white border-r border-zinc-200 flex flex-col no-print z-20 shadow-xl">
        <div className="p-6 border-b border-zinc-100 bg-[#2D5016] text-[#FFD700]">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-6 h-6" />
            <h1 className="text-xl font-bold">BNCC Pad</h1>
          </div>
          <p className="text-xs opacity-80">Smart Document Generator</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-100">
          <button 
            onClick={() => setSidebarTab('templates')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              sidebarTab === 'templates' 
                ? 'border-[#2D5016] text-[#2D5016]' 
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Layout className="w-4 h-4" />
              Templates
            </div>
          </button>
          <button 
            onClick={() => setSidebarTab('settings')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              sidebarTab === 'settings' 
                ? 'border-[#2D5016] text-[#2D5016]' 
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Settings2 className="w-4 h-4" />
              Settings
            </div>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-6">
          {sidebarTab === 'templates' ? (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-2">
                Available Templates
              </div>
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setContent(template.content)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50 hover:bg-white hover:border-[#2D5016] hover:shadow-md transition-all group"
                >
                  <div className="text-left">
                    <div className="text-sm font-bold text-zinc-800 group-hover:text-[#2D5016] transition-colors">{template.name}</div>
                    <div className="text-[10px] text-zinc-500">{template.category}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-[#2D5016] transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Document Info */}
              <div className="space-y-4">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Document Info</div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">সূত্র নং</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                      type="text" 
                      value={memoNo}
                      onChange={(e) => setMemoNo(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-zinc-200 rounded-md focus:ring-2 focus:ring-[#2D5016] focus:border-transparent outline-none"
                      placeholder="সূত্র নং লিখুন..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">তারিখ</label>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="text" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-zinc-200 rounded-md focus:ring-2 focus:ring-[#2D5016] focus:border-transparent outline-none"
                      />
                    </div>
                    <button 
                      onClick={handleAutoDate}
                      className="p-2 bg-zinc-100 rounded-md hover:bg-zinc-200 transition-colors"
                      title="আজকের তারিখ"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-4">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Appearance</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Font Size</label>
                    <input 
                      type="number" 
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full px-4 py-2 text-sm border border-zinc-200 rounded-md outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Line Height</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={lineHeight}
                      onChange={(e) => setLineHeight(Number(e.target.value))}
                      className="w-full px-4 py-2 text-sm border border-zinc-200 rounded-md outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Layout */}
              <div className="space-y-4">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Margins (mm)</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Top</label>
                    <input 
                      type="number" 
                      value={marginTop}
                      onChange={(e) => setMarginTop(Number(e.target.value))}
                      className="w-full px-4 py-2 text-sm border border-zinc-200 rounded-md outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Bottom</label>
                    <input 
                      type="number" 
                      value={marginBottom}
                      onChange={(e) => setMarginBottom(Number(e.target.value))}
                      className="w-full px-4 py-2 text-sm border border-zinc-200 rounded-md outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50 space-y-2">
          <button 
            onClick={handleExportPDF}
            disabled={isGenerating}
            className="w-full py-3 px-4 bg-[#2D5016] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#1f3a10] transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="animate-pulse">Generating...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download PDF
              </>
            )}
          </button>
          <button 
            onClick={handlePrint}
            className="w-full py-3 px-4 bg-zinc-200 text-zinc-800 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-zinc-300 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Document
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col overflow-hidden relative">
        {/* Editor Area */}
        <div className="flex-grow flex flex-col p-8 overflow-y-auto no-print">
          <div className="max-w-4xl w-full mx-auto space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-zinc-800">Editor</h2>
                <p className="text-sm text-zinc-500">Edit your document content here</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50">
                  <Save className="w-4 h-4" />
                  Save as Draft
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-md hover:bg-red-100">
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>

            <RichTextEditor value={content} onChange={setContent} />

            <div className="flex items-center gap-4 py-12 border-t border-zinc-200">
              <div className="w-12 h-12 rounded-full bg-[#2D5016]/10 flex items-center justify-center text-[#2D5016]">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Live Preview</h3>
                <p className="text-sm text-zinc-500">Check how your document will look after export</p>
              </div>
            </div>
            
            {/* Embedded Live Preview */}
            <div className="flex justify-center pb-20">
              <div className="scale-75 origin-top">
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

        {/* Floating Print Preview Overlay (Hidden by default, activated on print) */}
        <div className="hidden print:block absolute inset-0 bg-white z-[100]">
           <DocumentPreview 
              content={content}
              memoNo={memoNo}
              date={date}
              fontSize={fontSize}
              lineHeight={lineHeight}
              marginTop={marginTop}
              marginBottom={marginBottom}
            />
        </div>
      </main>
    </div>
  );
}
