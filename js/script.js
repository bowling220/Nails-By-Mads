if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => {
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 0);
});

// Toggle Hamburger Menu on Mobile
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// Appointment Booking Modal Functionality
const bookingModal = document.getElementById("bookingModal");
const bookBtn = document.getElementById("bookBtn");
const closeBookingModal = document.getElementById("closeBookingModal");
const bookingForm = document.getElementById("bookingForm");

const body = document.body;

bookBtn.addEventListener("click", function() {
  bookingModal.classList.add('active');
  body.classList.add('modal-open');
  if (navLinks.classList.contains("active")) {
    navLinks.classList.remove("active");
    menuToggle.classList.remove("active");
  }
});
closeBookingModal.addEventListener("click", function() {
  bookingModal.classList.remove('active');
  body.classList.remove('modal-open');
});
window.addEventListener("click", function(e) {
  if (e.target === bookingModal) {
    bookingModal.classList.remove('active');
    body.classList.remove('modal-open');
  }
});

// Send Emails on Appointment Booking using EmailJS
bookingForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const templateParamsUser = {
    user_name: name,
    user_email: email,
    appointment_date: date,
    appointment_time: time
  };
  emailjs.send("service_3nsu0pj", "template_m1blb99", templateParamsUser)
    .then((response) => {
      console.log("User confirmation email sent!", response.status, response.text);
    }, (error) => {
      console.error("Error sending user confirmation email:", error);
    });
  const templateParamsAdmin = {
    user_name: name,
    user_email: email,
    appointment_date: date,
    appointment_time: time
  };
  emailjs.send("service_3nsu0pj", "template_3pn5nga", templateParamsAdmin)
    .then((response) => {
      console.log("Admin notification email sent!", response.status, response.text);
    }, (error) => {
      console.error("Error sending admin notification email:", error);
    });
  alert("Your appointment has been booked! A confirmation email has been sent.");
  bookingForm.reset();
  bookingModal.classList.remove('active');
  body.classList.remove('modal-open');
});

// Smooth Scrolling for "Explore Services" Button and Navigation Links
const exploreServicesBtn = document.querySelector('.hero-content .cta');
if (exploreServicesBtn) {
  exploreServicesBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const targetSection = document.querySelector(this.getAttribute('href'));
    if (targetSection) {
      const targetY = targetSection.getBoundingClientRect().top + window.scrollY;
      smoothScrollTo(targetY, 1500);
    }
  });
}
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetSection = document.querySelector(this.getAttribute('href'));
    if (targetSection) {
      const targetY = targetSection.getBoundingClientRect().top + window.scrollY;
      smoothScrollTo(targetY, 1500);
    }
  });
});
function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY;
  const distanceY = targetY - startY;
  let startTime = null;
  function easeInOutQuad(t) {
    return t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
  }
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easing = easeInOutQuad(progress);
    window.scrollTo(0, startY + distanceY * easing);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }
  requestAnimationFrame(animation);
}

// Cookie Consent
const cookieConsent = document.getElementById("cookieConsent");
const acceptCookies = document.getElementById("acceptCookies");
if (localStorage.getItem("cookiesAccepted")) {
  cookieConsent.style.display = "none";
}
acceptCookies.addEventListener("click", function() {
  localStorage.setItem("cookiesAccepted", "true");
  cookieConsent.style.display = "none";
});