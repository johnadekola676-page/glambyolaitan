# CLAUDE.md - Glam By Olaitan Project Conventions

This document contains coding standards, conventions, and guidelines for the Glam By Olaitan luxury makeup artistry website.

## Project Overview

**Purpose:** Single-page luxury makeup artist portfolio and booking website
**Target Audience:** Nigerian clients seeking professional makeup services in Lagos
**Platform:** Static site hosted on Cloudflare Pages
**Primary Language:** JavaScript (Vanilla), HTML5, CSS3

---

## Design Philosophy

### Brand Identity
- **Luxury & Elegance:** Every design decision should reflect premium beauty services
- **Nigerian Context:** Language, pricing (₦), and cultural references tailored for Lagos market
- **Visual Consistency:** Rose gold aesthetic throughout all components

### Color Palette (Sacred - Do Not Modify)

**Primary Gradient (Rose Gold):**
```css
linear-gradient(135deg, #E8B4A2 0%, #C08B7A 50%, #A8705E 100%)
```

**Individual Colors:**
- `#E8B4A2` - Light rose gold (primary light)
- `#C08B7A` - Medium rose gold (primary)
- `#A8705E` - Dark rose gold (primary dark)
- `#D4967E` - Accent rose (buttons, highlights)
- `#FDF8F5` - Background cream/beige
- `#4A4039` - Text dark brown (headings)

**Usage Rules:**
- ✅ Always use the full gradient for primary CTAs
- ✅ Use individual colors for borders, text accents
- ❌ Never introduce new colors without approval
- ❌ Never change gradient stop positions

### Typography

**Headings:**
- Font Family: `'Cormorant Garamond', Georgia, serif`
- Weights: 400, 500, 600, 700
- Usage: All headings (h1-h4), section titles, branding
- Character: Elegant, sophisticated, timeless

**Body Text:**
- Font Family: `'Jost', 'Segoe UI', Tahoma, sans-serif`
- Weights: 300, 400, 500, 600, 700
- Usage: Paragraphs, descriptions, UI elements
- Character: Clean, modern, readable

**Decorative:**
- Font Family: `'Great Vibes', cursive`
- Usage: Minimal - special accents only
- Character: Handwritten elegance

**Typography Rules:**
- ✅ Use Cormorant for all headings
- ✅ Use Jost for all body text
- ✅ Maintain font weight hierarchy (700 for h1, 600 for h2, etc.)
- ❌ Never mix serif/sans-serif within the same element
- ❌ Never use system fonts for primary content

---

## Code Style & Conventions

### JavaScript

**Style Guide:**
```javascript
// ✅ GOOD - Strict IIFE pattern for encapsulation
(function () {
    'use strict';

    // Configuration first
    const CONFIG = { /* ... */ };

    // State variables
    let isProcessing = false;

    // Functions with clear section comments
    function functionName() {
        // Implementation
    }

    // Expose to global scope only when needed
    window.functionName = functionName;
})();
```

**Naming Conventions:**
- `camelCase` for functions and variables
- `UPPER_CASE` for constants/config
- Descriptive names: `bookService()` not `book()`
- Boolean prefixes: `isProcessing`, `hasLoaded`

**Functions:**
- Keep functions single-purpose
- Use early returns for error handling
- Add section headers with `// ========` dividers
- Expose only necessary functions to global scope

**Event Handling:**
- Use event delegation where possible
- Always clean up event listeners if dynamic
- Prefer named functions over anonymous callbacks

**WhatsApp Integration (Current Standard):**
```javascript
// ✅ GOOD - Service booking pattern
function bookService(serviceName) {
    const servicePricing = { /* map services to prices */ };
    const price = servicePricing[serviceName] || 'Price varies';

    // Generate date placeholder
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateStr = futureDate.toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Create formatted message
    const message = `Hello! I'm interested in booking...\n\n*Service:* ${serviceName}...`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${CONFIG.businessPhone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}
```

**Rules:**
- ✅ Always use `en-NG` locale for dates
- ✅ Use markdown formatting in WhatsApp messages (`*bold*`)
- ✅ Always encode messages with `encodeURIComponent()`
- ✅ Strip non-numeric characters from phone number
- ❌ Never hardcode phone numbers - use CONFIG
- ❌ Never use synchronous blocking operations

### HTML

**Structure:**
```html
<!-- ✅ GOOD - Semantic sections with IDs -->
<section id="services" class="services section">
    <div class="container">
        <div class="section-header">
            <span class="section-eyebrow">What We Offer</span>
            <h2 class="section-title">Our Services</h2>
            <p class="section-subtitle">Description...</p>
        </div>

        <div class="services-grid">
            <!-- Content -->
        </div>
    </div>
