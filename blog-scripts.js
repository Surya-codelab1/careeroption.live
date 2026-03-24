// ===== REUSABLE UTILITIES =====
const BlogUtils = {
    // Debounce function
    debounce(func, wait = 10, immediate = true) {
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
    },

    // Copy to clipboard
    async copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                return this.fallbackCopyToClipboard(text);
            }
        } else {
            return this.fallbackCopyToClipboard(text);
        }
    },

    // Fallback copy to clipboard
    fallbackCopyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        } catch (err) {
            document.body.removeChild(textarea);
            return false;
        }
    },

    // Show toast notification
    showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, duration);
        }
    },

    // Track events (placeholder for analytics)
    trackEvent(category, action, label) {
        console.log('Event tracked:', category, action, label);
        
        // Example for Google Analytics:
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', action, {
        //         'event_category': category,
        //         'event_label': label
        //     });
        // }
    }
};

// ===== THEME MANAGER =====
const ThemeManager = {
    init() {
        this.themeToggle = document.getElementById('themeToggle');
        this.htmlElement = document.documentElement;
        this.currentTheme = this.getStoredTheme();
        
        this.applyTheme(this.currentTheme);
        this.attachEventListeners();
    },

    getStoredTheme() {
        try {
            const stored = localStorage.getItem('theme');
            if (stored) {
                return stored;
            }
        } catch (e) {
            console.log('localStorage not available');
        }
        // Check system preference if no stored theme
        return this.getSystemPreference();
    },

    getSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    },

    applyTheme(theme) {
        this.htmlElement.setAttribute('data-theme', theme);
        this.updateThemeIcon(theme);
        this.updateThemeColors(theme);
        this.currentTheme = theme;
        
        // Store theme preference
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.log('Cannot save theme preference');
        }
    },

    updateThemeIcon(theme) {
        if (!this.themeToggle) return;
        
        const icon = this.themeToggle.querySelector('i');
        if (!icon) return;
        
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            this.themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            this.themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    },

    updateThemeColors(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.style.setProperty('--bg-color', '#0f172a');
            root.style.setProperty('--bg-secondary', '#1e293b');
            root.style.setProperty('--text-color', '#f8fafc');
            root.style.setProperty('--text-light', '#cbd5e1');
            root.style.setProperty('--border-color', '#334155');
        } else {
            root.style.removeProperty('--bg-color');
            root.style.removeProperty('--bg-secondary');
            root.style.removeProperty('--text-color');
            root.style.removeProperty('--text-light');
            root.style.removeProperty('--border-color');
        }
    },

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        
        this.htmlElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        this.applyTheme(newTheme);
        
        setTimeout(() => {
            this.htmlElement.style.transition = '';
        }, 300);
    },

    attachEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system preference changes (only if no stored preference)
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            darkModeQuery.addEventListener('change', (e) => {
                try {
                    if (!localStorage.getItem('theme')) {
                        this.applyTheme(e.matches ? 'dark' : 'light');
                    }
                } catch (err) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
};

// ===== HEADER MANAGER =====
const HeaderManager = {
    init() {
        this.header = document.getElementById('header');
        this.breadcrumb = document.querySelector('.breadcrumb');
        
        window.addEventListener('scroll', BlogUtils.debounce(() => this.handleScroll(), 10));
    },

    handleScroll() {
        if (window.scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        if (this.breadcrumb && window.scrollY > 200) {
            this.breadcrumb.classList.add('scrolled');
        } else if (this.breadcrumb) {
            this.breadcrumb.classList.remove('scrolled');
        }
    }
};

// ===== NAVIGATION MANAGER =====
const NavigationManager = {
    init() {
        this.navToggle = document.getElementById('navToggle');
        this.navClose = document.getElementById('navClose');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav__link');
        
        this.attachEventListeners();
    },

    attachEventListeners() {
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.openMenu());
        }

        if (this.navClose) {
            this.navClose.addEventListener('click', () => this.closeMenu());
        }

        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('show')) {
                this.closeMenu();
            }
        });
    },

    openMenu() {
        this.navMenu.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent body scroll when menu is open
    },

    closeMenu() {
        this.navMenu.classList.remove('show');
        document.body.style.overflow = ''; // Restore body scroll
    },

    handleOutsideClick(e) {
        if (this.navMenu && this.navToggle && 
            !this.navMenu.contains(e.target) && 
            !this.navToggle.contains(e.target)) {
            this.closeMenu();
        }
    }
};

