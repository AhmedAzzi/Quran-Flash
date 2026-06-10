import React from 'react';

const QuranPage = ({ pageNumber, studentId, errors }) => {
  // In a real app, we would load the image from assets/pages/page_XXX.png
  // For now, we'll render a placeholder with the page number and some text
  
  return (
    <div className="relative bg-[#FFFDF5] shadow-lg rounded-lg aspect-[1/1.414] w-full flex flex-col items-center p-8 border border-border">
      <div className="absolute top-4 text-text-secondary text-sm">صفحة {pageNumber}</div>
      
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="text-center">
          <h2 className="text-4xl font-quran mb-8">سورة البقرة</h2>
          <div className="space-y-4 text-2xl font-quran leading-loose">
            <p>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <p>الم (1) ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِلْمُتَّقِينَ (2)</p>
            <p>الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ (3)</p>
            <p>وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنْزِلَ إِلَيْكَ وَمَا أُنْزِلَ مِنْ قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ (4)</p>
          </div>
        </div>
      </div>

      {/* Heatmap Overlay (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Sample rect for an ayah error */}
        <rect 
          x="10%" y="20%" width="80%" height="5%" 
          fill="rgba(220, 38, 38, 0.2)" 
          className="transition-colors"
        />
      </svg>

      <div className="absolute bottom-4 text-text-secondary text-sm font-bold">ميزا جالاكسي</div>
    </div>
  );
};

export default QuranPage;
