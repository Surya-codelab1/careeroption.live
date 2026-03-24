// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');
const quickNav = document.querySelector('.quick-nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Quick nav scroll effect
    if (quickNav && window.scrollY > 300) {
        quickNav.classList.add('scrolled');
    } else if (quickNav) {
        quickNav.classList.remove('scrolled');
    }
});

// ===== MOBILE NAVIGATION TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navClose = document.getElementById('navClose');
const navMenu = document.getElementById('navMenu');

// Open menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show');
    });
}

// Close menu
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navToggle && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('show');
    }
});

// ===== QUICK NAVIGATION SMOOTH SCROLL =====
const quickNavItems = document.querySelectorAll('.quick-nav__item');

quickNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all items
        quickNavItems.forEach(navItem => navItem.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Smooth scroll to section
        const targetId = item.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const quickNavHeight = quickNav ? quickNav.offsetHeight : 0;
            const offset = headerHeight + quickNavHeight + 20;
            
            const targetPosition = targetSection.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ACTIVE SECTION HIGHLIGHTING =====
function highlightActiveSection() {
    const sections = document.querySelectorAll('.roadmap-section');
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            // Update quick nav active state
            quickNavItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightActiveSection);

// ===== SEE MORE / SEE LESS FUNCTIONALITY =====
const seeMoreButtons = document.querySelectorAll('.see-more-btn');

seeMoreButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        const grid = document.querySelector(`.blogs__grid[data-category="${category}"]`);
        const hiddenCards = grid.querySelectorAll('.blog__card.hidden');
        
        if (button.classList.contains('expanded')) {
            // Collapse - hide extra cards
            hiddenCards.forEach(card => {
                card.classList.add('hidden');
                card.style.animation = 'none';
            });
            button.classList.remove('expanded');
            
            // Scroll back to section header
            const section = button.closest('.roadmap-section');
            const headerHeight = header.offsetHeight;
            const quickNavHeight = quickNav ? quickNav.offsetHeight : 0;
            const offset = headerHeight + quickNavHeight + 20;
            
            window.scrollTo({
                top: section.offsetTop - offset,
                behavior: 'smooth'
            });
        } else {
            // Expand - show hidden cards
            hiddenCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.remove('hidden');
                    card.classList.add('animate');
                    
                    // Remove animation class after animation completes
                    setTimeout(() => {
                        card.classList.remove('animate');
                    }, 600);
                }, index * 100);
            });
            button.classList.add('expanded');
        }
    });
});

// ===== INTERSECTION OBSERVER FOR SECTION ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate blog cards within the section
            const cards = entry.target.querySelectorAll('.blog__card:not(.hidden)');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate');
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observe all roadmap sections
const roadmapSections = document.querySelectorAll('.roadmap-section');
roadmapSections.forEach(section => {
    sectionObserver.observe(section);
});

// ===== BACK TO TOP BUTTON =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            
            const headerHeight = header.offsetHeight;
            const quickNavHeight = quickNav ? quickNav.offsetHeight : 0;
            const offset = headerHeight + quickNavHeight + 20;
            
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== SCROLL PROGRESS INDICATOR =====
// function createScrollProgress() {
//     const progressBar = document.createElement('div');
//     progressBar.className = 'scroll-progress';
//     document.body.appendChild(progressBar);
    
//     window.addEventListener('scroll', () => {
//         const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
//         const scrolled = (window.scrollY / windowHeight) * 100;
//         progressBar.style.width = scrolled + '%';
//     });
// }

createScrollProgress();

// ===== LAZY LOADING IMAGES =====
const images = document.querySelectorAll('img[loading="lazy"]');

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===== READ MORE BUTTON RIPPLE EFFECT =====
const readMoreButtons = document.querySelectorAll('.blog__read-more');

readMoreButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple element
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        // Remove existing ripples
        const existingRipple = this.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
    }
    
    // Arrow keys for quick navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const activeQuickNav = document.querySelector('.quick-nav__item.active');
        if (activeQuickNav) {
            const allItems = Array.from(quickNavItems);
            const currentIndex = allItems.indexOf(activeQuickNav);
            
            let nextIndex;
            if (e.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % allItems.length;
            } else {
                nextIndex = (currentIndex - 1 + allItems.length) % allItems.length;
            }
            
            allItems[nextIndex].click();
            e.preventDefault();
        }
    }
});

// ===== PERFORMANCE OPTIMIZATION: Debounce scroll events =====
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Optimize scroll event listeners
const debouncedScrollHandler = debounce(() => {
    highlightActiveSection();
});

window.addEventListener('scroll', debouncedScrollHandler);

// ===== PREVENT ZOOM ON DOUBLE TAP (Mobile) =====
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ===== PREVENT LAYOUT SHIFT =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial section highlighting
    highlightActiveSection();
});

// ===== SEARCH FUNCTIONALITY (Optional Enhancement) =====
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value.toLowerCase();
        const allCards = document.querySelectorAll('.blog__card');
        
        allCards.forEach(card => {
            const title = card.querySelector('.blog__title').textContent.toLowerCase();
            const excerpt = card.querySelector('.blog__excerpt').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                card.style.display = '';
                card.classList.add('animate');
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show "no results" message if needed
        const visibleCards = document.querySelectorAll('.blog__card[style=""]');
        if (visibleCards.length === 0 && searchTerm !== '') {
            showNoResults();
        } else {
            hideNoResults();
        }
    }, 300));
}

function showNoResults() {
    const existing = document.querySelector('.no-results');
    if (existing) return;
    
    const noResults = document.createElement('div');
    noResults.className = 'empty-state no-results';
    noResults.innerHTML = `
        <i class="fas fa-search"></i>
        <h3>No Results Found</h3>
        <p>Try adjusting your search terms</p>
    `;
    
    document.querySelector('.blogs__grid').appendChild(noResults);
}

function hideNoResults() {
    const noResults = document.querySelector('.no-results');
    if (noResults) {
        noResults.remove();
    }
}

// ===== ANALYTICS TRACKING (Placeholder) =====
function trackEvent(category, action, label) {
    // Add your analytics tracking code here
    console.log('Event tracked:', category, action, label);
    
    // Example for Google Analytics:
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', action, {
    //         'event_category': category,
    //         'event_label': label
    //     });
    // }
}

// Track "Read More" clicks
readMoreButtons.forEach(button => {
    button.addEventListener('click', () => {
        const title = button.closest('.blog__card').querySelector('.blog__title').textContent;
        trackEvent('Blog', 'Read More Click', title);
    });
});

// Track "See More" clicks
seeMoreButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        const action = button.classList.contains('expanded') ? 'Collapse' : 'Expand';
        trackEvent('Category', action, category);
    });
});

// ===== SHARE FUNCTIONALITY (Optional Enhancement) =====
function initShareButtons() {
    const shareButtons = document.querySelectorAll('[data-share]');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const url = button.getAttribute('data-url') || window.location.href;
            const title = button.getAttribute('data-title') || document.title;
            
            if (navigator.share) {
                navigator.share({
                    title: title,
                    url: url
                }).catch(err => console.log('Error sharing:', err));
            } else {
                // Fallback: Copy to clipboard
                copyToClipboard(url);
                showToast('Link copied to clipboard!');
            }
        });
    });
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: var(--text-color);
        color: var(--bg-color);
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: fadeInUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== INITIALIZE OPTIONAL FEATURES =====
initSearch();
initShareButtons();

// ===== CONSOLE MESSAGE =====
console.log('%cCareerOption.Live - Career Roadmap', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cExplore Your Future 🚀', 'font-size: 14px; color: #8b5cf6;');
console.log('%cVersion 2.0.0', 'font-size: 12px; color: #6b7280;');