// ===== SOCIAL SHARE MANAGER =====
const SocialShareManager = {
    init() {
        this.shareIcons = document.querySelectorAll('.share-icon');
        this.currentURL = window.location.href;
        this.articleTitle = document.querySelector('.article__title')?.textContent || 'Check this out';
        
        this.attachEventListeners();
    },

    attachEventListeners() {
        this.shareIcons.forEach(button => {
            button.addEventListener('click', () => this.handleShare(button));
        });
    },

    handleShare(button) {
        const platform = button.getAttribute('data-platform');
        const isCopy = button.getAttribute('data-copy') || button.id === 'copyLinkBtn';

        if (isCopy) {
            this.copyLink(button);
        } else {
            this.shareToSocial(platform);
        }

        BlogUtils.trackEvent('Article', 'Share', platform || 'copy');
    },

    async copyLink(button) {
        const success = await BlogUtils.copyToClipboard(this.currentURL);
        
        if (success) {
            BlogUtils.showToast('Link copied to clipboard!');
            this.showCopySuccess(button);
        }
    },

    showCopySuccess(button) {
        const icon = button.querySelector('i');
        const originalClass = icon.className;
        icon.className = 'fas fa-check';
        button.classList.add('copied');
        
        setTimeout(() => {
            icon.className = originalClass;
            button.classList.remove('copied');
        }, 2000);
    },

    shareToSocial(platform) {
        const encodedURL = encodeURIComponent(this.currentURL);
        const encodedTitle = encodeURIComponent(this.articleTitle);
        
        const shareURLs = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodedURL}&text=${encodedTitle}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`,
            whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedURL}`
        };

        const shareURL = shareURLs[platform];
        if (shareURL) {
            window.open(shareURL, '_blank', 'width=600,height=400');
        }
    }
};

// ===== TABLE OF CONTENTS MANAGER =====
const TOCManager = {
    init() {
        this.tocList = document.querySelector('.toc__list');
        this.headings = document.querySelectorAll('.article__body h2, .article__body h3');
        this.tocLinks = [];
        
        this.generateTOC();
        this.attachEventListeners();
        this.highlightActive();
    },

    generateTOC() {
        if (!this.tocList || this.headings.length === 0) return;
        
        this.tocList.innerHTML = '';
        
        this.headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = `heading-${index}`;
            }
            
            const li = document.createElement('li');
            li.className = 'toc__item';
            if (heading.tagName === 'H3') {
                li.style.paddingLeft = '1rem';
            }
            
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.className = 'toc__link';
            link.innerHTML = `
                <i class="fas fa-chevron-right"></i>
                <span>${heading.textContent}</span>
            `;
            
            li.appendChild(link);
            this.tocList.appendChild(li);
        });
        
        this.tocLinks = document.querySelectorAll('.toc__link');
    },

    attachEventListeners() {
        window.addEventListener('scroll', BlogUtils.debounce(() => this.highlightActive(), 10));
        
        this.tocLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleTOCClick(e, link));
        });
    },

    highlightActive() {
        let current = '';
        const scrollPosition = window.scrollY + 200;
        
        this.headings.forEach(heading => {
            const sectionTop = heading.offsetTop;
            if (scrollPosition >= sectionTop) {
                current = heading.getAttribute('id');
            }
        });
        
        this.tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    },

    handleTOCClick(e, link) {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const header = document.getElementById('header');
            const breadcrumb = document.querySelector('.breadcrumb');
            const headerHeight = header?.offsetHeight || 0;
            const breadcrumbHeight = breadcrumb?.offsetHeight || 0;
            const offset = headerHeight + breadcrumbHeight + 20;
            
            const targetPosition = targetElement.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }

        BlogUtils.trackEvent('Article', 'TOC Click', link.textContent);
    }
};

