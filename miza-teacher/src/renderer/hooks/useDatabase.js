const { ipcRenderer } = window.require('electron');

export const useDatabase = () => {
  const getStudents = () => ipcRenderer.invoke('get-students');
  const getStudent = (id) => ipcRenderer.invoke('get-student', id);
  const getStudentErrors = (id) => ipcRenderer.invoke('get-student-errors', id);
  const saveSession = (data) => ipcRenderer.invoke('save-session', data);
  const getSettings = () => ipcRenderer.invoke('get-settings');
  const saveSetting = (key, value) => ipcRenderer.invoke('save-setting', key, value);

  return {
    getStudents,
    getStudent,
    getStudentErrors,
    saveSession,
    getSettings,
    saveSetting,
  };
};
