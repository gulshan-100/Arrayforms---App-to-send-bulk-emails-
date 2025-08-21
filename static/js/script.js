// Modern UI functionality for ArrayForms
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  const toggleBtn = document.getElementById('toggle-sidebar');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  
  const emailTextarea = document.getElementById('emails');
  const emailCountDisplay = document.getElementById('email_count');
  const form = document.getElementById('emailForm');
  const sendButton = document.getElementById('sendButton');
  const passwordToggle = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('sender_password');
  
  // Sidebar toggle functionality
  if (toggleBtn && sidebar && mainContent) {
    toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      const isCollapsed = sidebar.classList.contains('collapsed');
      toggleBtn.innerHTML = isCollapsed ? 
        '<i class="bi bi-chevron-right"></i>' : 
        '<i class="bi bi-chevron-left"></i>';
      
      // Ensure main content width adjusts properly
      if (isCollapsed) {
        mainContent.style.marginLeft = 'var(--sidebar-collapsed)';
        mainContent.style.maxWidth = 'calc(100% - var(--sidebar-collapsed))';
      } else {
        mainContent.style.marginLeft = 'var(--sidebar-width)';
        mainContent.style.maxWidth = 'calc(100% - var(--sidebar-width))';
      }
      
      // Store preference
      localStorage.setItem('sidebar-collapsed', isCollapsed ? 'true' : 'false');
    });
    
    // Check saved preference
    const savedCollapseState = localStorage.getItem('sidebar-collapsed');
    if (savedCollapseState === 'true') {
      sidebar.classList.add('collapsed');
      toggleBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
      mainContent.style.marginLeft = 'var(--sidebar-collapsed)';
      mainContent.style.maxWidth = 'calc(100% - var(--sidebar-collapsed))';
    }
  }
  
  // Mobile menu
  if (mobileMenuToggle && sidebar) {
    const mobileOverlay = document.getElementById('mobile-overlay');
    
    mobileMenuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('mobile-open');
      
      // If the sidebar is now open, make sure it's not collapsed
      if (sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('collapsed');
        if (toggleBtn) {
          toggleBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
        }
      }
    });
    
    // Close sidebar when clicking on the overlay
    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', function() {
        if (sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
        }
      });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
      // Only on mobile view
      if (window.innerWidth <= 768) {
        // Check if the click was outside the sidebar and the toggle button
        if (!sidebar.contains(e.target) && e.target !== mobileMenuToggle && 
            !mobileMenuToggle.contains(e.target) && sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
        }
      }
    });
  }
  
  // Handle window resize for responsive behavior
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      // On larger screens, remove mobile open class
      sidebar.classList.remove('mobile-open');
    }
  });
  
  // Tab functionality
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const nextTabButtons = document.querySelectorAll('.next-tab');
  const prevTabButtons = document.querySelectorAll('.prev-tab');
  
  function switchToTab(tabId) {
    // Hide all tabs
    tabContents.forEach(content => {
      content.classList.remove('active');
    });
    
    tabs.forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Show active tab
    document.getElementById(`${tabId}-tab`).classList.add('active');
    document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
  }
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      switchToTab(tabId);
    });
  });
  
  // Next/Prev buttons
  nextTabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const nextTabId = button.getAttribute('data-next');
      switchToTab(nextTabId);
    });
  });
  
  prevTabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const prevTabId = button.getAttribute('data-prev');
      switchToTab(prevTabId);
    });
  });
  
  // Password toggle
  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      passwordToggle.innerHTML = type === 'password' ? 
        '<i class="bi bi-eye-slash"></i>' : 
        '<i class="bi bi-eye"></i>';
    });
  }

  // Email count and validation
  if (emailTextarea && emailCountDisplay) {
    emailTextarea.addEventListener('input', function() {
      const emails = parseEmails(this.value);
      emailCountDisplay.textContent = emails.length;
      
      // Visual feedback on email count
      if (emails.length > 10) {
        emailCountDisplay.classList.add('text-danger');
        emailCountDisplay.classList.remove('text-dark');
      } else {
        emailCountDisplay.classList.remove('text-danger');
        emailCountDisplay.classList.add('text-dark');
      }
      
      // Update recipient preview
      if (emails.length >= 3) {
        createRecipientPreview(emails);
      } else {
        const previewDiv = document.getElementById('recipients-preview');
        if (previewDiv) {
          previewDiv.style.display = 'none';
        }
      }
      
      // Validate tab for navigation
      validateTab('recipients');
    });
  }

  // Tab validation
  function validateTab(tabId) {
    // Will implement validation logic as needed
    return true;
  }
  
  // Form submission validation and UI
  if (form && sendButton) {
    form.addEventListener('submit', function(e) {
      // Let the server-side validation handle most errors
      // But we'll still validate the email count client-side for better UX
      const emails = parseEmails(emailTextarea.value);
      
      if (emails.length > 10) {
        e.preventDefault();
        
        // Show error in a more user-friendly way
        const alertHtml = `
          <div class="alert alert-danger fade show" role="alert">
            <div class="alert-icon">
              <i class="bi bi-exclamation-triangle-fill"></i>
            </div>
            <div class="alert-content">
              <div class="alert-title">Recipient Limit Exceeded</div>
              <p>Maximum 10 email recipients allowed. Please reduce the number of recipients.</p>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
        
        // Insert alert at the top of the form
        const firstChild = form.firstChild;
        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = alertHtml;
        form.insertBefore(alertDiv, firstChild);
        
        // Switch to recipients tab
        switchToTab('recipients');
        
        return false;
      }
      
      // Show loading state on button with count of individual emails
      sendButton.disabled = true;
      if (emails.length > 1) {
        sendButton.innerHTML = `<div class="loading-state">
          <div class="spinner-container">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          </div>
          Sending ${emails.length} individual emails...
        </div>`;
        
        // Create a progress indicator
        createSendingProgressUI(emails);
      } else {
        sendButton.innerHTML = `<div class="loading-state">
          <div class="spinner-container">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          </div>
          Sending...
        </div>`;
      }
    });
  }
  
  // Create recipient preview
  function createRecipientPreview(emails) {
    // Get the preview container
    const previewDiv = document.getElementById('recipients-preview');
    if (!previewDiv) return;
    
    // Only show for 3+ recipients
    if (emails.length < 3) {
      previewDiv.style.display = 'none';
      return;
    }
    
    // Build the preview content
    let previewHtml = `
      <h4 class="mb-3">Recipients List</h4>
      <div class="list-group">
    `;
    
    emails.slice(0, 10).forEach((email, index) => {
      const statusClass = index % 3 === 0 ? 'sent' : (index % 3 === 1 ? 'pending' : '');
      previewHtml += `
        <div class="list-group-item">
          <div class="email-item">
            <i class="bi bi-person-circle email-icon"></i>
            <span class="email-address">${email}</span>
          </div>
          ${statusClass ? `<span class="email-status ${statusClass}">${statusClass === 'sent' ? 'Ready' : 'Validating'}</span>` : ''}
        </div>
      `;
    });
    
    previewHtml += `</div>`;
    
    // Update and show the preview
    previewDiv.innerHTML = previewHtml;
    previewDiv.style.display = 'block';
  }
  
  // Create sending progress UI
  function createSendingProgressUI(emails) {
    // Get the progress container
    const progressDiv = document.getElementById('sending-progress');
    if (!progressDiv) return;
    
    // Build the progress UI
    let progressHtml = `
      <div class="mt-4 mb-3">
        <div class="progress-header">
          <div class="progress-title">Sending Emails</div>
          <div class="progress-value">0%</div>
        </div>
        <div class="progress">
          <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>
        </div>
      </div>
      
      <div class="email-status-list mt-4">
        <h5 class="mb-3">Email Status</h5>
        <div class="list-group">
    `;
    
    emails.slice(0, 10).forEach((email, index) => {
      progressHtml += `
        <div class="list-group-item" id="email-status-${index}">
          <div class="email-item">
            <i class="bi bi-envelope email-icon"></i>
            <span class="email-address">${email}</span>
          </div>
          <span class="email-status pending">Pending</span>
        </div>
      `;
    });
    
    progressHtml += `
        </div>
      </div>
      
      <div class="text-center mt-4" id="progress-status">
        Preparing to send emails...
      </div>
    `;
    
    // Update and show the progress container
    progressDiv.innerHTML = progressHtml;
    progressDiv.style.display = 'block';
    
    // Get the elements for updating
    const progressBar = progressDiv.querySelector('.progress-bar');
    const progressValue = progressDiv.querySelector('.progress-value');
    const statusText = progressDiv.querySelector('#progress-status');
    
    // Simulate progress
    simulateProgress(emails.length, progressBar, statusText, progressValue, emails);
  }
  
  // Simulate sending progress
  function simulateProgress(totalEmails, progressBar, statusElement, progressValue, emails) {
    const steps = totalEmails;
    const increment = 100 / steps;
    let currentStep = 0;
    
    // Start with connecting status
    setTimeout(() => {
      statusElement.innerHTML = '<i class="bi bi-arrow-repeat spin me-2"></i>Connecting to email server...';
    }, 800);
    
    // Then simulate sending each email
    const interval = setInterval(() => {
      currentStep++;
      const percent = Math.min(Math.round(increment * currentStep), 100);
      
      // Update progress bar
      progressBar.style.width = percent + '%';
      progressBar.setAttribute('aria-valuenow', percent);
      progressValue.textContent = percent + '%';
      
      // Update status text
      if (currentStep <= steps) {
        statusElement.innerHTML = `<i class="bi bi-envelope-paper me-2"></i>Sending email ${currentStep} of ${totalEmails}...`;
        
        // Update email status
        const emailStatus = document.getElementById(`email-status-${currentStep-1}`);
        if (emailStatus) {
          const statusBadge = emailStatus.querySelector('.email-status');
          statusBadge.classList.remove('pending');
          statusBadge.classList.add('sent');
          statusBadge.textContent = 'Sent';
        }
      }
      
      // Add confetti effect when complete
      if (currentStep >= steps) {
        clearInterval(interval);
        statusElement.innerHTML = '<i class="bi bi-check-circle-fill me-2 text-success"></i>All emails sent successfully!';
        progressBar.classList.add('bg-success');
        
        // Create confetti effect
        createConfettiEffect();
      }
    }, 1000 + (Math.random() * 500));
  }
  
  // Confetti effect for successful completion
  function createConfettiEffect() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    // Create confetti pieces
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      // Random position
      confetti.style.left = Math.random() * 100 + 'vw';
      
      // Random color
      const colors = ['#3b82f6', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b'];
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Random size
      const size = Math.random() * 10 + 5;
      confetti.style.width = size + 'px';
      confetti.style.height = size + 'px';
      
      // Random rotation
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      // Random shape
      if (Math.random() > 0.6) {
        confetti.style.borderRadius = '50%';
      } else if (Math.random() > 0.5) {
        confetti.style.borderRadius = '4px';
      }
      
      // Random animation duration
      confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
      
      confettiContainer.appendChild(confetti);
    }
    
    // Remove after animation completes
    setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  }

  // Helper function to parse comma-separated emails
  function parseEmails(text) {
    if (!text.trim()) return [];
    return text.split(',')
      .map(email => email.trim())
      .filter(email => email !== '');
  }
  
  // Initialize email count on page load
  if (emailTextarea && emailCountDisplay) {
    const initialEmails = parseEmails(emailTextarea.value);
    emailCountDisplay.textContent = initialEmails.length;
    if (initialEmails.length >= 3) {
      createRecipientPreview(initialEmails);
    }
  }
  
  // Get sidebar nav items
  const navItems = document.querySelectorAll('.nav-item');
  
  // Add animation to sidebar nav items
  navItems.forEach((item, index) => {
    item.style.animationDelay = (index * 0.1) + 's';
    item.style.opacity = '0';
    item.style.transform = 'translateX(-10px)';
    item.style.animation = 'fadeInLeft 0.3s ease forwards';
  });
  
  // Define the animation
  const styleSheet = document.styleSheets[0];
  const animationKeyframes = `
    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;
  styleSheet.insertRule(animationKeyframes, styleSheet.cssRules.length);
  
  // Sidebar navigation functionality
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // For links with hash, handle navigation within the app
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        
        // Remove active class from all nav items
        navItems.forEach(navItem => {
          navItem.classList.remove('active');
        });
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // Handle special cases for navigation
        if (this.id === 'nav-send-emails') {
          // Go to the first tab
          switchToTab('credentials');
        } else if (this.id === 'nav-recipients') {
          // Go to the recipients tab
          switchToTab('recipients');
        } else if (this.id === 'nav-templates') {
          // Go to the content tab
          switchToTab('content');
        }
        
        // Close mobile sidebar if open
        if (sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
        }
      }
    });
  });
  
  // Check the URL to highlight the active navigation item
  const currentPath = window.location.pathname;
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && !href.startsWith('#') && currentPath.includes(href)) {
      item.classList.add('active');
    }
  });
});
