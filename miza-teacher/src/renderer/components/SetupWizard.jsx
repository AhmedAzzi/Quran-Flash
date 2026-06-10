import React, { useState } from 'react';
import { useDatabase } from '../hooks/useDatabase';

const SetupWizard = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const { saveSetting } = useDatabase();
  const [formData, setFormData] = useState({
    sheikhName: '',
    schoolName: '',
    city: '',
    sessionDuration: '30',
  });

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      await saveSetting('sheikh_name', formData.sheikhName);
      await saveSetting('school_name', formData.schoolName);
      await saveSetting('city', formData.city);
      await saveSetting('session_duration', formData.sessionDuration);
      await saveSetting('setup_complete', 'true');
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-12 shadow-2xl">
        <div className="flex justify-between mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`h-2 flex-1 mx-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-border'}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">مرحباً بك في ميزا جالاكسي</h2>
            <p className="text-text-secondary mb-8">لنقم بإعداد ملفك الشخصي كمعلم.</p>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">اسم الشيخ</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-background border border-border rounded-xl"
                  value={formData.sheikhName}
                  onChange={(e) => setFormData({...formData, sheikhName: e.target.value})}
                  placeholder="مثال: الشيخ أحمد يوسف"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">اسم المدرسة / المسجد</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-background border border-border rounded-xl"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">تفضيلات الشاشة الرئيسية</h2>
            <div className="space-y-4">
              <button className="w-full p-6 border-2 border-primary bg-primary/5 rounded-2xl text-right font-bold">
                عرض قائمة طلاب اليوم (اللوحة الرئيسية)
              </button>
              <button className="w-full p-6 border-2 border-border hover:border-primary rounded-2xl text-right font-bold">
                عرض المصحف مباشرة
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">إعدادات الجلسات</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">مدة الجلسة الافتراضية (بالدقائق)</label>
                <select 
                  className="w-full p-4 bg-background border border-border rounded-xl"
                  value={formData.sessionDuration}
                  onChange={(e) => setFormData({...formData, sessionDuration: e.target.value})}
                >
                  <option value="30">30 دقيقة</option>
                  <option value="45">45 دقيقة</option>
                  <option value="60">60 دقيقة</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">أنت جاهز تماماً!</h2>
            <p className="text-text-secondary mb-12">يمكنك الآن البدء في إدارة حلقاتك القرآنية بكل سهولة.</p>
          </div>
        )}

        <button 
          onClick={handleNext}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all mt-12"
        >
          {step === 4 ? 'ابدأ الاستخدام' : 'التالي'}
        </button>
      </div>
    </div>
  );
};

export default SetupWizard;
