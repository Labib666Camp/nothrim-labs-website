document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
              // Close mobile nav if open before scrolling
              const navLinks = document.querySelector('.nav-links');
              const toggleButton = document.querySelector('.mobile-nav-toggle');
              if (navLinks && navLinks.classList.contains('active')) {
                  navLinks.classList.remove('active');
                  if(toggleButton) toggleButton.setAttribute('aria-expanded', 'false');
                   // Change icon back to bars if using icon swap logic
                   const icon = toggleButton.querySelector('i');
                   if (icon) {
                       icon.classList.remove('fa-times');
                       icon.classList.add('fa-bars');
                   }
              }


              // Calculate offset for fixed navbar if necessary
              const navHeight = document.querySelector('.main-nav')?.offsetHeight || 0;
              const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 10; // Extra offset

              window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
              });

              // Optionally update URL hash without jumping
              // history.pushState(null, null, targetId);
          }
      });
  });

  // Active link highlighting & Nav styling on scroll
  const nav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]'); // Only sections with IDs

  function updateActiveLink() {
      let currentSectionId = '';
      const scrollPosition = window.pageYOffset;

      // Add/Remove scrolled class to nav
      if (nav) {
           if (scrollPosition > 50) {
              nav.classList.add('scrolled');
          } else {
              nav.classList.remove('scrolled');
          }
      }


      // Determine current section
      sections.forEach(section => {
          const sectionTop = section.offsetTop - (nav?.offsetHeight || 0) - 50; // Adjust threshold
          const sectionHeight = section.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              currentSectionId = section.getAttribute('id');
          }
      });

       // Update nav links active state
      navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentSectionId}`) {
              link.classList.add('active');
          }
      });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink(); // Initial check on load

  // Mobile Navigation Toggle
  const toggleButton = document.querySelector('.mobile-nav-toggle');
  const mobileNavLinks = document.querySelector('.nav-links');
  const icon = toggleButton?.querySelector('i');

  if (toggleButton && mobileNavLinks && icon) {
      toggleButton.addEventListener('click', () => {
          const isExpanded = mobileNavLinks.classList.toggle('active');
          toggleButton.setAttribute('aria-expanded', isExpanded);

          // Toggle icon class
           if (isExpanded) {
               icon.classList.remove('fa-bars');
               icon.classList.add('fa-times');
           } else {
               icon.classList.remove('fa-times');
               icon.classList.add('fa-bars');
           }
      });
  }
});