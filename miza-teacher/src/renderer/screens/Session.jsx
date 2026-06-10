import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDatabase } from '../hooks/useDatabase';
import QuranPage from '../components/QuranPage';
import { Check, AlertTriangle, X, Save, ArrowRight, User } from 'lucide-react';

const Session = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { getStudent, saveSession } = useDatabase();
  
  const [student, setStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionErrors, setSessionErrors] = useState([]);
  const [note, setNote] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      const data = await getStudent(studentId);
      setStudent(data);
      setCurrentPage(data.current_page || 1);
    };
    fetchStudent();
  }, [studentId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '1') addError('mastered', 0);
      if (e.key === '2') addError('warning', 1);
      if (e.key === '3') addError('error', 2);
      if (e.key === 'ArrowRight') setCurrentPage(prev => prev + 1);
      if (e.key === 'ArrowLeft') setCurrentPage(prev => Math.max(1, prev - 1));
      if (e.key === 'f' && e.ctrlKey) handleEndSession();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [student, sessionErrors, currentPage]);

  const addError = (type, severity) => {
    const newError = {
      surah: student.current_surah,
      ayah: 1, // Default for now
      page: currentPage,
      type,
      severity,
      timestamp: new Date().toISOString()
    };
    setSessionErrors([...sessionErrors, newError]);
  };

  const handleEndSession = async () => {
    await saveSession({
      student_id: studentId,
      date: new Date().toISOString().split('T')[0],
      session_type: student.session_type,
      grade: sessionErrors.length === 0 ? 'ممتاز' : sessionErrors.length < 3 ? 'جيد' : 'ضعيف',
      pages_covered: `${currentPage}`,
      sheikh_note: note,
      errors: sessionErrors
    });
    navigate('/');
  };

  if (!student) return <div className="p-10">جاري التحميل...</div>;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Panel - Quran */}
      <div className="flex-1 p-8 flex items-center justify-center overflow-y-auto">
        <div className="max-w-2xl w-full">
          <QuranPage pageNumber={currentPage} studentId={studentId} />
          
          <div className="flex justify-between mt-6">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="bg-white border border-border px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              الصفحة السابقة
            </button>
            <button 
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="bg-white border border-border px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              الصفحة التالية
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Controls */}
      <div className="w-[450px] bg-white border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{student.name}</h3>
              <p className="text-text-secondary text-sm">{student.session_type} - سورة {student.current_surah}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-text-secondary hover:text-danger"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-8 flex-1 space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => addError('mastered', 0)}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-green-50 text-green-700 border-2 border-transparent hover:border-green-500 transition-all"
            >
              <Check className="w-8 h-8" />
              <span className="font-bold">ممتاز (1)</span>
            </button>
            <button 
              onClick={() => addError('warning', 1)}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-amber-50 text-amber-700 border-2 border-transparent hover:border-amber-500 transition-all"
            >
              <AlertTriangle className="w-8 h-8" />
              <span className="font-bold">تنبيه (2)</span>
            </button>
            <button 
              onClick={() => addError('error', 2)}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-red-50 text-red-700 border-2 border-transparent hover:border-red-500 transition-all"
            >
              <X className="w-8 h-8" />
              <span className="font-bold">خطأ (3)</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-text-secondary">ملاحظات الشيخ</label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-32 p-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
              placeholder="اكتب ملاحظاتك هنا..."
            />
          </div>

          <div className="bg-background rounded-xl p-4">
            <h4 className="font-bold mb-3 text-sm">أخطاء الجلسة الحالية: {sessionErrors.length}</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {sessionErrors.map((err, i) => (
                <div key={i} className="flex justify-between text-sm bg-white p-2 rounded border border-border">
                  <span>{err.type === 'error' ? 'خطأ' : err.type === 'warning' ? 'تنبيه' : 'ممتاز'}</span>
                  <span className="text-text-secondary">الآية {err.ayah}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <button 
            onClick={handleEndSession}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all"
          >
            <Save className="w-5 h-5" />
            إنهاء الجلسة وحفظ البيانات
          </button>
        </div>
      </div>
    </div>
  );
};

export default Session;
