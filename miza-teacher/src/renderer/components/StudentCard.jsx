import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, User } from 'lucide-react';

const StudentCard = ({ student }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/session/${student.id}`)}
      className="bg-white p-6 rounded-xl border border-border hover:border-primary cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="bg-background p-3 rounded-full">
            <User className="text-primary w-6 h-6" />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            student.session_type === 'حفظ' ? 'bg-green-100 text-green-700' :
            student.session_type === 'مراجعة' ? 'bg-blue-100 text-blue-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            {student.session_type}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2">{student.name}</h3>
        <p className="text-text-secondary text-sm">
          السورة الحالية: {student.current_surah}
        </p>
      </div>

      <button 
        className="mt-6 w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors font-bold"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/session/${student.id}`);
        }}
      >
        <Play className="w-4 h-4 fill-current" />
        بدء الجلسة
      </button>
    </div>
  );
};

export default StudentCard;
