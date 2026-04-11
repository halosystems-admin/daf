import React from 'react';
import { ImageIcon } from 'lucide-react';
import type { EvidenceImageRef } from '../../../../shared/types';

interface Props {
  images: EvidenceImageRef[];
}

export const EvidenceImagesTab: React.FC<Props> = ({ images }) => {
  if (images.length > 0) {
    return (
      <ul className="grid gap-4 sm:grid-cols-2">
        {images.map(img => (
          <li
            key={img.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            {img.url ? (
              <a href={img.url} target="_blank" rel="noopener noreferrer" className="block">
                <img src={img.url} alt={img.title || 'Evidence figure'} className="h-40 w-full object-cover" />
              </a>
            ) : (
              <div className="flex h-40 items-center justify-center bg-slate-50 text-slate-400">
                <ImageIcon className="h-10 w-10" aria-hidden />
              </div>
            )}
            {(img.title || img.caption) && (
              <div className="p-3 text-sm">
                {img.title && <p className="font-medium text-slate-800">{img.title}</p>}
                {img.caption && <p className="mt-1 text-slate-600">{img.caption}</p>}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-[linear-gradient(180deg,#fbfdff_0%,#f6fafc_100%)] px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf6fb] text-[#3294c7]">
        <ImageIcon className="h-7 w-7" aria-hidden />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-700">No images for this query yet</p>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        Future versions may surface guideline diagrams, study figures, and patient education visuals where appropriate
        and permitted.
      </p>
    </div>
  );
};
