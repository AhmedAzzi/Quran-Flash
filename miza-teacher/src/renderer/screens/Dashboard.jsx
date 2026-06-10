import React, { useEffect, useState } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import StudentCard from '../components/StudentCard';
import { Settings, Users, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const { getStudents } = useDatabase();
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStudents();
      setStudents(data);
      setStats({
        total: data.length,
        completed: 0, // In a real app, this would be calculated from today's sessions
        pending: data.length
      });
    };
    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 bg-white border-l border-border p-8 flex flex-col">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-primary mb-2">ميزا جالاكسي</h1>
          <p className="text-text-secondary">وحدة المعلم</p>
        </div>

        <div className="space-y-6">
          <div className="bg-background p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2 text-text-secondary">
              <Users className="w-5 h-5" />
              <span>إجمالي الطلاب</span>
            </div>
            <div className="text-3xl font-bold">{stats.total}</div>
          </div>

          <div className="bg-green-50 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>جلسات مكتملة</span>
            </div>
            <div className="text-3xl font-bold text-green-700">{stats.completed}</div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2 text-blue-700">
              <Clock className="w-5 h-5" />
              <span>جلسات متبقية</span>
            </div>
            <div className="text-3xl font-bold text-blue-700">{stats.pending}</div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-border">
          <button className="flex items-center gap-3 text-text-secondary hover:text-primary transition-colors">
            <Settings className="w-5 h-5" />
            <span>الإعدادات</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">مرحباً بك، يا شيخ</h2>
            <p className="text-text-secondary">{new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {students.map(student => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
