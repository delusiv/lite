/*
// Function to load header HTML
function loadHeader() {
    // Define the header HTML directly in JavaScript to avoid fetch issues
    const headerHTML = `
    <header>
        <nav>
            <div class="logo">
                <a href="${window.location.pathname.includes('/projects/') ? '../index.html' : 'index.html'}">Max Boissiere</a>
            </div>
            <div class="nav-right">
                <a href="https://www.linkedin.com/in/max-boissiere-788115193/" target="_blank" rel="noopener noreferrer" class="linkedin-icon" aria-label="Visit Max Boissiere's LinkedIn profile">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-linkedin">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M8 11v5"/>
                        <path d="M8 8v.01"/>
                        <path d="M12 16v-5"/>
                        <path d="M16 16v-3a2 2 0 1 0 -4 0"/>
                        <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z"/>
                    </svg>
                </a>
                <a href="https://www.instagram.com/max.boissiere/" target="_blank" rel="noopener noreferrer" class="instagram-icon" aria-label="Visit Max Boissiere's Instagram profile">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-instagram">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z"/>
                        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/>
                        <path d="M16.5 7.5v.01"/>
                    </svg>
                </a>
                <a href="https://www.youtube.com/@max.boissiere" target="_blank" rel="noopener noreferrer" class="youtube-icon" aria-label="Visit Max Boissiere's YouTube channel">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-youtube">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z"/>
                        <path d="M10 9l5 3l-5 3z"/>
                    </svg>
                </a>
                <a href="https://soundcloud.com/quiet-4444" target="_blank" rel="noopener noreferrer" class="music-icon" aria-label="Visit Max Boissiere's SoundCloud">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-soundcloud">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M17 11h1c1.38 0 3 1.274 3 3c0 1.657 -1.5 3 -3 3l-6 0v-10c3 0 4.5 1.5 5 4z"/>
                        <path d="M9 8l0 9"/>
                        <path d="M6 17l0 -7"/>
                        <path d="M3 16l0 -2"/>
                    </svg>
                </a>
                <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-sun">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/>
                        <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"/>
                    </svg>
                </button>
            </div>
        </nav>
    </header>`;

    // Find the header placeholder and replace it
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;
    } else {
        console.error('Header placeholder not found');
    }
}
*/

// Load header when DOM is ready
// document.addEventListener('DOMContentLoaded', loadHeader);
