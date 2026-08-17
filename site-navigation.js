(() => {
  const mount = document.querySelector('[data-site-navigation]');
  if (!mount) return;

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const current = (page) => currentPage === page ? ' aria-current="page"' : '';

  mount.innerHTML = `
    <header id="sharedHeader" class="shared-site-header">
      <div class="w-full px-4 sm:px-7 lg:px-12">
        <div class="shared-header-inner">
          <a href="index.html" class="flex items-center" aria-label="VAISH Solar Services home">
            <img src="Assests/logo.jpeg" alt="VAISH Solar Services logo" class="shared-brand-logo" />
          </a>

          <nav class="shared-desktop-nav" aria-label="Primary navigation">
            <a href="index.html" class="nav-link"${current('index.html')}>Home</a>
            <div class="about-dropdown">
              <a href="about.html" class="nav-link about-dropdown-trigger" aria-haspopup="true"${current('about.html')}>About Us <i class="fas fa-chevron-down about-dropdown-caret" aria-hidden="true"></i></a>
              <div class="about-dropdown-menu">
                <a href="about.html#about">About</a>
                <a href="about.html#purpose">Purpose</a>
                <a href="about.html#team">Team</a>
                <a href="about.html#certificates">Certificates</a>
              </div>
            </div>
            <div class="services-dropdown">
              <button type="button" class="nav-link services-dropdown-trigger" aria-haspopup="true" aria-label="Open services menu">Our Services <span class="services-dropdown-caret" aria-hidden="true">+</span></button>
              <div class="services-dropdown-menu">
                <a href="services.html#on-grid">On-Grid Solar System</a>
                <a href="services.html#off-grid">Off-Grid Solar System</a>
                <a href="services.html#hybrid">Hybrid Solar System</a>
                <a href="services.html#solar-led">Solar LED Street Light</a>
                <a href="services.html#water-heating">Solar Water Heating System</a>
                <a href="services.html#water-pumping">Solar Water Pumping System &amp; Solar Aata Chakki</a>
              </div>
            </div>
            <a href="projects.html" class="nav-link"${current('projects.html')}>Projects</a>
            <a href="about.html#team" class="nav-link">Team</a>
            <a href="contact.html" class="nav-link"${current('contact.html')}>Contact Us</a>
            <a href="career.html" class="nav-link"${current('career.html')}>Career</a>
            <a href="get-a-quote.html" class="nav-link"${current('get-a-quote.html')}>Get a Quote</a>
          </nav>

          <button id="sharedMobileMenuBtn" class="shared-menu-button" type="button" aria-label="Toggle menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <aside id="sharedMobileMenu" class="shared-mobile-menu" aria-label="Mobile navigation">
        <div class="p-6">
          <div class="shared-mobile-menu-header">
            <img src="Assests/logo.jpeg" alt="VAISH Solar Services logo" class="w-14 h-14 object-contain" />
            <div class="shared-mobile-menu-actions">
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" aria-label="WhatsApp" class="shared-icon-button shared-whatsapp-button"><i class="fab fa-whatsapp"></i></a>
              <a href="contact.html" aria-label="Email us" class="shared-icon-button"><i class="fas fa-envelope"></i></a>
              <button id="sharedCloseMobileMenu" class="shared-icon-button" type="button" aria-label="Close menu"><i class="fas fa-times"></i></button>
            </div>
          </div>
          <nav class="flex flex-col gap-1">
            <a href="index.html" class="shared-mobile-link"${current('index.html')}>Home</a>
            <a href="about.html" class="shared-mobile-link"${current('about.html')}>About Us</a>
            <details class="shared-mobile-services">
              <summary class="shared-mobile-link shared-mobile-services-trigger"${current('services.html')}>Our Services</summary>
              <div class="shared-mobile-service-list">
                <a href="services.html#on-grid">On-Grid Solar System</a>
                <a href="services.html#off-grid">Off-Grid Solar System</a>
                <a href="services.html#hybrid">Hybrid Solar System</a>
                <a href="services.html#solar-led">Solar LED Street Light</a>
                <a href="services.html#water-heating">Solar Water Heating System</a>
                <a href="services.html#water-pumping">Solar Water Pumping System &amp; Solar Aata Chakki</a>
              </div>
            </details>
            <a href="projects.html" class="shared-mobile-link"${current('projects.html')}>Projects</a>
            <a href="about.html#team" class="shared-mobile-link">Team</a>
            <a href="contact.html" class="shared-mobile-link"${current('contact.html')}>Contact Us</a>
            <a href="career.html" class="shared-mobile-link"${current('career.html')}>Career</a>
            <a href="get-a-quote.html" class="shared-mobile-link"${current('get-a-quote.html')}>Get a Quote</a>
          </nav>
          <div class="mt-8 pt-6 border-t border-slate-100">
            <div class="flex flex-col gap-3">
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" class="shared-mobile-action"><i class="fab fa-whatsapp text-green-500"></i>Chat on WhatsApp</a>
              <a href="tel:+919876543210" class="shared-mobile-action"><i class="fas fa-phone text-brand-500"></i>+91 98765 43210</a>
              <a href="contact.html" class="shared-mobile-action"><i class="fas fa-envelope text-slate-700"></i>Contact Us</a>
            </div>
            <a href="get-a-quote.html" class="shared-mobile-quote">Get a Free Quote</a>
          </div>
        </div>
      </aside>
      <div id="sharedMobileOverlay" class="shared-mobile-overlay" hidden></div>
    </header>
  `;

  if (mount.hasAttribute('data-reserve-header-space')) {
    document.body.classList.add('shared-header-flow');
  }

  const header = document.getElementById('sharedHeader');
  const menuButton = document.getElementById('sharedMobileMenuBtn');
  const menu = document.getElementById('sharedMobileMenu');
  const closeButton = document.getElementById('sharedCloseMobileMenu');
  const overlay = document.getElementById('sharedMobileOverlay');

  const closeMenu = () => {
    menu.classList.remove('open');
    overlay.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    menu.classList.add('open');
    overlay.hidden = false;
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  };

  menuButton.addEventListener('click', openMenu);
  closeButton.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });

  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 2);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
})();
