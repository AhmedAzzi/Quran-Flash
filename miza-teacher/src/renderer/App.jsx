import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import Session from './screens/Session';
import StudentProfile from './screens/StudentProfile';

import { useDatabase } from './hooks/useDatabase';
import SetupWizard from './components/SetupWizard';

function App() {
  const { getSettings } = useDatabase();
  const [showSetup, setShowSetup] = React.useState(false);

  React.useEffect(() => {
    const checkSetup = async () => {
      const settings = await getSettings();
      const setupComplete = settings.find(s => s.key === 'setup_complete');
      if (!setupComplete) {
        setShowSetup(true);
      }
    };
    checkSetup();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background" dir="rtl">
        {showSetup && <SetupWizard onComplete={() => setShowSetup(false)} />}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/session/:studentId" element={<Session />} />
          <Route path="/student/:studentId" element={<StudentProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
