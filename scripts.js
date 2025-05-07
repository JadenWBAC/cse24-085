/**
 * Jaden's Plane Gallery - Main JavaScript
 * This file handles all interactive elements of the aviation gallery website
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initializeHero();
  initializeGallery();
  initializeVideoOverlay();
  initializeAircraftCards();
  initializeContactForm();
  lazyLoadImages();
});

/**
 * Hero Section Animation
 * Fades in the hero title and subtitle
 */
function initializeHero() {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    // Slight delay to ensure the effect is noticeable after page load
    setTimeout(() => {
      heroContent.classList.add('fade-in');
    }, 300);
  }
}

/**
 * Gallery Initialization
 * Handles image viewing functionality
 */
function initializeGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  let isZoomed = false; // Track if any image is currently zoomed
  
  if (galleryItems.length > 0) {
    galleryItems.forEach(item => {
      // Improved click effect for gallery items
      item.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        
        // Only allow zooming if no other image is currently zoomed
        if (!isZoomed) {
          isZoomed = true; // Set zoomed state to true
          
          // Create overlay for better viewing experience
          const overlay = document.createElement('div');
          overlay.className = 'gallery-overlay';
          document.body.appendChild(overlay);
          
          // Create zoomed container
          const zoomedContainer = document.createElement('div');
          zoomedContainer.className = 'zoomed-container';
          
          // Clone the image for zooming
          const img = this.querySelector('img').cloneNode(true);
          // Force load high quality version if using data-src
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          
          // Add caption if it exists
          const caption = this.querySelector('.image-caption');
          const captionClone = caption ? caption.cloneNode(true) : null;
          if (captionClone) {
            captionClone.style.opacity = '1';
          }
          
          // Add close button
          const closeBtn = document.createElement('button');
          closeBtn.className = 'zoom-close-btn';
          closeBtn.innerHTML = '&times;';
          
          // Add elements to zoomed container
          zoomedContainer.appendChild(img);
          if (captionClone) zoomedContainer.appendChild(captionClone);
          zoomedContainer.appendChild(closeBtn);
          
          // Append to body
          document.body.appendChild(zoomedContainer);
          document.body.style.overflow = 'hidden';
          
          // Apply blur to all gallery items when in fullscreen mode
          galleryItems.forEach(otherItem => {
            otherItem.style.filter = 'blur(5px)';
            otherItem.style.opacity = '0.7';
            otherItem.style.pointerEvents = 'none';
          });
          
          // Handle close button click
          closeBtn.addEventListener('click', removeZoom);
          overlay.addEventListener('click', removeZoom);
          
          function removeZoom() {
            zoomedContainer.remove();
            overlay.remove();
            document.body.style.overflow = 'auto';
            isZoomed = false; // Reset zoomed state
            
            // Restore interactivity and appearance to gallery items
            galleryItems.forEach(item => {
              item.style.pointerEvents = 'auto';
              item.style.filter = 'none';
              item.style.opacity = '1';
            });
          }
        }
      });
    });
  }
}

/**
 * Video Section Interactions
 * Handles video overlay behavior for featured videos
 */
function initializeVideoOverlay() {
  const featuredVideo = document.getElementById('featured-video');
  const videoOverlay = document.getElementById('video-overlay');
  
  if (featuredVideo && videoOverlay) {
    // Hide overlay when video plays
    featuredVideo.addEventListener('play', function() {
      videoOverlay.style.opacity = '0';
      videoOverlay.style.pointerEvents = 'none';
    });
    
    // Show overlay when video is paused
    featuredVideo.addEventListener('pause', function() {
      videoOverlay.style.opacity = '1';
      videoOverlay.style.pointerEvents = 'auto';
    });
    
    // Show overlay when video ends
    featuredVideo.addEventListener('ended', function() {
      videoOverlay.style.opacity = '1';
      videoOverlay.style.pointerEvents = 'auto';
    });
    
    // Ensure hero video plays automatically
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
      heroVideo.play().catch(error => {
        console.log('Auto-play prevented:', error);
        // Fallback for browsers that block autoplay
        document.addEventListener('click', () => {
          heroVideo.play();
        }, { once: true });
      });
    }
  }
}

/**
 * Aircraft Card Interactions
 * Handles expand/collapse functionality for aircraft info cards
 */
