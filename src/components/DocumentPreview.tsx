import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DocumentPreviewProps {
  content: string;
  memoNo: string;
  date: string;
  fontSize: number;
  lineHeight: number;
  marginTop: number;
  marginBottom: number;
  innerRef?: React.RefObject<HTMLDivElement | null>;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  content,
  memoNo,
  date,
  fontSize,
  lineHeight,
  marginTop,
  marginBottom,
  innerRef,
}) => {
  return (
    <div
      ref={innerRef}
      className="a4-page p-[25mm] font-['Inter'] flex flex-col relative overflow-hidden"
      style={{
        paddingTop: `${marginTop}mm`,
        paddingBottom: `${marginBottom}mm`,
      }}
    >
      {/* Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none z-0">
        <img
          src="https://i.ibb.co/Fb3R6wR/Bncc-logo.png"
          alt="BNCC Watermark"
          className="w-[400px]"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <img
            src="https://i.ibb.co/SBfzG9K/logo-removebg-preview-2.png"
            alt="City College Logo"
            className="h-20 w-auto"
            referrerPolicy="no-referrer"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#DC2626]">বাংলাদেশ ন্যাশনাল ক্যাডেট কোর</h1>
            <h2 className="text-xl font-semibold text-zinc-800">কক্সবাজার সিটি কলেজ</h2>
            <h2 className="text-xl font-bold text-[#DC2626]">মিশ্র প্লাটুন (সেনা শাখা)</h2>
            <p className="text-sm font-medium">কক্সবাজার সদর</p>
          </div>
          <img
            src="https://i.ibb.co/Fb3R6wR/Bncc-logo.png"
            alt="BNCC Logo"
            className="h-20 w-auto"
            referrerPolicy="no-referrer"
          />
        </header>

        <div className="text-center text-xs text-zinc-500 mb-2">
          ইমেইল: coxcitycollege@gmail.com, cccbncc@gmail.com
        </div>
        
        <div className="border-t-2 border-black mb-4"></div>

        {/* Info Line */}
        <div className="flex justify-between text-sm font-bold mb-8">
          <div>সূত্র নং: {memoNo || '____________________'}</div>
          <div>তারিখ: {date || '____/____/________'}</div>
        </div>

        {/* Content Body */}
        <div
          className="flex-grow prose prose-sm max-w-none break-words"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Footer Signature */}
        <footer className="mt-auto self-end text-right text-sm leading-relaxed">
          <div className="font-bold">
            <span className="text-blue-700 mr-1">পিইউও</span> উজ্জ্বল কান্তি দেব
          </div>
          <div>প্লাটুন কমান্ডার</div>
          <div>বিএনসিসি (<span className="text-[#DC2626]">সেনা শাখা</span>)</div>
          <div>কক্সবাজার সিটি কলেজ প্লাটুন</div>
        </footer>
      </div>
    </div>
  );
};
