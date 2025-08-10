// Max Boissiere - Ultra-Optimized JavaScript - Final Version
(function() {
    'use strict';
    
    let customShuffle = null;
    let currentFilterIndex = 0;
    const filterStates = [
        { filter: '*', text: 'All' },
        { filter: 'dp', text: 'Director of Photography' },
        { filter: 'editor', text: 'Video Editor' },
        { filter: 'director', text: 'Director' },
        { filter: 'contact', text: 'Contact' }
    ];
    
    // Theme management
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 
            (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (themeToggle) {
            // Add animation class based on current theme
            const animationClass = currentTheme === 'light' ? 'setting' : 'rising';
            themeToggle.classList.add(animationClass);
            
            // Change theme during the exchange (when outgoing icon is halfway down)
            setTimeout(() => {
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            }, 400);
            
            // Remove animation class after animation completes
            setTimeout(() => {
                themeToggle.classList.remove(animationClass);
            }, 800);
        } else {
            // Fallback if button not found
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        }
    }
    window.toggleTheme = toggleTheme;
    
    // Contact section
    function initContactSection() {
        const plusIcon = document.getElementById('galleryPlusIcon');
        const contactSection = document.getElementById('contactSection');
        
        if (!plusIcon || !contactSection) return;
        
        let isOpen = false;
        
        const toggleContact = () => {
            isOpen = !isOpen;
            
            if (isOpen) {
                plusIcon.classList.add('active');
                contactSection.classList.add('active');
                plusIcon.setAttribute('aria-label', 'Close contact section');
                
                // Scroll to show contact section
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
                }, 200);
                
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
    
    // Sequential loading animation
    function initSequentialLoading() {
        const loadItems = document.querySelectorAll('.load-item, h1, h2, h3, h4, h5, h6, p, .logo a, .nav-right, .back-link, .video-container, .detail-section, .still-item, .service-category');
        
        loadItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('loaded');
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }
    
    // Gallery item loading animation
    function initGalleryItemsLoading() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('loaded');
            }, index * 60);
        });
    }
    
    // Custom Shuffle.js-like implementation
    function initCustomShuffle() {
        const gallery = document.getElementById('gallery');
        if (!gallery) return;
        
        const galleryItems = gallery.querySelectorAll('.gallery-item');
        if (galleryItems.length === 0) return;
        
        let columns = 4; // Default for desktop
        
        // Calculate responsive columns
        function updateLayout() {
            const screenWidth = window.innerWidth;
            if (screenWidth <= 480) {
                columns = 1;
            } else if (screenWidth <= 1024) {
                columns = 2;
            } else {
                columns = 4;
            }
            layoutItems();
        }
        
        // Layout items in masonry-style grid
        function layoutItems() {
            const visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
            const columnHeights = new Array(columns).fill(0);
            
            // Get container dimensions without padding
            const containerRect = gallery.getBoundingClientRect();
            const containerStyle = window.getComputedStyle(gallery);
            const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
            const paddingRight = parseFloat(containerStyle.paddingRight) || 0;
            const containerWidth = gallery.offsetWidth - paddingLeft - paddingRight;
            
            const itemWidthPx = containerWidth / columns;
            const itemHeight = itemWidthPx * (9/16); // 16:9 aspect ratio
            
            visibleItems.forEach((item, index) => {
                // Find the shortest column
                const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
                
                // Position the item (no offset needed since we're using the inner width)
                const x = shortestColumn * itemWidthPx;
                const y = columnHeights[shortestColumn];
                
                item.style.transform = `translate(${x}px, ${y}px)`;
                item.style.width = `${itemWidthPx}px`; // Use pixel width instead of percentage
                
                // Update column height
                columnHeights[shortestColumn] += itemHeight;
            });
            
            // Set container height with bottom padding
            const maxHeight = Math.max(...columnHeights);
            gallery.style.height = `${maxHeight + 32}px`; // Add 2rem bottom padding
        }
        
        // Initialize layout
        updateLayout();
        
        // Initialize gallery items loading animation after layout
        setTimeout(() => {
            initGalleryItemsLoading();
        }, 100);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            updateLayout();
        });
        
        // Return layout function for filtering
        return {
            layout: layoutItems,
            updateLayout: updateLayout
        };
    }
    
    // Colorful sparks animation for filter button
    function createSparks(x, y) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
        const sparkCount = 12;
        
        for (let i = 0; i < sparkCount; i++) {
            const spark = document.createElement('div');
            spark.className = 'filter-spark';
            spark.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${x}px;
                top: ${y}px;
                box-shadow: 0 0 6px currentColor;
            `;
            
            document.body.appendChild(spark);
            
            // Random direction and distance
            const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5;
            const distance = 50 + Math.random() * 100;
            const duration = 800 + Math.random() * 400;
            
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;
            
            // Animate the spark
            const animation = spark.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(${endX - x}px, ${endY - y}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            animation.onfinish = () => {
                if (spark && spark.parentNode) {
                    spark.parentNode.removeChild(spark);
                }
            };
        }
    }

    // Filter functionality
    function restoreFilterState() {
        const savedIndex = localStorage.getItem('portfolioFilterIndex');
        const filterToggle = document.getElementById('filterToggle');
        const filterText = document.querySelector('.filter-text');
        
        if (!filterToggle) return;
        
        if (savedIndex !== null) {
            const index = parseInt(savedIndex, 10);
            if (index >= 0 && index < filterStates.length) {
                currentFilterIndex = index;
                const currentState = filterStates[currentFilterIndex];
                
                const filterIcon = filterToggle.querySelector('svg');
                
                if (filterText) {
                    if (currentState.filter === '*') {
                        if (filterIcon) filterIcon.style.display = 'block';
                        filterText.style.display = 'none';
                        filterText.textContent = '';
                    } else {
                        if (filterIcon) filterIcon.style.display = 'none';
                        filterText.style.display = 'block';
                        filterText.textContent = currentState.text;
                    }
                }
                filterToggle.setAttribute('data-filter', currentState.filter);
                
                // Apply filter with simple CSS Grid approach
                applySimpleFilter(currentState.filter);
            }
        }
    }
    
    function applySimpleFilter(filter) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const contactSection = document.getElementById('contactSection');
        const plusIcon = document.getElementById('galleryPlusIcon');
        
        // First, fade out all items
        galleryItems.forEach(item => {
            item.classList.remove('loaded');
        });
        
        // After fade out, apply filter and re-layout
        setTimeout(() => {
            galleryItems.forEach(item => {
                const category = item.dataset.category;
                const isPlusItem = item.classList.contains('gallery-plus-item');
                
                if (filter === 'contact') {
                    // Contact state: show only plus button
                    if (isPlusItem) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                } else if (filter === '*' || isPlusItem || category === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
            
            // Handle contact section for contact filter
            if (filter === 'contact') {
                // Open contact section automatically
                if (contactSection && plusIcon) {
                    plusIcon.classList.add('active');
                    contactSection.classList.add('active');
                    setTimeout(() => {
                        contactSection.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                    }, 200);
                }
            } else {
                // Close contact section for other filters
                if (contactSection && plusIcon) {
                    plusIcon.classList.remove('active');
                    contactSection.classList.remove('active');
                }
            }
            
            // Re-layout items after filter change
            if (customShuffle) {
                customShuffle.layout();
            }
            
            // Animate visible items back in
            const visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
            visibleItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('loaded');
                }, index * 60);
            });
        }, 200);
    }
    
    function initGalleryFilter() {
        const gallery = document.getElementById('gallery');
        let filterToggle = document.getElementById('filterToggle');
        let filterText = document.querySelector('.filter-text');
        
        // If filter elements don't exist yet, wait for header to load
        if (!filterToggle) {
            document.addEventListener('headerLoaded', () => {
                filterToggle = document.getElementById('filterToggle');
                filterText = document.querySelector('.filter-text');
                if (filterToggle) {
                    setupFilterLogic();
                }
            });
            return;
        }
        
        setupFilterLogic();
        
        function setupFilterLogic() {
            if (!gallery || !filterToggle) return;
            
            function saveFilterState() {
                localStorage.setItem('portfolioFilterIndex', currentFilterIndex.toString());
            }
            
            filterToggle.addEventListener('click', (event) => {
                // Create sparks at click position (with error handling)
                try {
                    const rect = filterToggle.getBoundingClientRect();
                    const x = event.clientX || rect.left + rect.width / 2;
                    const y = event.clientY || rect.top + rect.height / 2;
                    createSparks(x, y);
                } catch (sparkError) {
                    console.warn('Sparks animation failed:', sparkError);
                }
                
                currentFilterIndex = (currentFilterIndex + 1) % filterStates.length;
                const currentState = filterStates[currentFilterIndex];
                const filterIcon = filterToggle.querySelector('svg');
                
                if (filterText) {
                    if (currentState.filter === '*') {
                        if (filterIcon) filterIcon.style.display = 'block';
                        filterText.style.display = 'none';
                        filterText.textContent = '';
                    } else {
                        if (filterIcon) filterIcon.style.display = 'none';
                        filterText.style.display = 'block';
                        filterText.textContent = currentState.text;
                    }
                }
                
                filterToggle.setAttribute('data-filter', currentState.filter);
                saveFilterState();
                
                // Apply filter with simple CSS Grid approach
                applySimpleFilter(currentState.filter);
            });
        }
    }
    
    // Contact button handling
    function handleContactClick(event, email) {
        event.preventDefault();
        const button = event.target.closest('.cta-button');
        if (!button) return;
        
        if (!button.hasAttribute('data-original-text')) {
            button.setAttribute('data-original-text', button.textContent);
        }
        
        if (button.textContent === email) {
            copyToClipboard(email, button);
        } else {
            button.textContent = email;
            button.style.fontSize = '0.9rem';
        }
    }
    window.handleContactClick = handleContactClick;
    
    // Copy to clipboard
    function copyToClipboard(text, button) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showTooltip(button, 'Copied!');
            }).catch(() => {
                fallbackCopy(text, button);
            });
        } else {
            fallbackCopy(text, button);
        }
    }
    
    function fallbackCopy(text, button) {
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
            showTooltip(button, 'Copied!');
        } catch (err) {
            showTooltip(button, 'Copy failed');
        }
        
        document.body.removeChild(textArea);
    }
    
    function showTooltip(element, message) {
        const originalText = element.getAttribute('data-original-text') || element.textContent;
        element.textContent = message;
        element.style.backgroundColor = 'var(--accent)';
        element.style.color = 'white';
        
        setTimeout(() => {
            element.textContent = originalText;
            element.style.backgroundColor = '';
            element.style.color = '';
        }, 2000);    }

    // Project details section animations
    function initProjectDetailsAnimations() {
        const detailSections = document.querySelectorAll('.detail-section');
        
        detailSections.forEach(section => {
            const listItems = section.querySelectorAll('li');
            
            section.addEventListener('mouseenter', () => {
                listItems.forEach((item, index) => {
                    item.style.transitionDelay = `${index * 0.03}s`;
                });
            });
            
            section.addEventListener('mouseleave', () => {
                listItems.forEach(item => {
                    item.style.transitionDelay = '0s';
                });
            });
        });
    }

    // Blog animations
    function initBlogAnimations() {
        const blogSections = document.querySelectorAll('.blog-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                }
            });
        }, { threshold: 0.1 });
        
        blogSections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // Initialize everything
    function initializeGalleryFeatures() {
        // Simple initialization without complex timing issues
        const gallery = document.getElementById('gallery');
        const galleryItems = gallery ? gallery.querySelectorAll('.gallery-item') : [];
        
        if (gallery && galleryItems.length > 0) {
            customShuffle = initCustomShuffle();
            initGalleryFilter();
        } else {
            // If gallery isn't ready yet, try again after a short delay
            setTimeout(initializeGalleryFeatures, 100);
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        initContactSection();
        initSequentialLoading();
        initBlogAnimations();
        initProjectDetailsAnimations();
        initFullscreenViewer();
        
        // Initialize gallery features
        initializeGalleryFeatures();
    });
    
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
        // Get current theme for background
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const overlayBg = currentTheme === 'dark' ? 'rgba(0,0,0,0.95)' : 'rgba(128,128,128,0.95)';
        
        // Create overlay with theme-dependent background
        const overlay = document.createElement('div');
        overlay.className = 'lusion-viewer';
        overlay.style.cssText = `
            position: fixed; inset: 0; background: ${overlayBg}; z-index: 10000;
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
            transition: opacity 0.3s ease; pointer-events: auto; cursor: pointer;
        `;
        zoomIndicator.textContent = '100%';
        
        // Zoom slider container
        const sliderContainer = document.createElement('div');
        sliderContainer.style.cssText = `
            position: absolute; bottom: 80px; left: 30px; width: 200px;
            background: rgba(0,0,0,0.4); border-radius: 25px; padding: 15px 20px;
            backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);
            opacity: 0; pointer-events: none; transition: all 0.3s ease;
            transform: translateY(10px);
        `;
        
        // Slider label
        const sliderLabel = document.createElement('div');
        sliderLabel.style.cssText = `
            color: white; font-size: 11px; font-weight: 300; margin-bottom: 10px;
            text-align: center; opacity: 0.8;
        `;
        sliderLabel.textContent = 'Zoom Level';
        
        // Zoom slider
        const zoomSlider = document.createElement('input');
        zoomSlider.type = 'range';
        zoomSlider.min = '50';
        zoomSlider.max = '500';
        zoomSlider.value = '100';
        zoomSlider.step = '10';
        zoomSlider.style.cssText = `
            width: 100%; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.2);
            outline: none; appearance: none; -webkit-appearance: none;
        `;
        
        // Slider track styling
        const sliderStyle = document.createElement('style');
        sliderStyle.textContent = `
            .zoom-slider::-webkit-slider-thumb {
                appearance: none; width: 16px; height: 16px; border-radius: 50%;
                background: white; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            }
            .zoom-slider::-moz-range-thumb {
                width: 16px; height: 16px; border-radius: 50%; background: white;
                cursor: pointer; border: none; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            }
        `;
        document.head.appendChild(sliderStyle);
        zoomSlider.className = 'zoom-slider';
        
        // Slider value display
        const sliderValue = document.createElement('div');
        sliderValue.style.cssText = `
            color: white; font-size: 11px; font-weight: 400; text-align: center;
            margin-top: 8px; opacity: 0.9;
        `;
        sliderValue.textContent = '100%';
        
        // Assemble slider
        sliderContainer.appendChild(sliderLabel);
        sliderContainer.appendChild(zoomSlider);
        sliderContainer.appendChild(sliderValue);
        
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
        let dragStarted = false;
        let lastX = 0;
        let lastY = 0;
        
        // Update transform
        const updateTransform = () => {
            fullscreenImg.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
            const zoomPercentage = Math.round(scale * 100);
            zoomIndicator.textContent = `${zoomPercentage}%`;
            sliderValue.textContent = `${zoomPercentage}%`;
            zoomSlider.value = zoomPercentage;
            
            // Show/hide zoom indicator based on zoom level
            if (scale > 1) {
                zoomIndicator.style.opacity = '1';
                fullscreenImg.style.cursor = 'grab';
            } else {
                zoomIndicator.style.opacity = '0.6';
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
            
            const newScale = Math.max(0.5, Math.min(scale * factor, 5));
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
        
        // Set zoom to specific percentage
        const setZoom = (percentage) => {
            const newScale = percentage / 100;
            const rect = fullscreenImg.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            scale = Math.max(0.5, Math.min(newScale, 5));
            
            // Reset position when zooming out to 100% or less
            if (scale <= 1) {
                translateX = 0;
                translateY = 0;
            } else {
                // Constrain panning for new scale
                const maxTranslateX = (rect.width * (scale - 1)) / 2;
                const maxTranslateY = (rect.height * (scale - 1)) / 2;
                translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX));
                translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY));
            }
            
            updateTransform();
        };
        
        // Zoom indicator click to show/hide slider
        zoomIndicator.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = sliderContainer.style.opacity === '1';
            if (isVisible) {
                sliderContainer.style.opacity = '0';
                sliderContainer.style.pointerEvents = 'none';
                sliderContainer.style.transform = 'translateY(10px)';
            } else {
                sliderContainer.style.opacity = '1';
                sliderContainer.style.pointerEvents = 'auto';
                sliderContainer.style.transform = 'translateY(0)';
            }
        });
        
        // Slider input event
        zoomSlider.addEventListener('input', (e) => {
            const percentage = parseInt(e.target.value);
            setZoom(percentage);
        });
        
        // Hide slider when clicking elsewhere
        const handleOverlayClick = (e) => {
            if (e.target === overlay) {
                sliderContainer.style.opacity = '0';
                sliderContainer.style.pointerEvents = 'none';
                sliderContainer.style.transform = 'translateY(10px)';
                closeViewer();
            }
        };
        
        // Mouse events
        fullscreenImg.addEventListener('click', (e) => {
            // Only zoom if we didn't just finish dragging
            if (!dragStarted && scale === 1) {
                zoom(2, e.clientX, e.clientY);
            } else if (!dragStarted && scale > 1) {
                scale = 1;
                translateX = 0;
                translateY = 0;
                updateTransform();
            }
            // Reset drag flag after a short delay
            setTimeout(() => {
                dragStarted = false;
            }, 100);
        });
        
        fullscreenImg.addEventListener('mousedown', (e) => {
            if (scale > 1) {
                isDragging = true;
                dragStarted = false;
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
                
                // Mark that we've started dragging if movement is significant
                if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
                    dragStarted = true;
                }
                
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
        overlay.addEventListener('click', handleOverlayClick);
        
        // Assemble and show
        imageContainer.appendChild(fullscreenImg);
        overlay.appendChild(imageContainer);
        overlay.appendChild(closeBtn);
        overlay.appendChild(zoomIndicator);
        overlay.appendChild(sliderContainer);
        overlay.appendChild(instructions);
        document.body.appendChild(overlay);
        
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeydown);
        
        // Initialize display
        updateTransform();
        
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

    // Initialize fullscreen viewer
    document.addEventListener('DOMContentLoaded', initFullscreenViewer);
})();