function initializeAircraftCards() {
  const infoBtns = document.querySelectorAll('.info-btn');
  if (infoBtns.length > 0) {
    infoBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default behavior
        e.stopPropagation(); // Prevent event bubbling
        
        const card = e.target.closest('.aircraft-card');
        card.classList.toggle('expanded');
      });
    });
  }
  
  // Ensure nav links don't have hover issues
  const navLinks = document.querySelectorAll('nav a');
  if (navLinks.length > 0) {
    navLinks.forEach(link => {
      // Remove any existing event listeners that might cause issues
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
    });
  }
}

/**
 * Contact Form Handling
 * Manages form submission and validation
 */
function initializeContactForm() {
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validate form and show success message if valid
      if (validateForm()) {
        showSuccessMessage(form);
        form.reset();
      }
    });
    
    // Add input event listeners for real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        const border = this.parentElement.querySelector('.focus-border');
        if (border) border.style.width = '100%';
      });
      
      input.addEventListener('blur', function() {
        const border = this.parentElement.querySelector('.focus-border');
        if (border) border.style.width = '0';
      });
    });
  }
}

/**
 * Form Validation
 * Validates form inputs before submission
 */
function validateForm() {
  const form = document.querySelector('.contact-form');
  
  if (!form) return false;
  
  const nameInput = form.querySelector('input[name="name"]');
  const emailInput = form.querySelector('input[name="email"]');
  const messageInput = form.querySelector('textarea[name="message"]');
  
  let isValid = true;
  
  // Reset previous validation styles
  [nameInput, emailInput, messageInput].forEach(input => {
    if (input) input.style.borderColor = '';
  });
  
  // Validate name (if exists)
  if (nameInput && nameInput.value.trim() === '') {
    markInvalid(nameInput);
    isValid = false;
  } else if (nameInput) {
    markValid(nameInput);
  }
  
  // Validate email (if exists)
  if (emailInput) {
    if (emailInput.value.trim() === '' || !isValidEmail(emailInput.value)) {
      markInvalid(emailInput);
      isValid = false;
    } else {
      markValid(emailInput);
    }
  }
  
  // Validate message (if exists)
  if (messageInput && messageInput.value.trim() === '') {
    markInvalid(messageInput);
    isValid = false;
  } else if (messageInput) {
    markValid(messageInput);
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
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <p>Message sent successfully!</p>
  `;
  form.parentNode.insertBefore(successDiv, form.nextSibling);
  
  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}

/**
 * Lazy Load Images
 * Improves page load performance by loading images only when needed
 */
function lazyLoadImages() {
  // Select all images that should be lazy loaded
  const images = document.querySelectorAll('.gallery-item img, .card-image img');
  
  if (images.length > 0 && 'IntersectionObserver' in window) {
    // Create an intersection observer to detect when images enter the viewport
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // If the image has a data-src attribute, use it as the source
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // Add loaded class for fade-in animation
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
          
          // Stop observing this image
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading images when they're 50px from viewport
      threshold: 0.01 // Trigger when at least 1% of the image is visible
    });
    
    // Start observing each image
    images.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      img.classList.add('loaded');
    });
  }
}

/**
 * Update to the document.addEventListener DOMContentLoaded function
 * to include the new initializeAboutPage function
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initializeHero();
  initializeGallery();
  initializeVideoOverlay();
  initializeAircraftCards();
  initializeContactForm();
  initializeAboutPage(); // Add this line
  lazyLoadImages();
});

/**
 * About Page Initialization
 * Handles fade-in animations for the about page
 */
function initializeAboutPage() {
  // Get the section title element
  const sectionTitle = document.querySelector('.section-title');
  
  // If we're on the about page (section title exists)
  if (sectionTitle) {
    // Add fade-in class after a short delay
    setTimeout(() => {
      sectionTitle.classList.add('fade-in');
    }, 300);
    
    // Animate content sections when they scroll into view
    const animateOnScroll = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target); // Stop observing once animation is triggered
        }
      });
    };
    
    // Create intersection observer
    const observer = new IntersectionObserver(animateOnScroll, {
      root: null,
      threshold: 0.2, // Trigger when 20% of element is visible
      rootMargin: '0px'
    });
    
    // Observe all sections that should animate
    const sections = document.querySelectorAll('.about-content, .stats-section, .testimonials, .join-community');
    sections.forEach(section => {
      observer.observe(section);
    });
  }
}
