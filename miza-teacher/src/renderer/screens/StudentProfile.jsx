import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDatabase } from '../hooks/useDatabase';
import { ArrowRight, User, Calendar, BookOpen, AlertCircle } from 'lucide-react';

const StudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { getStudent, getStudentErrors } = useDatabase();
  
  const [student, setStudent] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const s = await getStudent(studentId);
      const e = await getStudentErrors(studentId);
      setStudent(s);
      setErrors(e);
    };
    fetchData();
  }, [studentId]);

  if (!student) return <div className="p-10">جاري التحميل...</div>;

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-colors"
      >
        <ArrowRight className="w-5 h-5" />
        <span>العودة للوحة التحكم</span>
      </button>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="bg-primary p-10 text-white">
          <div className="flex items-center gap-6">
            <div className="bg-white/20 p-4 rounded-full">
              <User className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{student.name}</h1>
              <div className="flex gap-4 text-white/80">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> انضم في: {student.enrollment_date || 'غير محدد'}</span>
                <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> السورة الحالية: {student.current_surah}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <AlertCircle className="text-danger" />
                نقاط الضعف (أخطاء متكررة)
              </h2>
              <div className="space-y-4">
                {errors.length > 0 ? (
                  errors.slice(0, 5).map((err, i) => (
                    <div key={i} className="bg-background p-4 rounded-xl flex justify-between items-center border border-border">
                      <div>
                        <span className="font-bold">سورة {err.surah_number}</span>
                        <span className="text-text-secondary mx-2">|</span>
                        <span>الآية {err.ayah_number}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        err.severity === 2 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {err.error_type}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-text-secondary italic">لا توجد أخطاء مسجلة لهذا الطالب.</p>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-background p-6 rounded-2xl border border-border">
              <h3 className="font-bold mb-4">إحصائيات سريعة</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-text-secondary">إجمالي الأخطاء</span>
                  <span className="font-bold">{errors.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">نوع الجلسة</span>
                  <span className="font-bold text-primary">{student.session_type}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
