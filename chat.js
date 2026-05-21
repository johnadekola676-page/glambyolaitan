// ============================================================================
// GLAM BY OLAITAN — Chat & Interactive Features
// Webhook URL is read from environment config (Cloudflare Pages compatible)
// ============================================================================

(function () {
    'use strict';

    // ========================================================================
    // CONFIGURATION
    // Read from window.__ENV__ (injected by Cloudflare Pages Functions or
    // build scripts), with sensible fallbacks.
    // ========================================================================
    const ENV = window.__ENV__ || {};

    const CONFIG = {
        webhookUrl: ENV.WEBHOOK_URL || 'https://ola212.app.n8n.cloud/webhook/glam-website',
        businessName: ENV.BUSINESS_NAME || 'Glam By Olaitan',
        businessPhone: ENV.BUSINESS_PHONE || '+2349069602020',
        businessEmail: ENV.BUSINESS_EMAIL || 'glam@olaitan.ng',
        businessSlug: ENV.BUSINESS_SLUG || 'glam9069',
    };

    // ========================================================================
    // STATE
    // ========================================================================
    let chatOpen = false;
    let isProcessing = false;
    const messageHistory = [];

    // ========================================================================
    // CHAT CONTROLS - NOW REDIRECTS TO WHATSAPP
    // ========================================================================
    function toggleChat() {
        openChat();
    }

    function openChat() {
        // Create general booking WhatsApp message
        const message = `Hello Glam By Olaitan! 💄✨\n\n` +
                       `I'd like to inquire about your makeup services and book an appointment.\n\n` +
                       `Please let me know your availability. Thank you!`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${CONFIG.businessPhone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    function closeChat() {
        // Not needed anymore since we're redirecting to WhatsApp
        // Kept for backward compatibility
    }

    // ========================================================================
    // MESSAGE HANDLING
    // ========================================================================
    function handleKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }

    async function sendMessage() {
        if (isProcessing) return;

        const input = document.getElementById('chat-input');
        if (!input) return;
        const message = input.value.trim();
        if (!message) return;

        // Check if webhook is configured
        if (!CONFIG.webhookUrl || CONFIG.webhookUrl === 'PASTE_YOUR_WEBHOOK_URL_HERE') {
            addMessage(
                '⚠️ Chat is not yet configured. Please contact us via WhatsApp at ' + CONFIG.businessPhone,
                'bot'
            );
            return;
        }

        isProcessing = true;
        addMessage(message, 'user');
        input.value = '';
        input.disabled = true;
        showTyping();

        try {
            const response = await fetch(CONFIG.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    name: getStored('userName'),
                    phone: getStored('userPhone'),
                    email: getStored('userEmail'),
                    platform: 'website',
                    timestamp: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('HTTP ' + response.status + ': ' + response.statusText);
            }

            const text = await response.text();
            removeTyping();

            // Try to parse as JSON, handle various response formats
            let reply = '';
            try {
                const data = JSON.parse(text);

                // Handle various n8n response formats
                if (typeof data === 'string') {
                    reply = data;
                } else if (Array.isArray(data) && data.length > 0) {
                    // n8n sometimes returns arrays
                    const first = data[0];
                    reply = first.message || first.output || first.text || first.response || JSON.stringify(first);
                } else if (data && typeof data === 'object') {
                    reply = data.message || data.output || data.text || data.response || '';

                    if (data.bookingReference) {
                        localStorage.setItem('lastBookingReference', data.bookingReference);
                    }
                    if (data.intent === 'booking' && !getStored('userName')) {
                        promptUserDetails();
                    }
                }
            } catch {
                // Not JSON — treat as plain text
                reply = text;
            }

            if (reply && reply.trim()) {
                addMessage(reply, 'bot');
            } else {
                // Empty response — provide helpful fallback
                addMessage(
                    'Thanks for your message! Our booking system is processing your request. ' +
                    'For immediate assistance, please WhatsApp us at ' + CONFIG.businessPhone + ' 💬',
                    'bot'
                );
            }
        } catch (err) {
            console.error('Chat error:', err);
            removeTyping();

            if (err.message.includes('Failed to fetch')) {
                addMessage('❌ Connection error. Please check your internet and try again.', 'bot');
            } else if (err.message.includes('404')) {
                addMessage(
                    '❌ Service unavailable. Please contact us via WhatsApp: ' + CONFIG.businessPhone,
                    'bot'
                );
            } else {
                addMessage('❌ Something went wrong. Please try again or contact us directly.', 'bot');
            }
        } finally {
            isProcessing = false;
            input.disabled = false;
            input.focus();
        }
    }

    // ========================================================================
    // MESSAGE RENDERING
    // ========================================================================
    function addMessage(text, sender) {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message ' + sender;

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = formatText(text);

        msgDiv.appendChild(bubble);
        container.appendChild(msgDiv);

        container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
        });

        messageHistory.push({
            text,
            sender,
            timestamp: new Date().toISOString(),
        });
    }

    function formatText(text) {
        // Bold **text**
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // Line breaks
        text = text.replace(/\n/g, '<br>');
        // Bullet points
        text = text.replace(/^- (.+)$/gm, '<li>$1</li>');
        if (text.includes('<li>')) {
            text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        }
        return text;
    }

    function showTyping() {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        const div = document.createElement('div');
        div.className = 'chat-message bot';
        div.id = 'typing-indicator';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = '<p style="display:flex;gap:4px;align-items:center">' +
            '<span class="typing-dot" style="animation-delay:0s"></span>' +
            '<span class="typing-dot" style="animation-delay:0.15s"></span>' +
            '<span class="typing-dot" style="animation-delay:0.3s"></span></p>';

        div.appendChild(bubble);
        container.appendChild(div);
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });

        // Add typing dot styles dynamically (once)
        if (!document.getElementById('typing-styles')) {
            const style = document.createElement('style');
            style.id = 'typing-styles';
            style.textContent = `
                .typing-dot {
                    width: 7px; height: 7px;
                    border-radius: 50%;
                    background: var(--rose-400, #D4967E);
                    display: inline-block;
                    animation: typeBounce 1s infinite;
                }
                @keyframes typeBounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-6px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    function removeTyping() {
        const el = document.getElementById('typing-indicator');
        if (el) el.remove();
    }

    // ========================================================================
    // LOCAL STORAGE HELPERS
    // ========================================================================
    function getStored(key) {
        try {
            return localStorage.getItem(key) || null;
        } catch {
            return null;
        }
    }

    function setStored(key, value) {
        try {
            if (value) localStorage.setItem(key, value);
        } catch { /* ignore */ }
    }

    function promptUserDetails() {
        const name = prompt('May I know your name?');
        const phone = prompt('Your phone number? (for booking confirmation)');
        const email = prompt('Your email? (optional)');
        setStored('userName', name);
        setStored('userPhone', phone);
        setStored('userEmail', email);
    }

    // ========================================================================
    // SERVICE BOOKING - WHATSAPP DIRECT
    // ========================================================================
    function bookService(serviceName) {
        // Service pricing mapping
        const servicePricing = {
            'Bridal Makeup': '₦35,000 - ₦50,000',
            'Birthday Photoshoot Glam': '₦35,000',
            'Soft Glam Makeup': '₦10,000',
            'Owambe Glam': '₦10,000',
            'Home Service': '+₦15,000 (additional)',
            'Simple/Everyday Makeup': '₦10,000'
        };

        // Get price or default message
        const price = servicePricing[serviceName] || 'Price varies';

        // Generate placeholder date (7 days from now)
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        const dateStr = futureDate.toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Create WhatsApp message
        const message = `Hello! I'm interested in booking the following service:\n\n` +
                       `*Service:* ${serviceName}\n` +
                       `*Price:* ${price}\n` +
                       `*Preferred Date:* ${dateStr} (please adjust to your preferred date)\n\n` +
                       `Looking forward to your response! 💄✨`;

        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);

        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/${CONFIG.businessPhone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    // ========================================================================
    // NAVIGATION
    // ========================================================================
    function initNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navbar = document.getElementById('navbar');

        // Hamburger toggle
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('open');
            });

            // Close on link click
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('open');
                });
            });
        }

        // Scroll effects
        let lastScroll = 0;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const y = window.scrollY;

                    // Background change
                    if (navbar) {
                        navbar.classList.toggle('scrolled', y > 60);

                        // Hide/show on scroll
                        if (y > 300 && y > lastScroll) {
                            navbar.classList.add('hide-nav');
                        } else {
                            navbar.classList.remove('hide-nav');
                        }
                    }

                    // Active nav link
                    updateActiveLink();

                    lastScroll = y;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const links = document.querySelectorAll('.nav-link');

        let currentId = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (window.scrollY >= top) {
                currentId = sec.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });
    }

    // ========================================================================
    // SMOOTH SCROLL
    // ========================================================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offset = document.querySelector('.navbar')?.offsetHeight || 72;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }

    // ========================================================================
    // SCROLL REVEAL
    // ========================================================================
    function initReveal() {
        // Add reveal class to elements
        const targets = document.querySelectorAll(
            '.service-card, .portfolio-item, .testimonial-card, ' +
            '.contact-card, .about-grid, .section-header, .cta-card'
        );
        targets.forEach(el => el.classList.add('reveal'));

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // ========================================================================
    // STAT COUNTER ANIMATION
    // ========================================================================
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        if (!counters.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(el => observer.observe(el));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.count, 10);
        const duration = 1800;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            el.textContent = Math.floor(eased * target);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(step);
    }

    // ========================================================================
    // PAGE LOADER
    // ========================================================================
    function initLoader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loader = document.getElementById('page-loader');
                if (loader) loader.classList.add('hidden');
            }, 1400);
        });
    }

    // ========================================================================
    // RETURNING USER WELCOME
    // ========================================================================
    function initReturningUser() {
        const lastRef = getStored('lastBookingReference');
        const userName = getStored('userName');

        if (lastRef && userName) {
            const welcome = document.querySelector('.chat-message.bot .message-bubble');
            if (welcome) {
                welcome.innerHTML =
                    '<p>Welcome back, <strong>' + userName + '</strong>! 💄</p>' +
                    '<p>Last booking: <strong>' + lastRef + '</strong></p>' +
                    '<p>How can I help you today?</p>';
            }
        }
    }

    // ========================================================================
    // INIT
    // ========================================================================
    document.addEventListener('DOMContentLoaded', () => {
        initLoader();
        initNavigation();
        initSmoothScroll();
        initReveal();
        initCounters();
        initReturningUser();
    });

    // ========================================================================
    // GLOBAL ERROR HANDLING
    // ========================================================================
    window.addEventListener('error', (e) => console.error('Global error:', e.error));
    window.addEventListener('unhandledrejection', (e) => console.error('Promise rejection:', e.reason));

    // ========================================================================
    // EXPOSE TO GLOBAL SCOPE (needed for onclick handlers in HTML)
    // ========================================================================
    window.toggleChat = toggleChat;
    window.openChat = openChat;
    window.closeChat = closeChat;
    window.sendMessage = sendMessage;
    window.handleKeyPress = handleKeyPress;
    window.bookService = bookService;

})();
