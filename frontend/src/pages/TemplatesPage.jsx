import React, { useEffect, useState } from 'react';
import { FiDownload, FiLock, FiUpload } from 'react-icons/fi';
import api from '../api/client';

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const { data } = await api.get('/profiles/templates/public');
        setTemplates(data);
      } catch (error) {
        console.warn(error);
      }
    };
    loadTemplates();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Template gallery</h1>
          <p className="text-sm text-white/60">Preview public and private themes. Import JSON presets or export your own.</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 flex items-center gap-2">
            <FiUpload /> Import
          </button>
          <button className="rounded-full bg-gunspink px-4 py-2 text-sm font-semibold hover:bg-pink-500 flex items-center gap-2">
            <FiDownload /> Export current
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {templates.length ? (
          templates.map((template) => (
            <div key={template.id} className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{template.name}</h3>
                {!template.isPublic && <FiLock className="text-white/40" />}
              </div>
              <p className="text-sm text-white/60">{template.description}</p>
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 text-xs text-white/60">
                <pre className="max-h-32 overflow-y-auto whitespace-pre-wrap text-left text-xs">
{JSON.stringify(template.data, null, 2)}
                </pre>
              </div>
              <button className="w-full rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20">
                Use template
              </button>
            </div>
          ))
        ) : (
          <div className="glass-card p-8 text-center text-white/60 md:col-span-3">No templates available yet.</div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;
