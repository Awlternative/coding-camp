const BASE_URL = 'https://notes-api.dicoding.dev/v2';

export class NotesAPI {
    static async getAllNotes() {
        const [activeResponse, archivedResponse] = await Promise.all([
            fetch(`${BASE_URL}/notes`),
            fetch(`${BASE_URL}/notes/archived`)
        ]);

        const activeData = await activeResponse.json();
        const archivedData = await archivedResponse.json();

        return [...activeData.data, ...archivedData.data];
    }

    static async deleteNote(id) {
        const response = await fetch(`${BASE_URL}/notes/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete note');
        }

        return true;
    }

    static async archiveNote(id, archived) {
        const endpoint = archived ? 'archive' : 'unarchive';
        const response = await fetch(`${BASE_URL}/notes/${id}/${endpoint}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error(`Failed to ${endpoint} note`);
        }

        return response.json();
    }
}