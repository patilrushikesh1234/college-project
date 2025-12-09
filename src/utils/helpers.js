export function loadJSON(key, defaultValue = null) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

export function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export async function submitAttendanceToSheet(endpoint, data) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  } catch (err) {
    console.error("Google Sheet submission error:", err);
    throw err;
  }
}
