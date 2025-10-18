import { gsap } from 'gsap';

class NoteCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
        this.animateEntry();
    }

    animateEntry() {
        const card = this.shadowRoot.querySelector('.note-card');
        gsap.from(card, {
            duration: 0.5,
            opacity: 0,
            y: 20,
            ease: 'power2.out'
        });
    }

    render() {
        const title = this.getAttribute('title');
        const body = this.getAttribute('body');
        const createdAt = new Date(this.getAttribute('createdAt')).toLocaleDateString();
        const archived = this.getAttribute('archived') === 'true';

        this.shadowRoot.innerHTML = `
            <style>
                .note-card {
                    background: var(--card-background);
                    padding: 1rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                h3 {
                    margin: 0 0 0.5rem 0;
                }
                p {
                    margin: 0;
                }
                .date {
                    font-size: 0.8rem;
                    color: #666;
                    margin-top: 0.5rem;
                }
                .actions {
                    margin-top: 1rem;
                    display: flex;
                    gap: 0.5rem;
                }
                .delete-btn {
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .delete-btn:hover {
                    background: #c82333;
                }
                .archive-btn {
                    background: #ffc107;
                    color: black;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .archive-btn:hover {
                    background: #e0a800;
                }
            </style>
            <div class="note-card">
                <h3>${title}</h3>
                <p>${body}</p>
                <div class="date">${createdAt}</div>
                <div class="actions">
                    <button class="archive-btn">${archived ? 'Unarchive' : 'Archive'}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        const deleteBtn = this.shadowRoot.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this note?')) {
                this.dispatchEvent(new CustomEvent('note-deleted', {
                    detail: { id: this.getAttribute('id') },
                    bubbles: true,
                    composed: true
                }));
            }
        });

        const archiveBtn = this.shadowRoot.querySelector('.archive-btn');
        archiveBtn.addEventListener('click', () => {
            const currentArchived = this.getAttribute('archived') === 'true';
            this.dispatchEvent(new CustomEvent('note-archived', {
                detail: {
                    id: this.getAttribute('id'),
                    archived: !currentArchived
                },
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define('note-card', NoteCard);