import React from 'react';
import ReactQuill from 'react-quill-new';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'align',
  'link',
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="h-[400px] mb-12"
        placeholder="শুরু করুন..."
      />
    </div>
  );
};
