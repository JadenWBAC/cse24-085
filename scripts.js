document.addEventListener('DOMContentLoaded', function() {
  // Gallery hover effect
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (galleryItems.length > 0) {
    galleryItems.forEach(item => {
      item.addEventListener('mouseenter', function() {
        // Add blur to all other items
        galleryItems.forEach(otherItem => {
          if (otherItem !== this) {
            otherItem.style.filter = 'blur(5px)';
            otherItem.style.opacity = '0.7';
          }
        });
      });

      item.addEventListener('mouseleave', function() {
        // Remove blur from all items
        galleryItems.forEach(otherItem => {
          otherItem.style.filter = 'none';
          otherItem.style.opacity = '1';
        });
      });

      // Add click effect to gallery items
      item.addEventListener('click', function() {
        this.classList.toggle('zoomed');
        if (this.classList.contains('zoomed')) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'auto';
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

  // Aircraft Card Interactions
  const infoBtns = document.querySelectorAll('.info-btn');
  if (infoBtns.length > 0) {
    infoBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.aircraft-card');
        card.classList.toggle('expanded');
      });
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