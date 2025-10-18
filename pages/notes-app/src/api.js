const BASE_URL = 'https://notes-api.dicoding.dev/v2';

export async function getNotes() {
  const response = await fetch(`${BASE_URL}/notes`);
  const result = await response.json();
  if (response.ok) {
    return result.data;
  }
  throw new Error(result.message);
}

export async function createNote(title, body) {
  const response = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body }),
  });
  const result = await response.json();
  if (response.ok) {
    return result.data;
  }
  throw new Error(result.message);
}

export async function deleteNote(noteId) {
  const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
    method: 'DELETE',
  });
  const result = await response.json();
  if (response.ok) {
    return result.message;
  }
  throw new Error(result.message);
}

export async function archiveNote(noteId) {
  const response = await fetch(`${BASE_URL}/notes/${noteId}/archive`, {
    method: 'POST',
  });
  const result = await response.json();
  if (response.ok) {
    return result.message;
  }
  throw new Error(result.message);
}

export async function unarchiveNote(noteId) {
  const response = await fetch(`${BASE_URL}/notes/${noteId}/unarchive`, {
    method: 'POST',
  });
  const result = await response.json();
  if (response.ok) {
    return result.message;
  }
  throw new Error(result.message);
}
