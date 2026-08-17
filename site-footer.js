(() => {
  const mount = document.querySelector('[data-site-footer]');
  if (!mount) return;

  mount.innerHTML = `
    <footer id="sharedFooter">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 shared-footer-content">
        <section aria-labelledby="footer-links-title">
          <h2 id="footer-links-title" class="shared-footer-title">Our Links</h2>
          <ul class="shared-footer-list">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html#certificates">Certificates</a></li>
            <li><a href="contact.html">FAQs</a></li>
            <li><a href="projects.html">Our Videos</a></li>
            <li><a href="career.html">Career</a></li>
            <li><a href="contact.html">Contact Us</a></li>
          </ul>
        </section>

        <section aria-labelledby="footer-services-title">
          <h2 id="footer-services-title" class="shared-footer-title">Our Services</h2>
          <ul class="shared-footer-list">
            <li><a href="services.html#on-grid">On-Grid Solar System</a></li>
            <li><a href="services.html#off-grid">Off-Grid Solar System</a></li>
            <li><a href="services.html#hybrid">Hybrid Solar System</a></li>
            <li><a href="services.html#solar-led">Solar LED Street Light</a></li>
            <li><a href="services.html#water-heating">Solar Water Heating System</a></li>
            <li><a href="services.html#water-pumping">Solar Water Pumping System &amp; Solar Aata Chakki</a></li>
          </ul>
        </section>

        <section class="shared-footer-contact" aria-label="VAISH Solar Services contact details">
          <img src="Assests/logo.jpeg" alt="VAISH Solar Services" class="shared-footer-logo" />
          <ul class="shared-footer-contact-list">
            <li><i class="fas fa-location-dot" aria-hidden="true"></i><span>219, Karamchari Nagar, Izzat Nagar Bareilly, U.P.-243122</span></li>
            <li><i class="fas fa-location-dot" aria-hidden="true"></i><span>G-79, Nehru Colony, Near IDBI Bank, Fawwara Chowk, Dehradun (UK)-248001</span></li>
            <li><i class="fas fa-envelope" aria-hidden="true"></i><a href="mailto:info@vaishsolarservices.com">info@vaishsolarservices.com</a></li>
            <li><i class="fas fa-envelope" aria-hidden="true"></i><a href="mailto:vaishsolarservices@gmail.com">vaishsolarservices@gmail.com</a></li>
            <li><i class="fas fa-phone" aria-hidden="true"></i><a href="tel:+919818155725">+91 9818155725</a></li>
            <li><i class="fab fa-whatsapp" aria-hidden="true"></i><a href="https://wa.me/917355552433" target="_blank" rel="noreferrer">+91 7355552433</a></li>
            <li><i class="fas fa-business-time" aria-hidden="true"></i><span>Office Timings: 10 AM to 7 PM</span></li>
          </ul>
          <div class="shared-footer-socials">
            <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f" aria-hidden="true"></i></a>
            <a href="https://www.instagram.com/vaishsolarservices?igsh=aDZ3eG9iMnZxamY1" target="_blank" rel="noreferrer" aria-label="Follow VAISH Solar Services on Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>
            <a href="https://www.youtube.com/@vaishsolarservices8477" target="_blank" rel="noreferrer" aria-label="Visit VAISH Solar Services on YouTube"><i class="fab fa-youtube" aria-hidden="true"></i></a>
          </div>
        </section>
      </div>
      <div class="shared-footer-bottom">© 2026 VAISH Solar Services. All rights reserved.</div>
    </footer>
  `;
})();
