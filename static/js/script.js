// Email validation and UI functionality
document.addEventListener('DOMContentLoaded', function() {
  const emailTextarea = document.getElementById('emails');
  const emailCountDisplay = document.getElementById('email_count');
  const form = document.getElementById('emailForm');
  const sendButton = document.getElementById('sendButton');

  // Count and validate emails as user types
  emailTextarea.addEventListener('input', function() {
    const emails = parseEmails(this.value);
    emailCountDisplay.textContent = emails.length;
    
    // Visual feedback on email count
    if (emails.length > 10) {
      emailCountDisplay.classList.add('text-danger');
      emailCountDisplay.classList.add('fw-bold');
    } else {
      emailCountDisplay.classList.remove('text-danger');
      emailCountDisplay.classList.remove('fw-bold');
    }
    
    // Update recipient preview if we have >= 5 emails
    if (emails.length >= 5) {
      createRecipientPreview(emails);
    } else {
      const previewDiv = document.getElementById('recipients-preview');
      if (previewDiv) {
        previewDiv.remove();
      }
    }
  });

  // Form submission validation and UI
  form.addEventListener('submit', function(e) {
    // Let the server-side validation handle most errors
    // But we'll still validate the email count client-side for better UX
    const emails = parseEmails(emailTextarea.value);
    
    if (emails.length > 10) {
      e.preventDefault();
      alert('Maximum 10 email recipients allowed. Please reduce the number of recipients.');
      return false;
    }
    
    // Show loading state on button with count of individual emails
    sendButton.disabled = true;
    if (emails.length > 1) {
      sendButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending ${emails.length} individual emails...`;
      
      // If there are 5+ recipients, create a progress indicator
      if (emails.length >= 5) {
        createSendingProgressUI(emails);
      }
    } else {
      sendButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
    }
  });
  
  // Create recipient progress UI
  function createRecipientPreview(emails) {
    // Remove existing preview if it exists
    const existingPreview = document.getElementById('recipients-preview');
    if (existingPreview) {
      existingPreview.remove();
    }
    
    // Only show for 5+ recipients
    if (emails.length < 5) return;
    
    const previewDiv = document.createElement('div');
    previewDiv.id = 'recipients-preview';
    previewDiv.className = 'mt-2 p-3 border rounded bg-light';
    
    const heading = document.createElement('h6');
    heading.textContent = 'Recipients:';
    previewDiv.appendChild(heading);
    
    const list = document.createElement('ul');
    list.className = 'list-group list-group-flush small';
    
    emails.slice(0, 10).forEach((email, index) => {
      const item = document.createElement('li');
      item.className = 'list-group-item bg-transparent py-1';
      item.textContent = email;
      list.appendChild(item);
    });
    
    previewDiv.appendChild(list);
    
    // Insert after the emails textarea's parent div
    emailTextarea.closest('.mb-3').appendChild(previewDiv);
  }
  
  // Create sending progress UI
  function createSendingProgressUI(emails) {
    // Remove existing progress UI if it exists
    const existingProgress = document.getElementById('sending-progress');
    if (existingProgress) {
      existingProgress.remove();
    }
    
    const progressDiv = document.createElement('div');
    progressDiv.id = 'sending-progress';
    progressDiv.className = 'mt-3 p-3 border rounded';
    
    const heading = document.createElement('h6');
    heading.textContent = 'Sending Progress:';
    progressDiv.appendChild(heading);
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress mb-3';
    progressBar.style.height = '20px';
    
    const progressBarInner = document.createElement('div');
    progressBarInner.className = 'progress-bar progress-bar-striped progress-bar-animated';
    progressBarInner.setAttribute('role', 'progressbar');
    progressBarInner.setAttribute('aria-valuenow', '0');
    progressBarInner.setAttribute('aria-valuemin', '0');
    progressBarInner.setAttribute('aria-valuemax', '100');
    progressBarInner.style.width = '0%';
    progressBar.appendChild(progressBarInner);
    
    progressDiv.appendChild(progressBar);
    
    // Status text
    const status = document.createElement('p');
    status.className = 'text-center';
    status.textContent = 'Preparing to send emails...';
    progressDiv.appendChild(status);
    
    // Insert before the submit button
    const submitButtonContainer = sendButton.closest('.d-grid');
    submitButtonContainer.parentNode.insertBefore(progressDiv, submitButtonContainer);
    
    // Simulate progress (since we can't get real-time updates from server)
    simulateProgress(emails.length, progressBarInner, status);
  }
  
  // Simulate sending progress
  function simulateProgress(totalEmails, progressBar, statusElement) {
    const steps = totalEmails;
    const increment = 100 / steps;
    let currentStep = 0;
    
    // Start with connecting status
    setTimeout(() => {
      statusElement.textContent = 'Connecting to email server...';
    }, 800);
    
    // Then simulate sending each email
    const interval = setInterval(() => {
      currentStep++;
      const percent = Math.min(increment * currentStep, 100);
      progressBar.style.width = percent + '%';
      progressBar.setAttribute('aria-valuenow', percent);
      
      if (currentStep <= steps) {
        statusElement.textContent = `Sending email ${currentStep} of ${totalEmails}...`;
      }
      
      if (currentStep >= steps) {
        clearInterval(interval);
        statusElement.textContent = 'All emails queued for delivery!';
      }
    }, 1000 + (Math.random() * 500));
  }

  // Helper function to parse comma-separated emails
  function parseEmails(text) {
    if (!text.trim()) return [];
    return text.split(',')
      .map(email => email.trim())
      .filter(email => email !== '');
  }
  
  // Initialize email count on page load
  if (emailTextarea) {
    const initialEmails = parseEmails(emailTextarea.value);
    emailCountDisplay.textContent = initialEmails.length;
    if (initialEmails.length >= 5) {
      createRecipientPreview(initialEmails);
    }
  }
});
