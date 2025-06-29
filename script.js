// Max Boissiere - Cinematography Portfolio LITE VERSION
// All JavaScript functionality consolidated into a single file

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Contact section toggle
function initContactSection() {
    const plusIcon = document.getElementById('galleryPlusIcon');
    const contactSection = document.getElementById('contactSection');
    
    if (plusIcon && contactSection) {
        let isOpen = false;
        
        const toggleContact = () => {
            isOpen = !isOpen;
            
            if (isOpen) {
                plusIcon.classList.add('active');
                contactSection.classList.add('active');
                plusIcon.setAttribute('aria-label', 'Close contact section');
                
                // Scroll to hide the plus icon completely and show contact section
                setTimeout(() => {
                    const contactContent = contactSection.querySelector('.contact-content');
                    if (contactContent) {
                        contactContent.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    } else {
                        contactSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 200); // Slightly longer delay to let expansion animation progress
                
            } else {
                plusIcon.classList.remove('active');
                contactSection.classList.remove('active');
                plusIcon.setAttribute('aria-label', 'Open contact section');
            }
        };
        
        plusIcon.addEventListener('click', toggleContact);
        
        plusIcon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleContact();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                toggleContact();
            }
        });
    }
}

// Lusion.co-inspired sequential animation system
function initSequentialAnimation() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const animatedElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .logo a, .nav-right, .gallery-item, .back-link, .video-container, .detail-section, .still-item, .service-category');
    
    if (prefersReducedMotion) {
        animatedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }
    
    // Convert to array and sort by vertical position
    const elementsArray = Array.from(animatedElements).sort((a, b) => {
        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();
        return (rectA.top + window.scrollY) - (rectB.top + window.scrollY);
    });
    
    // Initialize gallery items for refined animation
    const galleryItems = elementsArray.filter(el => el.classList.contains('gallery-item'));
    initGalleryAnimations(galleryItems);
    
    // Add classes and animate with refined timing
    elementsArray.forEach(el => el.classList.add('load-item'));
    
    elementsArray.forEach((el, index) => {
        const delay = el.classList.contains('gallery-item') ? 
            100 + (index * 35) : // Gallery items get slower, more elegant reveal
            index * 45; // Others maintain crisp timing
        
        setTimeout(() => el.classList.add('loaded'), delay);
    });
}

// Gallery-specific Lusion.co-inspired animations
function initGalleryAnimations(galleryItems) {
    // No additional hover interactions needed - CSS handles the main hover effects
    // This function is kept for potential future gallery-specific JS enhancements
}

// Image loading with animation support
function initImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Set up image loading
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
}

// Lusion.co-inspired fullscreen viewer with pixel peeping
function initFullscreenViewer() {
    const stillImages = document.querySelectorAll('.still-item img');
    
    stillImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.title = 'Click to view fullscreen';
        
        img.addEventListener('click', (e) => {
            e.preventDefault();
            createLusionViewer(img);
        });
    });
}

