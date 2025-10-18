class LoadingIndicator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .loading-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 2rem;
                }
                
                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid var(--primary-color);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
            <div class="loading-container">
                <div class="loading-spinner"></div>
            </div>
        `;
    }
}

customElements.define('loading-indicator', LoadingIndicator);
