document.addEventListener('DOMContentLoaded', function() {
  // Gallery hover effect
  const galleryItems = document.querySelectorAll('.gallery-item');
  let isZoomed = false; // Track if any image is currently zoomed
  
  if (galleryItems.length > 0) {
    galleryItems.forEach(item => {
      item.addEventListener('mouseenter', function() {
        // Only apply hover effects if no image is zoomed
        if (!isZoomed) {
          // Add blur to all other items
          galleryItems.forEach(otherItem => {
            if (otherItem !== this) {
              otherItem.style.filter = 'blur(5px)';
              otherItem.style.opacity = '0.7';
            }
          });
        }
      });

      item.addEventListener('mouseleave', function() {
        // Only remove effects if no image is zoomed
        if (!isZoomed) {
          // Remove blur from all items
          galleryItems.forEach(otherItem => {
            otherItem.style.filter = 'none';
            otherItem.style.opacity = '1';
          });
        }
      });

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
          
          // Make all gallery items non-interactive while zoomed
          galleryItems.forEach(item => {
            item.style.pointerEvents = 'none';
          });
          
          // Handle close button click
          closeBtn.addEventListener('click', removeZoom);
          overlay.addEventListener('click', removeZoom);
          
          function removeZoom() {
            zoomedContainer.remove();
            overlay.remove();
            document.body.style.overflow = 'auto';
            isZoomed = false; // Reset zoomed state
            
            // Restore interactivity to gallery items
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