function createLusionViewer(img) {
    // Create overlay with elegant fade-in
    const overlay = document.createElement('div');
    overlay.className = 'lusion-viewer';
    overlay.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.98); z-index: 10000;
        opacity: 0; transition: opacity 0.4s cubic-bezier(0.19,1,0.22,1);
        cursor: grab; overflow: hidden; user-select: none;
    `;
    
    // Image container for transforms
    const imageContainer = document.createElement('div');
    imageContainer.style.cssText = `
        position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
        transform: scale(0.95); transition: transform 0.6s cubic-bezier(0.19,1,0.22,1);
    `;
    
    // The main image
    const fullscreenImg = document.createElement('img');
    fullscreenImg.src = img.src;
    fullscreenImg.alt = img.alt;
    fullscreenImg.style.cssText = `
        max-width: 85vw; max-height: 85vh; object-fit: contain; cursor: zoom-in;
        transition: all 0.4s cubic-bezier(0.19,1,0.22,1); border-radius: 4px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5); transform-origin: center;
    `;
    fullscreenImg.draggable = false;
    
    // Close button with minimal design
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute; top: 30px; right: 30px; width: 44px; height: 44px;
        border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; background: rgba(0,0,0,0.4);
        color: white; font-size: 20px; font-weight: 300; cursor: pointer; z-index: 10001;
        display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);
        transition: all 0.3s cubic-bezier(0.19,1,0.22,1); opacity: 0.7;
    `;
    
    // Zoom indicator
    const zoomIndicator = document.createElement('div');
    zoomIndicator.style.cssText = `
        position: absolute; bottom: 30px; left: 30px; padding: 8px 16px;
        background: rgba(0,0,0,0.4); color: white; border-radius: 20px;
        font-size: 12px; font-weight: 400; backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1); opacity: 0;
        transition: opacity 0.3s ease; pointer-events: none;
    `;
    zoomIndicator.textContent = '100%';
    
    // Instructions
    const instructions = document.createElement('div');
    instructions.style.cssText = `
        position: absolute; bottom: 30px; right: 30px; padding: 8px 16px;
        background: rgba(0,0,0,0.4); color: rgba(255,255,255,0.8); border-radius: 20px;
        font-size: 11px; font-weight: 300; backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1); opacity: 0;
        transition: opacity 0.3s ease; pointer-events: none; text-align: right;
    `;
    instructions.innerHTML = 'Click to zoom • Drag to pan • Scroll to zoom • ESC to close';
    
    // Zoom and pan state
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    
    // Update transform
    const updateTransform = () => {
        fullscreenImg.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        zoomIndicator.textContent = `${Math.round(scale * 100)}%`;
        
        // Show/hide zoom indicator based on zoom level
        if (scale > 1) {
            zoomIndicator.style.opacity = '1';
            fullscreenImg.style.cursor = 'grab';
        } else {
            zoomIndicator.style.opacity = '0';
            fullscreenImg.style.cursor = 'zoom-in';
        }
        
        // Update overlay cursor based on state
        if (isDragging) {
            overlay.style.cursor = 'grabbing';
            fullscreenImg.style.cursor = 'grabbing';
        } else if (scale > 1) {
            overlay.style.cursor = 'grab';
        } else {
            overlay.style.cursor = 'zoom-in';
        }
    };
    
    // Zoom functionality
    const zoom = (factor, clientX, clientY) => {
        const rect = fullscreenImg.getBoundingClientRect();
        const x = clientX - rect.left - rect.width / 2;
        const y = clientY - rect.top - rect.height / 2;
        
        const newScale = Math.max(1, Math.min(scale * factor, 4));
        const scaleFactor = newScale / scale;
        
        translateX = translateX * scaleFactor - x * (scaleFactor - 1) / scale;
        translateY = translateY * scaleFactor - y * (scaleFactor - 1) / scale;
        scale = newScale;
        
        // Constrain panning
        const maxTranslateX = (rect.width * (scale - 1)) / 2;
        const maxTranslateY = (rect.height * (scale - 1)) / 2;
        translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX));
        translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY));
        
        updateTransform();
    };
    
    // Mouse events
    fullscreenImg.addEventListener('click', (e) => {
        if (scale === 1) {
            zoom(2, e.clientX, e.clientY);
        } else {
            scale = 1;
            translateX = 0;
            translateY = 0;
            updateTransform();
        }
    });
    
    fullscreenImg.addEventListener('mousedown', (e) => {
        if (scale > 1) {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            updateTransform();
            e.preventDefault();
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging && scale > 1) {
            const deltaX = e.clientX - lastX;
            const deltaY = e.clientY - lastY;
            translateX += deltaX / scale;
            translateY += deltaY / scale;
            lastX = e.clientX;
            lastY = e.clientY;
            updateTransform();
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            updateTransform();
        }
    });
    
    // Wheel zoom
    overlay.addEventListener('wheel', (e) => {
        e.preventDefault();
        const factor = e.deltaY > 0 ? 0.9 : 1.1;
        zoom(factor, e.clientX, e.clientY);
    });
    
    // Close functionality
    const closeViewer = () => {
        overlay.style.opacity = '0';
        imageContainer.style.transform = 'scale(0.95)';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
                document.body.style.overflow = originalOverflow;
                document.removeEventListener('keydown', handleKeydown);
            }
        }, 400);
    };
    
    const handleKeydown = (e) => {
        if (e.key === 'Escape') closeViewer();
    };
    
    // Close button events
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255,255,255,0.1)';
        closeBtn.style.opacity = '1';
    });
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(0,0,0,0.4)';
        closeBtn.style.opacity = '0.7';
    });
    closeBtn.addEventListener('click', closeViewer);
    
    // Background click to close
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeViewer();
    });
    
    // Assemble and show
    imageContainer.appendChild(fullscreenImg);
    overlay.appendChild(imageContainer);
    overlay.appendChild(closeBtn);
    overlay.appendChild(zoomIndicator);
    overlay.appendChild(instructions);
    document.body.appendChild(overlay);
    
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeydown);
    
    // Animate in
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        imageContainer.style.transform = 'scale(1)';
        setTimeout(() => {
            instructions.style.opacity = '0.8';
            setTimeout(() => {
                instructions.style.opacity = '0';
            }, 3000);
        }, 1000);
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Lusion.co style navbar scroll effect
function initNavbarScrollEffect() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScrollY = 0;
    let ticking = false;
    
    const updateNavbar = () => {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class after 30px for subtle effect
        if (currentScrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    };
    
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
}

