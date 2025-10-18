class NotesList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        window.addEventListener('note-added', (e) => {
            notesData.push(e.detail);
            this.render();
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .notes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 1rem;
                }
            </style>
            <div class="notes-grid">
                ${notesData
                    .map(
                        (note) => `
                    <note-card 
                        title="${note.title}" 
                        body="${note.body}" 
                        createdAt="${note.createdAt}">
                    </note-card>
                `
                    )
                    .join('')}
            </div>
        `;
    }
}

customElements.define('notes-list', NotesList);
