/* ============================================
   SHIVANI CHAUDHARI — PORTFOLIO JS
   Interactive Effects & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Cursor Glow ---
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // --- Particle Canvas ---
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 265 : 190;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // --- Navigation ---
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  // --- Typewriter Effect ---
  const typewriterEl = document.getElementById('typewriter');
  const titles = [
    'AI/ML Engineer',
    'Python Developer',
    'Real-Time Systems',
    'Azure Cloud',
    'M.S. AI/ML @ Walsh College'
  ];
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typeWriter() {
    const current = titles[titleIndex];
    if (isDeleting) {
      typewriterEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typewriterEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === current.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 400;
    }

    setTimeout(typeWriter, typeSpeed);
  }
  typeWriter();

  // --- Stat Counter Animation ---
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounters() {
    statNumbers.forEach(el => {
      const target = parseFloat(el.dataset.count);
      const isDecimal = target % 1 !== 0;
      const isLarge = target > 100;
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        let value = target * eased;

        if (isLarge) {
          el.textContent = Math.floor(value).toLocaleString() + '+';
        } else if (isDecimal) {
          el.textContent = value.toFixed(1) + '+';
        } else {
          el.textContent = Math.floor(value) + '+';
        }

        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.section-header, .about-text, .about-visual, .project-card, .skill-category, .edu-card, .cert-card, .contact-info, .contact-form, .timeline-item, .highlight');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger stat counters when hero stats become visible
        if (entry.target.classList.contains('hero-stats') || entry.target.closest('.hero')) {
          animateCounters();
        }

        // Trigger skill bar animation
        if (entry.target.classList.contains('skill-category')) {
          const bars = entry.target.querySelectorAll('.skill-bar span');
          bars.forEach(bar => {
            bar.style.width = bar.parentElement.parentElement.dataset.level
              ? bar.parentElement.parentElement.querySelector('.skill-bar span').style.width
              : bar.style.width;
          });
        }
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // Observe hero stats
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(heroStats);
  }

  // --- Terminal Animation ---
  const terminalBody = document.getElementById('terminalBody');
  const terminalCommands = [
    { cmd: 'cat about.txt', output: [
      { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: '' },
      { text: 'Name: Shivani Chaudhari', type: 'success' },
      { text: 'Role: AI/ML Engineer', type: 'success' },
      { text: 'Experience: 3 years', type: 'success' },
      { text: 'Company: Hitachi Digital Services', type: 'info' },
      { text: 'Location: Pune, India', type: 'info' },
      { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: '' },
    ]},
    { cmd: 'cat skills.json', output: [
      { text: '{', type: '' },
      { text: '  "languages": ["Python", "Node.js", "TypeScript"],', type: 'info' },
      { text: '  "ml_ai": ["PyTorch", "scikit-learn", "BERT", "FAISS", "YOLOv8"],', type: 'info' },
      { text: '  "frameworks": ["FastAPI", "gRPC", "React", "Django"],', type: 'info' },
      { text: '  "cloud": ["Azure", "Docker", "Kubernetes", "MLflow"],', type: 'info' },
      { text: '  "security": ["Keycloak", "OAuth 2.0", "JWT"]', type: 'info' },
      { text: '}', type: '' },
    ]},
    { cmd: 'echo $PASSION', output: [
      { text: 'Building production ML pipelines & real-time systems', type: 'success' },
    ]},
    { cmd: 'whoami', output: [
      { text: 'shivani-chaudhari', type: 'success' },
      { text: 'AI/ML Engineer @ Hitachi Digital Services', type: 'info' },
      { text: 'M.S. AI/ML @ Walsh College | PG @ UT Austin', type: 'info' },
    ]},
  ];

  let termIndex = 0;

  function runTerminalAnimation() {
    if (termIndex >= terminalCommands.length) {
      // Add final cursor line
      const cursorLine = document.createElement('div');
      cursorLine.className = 'terminal-line';
      cursorLine.innerHTML = '<span class="prompt">$</span> <span class="cursor-terminal"></span>';
      terminalBody.appendChild(cursorLine);
      return;
    }

    const { cmd, output } = terminalCommands[termIndex];
    const lineDiv = document.createElement('div');
    lineDiv.className = 'terminal-line';
    lineDiv.innerHTML = `<span class="prompt">$</span> <span class="typed-cmd" data-cmd="${cmd}"></span>`;
    terminalBody.appendChild(lineDiv);

    const typedEl = lineDiv.querySelector('.typed-cmd');
    let i = 0;

    function typeCmd() {
      if (i < cmd.length) {
        typedEl.textContent += cmd[i];
        i++;
        setTimeout(typeCmd, 30 + Math.random() * 20);
      } else {
        // Show output
        output.forEach((line, idx) => {
          setTimeout(() => {
            const outDiv = document.createElement('div');
            outDiv.className = `terminal-output ${line.type}`;
            outDiv.textContent = line.text;
            outDiv.style.animationDelay = `${idx * 0.1}s`;
            terminalBody.appendChild(outDiv);
            terminalBody.scrollTop = terminalBody.scrollHeight;
          }, (idx + 1) * 100);
        });

        // Next command
        setTimeout(() => {
          termIndex++;
          runTerminalAnimation();
        }, output.length * 100 + 800);
      }
    }
    typeCmd();
  }

  // Start terminal when about section is visible
  const aboutSection = document.getElementById('about');
  let terminalStarted = false;
  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !terminalStarted) {
        terminalStarted = true;
        setTimeout(runTerminalAnimation, 500);
        aboutObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  aboutObserver.observe(aboutSection);

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Skill bar animation on scroll ---
  const skillCategories = document.querySelectorAll('.skill-category');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const bars = entry.target.querySelectorAll('.skill-bar span');
        bars.forEach(bar => {
          const width = bar.style.width;
          bar.style.setProperty('--skill-width', width);
          bar.style.width = '0';
          setTimeout(() => {
            bar.style.width = width;
          }, 200);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  skillCategories.forEach(cat => skillObserver.observe(cat));

  // --- Form handling ---
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    const btn = contactForm.querySelector('button');
    btn.innerHTML = '<span>Sending...</span>';
    // Formspree handles the actual submission
    setTimeout(() => {
      btn.innerHTML = '<span>Message Sent!</span> ✓';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    }, 1000);
  });

  // --- Active nav link highlight ---
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
