import { showError, showSuccess } from '../utils/notifications.js';

class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loading = false;
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .form-container {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                input, textarea {
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;
                }
                textarea {
                    min-height: 100px;
                }
                button {
                    padding: 0.75rem;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .error {
                    color: red;
                    font-size: 0.875rem;
                    margin-top: -0.5rem;
                }
            </style>
            <div class="form-container">
                <form id="noteForm">
                    <input 
                        type="text" 
                        id="title" 
                        name="title"
                        placeholder="Note Title" 
                        required 
                        minlength="3"
                        ${this.loading ? 'disabled' : ''}
                    >
                    <div class="error" id="titleError"></div>
                    
                    <textarea 
                        id="body" 
                        name="body"
                        placeholder="Note Content" 
                        required
                        minlength="5"
                        ${this.loading ? 'disabled' : ''}
                    ></textarea>
                    <div class="error" id="bodyError"></div>
                    
                    <button type="submit" ${this.loading ? 'disabled' : ''}>
                        ${this.loading ? 'Adding Note...' : 'Add Note'}
                    </button>
                </form>
            </div>
        `;
    }

    validateForm() {
        const title = this.shadowRoot.querySelector('#title').value.trim();
        const body = this.shadowRoot.querySelector('#body').value.trim();
        const titleError = this.shadowRoot.querySelector('#titleError');
        const bodyError = this.shadowRoot.querySelector('#bodyError');

        let isValid = true;

        // Reset errors
        titleError.textContent = '';
        bodyError.textContent = '';

        // Validate title
        if (!title) {
            titleError.textContent = 'Title is required';
            isValid = false;
        } else if (title.length < 3) {
            titleError.textContent = 'Title must be at least 3 characters long';
            isValid = false;
        }

        // Validate body
        if (!body) {
            bodyError.textContent = 'Content is required';
            isValid = false;
        } else if (body.length < 5) {
            bodyError.textContent = 'Content must be at least 5 characters long';
            isValid = false;
        }

        return {
            isValid,
            title,
            body,
        };
    }

    async handleSubmit(e) {
        e.preventDefault();
        try {
            const validation = this.validateForm();
            if (!validation.isValid) return;

            this.loading = true; // Tampilkan indikator loading
            this.render();

            const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: validation.title,
                    body: validation.body,
                }),
            });

            const responseJson = await response.json();

            if (responseJson.status === 'success') {
                window.dispatchEvent(new CustomEvent('note-added'));
                this.resetForm();
                showSuccess('Note added successfully');
            } else {
                throw new Error(responseJson.message);
            }
        } catch (error) {
            showError('Failed to add note: ' + error.message);
        } finally {
            this.loading = false; // Sembunyikan indikator loading
            this.render();
        }
    }

    addEventListeners() {
        this.shadowRoot
            .querySelector('#noteForm')
            .addEventListener('submit', this.handleSubmit.bind(this));
    }
}

customElements.define('note-form', NoteForm);