// Gallery filtering with Shuffle.js
function initGalleryFilter() {
    const gallery = document.getElementById('gallery');
    const filterToggle = document.getElementById('filterToggle');
    const filterText = document.querySelector('.filter-text');
    const filterCounter = document.querySelector('.filter-counter');
    
    if (!gallery || !filterToggle) return;
    
    let currentFilterIndex = 0;
    let shuffleInstance = null;
    
    // Filter states
    const filterStates = [
        { filter: '*', text: 'All Projects' },
        { filter: 'dp', text: 'Director of Photography' },
        { filter: 'editor', text: 'Editor' },
        { filter: 'director', text: 'Director' }
    ];
    
    // Sparks animation function
    function createSparks(element, clickEvent) {
        let sparksX, sparksY;
        
        if (clickEvent) {
            // Use exact click position
            sparksX = clickEvent.clientX;
            sparksY = clickEvent.clientY;
        } else {
            // Fallback to button center
            const rect = element.getBoundingClientRect();
            sparksX = rect.left + rect.width / 2;
            sparksY = rect.top + rect.height / 2;
        }
        
        const sparksContainer = document.createElement('div');
        sparksContainer.className = 'sparks-container';
        
        // Position container at exact click location
        sparksContainer.style.position = 'fixed';
        sparksContainer.style.left = sparksX + 'px';
        sparksContainer.style.top = sparksY + 'px';
        sparksContainer.style.transform = 'translate(-50%, -50%)';
        
        document.body.appendChild(sparksContainer);
        
        // Create multiple sparks
        for (let i = 0; i < 12; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            
            // Random direction and distance
            const angle = (i * 30) + Math.random() * 30; // Spread around circle
            const distance = 50 + Math.random() * 30; // Random distance
            const x = Math.cos(angle * Math.PI / 180) * distance;
            const y = Math.sin(angle * Math.PI / 180) * distance;
            
            spark.style.setProperty('--x', x + 'px');
            spark.style.setProperty('--y', y + 'px');
            
            // Random colors
            const colors = ['#ffd700', '#ff6b35', '#2563eb', '#7c3aed', '#10b981', '#f59e0b'];
            spark.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            sparksContainer.appendChild(spark);
        }
        
        // Add shake animation to button
        element.classList.add('sparking');
        
        // Cleanup after animation
        setTimeout(() => {
            element.classList.remove('sparking');
            if (sparksContainer.parentNode) {
                sparksContainer.parentNode.removeChild(sparksContainer);
            }
        }, 800);
    }
    
    // Initialize Shuffle.js
    if (typeof Shuffle !== 'undefined') {
        shuffleInstance = new Shuffle(gallery, {
            itemSelector: '.gallery-item:not(.contact-section)',
            columnWidth: 300,
            gutterWidth: 32,
            speed: 600,
            easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
            delayMode: 'progressive',
            staggerAmount: 15,
            staggerAmountMax: 100,
            useTransforms: true,
            throttle: 300,
            throttleResize: 100,
            isCentered: true,
        });
        
        // Force initial layout after a short delay
        setTimeout(() => {
            if (shuffleInstance) {
                shuffleInstance.update();
                
                // Restore saved filter state
                restoreFilterState();
            }
        }, 100);
    } else {
        // If Shuffle.js isn't available, still restore the UI state
        setTimeout(() => {
            restoreFilterState();
        }, 100);
    }
    
    // Function to save filter state
    function saveFilterState() {
        localStorage.setItem('portfolioFilterIndex', currentFilterIndex.toString());
    }
    
    // Function to restore filter state
    function restoreFilterState() {
        const savedIndex = localStorage.getItem('portfolioFilterIndex');
        if (savedIndex !== null) {
            const index = parseInt(savedIndex, 10);
            if (index >= 0 && index < filterStates.length) {
                currentFilterIndex = index;
                const currentState = filterStates[currentFilterIndex];
                
                // Update UI
                if (filterText) {
                    filterText.textContent = currentState.text;
                }
                if (filterCounter) {
                    filterCounter.textContent = `${currentFilterIndex + 1}/4`;
                }
                filterToggle.setAttribute('data-filter', currentState.filter);
                
                // Apply filter with Shuffle.js
                if (shuffleInstance) {
                    if (currentState.filter === '*') {
                        shuffleInstance.filter();
                    } else {
                        shuffleInstance.filter((element) => {
                            return element.dataset.category === currentState.filter;
                        });
                    }
                }
            }
        }
    }
    
    // Toggle filter functionality
    filterToggle.addEventListener('click', (event) => {
        // Create sparks effect at click location
        createSparks(filterToggle, event);
        
        // Cycle to next filter state
        currentFilterIndex = (currentFilterIndex + 1) % filterStates.length;
        const currentState = filterStates[currentFilterIndex];
        
        // Update button text
        if (filterText) {
            filterText.textContent = currentState.text;
        }
        
        // Update counter
        if (filterCounter) {
            filterCounter.textContent = `${currentFilterIndex + 1}/4`;
        }
        
        // Update button color state
        filterToggle.setAttribute('data-filter', currentState.filter);
        
        // Save filter state
        saveFilterState();
        
        // Apply filter with Shuffle.js
        if (shuffleInstance) {
            if (currentState.filter === '*') {
                shuffleInstance.filter();
            } else {
                shuffleInstance.filter((element) => {
                    return element.dataset.category === currentState.filter;
                });
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (shuffleInstance) {
            shuffleInstance.update();
        }
    });
}

// Handle contact button click - change text to show email
function handleContactClick(event, email) {
    event.preventDefault();
    
    const button = event.target.closest('.cta-button');
    if (!button) return;
    
    // Store original text if not already stored
    if (!button.hasAttribute('data-original-text')) {
        button.setAttribute('data-original-text', button.textContent);
    }
    
    // Check if currently showing email
    if (button.textContent === email) {
        // Copy email to clipboard
        copyToClipboard(email, button);
    } else {
        // Show email
        button.textContent = email;
        button.style.fontSize = '0.9rem';
        button.style.letterSpacing = '0.5px';
    }
}

// Copy text to clipboard and show tooltip
function copyToClipboard(text, button) {
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(text).then(() => {
            showTooltip(button, 'Email copied to clipboard!');
        }).catch(() => {
            fallbackCopyTextToClipboard(text, button);
        });
    } else {
        // Fallback for older browsers or non-secure contexts
        fallbackCopyTextToClipboard(text, button);
    }
}

// Fallback copy method
function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showTooltip(button, 'Email copied to clipboard!');
    } catch (err) {
        showTooltip(button, 'Could not copy email');
        console.error('Failed to copy email to clipboard');
    }
    
    document.body.removeChild(textArea);
}

