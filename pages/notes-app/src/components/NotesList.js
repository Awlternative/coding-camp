import { NotesAPI } from '../services/api.js';
import { showError, showSuccess } from '../utils/notifications.js';

class NotesList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.notes = [];
        this.loading = true;
    }

    async connectedCallback() {
        await this.loadNotes();
        this.addEventListeners();
    }

    addEventListeners() {
        this.shadowRoot.addEventListener('note-deleted', async (e) => {
            this.loading = true; // Tampilkan indikator loading
            this.render();
            try {
                await NotesAPI.deleteNote(e.detail.id);
                await this.loadNotes();
                showSuccess('Note deleted successfully');
            } catch (error) {
                console.error('Failed to delete note:', error);
                showError('Failed to delete note: ' + error.message);
            } finally {
                this.loading = false; // Sembunyikan indikator loading
                this.render();
            }
        });

        this.shadowRoot.addEventListener('note-archived', async (e) => {
            this.loading = true; // Tampilkan indikator loading
            this.render();
            try {
                const { id, archived } = e.detail;
                await NotesAPI.archiveNote(id, archived);
                await this.loadNotes();
                showSuccess(`Note ${archived ? 'archived' : 'unarchived'} successfully`);
            } catch (error) {
                console.error('Failed to archive note:', error);
                showError('Failed to archive note: ' + error.message);
            } finally {
                this.loading = false; // Sembunyikan indikator loading
                this.render();
            }
        });

        window.addEventListener('note-added', async () => {
            this.loading = true; // Tampilkan indikator loading
            this.render();
            try {
                await this.loadNotes();
                showSuccess('Note added successfully');
            } catch (error) {
                console.error('Failed to add note:', error);
                showError('Failed to add note: ' + error.message);
            } finally {
                this.loading = false; // Sembunyikan indikator loading
                this.render();
            }
        });
    }

    async loadNotes() {
        this.loading = true;
        this.render();

        try {
            const notes = await NotesAPI.getAllNotes();
            this.notes = notes;
        } catch (error) {
            console.error('Failed to load notes:', error);
            showError('Failed to load notes: ' + error.message);
        } finally {
            this.loading = false;
            this.render();
        }
    }

    render() {
        if (this.loading) {
            this.shadowRoot.innerHTML = '<loading-indicator></loading-indicator>';
            return;
        }

        const activeNotes = this.notes.filter(note => !note.archived);
        const archivedNotes = this.notes.filter(note => note.archived);

        this.shadowRoot.innerHTML = `
            <style>
                .notes-section {
                    margin-bottom: 2rem;
                }
                .notes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 1rem;
                }
                .section-title {
                    margin-bottom: 1rem;
                    color: #333;
                }
                .empty-message {
                    text-align: center;
                    color: #666;
                    padding: 1rem;
                }
            </style>
            <div class="notes-section">
                <h2 class="section-title">Active Notes (${activeNotes.length})</h2>
                <div class="notes-grid">
                    ${activeNotes.length 
                        ? activeNotes.map(note => `
                            <note-card 
                                id="${note.id}"
                                title="${this.escapeHtml(note.title)}"
                                body="${this.escapeHtml(note.body)}"
                                archived="false"
                                createdAt="${note.createdAt}">
                            </note-card>
                        `).join('')
                        : '<div class="empty-message">No active notes</div>'
                    }
                </div>
            </div>
            <div class="notes-section">
                <h2 class="section-title">Archived Notes (${archivedNotes.length})</h2>
                <div class="notes-grid">
                    ${archivedNotes.length
                        ? archivedNotes.map(note => `
                            <note-card 
                                id="${note.id}"
                                title="${this.escapeHtml(note.title)}"
                                body="${this.escapeHtml(note.body)}"
                                archived="true"
                                createdAt="${note.createdAt}">
                            </note-card>
                        `).join('')
                        : '<div class="empty-message">No archived notes</div>'
                    }
                </div>
            </div>
        `;
    }

    // Add this helper method to the class
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

customElements.define('notes-list', NotesList);
