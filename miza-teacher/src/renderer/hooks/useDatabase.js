export const useDatabase = () => {
  const invoke = (channel, ...args) => {
    if (window.electronAPI) {
      return window.electronAPI.invoke(channel, ...args);
    }
    console.error('electronAPI not found on window');
    return Promise.reject('electronAPI not found');
  };

  const getStudents = () => invoke('get-students');
  const getStudent = (id) => invoke('get-student', id);
  const getStudentErrors = (id) => invoke('get-student-errors', id);
  const saveSession = (data) => invoke('save-session', data);
  const getSettings = () => invoke('get-settings');
  const saveSetting = (key, value) => invoke('save-setting', key, value);

  return {
    getStudents,
    getStudent,
    getStudentErrors,
    saveSession,
    getSettings,
    saveSetting,
  };
};
