/* ============================================
   KLM HR DIRECTOR APPLICATION - VALIDATIONS
   ============================================ */

// Validation Rules
const validationRules = {
    q1: {
        minWords: 50,
        maxWords: 500,
        required: true,
        name: 'Leadership Experience'
    },
    q2: {
        minWords: 50,
        maxWords: 500,
        required: true,
        name: 'Strategic Vision'
    },
    q3: {
        minWords: 50,
        maxWords: 500,
        required: true,
        name: 'Team Management'
    },
    q4: {
        minWords: 50,
        maxWords: 500,
        required: true,
        name: 'Crisis Management'
    },
    q5: {
        minWords: 50,
        maxWords: 500,
        required: true,
        name: 'Innovation & Development'
    },
    q6: {
        minWords: 25,
        maxWords: 200,
        required: true,
        name: 'Availability'
    },
    agreement: {
        required: true,
        name: 'Terms Agreement'
    }
};

// Count words in text
function countWords(text) {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Validate single field
function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const rule = validationRules[fieldId];

    if (!field || !rule) return { valid: true };

    const value = field.value.trim();
    const wordCount = countWords(value);

    // Required check
    if (rule.required && !value) {
        return {
            valid: false,
            error: `${rule.name} is required`
        };
    }

    // Word count check (for textareas)
    if (field.tagName === 'TEXTAREA') {
        if (wordCount < rule.minWords) {
            return {
                valid: false,
                error: `${rule.name} must be at least ${rule.minWords} words (${wordCount}/${rule.minWords})`
            };
        }
        if (wordCount > rule.maxWords) {
            return {
                valid: false,
                error: `${rule.name} must not exceed ${rule.maxWords} words (${wordCount}/${rule.maxWords})`
            };
        }
    }

    return { valid: true };
}

// Validate checkbox
function validateCheckbox(checkboxId) {
    const checkbox = document.getElementById(checkboxId);
    const rule = validationRules[checkboxId];

    if (!checkbox || !rule) return { valid: true };

    if (rule.required && !checkbox.checked) {
        return {
            valid: false,
            error: `You must agree to the ${rule.name}`
        };
    }

    return { valid: true };
}

// Validate all fields
function validateAllFields() {
    const errors = [];

    // Validate textareas
    ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'].forEach(fieldId => {
        const validation = validateField(fieldId);
        if (!validation.valid) {
            errors.push(validation.error);
        }
    });

    // Validate agreement
    const agreementValidation = validateCheckbox('agreement');
    if (!agreementValidation.valid) {
        errors.push(agreementValidation.error);
    }

    return {
        valid: errors.length === 0,
        errors: errors
    };
}

// Show validation error
function showValidationError(error) {
    const modal = document.getElementById('errorModal');
    const errorList = document.getElementById('errorList');

    errorList.innerHTML = '';
    
    if (Array.isArray(error)) {
        error.forEach(err => {
            const li = document.createElement('li');
            li.textContent = err;
            errorList.appendChild(li);
        });
    } else {
        errorList.innerHTML = `<li>${error}</li>`;
    }

    modal.classList.add('show');
}

// Show success modal
function showSuccessModal(applicationData) {
    const modal = document.getElementById('successModal');
    const appId = document.getElementById('appId');
    
    appId.textContent = applicationData.id;
    modal.classList.add('show');
}

// Export validation functions for use in main script
window.validationModule = {
    validateAllFields,
    validateField,
    validateCheckbox,
    showValidationError,
    showSuccessModal,
    countWords
};