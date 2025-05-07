/**
 * Jaden's Plane Gallery - Main JavaScript
 * Optimized code for the aviation gallery website
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components in a single call
  initializeComponents();
});

/**
 * Main initialization function that calls all component initializers
 */
function initializeComponents() {
  const components = {
    hero: document.querySelector('.hero-content'),
    gallery: document.querySelectorAll('.gallery-item'),
    video: {
      featured: document.getElementById('featured-video'),
      overlay: document.getElementById('video-overlay'),
      hero: document.querySelector('.hero-video')
    },
    aircraftCards: document.querySelectorAll('.info-btn'),
    contactForm: document.querySelector('.contact-form'),
    aboutPage: document.querySelector('.section-title'),
    navLinks: document.querySelectorAll('nav a')
  };

  // Initialize only components that exist on the page
  if (components.hero) initializeHero(components.hero);
  if (components.gallery.length) initializeGallery(components.gallery);
  if (components.video.featured && components.video.overlay) initializeVideoOverlay(components.video);
  if (components.aircraftCards.length) initializeAircraftCards(components.aircraftCards);
  if (components.contactForm) initializeContactForm(components.contactForm);
  if (components.aboutPage) initializeAboutPage(components.aboutPage);
  if (components.navLinks.length) initializeNavigation(components.navLinks);
  
  // Always initialize lazy loading for performance
  lazyLoadImages();
}

/**
 * Hero Section Animation
 */
function initializeHero(heroContent) {
  // Use requestAnimationFrame for better performance
  requestAnimationFrame(() => {
    heroContent.classList.add('fade-in');
  });
}

/**
 * Gallery Initialization with improved event delegation
 */
function initializeGallery(galleryItems) {
  // Use a single event listener on the parent container for better performance
  const galleryContainer = galleryItems[0].parentElement;
  let activeZoom = null;
  
  galleryContainer.addEventListener('click', function(e) {
    // Find if a gallery item was clicked
    const galleryItem = e.target.closest('.gallery-item');
    if (!galleryItem || activeZoom) return;
    
    e.stopPropagation();
    activeZoom = createZoomView(galleryItem, galleryItems);
  });
  
  // Handle clicks on the document to close zoomed views
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('gallery-overlay') || 
        e.target.classList.contains('zoom-close-btn')) {
      removeZoomView(activeZoom, galleryItems);
      activeZoom = null;
    }
  });
}

/**
 * Create zoomed view of gallery image
 */
function createZoomView(item, allItems) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'gallery-overlay';
  
  // Create zoomed container
  const zoomedContainer = document.createElement('div');
  zoomedContainer.className = 'zoomed-container';
  
  // Clone the image for zooming
  const img = item.querySelector('img').cloneNode(true);
  if (img.dataset.src) img.src = img.dataset.src;
  
  // Add caption if it exists
  const caption = item.querySelector('.image-caption');
  const captionClone = caption ? caption.cloneNode(true) : null;
  if (captionClone) captionClone.style.opacity = '1';
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'zoom-close-btn';
  closeBtn.innerHTML = '&times;';
  
  // Assemble the zoomed view
  zoomedContainer.appendChild(img);
  if (captionClone) zoomedContainer.appendChild(captionClone);
  zoomedContainer.appendChild(closeBtn);
  
  // Append to body
  document.body.appendChild(overlay);
  document.body.appendChild(zoomedContainer);
  document.body.style.overflow = 'hidden';
  
  // Apply blur to all gallery items
  allItems.forEach(item => {
    item.style.filter = 'blur(5px)';
    item.style.opacity = '0.7';
    item.style.pointerEvents = 'none';
  });
  
  return { overlay, zoomedContainer };
}

/**
 * Remove zoomed view
 */
function removeZoomView(zoomElements, galleryItems) {
  if (!zoomElements) return;
  
  const { overlay, zoomedContainer } = zoomElements;
  zoomedContainer.remove();
  overlay.remove();
  document.body.style.overflow = 'auto';
  
  // Restore gallery items
  galleryItems.forEach(item => {
    item.style.pointerEvents = 'auto';
    item.style.filter = 'none';
    item.style.opacity = '1';
  });
}

/**
 * Video Section Interactions
 */
function initializeVideoOverlay(videoElements) {
  const { featured, overlay, hero } = videoElements;
  
  // Event listener for featured video
  const videoEvents = ['play', 'pause', 'ended'];
  videoEvents.forEach(event => {
    featured.addEventListener(event, function() {
      const isPlaying = event === 'play';
      overlay.style.opacity = isPlaying ? '0' : '1';
      overlay.style.pointerEvents = isPlaying ? 'none' : 'auto';
    });
  });
  
  // Handle hero video autoplay with better error handling
  if (hero) {
    hero.play().catch(() => {
      // Add play button for browsers that block autoplay
      const playButton = document.createElement('button');
      playButton.className = 'video-play-btn';
      playButton.innerHTML = '<i class="fas fa-play"></i>';
      playButton.addEventListener('click', () => hero.play());
      hero.parentNode.appendChild(playButton);
    });
  }
}

/**
 * Aircraft Card Interactions using event delegation
 */
function initializeAircraftCards(infoBtns) {
  // Use event delegation for better performance
  document.addEventListener('click', function(e) {
    const infoBtn = e.target.closest('.info-btn');
    if (!infoBtn) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const card = infoBtn.closest('.aircraft-card');
    card.classList.toggle('expanded');
  });
}

