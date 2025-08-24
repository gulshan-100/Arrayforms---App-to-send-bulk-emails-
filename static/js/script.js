// Simple UI functionality for ArrayForms
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const emailTextarea = document.getElementById('emails');
  const emailCountDisplay = document.getElementById('email_count');
  const form = document.getElementById('emailForm');
  const sendButton = document.getElementById('sendButton');
  const passwordToggle = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('sender_password');
  
  // Rich Text Editor Elements
  const richTextEditor = document.getElementById('richTextEditor');
  const bodyInput = document.getElementById('body');
  const fileUploadArea = document.getElementById('fileUploadArea');
  const fileInput = document.getElementById('attachments');
  const fileList = document.getElementById('fileList');
  
  // Rich Text Editor Toolbar Buttons
  const boldBtn = document.getElementById('boldBtn');
  const italicBtn = document.getElementById('italicBtn');
  const underlineBtn = document.getElementById('underlineBtn');
  const h1Btn = document.getElementById('h1Btn');
  const h2Btn = document.getElementById('h2Btn');
  const h3Btn = document.getElementById('h3Btn');
  const ulBtn = document.getElementById('ulBtn');
  const olBtn = document.getElementById('olBtn');
  const linkBtn = document.getElementById('linkBtn');
  const colorBtn = document.getElementById('colorBtn');
  const clearFormatBtn = document.getElementById('clearFormatBtn');
  const fontFamilyBtn = document.getElementById('fontFamilyBtn');
  const fontSizeBtn = document.getElementById('fontSizeBtn');
  
  // Tab functionality
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const nextTabButtons = document.querySelectorAll('.next-tab');
  const prevTabButtons = document.querySelectorAll('.prev-tab');
  
  // Initialize Rich Text Editor
  if (richTextEditor && bodyInput) {
    initializeRichTextEditor();
  }
  
  // Initialize File Upload
  if (fileUploadArea && fileInput) {
    initializeFileUpload();
  }
  
  function initializeRichTextEditor() {
    // Sync content between rich text editor and hidden input
    richTextEditor.addEventListener('input', function() {
      bodyInput.value = richTextEditor.innerHTML;
    });
    
    // Load initial content if exists
    if (bodyInput.value) {
      richTextEditor.innerHTML = bodyInput.value;
    }
    
    // Bold button
    if (boldBtn) {
      boldBtn.addEventListener('click', function() {
        document.execCommand('bold', false, null);
        updateToolbarState();
      });
    }
    
    // Italic button
    if (italicBtn) {
      italicBtn.addEventListener('click', function() {
        document.execCommand('italic', false, null);
        updateToolbarState();
      });
    }
    
    // Underline button
    if (underlineBtn) {
      underlineBtn.addEventListener('click', function() {
        document.execCommand('underline', false, null);
        updateToolbarState();
      });
    }
    
    // Heading buttons
    if (h1Btn) {
      h1Btn.addEventListener('click', function() {
        document.execCommand('formatBlock', false, 'h1');
        updateToolbarState();
      });
    }
    
    if (h2Btn) {
      h2Btn.addEventListener('click', function() {
        document.execCommand('formatBlock', false, 'h2');
        updateToolbarState();
      });
    }
    
    if (h3Btn) {
      h3Btn.addEventListener('click', function() {
        document.execCommand('formatBlock', false, 'h3');
        updateToolbarState();
      });
    }
    
    // List buttons
    if (ulBtn) {
      ulBtn.addEventListener('click', function() {
        document.execCommand('insertUnorderedList', false, null);
        updateToolbarState();
      });
    }
    
    if (olBtn) {
      olBtn.addEventListener('click', function() {
        document.execCommand('insertOrderedList', false, null);
        updateToolbarState();
      });
    }
    
    // Link button
    if (linkBtn) {
      linkBtn.addEventListener('click', function() {
        const url = prompt('Enter URL:');
        if (url) {
          document.execCommand('createLink', false, url);
        }
        updateToolbarState();
      });
    }
    
    // Color button
    if (colorBtn) {
      colorBtn.addEventListener('click', function() {
        showColorPicker();
      });
    }
    
    // Clear formatting button
    if (clearFormatBtn) {
      clearFormatBtn.addEventListener('click', function() {
        document.execCommand('removeFormat', false, null);
        updateToolbarState();
      });
    }
    
    // Font family button
    if (fontFamilyBtn) {
      fontFamilyBtn.addEventListener('change', function() {
        const fontFamily = this.value;
        if (fontFamily) {
          document.execCommand('fontName', false, fontFamily);
        }
        updateToolbarState();
      });
    }
    
    // Font size button
    if (fontSizeBtn) {
      fontSizeBtn.addEventListener('change', function() {
        const fontSize = this.value;
        if (fontSize) {
          document.execCommand('fontSize', false, fontSize);
        }
        updateToolbarState();
      });
    }
    
    // Update toolbar state on selection change
    richTextEditor.addEventListener('mouseup', updateToolbarState);
    richTextEditor.addEventListener('keyup', updateToolbarState);
  }
  
  function updateToolbarState() {
    // Update button states based on current selection
    if (boldBtn) {
      boldBtn.classList.toggle('active', document.queryCommandState('bold'));
    }
    if (italicBtn) {
      italicBtn.classList.toggle('active', document.queryCommandState('italic'));
    }
    if (underlineBtn) {
      underlineBtn.classList.toggle('active', document.queryCommandState('underline'));
    }
  }
  
  function showColorPicker() {
    const colors = [
      '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef',
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
      '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
    ];
    
    const modal = document.createElement('div');
    modal.className = 'color-picker-overlay';
    modal.innerHTML = `
      <div class="color-picker-modal">
        <div class="color-picker-header">
          <h3 class="color-picker-title">Choose Text Color</h3>
          <button class="color-picker-close" onclick="this.closest('.color-picker-overlay').remove()">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="color-grid">
          ${colors.map(color => `
            <div class="color-option" style="background-color: ${color}" data-color="${color}"></div>
          `).join('')}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add click handlers for color options
    modal.querySelectorAll('.color-option').forEach(option => {
      option.addEventListener('click', function() {
        const color = this.dataset.color;
        document.execCommand('foreColor', false, color);
        modal.remove();
      });
    });
    
    // Close modal when clicking overlay
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
  
  function initializeFileUpload() {
    // Handle file selection
    fileInput.addEventListener('change', handleFileSelect);
    
    // Handle drag and drop
    fileUploadArea.addEventListener('dragover', function(e) {
      e.preventDefault();
      fileUploadArea.classList.add('dragover');
    });
    
    fileUploadArea.addEventListener('dragleave', function(e) {
      e.preventDefault();
      fileUploadArea.classList.remove('dragover');
    });
    
    fileUploadArea.addEventListener('drop', function(e) {
      e.preventDefault();
      fileUploadArea.classList.remove('dragover');
      
      const files = e.dataTransfer.files;
      handleFiles(files);
    });
    
    // Click to upload
    fileUploadArea.addEventListener('click', function() {
      fileInput.click();
    });
  }
  
  function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
  }
  
  function handleFiles(files) {
    Array.from(files).forEach(file => {
      if (isValidFile(file)) {
        addFileToList(file);
      } else {
        showFileError(file.name);
      }
    });
  }
  
  function isValidFile(file) {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif'
    ];
    
    const maxSize = 16 * 1024 * 1024; // 16MB
    
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  }
  
  function addFileToList(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
      <div class="file-item-info">
        <i class="bi bi-file-earmark file-icon"></i>
        <div class="file-details">
          <div class="file-name">${file.name}</div>
          <div class="file-size">${formatFileSize(file.size)}</div>
        </div>
      </div>
      <button class="file-remove" onclick="this.closest('.file-item').remove()">
        <i class="bi bi-x"></i>
      </button>
    `;
    
    fileList.appendChild(fileItem);
  }
  
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  function showFileError(filename) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger fade show';
    alert.innerHTML = `
      <div class="alert-icon">
        <i class="bi bi-exclamation-triangle-fill"></i>
      </div>
      <div class="alert-content">
        <div class="alert-title">Invalid File</div>
        <p>${filename} is not a supported file type or exceeds the 16MB size limit.</p>
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Insert alert at the top of the form
    const firstChild = form.firstChild;
    form.insertBefore(alert, firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      alert.remove();
    }, 5000);
  }
  
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
      // Sync rich text editor content before submission
      if (richTextEditor && bodyInput) {
        bodyInput.value = richTextEditor.innerHTML;
      }
      
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
  
  // Add smooth scrolling for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add keyboard navigation for tabs
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case '1':
          e.preventDefault();
          switchToTab('credentials');
          break;
        case '2':
          e.preventDefault();
          switchToTab('recipients');
          break;
        case '3':
          e.preventDefault();
          switchToTab('content');
          break;
      }
    }
  });
  
  // Add form auto-save functionality
  const formInputs = document.querySelectorAll('#emailForm input, #emailForm textarea');
  formInputs.forEach(input => {
    input.addEventListener('input', function() {
      const formData = new FormData(form);
      const data = {};
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }
      localStorage.setItem('arrayforms-draft', JSON.stringify(data));
    });
  });
  
  // Load saved draft on page load
  const savedDraft = localStorage.getItem('arrayforms-draft');
  if (savedDraft) {
    try {
      const data = JSON.parse(savedDraft);
      Object.keys(data).forEach(key => {
        const input = document.querySelector(`[name="${key}"]`);
        if (input && data[key]) {
          input.value = data[key];
        }
      });
      
      // Update email count if emails were saved
      if (emailTextarea && emailCountDisplay) {
        const emails = parseEmails(emailTextarea.value);
        emailCountDisplay.textContent = emails.length;
        if (emails.length >= 3) {
          createRecipientPreview(emails);
        }
      }
    } catch (e) {
      console.log('Could not load saved draft');
    }
  }
  
  // Clear draft after successful form submission
  if (form) {
    form.addEventListener('submit', function() {
      localStorage.removeItem('arrayforms-draft');
    });
  }
  

});
