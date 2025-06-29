// Lusion.co style scroll animations for blog
class BlogScrollAnimations {
    constructor() {
        this.sections = [];
        this.observer = null;
        this.init();
    }
    
    init() {
        this.setupSections();
        this.createObserver();
        this.observeSections();
    }
    
    setupSections() {
        this.sections = document.querySelectorAll('.blog-section, .blog-intro');
        
        // Add initial state
        this.sections.forEach((section, index) => {
            section.style.transitionDelay = `${index * 100}ms`;
        });
    }
    
    createObserver() {
        const options = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: 0.1
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, options);
    }
    
    observeSections() {
        this.sections.forEach(section => {
            this.observer.observe(section);
        });
    }
}

// Initialize blog animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only run on blog pages
    if (document.querySelector('.blog-content')) {
        new BlogScrollAnimations();
        
        // Add subtle parallax to hero
        const hero = document.querySelector('.project-hero');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                hero.style.transform = `translateY(${rate}px)`;
            });
        }
        
        // Add reading progress indicator
        createReadingProgress();
    }
});

function createReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const article = document.querySelector('.blog-content');
        if (!article) return;
        
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        
        const startReading = articleTop - windowHeight;
        const finishReading = articleTop + articleHeight;
        const totalReadingArea = finishReading - startReading;
        const currentReadingPosition = scrollTop - startReading;
        
        const readingProgress = Math.max(0, Math.min(100, 
            (currentReadingPosition / totalReadingArea) * 100
        ));
        
        progressBar.style.width = `${readingProgress}%`;
    });
}
