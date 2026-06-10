export const useDatabase = () => {
  const isElectron = !!window.electronAPI;

  const invoke = async (channel, ...args) => {
    if (isElectron) {
      return window.electronAPI.invoke(channel, ...args);
    }
    
    // Web Fallback for development/testing
    console.warn(`[Web Fallback] Invoking channel: ${channel}`, args);
    
    switch (channel) {
      case 'get-students':
        return [
          { id: 1, name: 'أحمد بن يوسف (Web)', current_surah: 2, current_page: 15, session_type: 'حفظ' },
          { id: 2, name: 'عبد الرحمن الصالح (Web)', current_surah: 18, current_page: 293, session_type: 'مراجعة' }
        ];
      case 'get-student':
        return { id: args[0], name: 'طالب تجريبي', current_surah: 1, current_page: 1, session_type: 'حفظ' };
      case 'get-settings':
        return [{ key: 'setup_complete', value: 'true' }];
      default:
        return null;
    }
  };

  return {
    getStudents: () => invoke('get-students'),
    getStudent: (id) => invoke('get-student', id),
    getStudentErrors: (id) => invoke('get-student-errors', id),
    saveSession: (data) => invoke('save-session', data),
    getSettings: () => invoke('get-settings'),
    saveSetting: (key, value) => invoke('save-setting', key, value),
  };
};
