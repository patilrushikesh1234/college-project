export const getStudentsKey = (classId) => `students_${classId}`;
export const getSubjectsKey = (classId) => `subjects_${classId}`;
export const getAttendanceKey = (classId, subject) =>
  `attendance_${classId}_${subject}`;

export function loadJSON(key, defaultValue = null) {
  if (typeof window === "undefined") return defaultValue;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

export function saveJSON(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}
