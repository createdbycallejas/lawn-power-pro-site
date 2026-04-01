/* ============================================
   LAWN & POWER PRO v2 — SCRIPTS
   ============================================ */

(function () {
  'use strict';

  /* ── Mobile Nav ── */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Nav scroll state ── */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── Scroll-triggered animations ── */
  var animEls = document.querySelectorAll('[data-anim]');
  if (animEls.length) {
    var staggerDelay = 0;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Add a small stagger for sibling elements
          var siblings = entry.target.parentElement.querySelectorAll('[data-anim]');
          var index = Array.prototype.indexOf.call(siblings, entry.target);
          entry.target.style.transitionDelay = (index * 0.08) + 's';
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    animEls.forEach(function (el) { observer.observe(el); });
  }


  /* ============================================
     PHOTO UPLOAD — Preview + Drag & Drop
     ============================================
     
     This provides a visual photo upload experience.
     
     IMPORTANT: Netlify Forms does NOT natively store
     uploaded files. To actually receive photos, you
     need to integrate with a third-party service:
     
     - Option A: Netlify Functions + AWS S3 / Cloudinary
     - Option B: Third-party form handler (Formspree, Basin)
     - Option C: Direct users to text photos to 973-886-4726
     
     The file input and preview UI below is functional
     and ready to wire up to any backend solution.
  */

  var photoUpload = document.getElementById('photoUpload');
  var photoInput = document.getElementById('q-photos');
  var photoPreviews = document.getElementById('photoPreviews');
  var uploadContent = document.getElementById('photoUploadContent');

  if (photoUpload && photoInput && photoPreviews) {
    var selectedFiles = [];

    // Handle file selection
    photoInput.addEventListener('change', function () {
      addFiles(this.files);
    });

    // Drag & drop
    photoUpload.addEventListener('dragover', function (e) {
      e.preventDefault();
      photoUpload.classList.add('dragging');
    });

    photoUpload.addEventListener('dragleave', function (e) {
      e.preventDefault();
      photoUpload.classList.remove('dragging');
    });

    photoUpload.addEventListener('drop', function (e) {
      e.preventDefault();
      photoUpload.classList.remove('dragging');
      if (e.dataTransfer.files.length) {
        addFiles(e.dataTransfer.files);
      }
    });

    function addFiles(fileList) {
      for (var i = 0; i < fileList.length; i++) {
        var file = fileList[i];
        if (file.type.startsWith('image/')) {
          selectedFiles.push(file);
        }
      }
      renderPreviews();
    }

    function renderPreviews() {
      photoPreviews.innerHTML = '';

      if (selectedFiles.length === 0) {
        uploadContent.style.display = '';
        return;
      }

      // Collapse the upload prompt when photos are selected
      uploadContent.style.display = 'none';

      selectedFiles.forEach(function (file, index) {
        var wrapper = document.createElement('div');
        wrapper.className = 'photo-preview';

        var img = document.createElement('img');
        img.alt = file.name;
        var reader = new FileReader();
        reader.onload = function (e) {
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);

        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'photo-preview-remove';
        removeBtn.innerHTML = '&times;';
        removeBtn.setAttribute('aria-label', 'Remove photo');
        removeBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          e.preventDefault();
          selectedFiles.splice(index, 1);
          renderPreviews();
        });

        wrapper.appendChild(img);
        wrapper.appendChild(removeBtn);
        photoPreviews.appendChild(wrapper);
      });

      // Add "add more" button
      var addMore = document.createElement('div');
      addMore.className = 'photo-preview';
      addMore.style.cssText = 'display:flex;align-items:center;justify-content:center;background:var(--gray-50);border:2px dashed var(--gray-200);cursor:pointer;color:var(--gray-300);font-size:24px;';
      addMore.innerHTML = '+';
      addMore.addEventListener('click', function (e) {
        e.stopPropagation();
        photoInput.click();
      });
      photoPreviews.appendChild(addMore);
    }
  }


  /* ── Form submission feedback ── */
  var quoteForm = document.querySelector('.quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      // If not on Netlify, show a demo confirmation
      // On Netlify, the form will be handled automatically
      var isNetlify = window.location.hostname.includes('netlify');
      if (!isNetlify) {
        e.preventDefault();
        var btn = quoteForm.querySelector('button[type="submit"]');
        if (btn) {
          btn.innerHTML = '&#10003; Request Sent!';
          btn.style.background = 'var(--fern)';
          btn.disabled = true;
          setTimeout(function () {
            btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Submit Quote Request';
            btn.style.background = '';
            btn.disabled = false;
          }, 3000);
        }
      }
    });
  }

})();
