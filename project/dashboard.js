// Enhanced Star Generation with Multiple Layers
function createStars() {
    const starsContainer = document.getElementById('stars');
    const numberOfStars = 200;
    
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random size
        const size = Math.random() * 3 + 0.5;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        // Random animation
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 4 + 2) + 's';
        
        // Some stars are brighter
        if (Math.random() > 0.9) {
            star.classList.add('bright');
        }
        
        starsContainer.appendChild(star);
    }
    
    // Add shooting stars
    createShootingStars();
    
    // Add distant galaxy
    createDistantGalaxy();
    
    // Add asteroid belt
    createAsteroidBelt();
    
    // Add extra exoplanets
    createExtraExoplanets();
}

// Create Shooting Stars
function createShootingStars() {
    setInterval(() => {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        shootingStar.style.top = Math.random() * 50 + '%';
        shootingStar.style.left = Math.random() * 100 + '%';
        shootingStar.style.animationDuration = (Math.random() * 2 + 1) + 's';
        
        document.body.appendChild(shootingStar);
        
        setTimeout(() => {
            shootingStar.remove();
        }, 3000);
    }, 5000);
}

// Create Distant Galaxy
function createDistantGalaxy() {
    const galaxy = document.createElement('div');
    galaxy.className = 'distant-galaxy';
    document.body.appendChild(galaxy);
}

// Create Asteroid Belt
function createAsteroidBelt() {
    const belt = document.createElement('div');
    belt.className = 'asteroid-belt';
    document.body.appendChild(belt);
}

// Add Extra Exoplanets
function createExtraExoplanets() {
    const container = document.querySelector('.exoplanet-system');
    
    // Add planet 5
    const planet5 = document.createElement('div');
    planet5.className = 'exoplanet exoplanet5';
    container.appendChild(planet5);
    
    // Add planet 6
    const planet6 = document.createElement('div');
    planet6.className = 'exoplanet exoplanet6';
    container.appendChild(planet6);
}

// 3D Card Mouse Follow Effect
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `
            translateY(-10px) 
            translateZ(30px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
        `;
        
        // Update CSS custom properties for gradient effect
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Button Ripple Effect
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.innerHTML = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Parallax Effect for Background Elements
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    
    document.querySelectorAll('.exoplanet').forEach((planet, index) => {
        const speed = (index + 1) * 0.5;
        planet.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
    });
    
    const nebula = document.querySelector('.nebula');
    if (nebula) {
        nebula.style.transform = `translate(${moveX * 2}px, ${moveY * 2}px) scale(1.1)`;
    }
});

// Smooth Scroll with Parallax
let scrollPosition = 0;

window.addEventListener('scroll', () => {
    scrollPosition = window.scrollY;
    
    document.querySelectorAll('.card').forEach((card, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrollPosition * speed);
        card.style.transform = `translateY(${yPos}px)`;
    });
});

// Initialize on Load
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    
    // Animate cards on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.card, .stat-card, .info-card').forEach(el => {
        observer.observe(el);
    });
});

// Fade In Up Animation
const fadeStyle = document.createElement('style');
fadeStyle.innerHTML = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeStyle);