</section>
```

**Conventions:**
- Use semantic HTML5 elements (`<section>`, `<article>`, `<nav>`)
- Every major section needs an `id` for navigation
- Wrap content in `.container` for consistent max-width
- Use BEM-like naming: `.service-card-body`, `.chat-fab-pulse`

**Accessibility:**
- Always include `alt` text on images
- Use `aria-label` on icon-only buttons
- Include `role="dialog"` on modals
- Maintain proper heading hierarchy (h1 → h2 → h3)

**Service Cards Pattern:**
```html
<div class="service-card" id="svc-bridal">
    <div class="service-card-img">
        <img src="images/[filename].jpg" alt="[Descriptive alt text]" loading="lazy">
        <div class="service-card-overlay"></div>
    </div>
    <div class="service-card-body">
        <h3>[Service Name]</h3>
        <p class="service-price">₦[Price]</p>
        <p>[Description]</p>
        <button onclick="bookService('[Service Name]')" class="btn btn-outline-rose">Book Now</button>
    </div>
</div>
```

**Rules:**
- ✅ Use `loading="lazy"` for below-the-fold images
- ✅ Always use Nigerian Naira symbol (₦) for pricing
- ✅ Keep image aspect ratios consistent within grids
- ❌ Never use inline styles - use classes
- ❌ Never use deprecated HTML attributes

### CSS

**Architecture:**
```css
/* ✅ GOOD - Organized sections with comments */

/* =================================================================
   VARIABLES & TOKENS
   ================================================================= */
:root {
    --rose-100: #FDF8F5;
    --rose-400: #D4967E;
    --rose-600: #C08B7A;
    /* ... */
}

/* =================================================================
   BASE STYLES
   ================================================================= */
*, *::before, *::after {
    box-sizing: border-box;
}

/* =================================================================
   COMPONENTS - Service Cards
   ================================================================= */
