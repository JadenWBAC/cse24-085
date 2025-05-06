document.addEventListener('DOMContentLoaded', function() {
  // Gallery hover effect - without blur
  const galleryItems = document.querySelectorAll('.gallery-item');
  let isZoomed = false; // Track if any image is currently zoomed
  
  if (galleryItems.length > 0) {
    galleryItems.forEach(item => {
      // Remove the mouseenter/mouseleave blur effects
      // We'll keep the basic hover scaling from CSS

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

  // Form Validation
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Add validation logic
      if (validateForm()) {
        showSuccessMessage(form);
        form.reset();
      }
    });
  }

  // Aircraft Card Interactions - Fixed to prevent navigation glitch
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
  
  // NEW: Handle featured video overlay
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
  }
  
  // NEW: Handle hero background video
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    // Ensure video plays automatically
    heroVideo.play().catch(error => {
      console.log('Auto-play prevented:', error);
      // Fallback for browsers that block autoplay
      const playPromise = document.addEventListener('click', () => {
        heroVideo.play();
      }, { once: true });
    });
  }
});

function validateForm() {
  // Add validation checks here
  return true;
}

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

// Rest of your existing functions...
function lazyLoadImages() {
  // Select all images that should be lazy loaded (gallery and aircraft images)
  const images = document.querySelectorAll('.gallery-item img, .card-image img');
  
  if (images.length > 0) {
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
  }
}

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

function initializeForm() {
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Add validation logic
      if (validateForm()) {
        showSuccessMessage(form);
        form.reset();
      }
    });
  }
}

function markInvalid(element) {
  element.style.borderColor = '#ff3860';
  element.parentElement.querySelector('.focus-border').style.backgroundColor = '#ff3860';
}

function markValid(element) {
  element.style.borderColor = '#00d1b2';
  element.parentElement.querySelector('.focus-border').style.backgroundColor = '#00d1b2';
}

function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}