/* ============================================
   MAIN APPLICATION JAVASCRIPT
   ============================================ */

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupModals();
    setupFormHandlers();
    setupCharts();
    setupAnimations();
    setupScrollEffects();
    setupButtonHandlers();
}

/* ============================================
   NAVIGATION & MENU
   ============================================ */
function setupNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navAnchors = document.querySelectorAll('.nav-links a[data-section]');

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Close menu on link click
    navAnchors.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            updateActiveNav(this);
        });
    });

    // Smooth scroll with offset for navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function updateActiveNav(element) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    element.classList.add('active');
}

/* ============================================
   MODAL HANDLERS
   ============================================ */
function setupModals() {
    const loginBtn = document.querySelector('.btn-login');
    const loginModal = document.getElementById('loginModal');
    const modalClose = document.querySelector('.modal-close');
    const loginForm = document.getElementById('loginForm');

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', function() {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Handle login form
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

function handleLogin() {
    const email = document.querySelector('#loginForm input[type="email"]').value;
    const password = document.querySelector('#loginForm input[type="password"]').value;
    
    if (email && password) {
        showNotification('Login successful!', 'success');
        document.getElementById('loginModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        document.getElementById('loginForm').reset();
    }
}

/* ============================================
   FORM HANDLERS
   ============================================ */
function setupFormHandlers() {
    const leaveForm = document.getElementById('leaveForm');
    const contactForm = document.getElementById('contactForm');

    if (leaveForm) {
        leaveForm.addEventListener('submit', handleLeaveSubmit);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleLeaveSubmit(e) {
    e.preventDefault();
    
    const leaveType = document.getElementById('leaveType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const reason = document.getElementById('reason').value;

    if (leaveType && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        showNotification(`Leave request submitted for ${days} day(s)!`, 'success');
        
        // Add to recent requests table
        addLeaveRecord(startDate, leaveType, days);
        
        e.target.reset();
    } else {
        showNotification('Please fill all required fields', 'error');
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'var(--danger-color)';
        } else {
            input.style.borderColor = 'var(--border-color)';
        }
    });

    if (isValid) {
        showNotification('Message sent successfully! We will contact you soon.', 'success');
        form.reset();
    } else {
        showNotification('Please fill all fields', 'error');
    }
}

function addLeaveRecord(date, type, days) {
    const tableBody = document.querySelector('.leave-table table tbody');
    
    if (tableBody) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${date}</td>
            <td>${type.charAt(0).toUpperCase() + type.slice(1)}</td>
            <td>${days}</td>
            <td><span class="status pending">Pending</span></td>
        `;
        
        tableBody.insertBefore(row, tableBody.firstChild);
    }
}

/* ============================================
   BUTTON HANDLERS
   ============================================ */
function setupButtonHandlers() {
    const getStartedBtn = document.getElementById('getStartedBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');

    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            document.getElementById('employees').scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

/* ============================================
   NOTIFICATION SYSTEM
   ============================================ */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

    // Add styles if not already in CSS
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background-color: ${type === 'success' ? '#26a65b' : type === 'error' ? '#e74c3c' : '#0066cc'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/* ============================================
   CHARTS INITIALIZATION
   ============================================ */
function setupCharts() {
    if (typeof Chart !== 'undefined') {
        createDepartmentChart();
        createLeaveChart();
    }
}

function createDepartmentChart() {
    const ctx = document.getElementById('departmentChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Engineering', 'HR', 'Sales', 'Marketing', 'Operations'],
                datasets: [{
                    data: [45, 20, 35, 25, 30],
                    backgroundColor: [
                        '#0066cc',
                        '#ff6b6b',
                        '#26a65b',
                        '#f39c12',
                        '#3498db'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function createLeaveChart() {
    const ctx = document.getElementById('leaveChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Leave Requests',
                    data: [12, 19, 8, 15, 22, 16],
                    borderColor: '#0066cc',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#0066cc',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + ' requests';
                            }
                        }
                    }
                }
            }
        });
    }
}

/* ============================================
   SCROLL EFFECTS
   ============================================ */
function setupScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all feature cards and dashboard cards
    document.querySelectorAll('.feature-item, .dashboard-card, .employee-card, .balance-card').forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}

/* ============================================
   ANIMATIONS HELPER
   ============================================ */
function setupAnimations() {
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        .notification-success {
            background-color: #26a65b !important;
        }

        .notification-error {
            background-color: #e74c3c !important;
        }

        .notification-info {
            background-color: #0066cc !important;
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   SCROLL TO TOP BUTTON
   ============================================ */
window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        let scrollToTop = document.querySelector('.scroll-to-top');
        if (!scrollToTop) {
            scrollToTop = createScrollToTopButton();
        }
        scrollToTop.style.display = 'block';
    } else {
        let scrollToTop = document.querySelector('.scroll-to-top');
        if (scrollToTop) {
            scrollToTop.style.display = 'none';
        }
    }
});

function createScrollToTopButton() {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #0066cc, #004499);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 999;
        font-size: 1.2rem;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;

    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    });

    document.body.appendChild(button);
    return button;
}

/* ============================================
   ACTIVE NAV ON SCROLL
   ============================================ */
window.addEventListener('scroll', function() {
    let current = '';
    const sections = document.querySelectorAll('section, header');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

/* ============================================
   FORM VALIDATION
   ============================================ */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(phone);
}

/* ============================================
   PERFORMANCE MONITORING
   ============================================ */
if (typeof window.performance !== 'undefined' && window.performance.timing) {
    window.addEventListener('load', function() {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page Load Time:', pageLoadTime + 'ms');
    });
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

console.log('KLM HR Application Initialized Successfully ✓');