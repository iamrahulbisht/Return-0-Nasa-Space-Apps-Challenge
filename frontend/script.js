// Generate realistic star field
function createStars() {
    const starsContainer = document.getElementById('stars');
    const numberOfStars = 200;
    
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 3;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 4 + 2) + 's';
        
        starsContainer.appendChild(star);
    }
}

// Flip card animation (for login page)
function flipCard() {
    const container = document.getElementById('loginContainer');
    if (container) {
        container.classList.toggle('flipped');
        
        // Clear any error/success messages when flipping
        document.querySelectorAll('.error-message, .success-message').forEach(el => {
            el.style.display = 'none';
        });
    }
}

// Make flipCard available globally
window.flipCard = flipCard;

// Smooth scroll for navigation links (for landing page)
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

// 3D tilt effect on mouse move (for login page)
const loginContainer = document.getElementById('loginContainer');
if (loginContainer) {
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        
        if (!loginContainer.classList.contains('flipped')) {
            loginContainer.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        } else {
            loginContainer.style.transform = `rotateY(${180 + xAxis}deg) rotateX(${yAxis}deg)`;
        }
    });

    // Reset position on mouse leave
    document.addEventListener('mouseleave', () => {
        if (!loginContainer.classList.contains('flipped')) {
            loginContainer.style.transform = 'rotateY(0deg) rotateX(0deg)';
        } else {
            loginContainer.style.transform = 'rotateY(180deg) rotateX(0deg)';
        }
    });
}

// Input field animations
const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"]');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateZ(10px)';
        this.parentElement.style.transition = 'transform 0.3s';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateZ(0)';
    });
});

// Particle effect on click
document.addEventListener('click', (e) => {
    for(let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.borderRadius = '50%';
        particle.style.background = '#a78bfa';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        particle.style.animation = `particle-explode${i} 1s forwards`;
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
});

// Initialize stars on page load
createStars();