.service-card {
    /* Styles */
}
```

**Naming Convention (BEM-inspired):**
- Block: `.service-card`
- Element: `.service-card-body`
- Modifier: `.service-card--featured`

**Animation Standards:**
```css
/* ✅ GOOD - Smooth luxury animations */
.btn {
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-title {
    animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Use custom easing for premium feel */
```

**Responsive Design:**
```css
/* ✅ GOOD - Mobile-first approach */
.hero-grid {
    display: flex;
    flex-direction: column;
}

@media (min-width: 768px) {
    .hero-grid {
        flex-direction: row;
        gap: 3rem;
    }
}
```

**Shadow Standards:**
```css
/* Elegant multi-layer shadows for luxury feel */
box-shadow:
    rgba(74, 46, 37, 0.12) 0px 10px 30px 0px,
    rgba(74, 46, 37, 0.06) 0px 4px 8px 0px,
    rgba(192, 139, 122, 0.25) 0px 0px 40px 0px; /* glow effect */
```

**Rules:**
- ✅ Use CSS custom properties (variables) for colors
- ✅ Mobile-first responsive design
- ✅ Use `rem` for font sizes, `px` for borders/shadows
- ✅ Custom cubic-bezier easing for premium animations
- ❌ Never use `!important` except for utility classes
- ❌ Never use fixed pixel widths for containers
- ❌ Avoid excessive animation duration (>1s)

---

## Component Patterns

### Button Styles

**Primary CTA:**
```html
<button class="btn btn-primary btn-lg">Book Now</button>
```
- Background: Rose gold gradient
- Text: White
- Usage: Primary actions (booking, submissions)

**Outline (Ghost):**
```html
<button class="btn btn-outline-rose">Book Now</button>
```
- Background: Transparent
- Border: Rose gold
- Usage: Service cards, secondary actions

**WhatsApp:**
```html
<a href="https://wa.me/[number]" class="btn btn-whatsapp">Chat on WhatsApp</a>
```
- Background: Green gradient (WhatsApp brand color)
- Icon: WhatsApp SVG icon

### FAB (Floating Action Button)

**Current Implementation:**
```html
<button id="chat-fab" class="chat-fab" onclick="toggleChat()" aria-label="Book via WhatsApp">
    <svg><!-- WhatsApp icon --></svg>
    <span class="chat-fab-pulse"></span>
</button>
```

**Styling:**
- Size: 60px × 60px
- Position: Fixed bottom-right (24px margin)
- Background: Rose gold gradient
- Animation: Bounce on hover, pulse ring
- z-index: 9998

**Rules:**
- ✅ Always include pulse animation ring
- ✅ Use WhatsApp icon (not generic chat)
- ✅ Position must be responsive (adjust on mobile)
- ❌ Never remove the FAB - it's a primary booking entry point

### Section Headers

**Standard Pattern:**
```html
<div class="section-header">
    <span class="section-eyebrow">[Category]</span>
    <h2 class="section-title">[Main Heading]</h2>
    <p class="section-subtitle">[Supporting text]</p>
</div>
```

**Usage:**
- Eyebrow: Small caps, rose gold color
- Title: Large Cormorant Garamond serif
- Subtitle: Supporting description in Jost

---

## Business Logic & Data

### Services & Pricing

**Current Services (DO NOT MODIFY without approval):**
```javascript
const services = {
    'Bridal Makeup': '₦35,000 - ₦50,000',
    'Birthday Photoshoot Glam': '₦35,000',
    'Soft Glam Makeup': '₦10,000',
    'Owambe Glam': '₦10,000',
    'Home Service': '+₦15,000 (additional)',
    'Simple/Everyday Makeup': '₦10,000'
};
```

**Rules for Adding New Services:**
1. Add to service cards in HTML (with image)
2. Add pricing to `servicePricing` object in `bookService()`
3. Update portfolio section if applicable
4. Use consistent naming across all references
5. Always use Nigerian Naira (₦) symbol

### Contact Information

**Configuration:**
```javascript
const CONFIG = {
    businessName: 'Glam By Olaitan',
    businessPhone: '+2349069602020', // Always include country code
    businessEmail: 'glam@olaitan.ng',
};
```

**Rules:**
- ✅ Store in CONFIG object
- ✅ Use environment variables for production
- ✅ Always validate phone number format
- ❌ Never hardcode in multiple places

### WhatsApp Message Templates

**Service Booking:**
```
Hello! I'm interested in booking the following service:

*Service:* [Service Name]
*Price:* [Price]
*Preferred Date:* [Date] (please adjust to your preferred date)

Looking forward to your response! 💄✨
```

**General Inquiry:**
```
Hello Glam By Olaitan! 💄✨

I'd like to inquire about your makeup services and book an appointment.

Please let me know your availability. Thank you!
```

**Rules:**
- ✅ Use markdown bold (`*text*`) for labels
- ✅ Include emojis for personality (💄✨)
- ✅ Always provide date placeholder (7 days ahead)
- ✅ Keep messages professional but warm
- ❌ Never send empty or malformed messages

---

## Performance & Optimization

### Image Guidelines

**Format & Sizing:**
- Format: JPG for photos, SVG for icons/logos
- Max width: 1920px for full-width images
- Optimize: Use tools like ImageOptim, TinyPNG
- Loading: `loading="lazy"` for below-the-fold

**File Naming:**
```
images/photo_2026-02-19_09-51-12.jpg  ✅ (current pattern)
images/bridal-makeup-hero.jpg         ✅ (descriptive alternative)
images/IMG_1234.jpg                   ❌ (non-descriptive)
```

### JavaScript Performance

**Loading Strategy:**
```html
<!-- Scripts at end of body (non-blocking) -->
<script src="chat.js"></script>
```

**Best Practices:**
- Use event delegation for dynamic elements
- Debounce scroll/resize handlers
- Use `requestAnimationFrame` for animations
- Minimize DOM manipulations (batch updates)

### CSS Performance

**Critical CSS:**
- Inline critical above-the-fold styles if needed
- Use external stylesheet for main styles
- Minimize specificity (avoid deep nesting)

**Animation Performance:**
```css
/* ✅ GOOD - GPU-accelerated properties */
.element {
    transform: translateY(0);
    opacity: 1;
}

/* ❌ BAD - Triggers layout recalculation */
.element {
    top: 0;
    margin-top: 10px;
}
```

---

## Deployment & Environment

### Cloudflare Pages Setup

**Branch Configuration:**
- Production: `main` branch
- Preview: All other branches

**Environment Variables:**
```bash
# Optional (fallbacks exist in code)
WEBHOOK_URL=[not currently used]
BUSINESS_PHONE=+2349069602020
```

**Build Settings:**
- Build command: None (static site)
- Build output directory: `/`
- Root directory: `/`

### Git Workflow

**Branch Strategy:**
- `main` - Production branch (auto-deploys)
- Feature branches: `feature/service-name`
- Bug fixes: `fix/issue-description`

**Commit Messages:**
```bash
# ✅ GOOD
git commit -m "Add new bridal service package

Includes trial session and touch-up kit pricing.
Updates service cards and WhatsApp booking flow.

Fixes #123"

# ❌ BAD
git commit -m "update stuff"
```

**Format:**
- Subject: Present tense, imperative mood
- Body: What and why (not how)
- Footer: Reference issues (Fixes #N)
- Include: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`

---

## Testing & Quality Assurance

### Manual Testing Checklist

**Before Every Deployment:**
- [ ] All service "Book Now" buttons work
- [ ] WhatsApp URLs open correctly with pre-filled messages
- [ ] FAB button redirects to WhatsApp
- [ ] All navigation links work (smooth scroll)
- [ ] Mobile responsive (test on 375px, 768px, 1024px)
- [ ] Images load correctly
- [ ] No console errors
- [ ] Contact links work (WhatsApp, email)

### Browser Testing

**Required Browsers:**
- Chrome (latest)
- Safari (iOS - primary mobile browser in Nigeria)
- Firefox (latest)
- Edge (latest)

**Mobile Testing:**
- iOS Safari (iPhone)
- Chrome Android
- WhatsApp in-app browser

### Performance Benchmarks

**Target Metrics:**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

---

## Content Guidelines

### Writing Style

**Tone:**
- Professional yet warm
- Confident but not boastful
- Encouraging and reassuring
- Nigerian English conventions

**Example (Good):**
> "Hi, I'm Olaitan! I specialize in creating stunning makeup looks that enhance your natural beauty and boost your confidence."

**Example (Avoid):**
> "I am the best makeup artist. My work is flawless and perfect."

### Service Descriptions

**Formula:**
1. Service type/category
2. Key benefits (2-3 points)
3. What's included
4. Perfect for...

**Example:**
> "Traditional and white wedding perfection. Includes trials, touch-up kit, and expert styling for your big day."

### SEO & Metadata

**Title Format:**
```
[Service/Page] — Glam By Olaitan | Luxury Makeup Artistry Lagos
```

**Description Format:**
```
[Service description]. Professional makeup artist in Lagos, Nigeria. Book your appointment today.
```

**Keywords Focus:**
- Makeup artist Lagos
- Bridal makeup Nigeria
- Professional MUA
- Luxury makeup artistry
- [Service type] Lagos

---

## Troubleshooting & Common Issues

### WhatsApp Links Not Working

**Symptoms:**
- Link opens but no message
- Wrong phone number
- Message not formatted correctly

**Solutions:**
1. Check phone number format (no spaces, include country code)
2. Verify `encodeURIComponent()` usage
3. Test in multiple browsers
4. Check WhatsApp Web vs. App behavior

### Images Not Loading

**Symptoms:**
- Broken image icons
- Slow loading
- Layout shifts

**Solutions:**
1. Verify image paths (relative to index.html)
2. Check file names (case-sensitive)
3. Ensure images are committed to git
4. Add width/height attributes to prevent CLS

### Styling Issues

**Symptoms:**
- Colors don't match design
- Layout breaks on mobile
- Animations jittery

**Solutions:**
1. Check CSS specificity conflicts
2. Verify custom properties (CSS variables)
3. Test on actual mobile devices
4. Use browser DevTools responsive mode

---

## Maintenance & Updates

### Regular Maintenance Tasks

**Monthly:**
- [ ] Review and respond to booking inquiries
- [ ] Update portfolio images
- [ ] Check for broken links
- [ ] Review analytics (if installed)

**Quarterly:**
- [ ] Update service pricing if needed
- [ ] Refresh testimonials
- [ ] Review SEO performance
- [ ] Test all booking flows

**Annually:**
- [ ] Update copyright year in footer
- [ ] Review and refresh homepage copy
- [ ] Audit and optimize images
- [ ] Consider design refresh

### Adding New Services

**Checklist:**
1. Create service card HTML in `index.html`
2. Add high-quality service image to `/images/`
3. Update `servicePricing` in `chat.js`
4. Add portfolio item if applicable
5. Test booking flow
6. Update SEO metadata
7. Commit and deploy

### Updating Contact Information

**Files to Update:**
1. `chat.js` - CONFIG object
2. `index.html` - Contact section links
3. `index.html` - Footer links
4. Environment variables (Cloudflare Pages)

---

## Future Enhancement Ideas

**Potential Features (Not Implemented Yet):**
- [ ] Gallery lightbox for portfolio images
- [ ] Instagram feed integration
- [ ] Blog section for makeup tips
- [ ] Before/After slider component
- [ ] Testimonial carousel/slider
- [ ] Booking calendar widget
- [ ] Multi-language support (Yoruba, Igbo)

**Technical Improvements:**
- [ ] Add structured data (Schema.org)
- [ ] Implement service worker (offline support)
- [ ] Add image lazy loading library
- [ ] Performance monitoring (Web Vitals)
- [ ] A/B testing framework

---

## Contact & Support

**For Development Questions:**
- Review this CLAUDE.md first
- Check existing code patterns
- Test locally before deploying

**Code Review Guidelines:**
- Ensure design consistency
- Verify mobile responsiveness
- Test WhatsApp integration
- Check accessibility
- Validate against this guide

---

## Version History

**v1.0.0** - May 21, 2026
- Initial CLAUDE.md creation
- WhatsApp direct booking implementation
- Removed chat bot complexity
- Established design system documentation

---

**Last Updated:** May 21, 2026
**Maintained By:** Glam By Olaitan Development Team
**Repository:** github.com/johnadekola676-page/glambyolaitan
