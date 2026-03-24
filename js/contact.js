// ===== GOOGLE SHEETS INTEGRATION =====
const scriptURL = 'https://script.google.com/macros/s/AKfycbwo77tHIVAQZHZzyucKJct6RbIItKKSsESl1Fh7DO15cy9oWPd5Mp2BPUWqaIgUaONb/exec';
// Replace above with your Google Apps Script Web App URL after deployment

const form = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const submitButton = form.querySelector('.btn-submit');

// Form submission handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Add loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    try {
        // Create FormData object
        const formData = new FormData(form);
        
        // Add timestamp
        formData.append('Timestamp', new Date().toLocaleString());
        
        // Send data to Google Sheets
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            // Show success message
            showSuccessMessage();
            
            // Reset form
            form.reset();
            
            // Track event (if Google Analytics is set up)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submission', {
                    'event_category': 'Contact',
                    'event_label': 'Contact Form Submitted'
                });
            }
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error!', error.message);
        alert('Oops! Something went wrong. Please try again or email us directly at support.careeroption@atomicmail.io');
    } finally {
        // Remove loading state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
    }
});

// Show success message
function showSuccessMessage() {
    successMessage.classList.add('show');
    
    // Add confetti effect if available
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

// Reset form and hide success message
function resetForm() {
    successMessage.classList.remove('show');
    form.reset();
}

// ===== FORM VALIDATION =====
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

// Real-time validation
nameInput.addEventListener('blur', () => {
    validateName(nameInput);
});

emailInput.addEventListener('blur', () => {
    validateEmail(emailInput);
});

messageInput.addEventListener('blur', () => {
    validateMessage(messageInput);
});

function validateName(input) {
    const value = input.value.trim();
    if (value.length < 2) {
        showError(input, 'Name must be at least 2 characters long');
        return false;
    }
    removeError(input);
    return true;
}

function validateEmail(input) {
    const value = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(value)) {
        showError(input, 'Please enter a valid email address');
        return false;
    }
    removeError(input);
    return true;
}

function validateMessage(input) {
    const value = input.value.trim();
    if (value.length < 10) {
        showError(input, 'Message must be at least 10 characters long');
        return false;
    }
    removeError(input);
    return true;
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    
    // Remove existing error
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    formGroup.appendChild(errorDiv);
    input.style.borderColor = '#ef4444';
}

function removeError(input) {
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    if (errorMessage) {
        errorMessage.remove();
    }
    input.style.borderColor = '';
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe benefit cards
document.querySelectorAll('.benefit-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// ===== CHARACTER COUNTER FOR TEXTAREA =====
const messageTextarea = document.getElementById('message');
const messageGroup = messageTextarea.closest('.form-group');

// Create character counter
const charCounter = document.createElement('div');
charCounter.className = 'char-counter';
charCounter.style.fontSize = '0.875rem';
charCounter.style.color = 'var(--text-light)';
charCounter.style.textAlign = 'right';
charCounter.style.marginTop = '0.25rem';
messageGroup.appendChild(charCounter);

messageTextarea.addEventListener('input', () => {
    const length = messageTextarea.value.length;
    const maxLength = 500; // Optional max length
    
    charCounter.textContent = `${length} characters`;
    
    if (length > maxLength) {
        charCounter.style.color = '#ef4444';
    } else {
        charCounter.style.color = 'var(--text-light)';
    }
});

// ===== PREVENT SPAM SUBMISSIONS =====
let lastSubmitTime = 0;
const minTimeBetweenSubmits = 5000; // 5 seconds

form.addEventListener('submit', (e) => {
    const now = Date.now();
    if (now - lastSubmitTime < minTimeBetweenSubmits) {
        e.preventDefault();
        alert('Please wait a moment before submitting again.');
        return;
    }
    lastSubmitTime = now;
});

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Add aria-invalid on validation errors
nameInput.addEventListener('invalid', () => {
    nameInput.setAttribute('aria-invalid', 'true');
});

emailInput.addEventListener('invalid', () => {
    emailInput.setAttribute('aria-invalid', 'true');
});

messageInput.addEventListener('invalid', () => {
    messageInput.setAttribute('aria-invalid', 'true');
});

// Remove aria-invalid on input
[nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
        input.removeAttribute('aria-invalid');
    });
});

// ===== SMOOTH SCROLL TO FORM ON ERROR =====
form.addEventListener('invalid', (e) => {
    e.preventDefault();
    const firstInvalidField = form.querySelector(':invalid');
    if (firstInvalidField) {
        firstInvalidField.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        firstInvalidField.focus();
    }
}, true);

// ===== AUTO-SAVE FORM DATA (OPTIONAL) =====
// Save form data to sessionStorage to prevent data loss
const saveFormData = () => {
    const formData = {
        name: nameInput.value,
        email: emailInput.value,
        subject: document.getElementById('subject').value,
        message: messageInput.value
    };
    sessionStorage.setItem('contactFormData', JSON.stringify(formData));
};

const loadFormData = () => {
    const savedData = sessionStorage.getItem('contactFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        nameInput.value = formData.name || '';
        emailInput.value = formData.email || '';
        document.getElementById('subject').value = formData.subject || '';
        messageInput.value = formData.message || '';
    }
};

// Save on input
[nameInput, emailInput, document.getElementById('subject'), messageInput].forEach(input => {
    input.addEventListener('input', saveFormData);
});

// Load on page load
window.addEventListener('load', loadFormData);

// Clear on successful submission
function clearSavedFormData() {
    sessionStorage.removeItem('contactFormData');
}

// Update showSuccessMessage to clear saved data
const originalShowSuccessMessage = showSuccessMessage;
showSuccessMessage = function() {
    originalShowSuccessMessage();
    clearSavedFormData();
};

console.log('%cContact Form Ready! 📧', 'font-size: 16px; font-weight: bold; color: #6366f1;');
console.log('%cMake sure to update scriptURL with your Google Apps Script URL', 'font-size: 12px; color: #8b5cf6;');