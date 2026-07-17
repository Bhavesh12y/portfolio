/* ==========================================================================
   Bhavesh Gupta — Portfolio JavaScript
   Handles: mobile nav, theme toggle, scroll reveal (IntersectionObserver),
   project-card glow tracking, active nav link spy, and EmailJS contact form.
   ========================================================================== */

;(function () {
  /* ---------- DOM refs ---------- */
  const header = document.querySelector('header')
  const nav = header.querySelector('nav')
  const mobileToggle = header.querySelector('.mobile-toggle')
  const mobileToggleIcon = mobileToggle.querySelector('i')
  const themeToggle = header.querySelector('.theme-toggle')
  const themeToggleIcon = themeToggle.querySelector('i')
  const html = document.documentElement
  const allNavLinks = document.querySelectorAll('.nav-links a')
  const contactForm = document.getElementById('contact-form')
  const scrollCue = document.querySelector('.scroll-cue')

  /* ---------- 1. Mobile navigation ---------- */
  function closeNav () {
    nav.classList.remove('active')
    mobileToggleIcon.className = 'fa-solid fa-bars'
    document.body.style.overflow = ''
  }

  function openNav () {
    nav.classList.add('active')
    mobileToggleIcon.className = 'fa-solid fa-xmark'
    document.body.style.overflow = 'hidden'
  }

  mobileToggle.addEventListener('click', () => {
    nav.classList.contains('active') ? closeNav() : openNav()
  })

  // Close nav when a link is clicked
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('active')) closeNav()
    })
  })

  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('active') &&
        !nav.contains(e.target) &&
        !mobileToggle.contains(e.target)) {
      closeNav()
    }
  })

  // Close nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) closeNav()
  })

  /* ---------- 2. Theme toggle ---------- */
  const getTheme = () => html.getAttribute('data-theme') || 'dark'
  const setTheme = (theme) => {
    html.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    updateThemeIcon(theme)
  }

  function updateThemeIcon (theme) {
    if (theme === 'light') {
      themeToggleIcon.className = 'fa-solid fa-sun'
    } else {
      themeToggleIcon.className = 'fa-solid fa-moon'
    }
  }

  // Init from localStorage
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    setTheme(savedTheme)
  } else {
    updateThemeIcon(getTheme())
  }

  themeToggle.addEventListener('click', () => {
    const next = getTheme() === 'dark' ? 'light' : 'dark'
    setTheme(next)
  })

  /* ---------- 3. IntersectionObserver – scroll reveal ---------- */
  const animatedEls = document.querySelectorAll('.animate')

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px', // trigger a bit before element enters viewport
      threshold: 0.08
    }

    const revealCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show')
          // Optionally unobserve after reveal (keeps performance lean)
          // revealObserver.unobserve(entry.target)
        }
        // If you want elements to re-hide when scrolling back up,
        // add an else block: entry.target.classList.remove('show')
      })
    }

    const revealObserver = new IntersectionObserver(revealCallback, observerOptions)
    animatedEls.forEach(el => revealObserver.observe(el))
  } else {
    // Fallback for old browsers – just show everything
    animatedEls.forEach(el => el.classList.add('show'))
  }

  /* ---------- 4. Active nav link spy ---------- */
  const sectionIds = []
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href')
    if (href && href.startsWith('#')) {
      sectionIds.push(href.substring(1))
    }
  })

  function onScrollSpy () {
    const scrollPos = window.scrollY + 120 // offset for sticky header

    let currentId = ''
    for (const id of sectionIds) {
      const section = document.getElementById(id)
      if (section && section.offsetTop <= scrollPos) {
        currentId = id
      }
    }

    allNavLinks.forEach(link => {
      link.classList.remove('active-link')
      const href = link.getAttribute('href')
      if (href === '#' + currentId) {
        link.classList.add('active-link')
      }
    })
  }

  // Add CSS for active link
  const styleEl = document.createElement('style')
  styleEl.textContent = `
    .nav-links a.active-link {
      color: var(--text) !important;
    }
    .nav-links a.active-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--accent);
      border-radius: 2px;
    }
  `
  document.head.appendChild(styleEl)

  window.addEventListener('scroll', onScrollSpy, { passive: true })
  onScrollSpy() // initial call

  /* ---------- 5. Project card glow tracking ---------- */
  const projectCards = document.querySelectorAll('.project-card')

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      card.style.setProperty('--mx', x + 'px')
      card.style.setProperty('--my', y + 'px')
    })

    // Reset glow when mouse leaves
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mx', '50%')
      card.style.setProperty('--my', '0%')
    })
  })

  /* ---------- 6. Hide scroll cue on scroll ---------- */
  if (scrollCue) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        scrollCue.style.opacity = '0'
        scrollCue.style.transition = 'opacity 0.4s ease'
        scrollCue.style.pointerEvents = 'none'
      } else {
        scrollCue.style.opacity = '1'
        scrollCue.style.pointerEvents = 'auto'
      }
    }, { passive: true })
  }

  /* ---------- 7. Contact form – EmailJS ---------- */
  // Replace these with your actual EmailJS credentials
  // 1. Sign up at https://www.emailjs.com/
  // 2. Create a service (e.g., Gmail), copy the Service ID
  // 3. Create an email template, copy the Template ID
  // 4. Get your Public Key from Account → API Keys

  const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY' // ← Replace
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID' // ← Replace
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID' // ← Replace

  // Only initialize EmailJS if credentials are set
  if (
    EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
    typeof emailjs !== 'undefined'
  ) {
    emailjs.init(EMAILJS_PUBLIC_KEY)
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault()

      // Get form data
      const formData = {
        from_name: document.getElementById('from_name').value.trim(),
        reply_to: document.getElementById('reply_to').value.trim(),
        message: document.getElementById('message').value.trim()
      }

      // Basic validation
      if (!formData.from_name || !formData.reply_to || !formData.message) {
        showFormFeedback('Please fill in all fields.', 'error')
        return
      }

      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.reply_to)) {
        showFormFeedback('Please enter a valid email address.', 'error')
        return
      }

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...'
      submitBtn.disabled = true

      // If EmailJS is configured, use it
      if (
        EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
        typeof emailjs !== 'undefined'
      ) {
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData)
          .then(() => {
            showFormFeedback('Message sent successfully! I\'ll get back to you soon.', 'success')
            contactForm.reset()
            // Reset floating labels
            contactForm.querySelectorAll('input, textarea').forEach(el => {
              el.classList.remove('has-value')
            })
          })
          .catch((error) => {
            console.error('EmailJS error:', error)
            showFormFeedback('Oops! Something went wrong. Please try emailing me directly.', 'error')
          })
          .finally(() => {
            submitBtn.innerHTML = originalBtnText
            submitBtn.disabled = false
          })
      } else {
        // Fallback: simulate sending (for demo purposes)
        console.log('EmailJS not configured. Form data:', formData)
        setTimeout(() => {
          showFormFeedback(
            'EmailJS not configured yet. Replace YOUR_PUBLIC_KEY, YOUR_SERVICE_ID, and YOUR_TEMPLATE_ID in script.js. For now, email me directly at hello@bhaveshgupta.dev',
            'error'
          )
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false
        }, 800)
      }
    })

    // Floating label behavior – add/remove class for labels to stay up
    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => {
        if (field.value.trim() !== '') {
          field.classList.add('has-value')
        } else {
          field.classList.remove('has-value')
        }
      })
      field.addEventListener('blur', () => {
        if (field.value.trim() !== '') {
          field.classList.add('has-value')
        } else {
          field.classList.remove('has-value')
        }
      })
    })
  }

  function showFormFeedback (message, type) {
    // Remove existing feedback
    const existing = document.querySelector('.form-feedback')
    if (existing) existing.remove()

    const feedback = document.createElement('div')
    feedback.className = 'form-feedback'
    feedback.textContent = message
    feedback.style.cssText = `
      margin-top: 14px;
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      font-size: 0.88rem;
      font-weight: 500;
      animation: fadeInUp 0.35s var(--ease);
      ${
        type === 'success'
          ? 'background: rgba(71,224,210,0.12); color: var(--accent); border: 1px solid rgba(71,224,210,0.3);'
          : 'background: rgba(255,155,82,0.12); color: var(--accent-2); border: 1px solid rgba(255,155,82,0.3);'
      }
    `
    contactForm.appendChild(feedback)

    // Auto-remove after 6 seconds
    setTimeout(() => {
      feedback.style.opacity = '0'
      feedback.style.transition = 'opacity 0.4s ease'
      setTimeout(() => feedback.remove(), 400)
    }, 6000)
  }

  // Add keyframe for feedback animation
  const feedbackKeyframes = document.createElement('style')
  feedbackKeyframes.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `
  document.head.appendChild(feedbackKeyframes)

  /* ---------- 8. Keyboard accessibility – theme toggle ---------- */
  themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      themeToggle.click()
    }
  })

  /* ---------- 9. Smooth scroll for Safari (polyfill-ish) ---------- */
  // Most modern browsers support scroll-behavior: smooth, but just in case:
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href')
      if (href === '#top') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        const headerHeight = header.offsetHeight
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16
        window.scrollTo({ top: targetPosition, behavior: 'smooth' })
      }
    })
  })

  console.log('%c🚀 Bhavesh Gupta Portfolio %cReady',
    'color: #47E0D2; font-size: 1.2em; font-weight: bold;',
    'color: #97A3B8;')
  console.log('%c📡 Signal locked. Navigation systems online.',
    'color: #8B7CF6; font-style: italic;')

})()