/**
 * Contact Form Handling with improved validation
 */
function initializeContactForm(form) {
  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm(this)) {
      showSuccessMessage(this);
      this.reset();
    }
  });
  
  // Input animations with event delegation
  form.addEventListener('focus', function(e) {
    const input = e.target.closest('input, textarea');
    if (!input) return;
    
    const border = input.parentElement.querySelector('.focus-border');
    if (border) border.style.width = '100%';
  }, true);
  
  form.addEventListener('blur', function(e) {
    const input = e.target.closest('input, textarea');
    if (!input) return;
    
    const border = input.parentElement.querySelector('.focus-border');
    if (border) border.style.width = '0';
  }, true);
}

/**
 * Form Validation with optimized selectors
 */
function validateForm(form) {
  const inputs = {
    name: form.querySelector('input[name="name"]'),
    email: form.querySelector('input[name="email"]'),
    message: form.querySelector('textarea[name="message"]')
  };
  
  let isValid = true;
  
  // Reset previous validation styles
  Object.values(inputs).forEach(input => {
    if (input) input.style.borderColor = '';
  });
  
  // Validate name
  if (inputs.name && inputs.name.value.trim() === '') {
    markInvalid(inputs.name);
    isValid = false;
  } else if (inputs.name) {
    markValid(inputs.name);
  }
  
  // Validate email
  if (inputs.email) {
    if (inputs.email.value.trim() === '' || !isValidEmail(inputs.email.value)) {
      markInvalid(inputs.email);
      isValid = false;
    } else {
      markValid(inputs.email);
    }
  }
  
  // Validate message
  if (inputs.message && inputs.message.value.trim() === '') {
    markInvalid(inputs.message);
    isValid = false;
  } else if (inputs.message) {
    markValid(inputs.message);
  }
  
  return isValid;
}

/**
 * Mark form field as invalid
 */
function markInvalid(element) {
  element.style.borderColor = '#ff3860';
  const border = element.parentElement.querySelector('.focus-border');
  if (border) border.style.backgroundColor = '#ff3860';
}

/**
 * Mark form field as valid
 */
function markValid(element) {
  element.style.borderColor = '#00d1b2';
  const border = element.parentElement.querySelector('.focus-border');
  if (border) border.style.backgroundColor = '#00d1b2';
}

/**
 * Email validation using regex
 */
function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Display success message after form submission
 */
function showSuccessMessage(form) {
  // Check if success message already exists and remove it
  const existingMsg = form.parentNode.querySelector('.success-message');
  if (existingMsg) existingMsg.remove();
  
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <p>Message sent successfully!</p>
  `;
  form.parentNode.insertBefore(successDiv, form.nextSibling);
  
  // Use built-in animation instead of setTimeout for better performance
  successDiv.style.animation = 'fadeout 3s forwards';
  successDiv.addEventListener('animationend', () => successDiv.remove());
}

/**
 * Lazy Load Images with Intersection Observer
 */
function lazyLoadImages() {
  // Select all images that should be lazy loaded
  const images = document.querySelectorAll('img[data-src]');
  
  if (images.length === 0) return;
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            
            img.addEventListener('load', () => {
              img.classList.add('loaded');
            }, { once: true });
          }
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
      }
    });
  }
}

/**
 * About Page Initialization with Intersection Observer
 */
function initializeAboutPage(sectionTitle) {
  // Add fade-in class to title
  requestAnimationFrame(() => {
    sectionTitle.classList.add('fade-in');
  });
  
  // Animate content sections when they scroll into view
  const sections = document.querySelectorAll('.about-content, .stats-section, .testimonials, .join-community');
  
  if (sections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px'
    });
    
    sections.forEach(section => observer.observe(section));
  } else {
    // Fallback for browsers without IntersectionObserver
    sections.forEach(section => section.classList.add('fade-in'));
  }
}

/**
 * Navigation enhancement
 */
function initializeNavigation(navLinks) {
  const currentPage = window.location.pathname.split('/').pop();
  
  // Icon mapping
  const iconMap = {
    'home': 'fas fa-home',
    'gallery': 'fas fa-images',
    'aircraft': 'fas fa-plane',
    'about': 'fas fa-info-circle',
    'contact': 'fas fa-envelope'
  };
  
  // Apply icons and active classes
  navLinks.forEach(link => {
    const linkText = link.textContent.trim().toLowerCase();
    const iconClass = iconMap[linkText] || 'fas fa-angle-right';
    
    // Create and prepend icon element
    const icon = document.createElement('i');
    icon.className = iconClass;
    link.innerHTML = '';
    link.appendChild(icon);
    link.appendChild(document.createTextNode(' ' + linkText.charAt(0).toUpperCase() + linkText.slice(1)));
    
    // Set active class
    const href = link.getAttribute('href');
    if ((href === 'index.html' && (currentPage === '' || currentPage === 'index.html')) ||
        (href !== 'index.html' && currentPage.includes(href))) {
      link.classList.add('active');
    }
  });
  
  // Use CSS transitions instead of JavaScript for hover effects
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    nav a:not(.active):hover {
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transform: scale(1.05);
    }
    nav a {
      transition: all 0.3s ease;
    }
  `;
  document.head.appendChild(styleTag);
}