// Show tooltip
function showTooltip(button, message) {
    // Remove any existing tooltip
    const existingTooltip = document.querySelector('.copy-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'copy-tooltip';
    tooltip.textContent = message;
    
    // Position tooltip above the button
    const rect = button.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.left = rect.left + rect.width / 2 + 'px';
    tooltip.style.top = rect.top - 10 + 'px';
    tooltip.style.transform = 'translate(-50%, -100%)';
    tooltip.style.background = 'var(--dark-bg)';
    tooltip.style.color = 'var(--dark-text)';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '0.85rem';
    tooltip.style.fontWeight = '500';
    tooltip.style.zIndex = '10000';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    
    // Add arrow
    const arrow = document.createElement('div');
    arrow.style.position = 'absolute';
    arrow.style.top = '100%';
    arrow.style.left = '50%';
    arrow.style.transform = 'translateX(-50%)';
    arrow.style.width = '0';
    arrow.style.height = '0';
    arrow.style.borderLeft = '6px solid transparent';
    arrow.style.borderRight = '6px solid transparent';
    arrow.style.borderTop = '6px solid var(--dark-bg)';
    tooltip.appendChild(arrow);
    
    document.body.appendChild(tooltip);
    
    // Animate in
    requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translate(-50%, -100%) translateY(-5px)';
    });
    
    // Remove after 2 seconds
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translate(-50%, -100%)';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 300);
        }
    }, 2000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initContactSection();
    initImageLoading();
    initFullscreenViewer();
    initSmoothScrolling();
    initSequentialAnimation(); // Add sequential loading animation
    initNavbarScrollEffect(); // Add Lusion.co style navbar effect
    initGalleryFilter(); // Add Shuffle.js gallery filtering
    
    window.toggleTheme = toggleTheme;
});

// Preload critical images - optimized
function preloadImages() {
    if (window.location.pathname.includes('/projects/')) return;
    
    const criticalImages = ['gallery/acyr1.png', 'gallery/rei1.png', 'gallery/nami1.png', 'gallery/sfl1.png'];
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

window.addEventListener('load', preloadImages);