// ===== BACK TO TOP MANAGER =====
const BackToTopManager = {
    init() {
        this.button = document.getElementById('backToTop');
        
        if (!this.button) return;
        
        window.addEventListener('scroll', () => this.handleScroll());
        this.button.addEventListener('click', () => this.scrollToTop());
    },

    handleScroll() {
        if (window.scrollY > 500) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    },

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

// ===== READING PROGRESS MANAGER =====
const ReadingProgressManager = {
    init() {
        this.createProgressBar();
        window.addEventListener('scroll', () => this.updateProgress());
        
        // Update progress bar position when nav menu opens/closes
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            const observer = new MutationObserver(() => {
                this.updateProgressBarZIndex();
            });
            observer.observe(navMenu, { attributes: true, attributeFilter: ['class'] });
        }
    },

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: var(--header-height);
            left: 0;
            width: 0%;
            height: 4px;
            background: var(--gradient-primary);
            z-index: 999;
            transition: width 0.1s ease, z-index 0s;
        `;
        document.body.appendChild(progressBar);
        this.progressBar = progressBar;
    },

    updateProgressBarZIndex() {
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('show')) {
            // Lower z-index when menu is open
            this.progressBar.style.zIndex = '998';
        } else {
            // Restore z-index when menu is closed
            this.progressBar.style.zIndex = '999';
        }
    },

    updateProgress() {
        const article = document.querySelector('.article__body');
        if (!article) return;
        
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrolled = window.scrollY;
        
        const start = articleTop - windowHeight / 2;
        const end = articleTop + articleHeight - windowHeight / 2;
        const progress = Math.min(Math.max((scrolled - start) / (end - start), 0), 1);
        
        this.progressBar.style.width = (progress * 100) + '%';
    }
};

// ===== IMAGE LAZY LOADING MANAGER =====
const ImageLazyLoadManager = {
    init() {
        const images = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }
};

// ===== RELATED ARTICLES MANAGER =====
const RelatedArticlesManager = {
    init() {
        this.attachClickHandlers();
    },

    attachClickHandlers() {
        document.querySelectorAll('.related-article, .related-article-card').forEach(article => {
            article.addEventListener('click', (e) => {
                // Don't trigger if clicking a link directly
                if (e.target.tagName === 'A') return;
                
                const link = article.querySelector('a');
                if (link) {
                    const title = article.querySelector('.related-article__title, .related-article-card__title')?.textContent;
                    BlogUtils.trackEvent('Article', 'Related Article Click', title);
                    window.location.href = link.href;
                }
            });
        });
    }
};

// ===== READING TIME CALCULATOR =====
const ReadingTimeCalculator = {
    init() {
        this.calculateReadingTime();
    },

    calculateReadingTime() {
        const articleBody = document.querySelector('.article__body');
        if (!articleBody) return;
        
        const text = articleBody.textContent;
        const wordCount = text.trim().split(/\s+/).length;
        const readingSpeed = 200; // words per minute
        const minutes = Math.ceil(wordCount / readingSpeed);
        
        const readTimeElement = document.querySelector('.article__read-time');
        if (readTimeElement) {
            readTimeElement.innerHTML = `<i class="far fa-clock"></i> ${minutes} min read`;
        }
    }
};

// ===== FOOTER LOADER =====
const FooterLoader = {
    async init() {
        try {
            const response = await fetch('footer.html');
            if (response.ok) {
                const footerHTML = await response.text();
                document.getElementById('footer-placeholder').innerHTML = footerHTML;
            } else {
                this.createInlineFooter();
            }
        } catch (error) {
            console.error('Error loading footer:', error);
            this.createInlineFooter();
        }
    },

    createInlineFooter() {
        const footerHTML = `
            <footer class="footer">
                <div class="footer__container container">
                    <div class="footer__content">
                        <div class="footer__column">
                            <h3 class="footer__title">About CareerOption.Live</h3>
                            <p class="footer__text">
                                Empowering students and professionals to discover their perfect career path through expert guidance, comprehensive roadmaps, and actionable insights.
                            </p>
                            
                         </div>
                        <div class="footer__column">
                            <h3 class="footer__title">Quick Links</h3>
                            <ul class="footer__links">
                                <li><a href="/">Home</a></li>
                                <li><a href="/career-roadmap.html">Career Roadmap</a></li>
                                <li><a href="/about.html">About</a></li>
                                <li><a href="/contact.html">Contact Us</a></li>
                            </ul>
                        </div>
                        <div class="footer__column">
                            <h3 class="footer__title">Legal</h3>
                            <ul class="footer__links">
                                <li><a href="/legal/privacy-policy.html">Privacy Policy</a></li>
                                <li><a href="/legal/terms-of-service.html">Terms of Service</a></li>
                                <li><a href="/legal/disclaimer.html">Disclaimer</a></li>
                                <li><a href="/legal/cookie-policy.html">Cookie Policy</a></li>
                                <li><a href="/sitemap.xml">Sitemap</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer__bottom">
                        <p class="footer__tagline">Designed with <i class="fas fa-heart"></i> for Students and Dreamers</p>
                        <p class="footer__copyright">&copy; 2025 CareerOption.Live. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `;
        document.getElementById('footer-placeholder').innerHTML = footerHTML;
    }
};

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
const SmoothScrollManager = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e, anchor));
        });
    },

    handleClick(e, anchor) {
        const href = anchor.getAttribute('href');
        
        if (href === '#') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            
            const header = document.getElementById('header');
            const breadcrumb = document.querySelector('.breadcrumb');
            const headerHeight = header?.offsetHeight || 0;
            const breadcrumbHeight = breadcrumb?.offsetHeight || 0;
            const offset = headerHeight + breadcrumbHeight + 20;
            
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
};

// ===== EXTERNAL LINKS SECURITY =====
const ExternalLinksManager = {
    init() {
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (!link.href.includes(window.location.hostname)) {
                link.setAttribute('rel', 'noopener noreferrer');
                link.setAttribute('target', '_blank');
            }
        });
    }
};

// ===== PREFETCH MANAGER =====
const PrefetchManager = {
    init() {
        setTimeout(() => this.prefetchRelatedArticles(), 3000);
    },

    prefetchRelatedArticles() {
        const relatedLinks = document.querySelectorAll('.related-article a, .related-article-card a');
        relatedLinks.forEach(link => {
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = link.href;
            document.head.appendChild(prefetchLink);
        });
    }
};

// ===== ACTIVE NAVIGATION MARKER =====
const ActiveNavManager = {
    init() {
        const currentPath = window.location.pathname;

        // Remove all hardcoded active classes first
        document.querySelectorAll('.nav__link').forEach(link => {
            link.classList.remove('active');
        });

        const navRules = [
            {
                href: '/',
                activePaths: ['/', '/index.html', '/home-articles/'],
                excludePaths: ['/articles/', '/career-roadmap', '/about', '/contact'] // ✅ exclude these
            },
            {
                href: '/career-roadmap.html',
                activePaths: ['/career-roadmap.html', '/articles/'],
                excludePaths: []
            },
            {
                href: '/about.html',
                activePaths: ['/about.html'],
                excludePaths: []
            },
            {
                href: '/contact.html',
                activePaths: ['/contact.html'],
                excludePaths: []
            }
        ];

        navRules.forEach(rule => {
            const link = document.querySelector(`.nav__link[href="${rule.href}"]`);
            if (!link) return;

            // Check if path should be excluded first
            const isExcluded = rule.excludePaths.some(path => 
                currentPath.startsWith(path)
            );

            if (isExcluded) return; // ✅ skip if excluded

            const isActive = rule.activePaths.some(path => {
                if (path.endsWith('/') && path.length > 1) {
                    return currentPath.startsWith(path);
                }
                return currentPath === path || 
                       currentPath === path.replace('.html', '');
            });

            if (isActive) {
                link.classList.add('active');
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ActiveNavManager.init();
});

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    ActiveNavManager.init();
});

// ===== PREVENT DOUBLE TAP ZOOM (Mobile) =====
const MobileZoomPreventer = {
    init() {
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
};

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    ThemeManager.init();
    HeaderManager.init();
    NavigationManager.init();
    SocialShareManager.init();
    TOCManager.init();
    BackToTopManager.init();
    ReadingProgressManager.init();
    ImageLazyLoadManager.init();
    RelatedArticlesManager.init();
    ReadingTimeCalculator.init();
    FooterLoader.init();
    SmoothScrollManager.init();
    ExternalLinksManager.init();
    PrefetchManager.init();
    ActiveNavManager.init();
    MobileZoomPreventer.init();
});

// ===== PAGE LOAD PERFORMANCE =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial TOC highlighting
    TOCManager.highlightActive();
    
    // Log page load time
    const loadTime = performance.now();
    console.log(`%cCareerOption.Live - Blog Article`, 'font-size: 20px; font-weight: bold; color: #6366f1;');
    console.log(`%cPage loaded in ${Math.round(loadTime)}ms`, 'font-size: 12px; color: #6b7280;');
    console.log(`%cVersion 3.1.0 - Fixed Theme Storage & Progress Bar`, 'font-size: 12px; color: #8b5cf6;');
});