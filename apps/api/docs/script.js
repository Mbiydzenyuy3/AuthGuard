/* eslint-disable no-undef */

document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.sidebar a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }

      closeMobileMenu();
    });
  });

  createScrollToTopButton();

  highlightActiveSection();

  addCopyCodeButtons();

  setupMobileMenu();
});

function createScrollToTopButton() {
  const scrollBtn = document.createElement('button');
  scrollBtn.innerHTML = '↑';
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');

  document.body.appendChild(scrollBtn);

  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

function highlightActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sidebar a[href^="#"]');

  window.addEventListener('scroll', function () {
    let current = '';
    const scrollPosition = window.pageYOffset + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function addCopyCodeButtons() {
  const codeBlocks = document.querySelectorAll('.code-block code');

  codeBlocks.forEach((codeBlock) => {
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = '📋';
    copyBtn.className = 'copy-btn';
    copyBtn.title = 'Copy code';
    copyBtn.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.3s ease;
        `;

    codeBlock.parentElement.style.position = 'relative';
    codeBlock.parentElement.appendChild(copyBtn);

    copyBtn.addEventListener('click', function () {
      const codeText = codeBlock.textContent;

      navigator.clipboard
        .writeText(codeText)
        .then(function () {
          const originalHTML = copyBtn.innerHTML;
          copyBtn.innerHTML = '✅';
          copyBtn.style.background = 'rgba(40, 167, 69, 0.8)';

          setTimeout(function () {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
          }, 2000);
        })
        .catch(function (err) {
          console.error('Failed to copy code: ', err);
          copyBtn.innerHTML = '❌';
          copyBtn.style.background = 'rgba(220, 53, 69, 0.8)';

          setTimeout(function () {
            copyBtn.innerHTML = '📋';
            copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
          }, 2000);
        });
    });
  });
}

function setupMobileMenu() {
  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.innerHTML = '☰';
  mobileMenuBtn.className = 'mobile-menu-btn';
  mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');

  document.body.appendChild(mobileMenuBtn);

  const sidebar = document.querySelector('.sidebar');

  mobileMenuBtn.addEventListener('click', function () {
    sidebar.classList.toggle('open');
  });

  document.addEventListener('click', function (e) {
    if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      closeMobileMenu();
    }
  });
}

function closeMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.classList.remove('open');
  }
}

function addSearchFunctionality() {
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search documentation...';
  searchInput.className = 'search-input';

  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  searchContainer.style.cssText = `
        margin: 1rem 0;
        position: relative;
    `;

  searchInput.style.cssText = `
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e0e0e0;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    `;

  searchInput.addEventListener('focus', function () {
    this.style.borderColor = '#667eea';
  });

  searchInput.addEventListener('blur', function () {
    this.style.borderColor = '#e0e0e0';
  });

  searchContainer.appendChild(searchInput);

  const firstSection = document.querySelector('section');
  if (firstSection) {
    firstSection.insertBefore(searchContainer, firstSection.firstChild);
  }
}

if (window.innerWidth > 768) {
  addSearchFunctionality();
}

document.addEventListener('keydown', function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.focus();
    }
  }

  if (e.key === 'Escape') {
    closeMobileMenu();
  }
});

function addLoadingAnimations() {
  const codeBlocks = document.querySelectorAll('.code-block');

  codeBlocks.forEach((block) => {
    block.style.opacity = '0';
    block.style.transform = 'translateY(20px)';
    block.style.transition = 'all 0.6s ease';

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(block);
  });
}

document.addEventListener('DOMContentLoaded', addLoadingAnimations);

function addResponsiveTables() {
  const tables = document.querySelectorAll('table');

  tables.forEach((table) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    wrapper.style.cssText = `
            overflow-x: auto;
            margin: 1rem 0;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
        `;

    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
}

document.addEventListener('DOMContentLoaded', addResponsiveTables);

function enhanceSyntaxHighlighting() {
  const style = document.createElement('style');
  style.textContent = `
        .language-javascript .token.keyword { color: #f97583; }
        .language-javascript .token.string { color: #9ecbff; }
        .language-javascript .token.number { color: #79b8ff; }
        .language-javascript .token.comment { color: #8b949e; }
        
        .language-bash .token.function { color: #f97583; }
        .language-bash .token.string { color: #9ecbff; }
        
        .language-python .token.keyword { color: #f97583; }
        .language-python .token.string { color: #9ecbff; }
        .language-python .token.number { color: #79b8ff; }
    `;

  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', enhanceSyntaxHighlighting);

window.addEventListener('error', function (e) {
  console.warn('Documentation script error:', e.error);
});

if ('performance' in window) {
  window.addEventListener('load', function () {
    setTimeout(function () {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log(
        `Documentation loaded in ${perfData.loadEventEnd - perfData.loadEventStart}ms`,
      );
    }, 0);
  });
}
