// Loading script for enhanced performance and user experience
// This script handles initial page loading states and optimizations

// Show loading state immediately
document.documentElement.classList.add('loading');

// Critical resource preloading
function preloadCriticalResources() {
    // Preload Inter font
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    fontLink.as = 'style';
    fontLink.onload = function() { this.rel = 'stylesheet'; };
    document.head.appendChild(fontLink);
    
    // Preload critical images for gallery
    if (!window.location.pathname.includes('/projects/')) {
        const criticalImages = [
            'gallery/acyr1.png',
            'gallery/rei1.png', 
            'gallery/nami1.png',
            'gallery/sfl1.png'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = src;
            link.as = 'image';
            document.head.appendChild(link);
        });
    }
}

// Initialize loading optimizations
function initLoadingOptimizations() {
    // Add loaded class when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                document.documentElement.classList.remove('loading');
                document.documentElement.classList.add('loaded');
            }, 100);
        });
    } else {
        document.documentElement.classList.remove('loading');
        document.documentElement.classList.add('loaded');
    }
    
    // Preload resources
    preloadCriticalResources();
}

// Run immediately
initLoadingOptimizations();
