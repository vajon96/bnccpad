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
      className="a4-page p-[40px] font-['Hind_Siliguri'] flex flex-col relative overflow-hidden"
    >
      {/* Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.07] pointer-events-none z-0">
        <img
          src="https://i.ibb.co/Fb3R6wR/Bncc-logo.png"
          alt="BNCC Watermark"
          className="w-[400px]"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="flex justify-between items-center mb-4">
          <img
            src="https://i.ibb.co/SBfzG9K/logo-removebg-preview-2.png"
            alt="City College Logo"
            className="h-[100px] w-auto"
            referrerPolicy="no-referrer"
          />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#DC2626]">বাংলাদেশ ন্যাশনাল ক্যাডেট কোর</h2>
            <h3 className="text-xl font-semibold">কক্সবাজার সিটি কলেজ</h3>
            <h3 className="text-xl font-bold text-[#DC2626]">মিশ্র প্লাটুন (সেনা শাখা)</h3>
            <p className="text-base font-medium">কক্সবাজার সদর</p>
          </div>
          <img
            src="https://i.ibb.co/Fb3R6wR/Bncc-logo.png"
            alt="BNCC Logo"
            className="h-[100px] w-auto"
            referrerPolicy="no-referrer"
          />
        </header>

        <div className="text-center text-xs mb-2">
          ইমেইল: coxcitycollege@gmail.com, cccbncc@gmail.com
        </div>
        
        <hr className="border-black border-t-2 my-3" />

        {/* Info Line */}
        <div className="flex justify-between text-base font-medium mb-6">
          <div className="memo-preview">সূত্র নং: {memoNo || '____________________'}</div>
          <div className="date-preview">তারিখ: {date || '____/____/________'}</div>
        </div>

        {/* Content Body */}
        <div
          className="flex-grow main-body-preview min-h-[180mm]"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            paddingTop: `${marginTop}px`,
            paddingBottom: `${marginBottom}px`,
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Footer Signature */}
        <footer className="text-right mt-6 text-base leading-relaxed">
          <span className="text-blue-700 font-semibold">পিইউও </span>
          উজ্জ্বল কান্তি দেব<br />
          প্লাটুন কমান্ডার<br />
          বিএনসিসি (<span className="text-red-600">সেনা শাখা</span>)<br />
          কক্সবাজার সিটি কলেজ প্লাটুন
        </footer>
      </div>
    </div>
  );
};
