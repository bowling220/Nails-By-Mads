// Ensure the page always loads at the top
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
  });
  
  // Import Firebase modules from CDN (Firebase v9+ Modular SDK)
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
  import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
  
  // Firebase configuration (replace these values with your own Firebase project's config)
  const firebaseConfig = {
    apiKey: "AIzaSyD4xCq8DWbttfXmQAB_LGeQoWxfzZMhuiQ",
    authDomain: "maddieswebsite-b70df.firebaseapp.com",
    projectId: "maddieswebsite-b70df",
    storageBucket: "maddieswebsite-b70df.firebasestorage.app",
    messagingSenderId: "243806361324",
    appId: "1:243806361324:web:bd2325d3288f1ec4ecf7c9",
    measurementId: "G-MYHEQRVT1C"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  // Scroll Zoom Effect for the Header Background
  const inner = document.querySelector(".inner");
  window.addEventListener("scroll", function() {
    let scrollY = window.pageYOffset;
    let scaleFactor = 1 + scrollY / window.innerHeight;
    inner.style.transform = `scale(${scaleFactor})`;
  });
  
  // Appointment Booking Modal
  const bookingModal = document.getElementById("bookingModal");
  const bookBtn = document.getElementById("bookBtn");
  const closeModal = document.querySelector(".modal .close");
  const bookingForm = document.querySelector(".booking-form");
  
  bookBtn.addEventListener("click", function() {
    bookingModal.style.display = "block";
  });
  
  closeModal.addEventListener("click", function() {
    bookingModal.style.display = "none";
  });
  
  window.addEventListener("click", function(e) {
    if (e.target === bookingModal) {
      bookingModal.style.display = "none";
    }
  });
  
  // Save appointment to Firestore when the booking form is submitted
  bookingForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const name = bookingForm.querySelector('input[type="text"]').value;
    const email = bookingForm.querySelector('input[type="email"]').value;
    const date = bookingForm.querySelector('input[type="date"]').value;
    const time = bookingForm.querySelector('input[type="time"]').value;
  
    const appointment = { name, email, date, time, timestamp: Date.now() };
  
    try {
      // Save the appointment in the "appointments" collection in Firestore
      await addDoc(collection(db, "appointments"), appointment);
      alert("Your appointment has been booked!");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("There was an error booking your appointment. Please try again later.");
    }
  
    bookingForm.reset();
    bookingModal.style.display = "none";
  });
  
  // Schedule Modal (View Appointments)
  // NOTE: In a production app, you would secure this data. For demo purposes, we load all appointments.
  const scheduleModal = document.getElementById("scheduleModal");
  const viewScheduleBtn = document.getElementById("viewScheduleBtn");
  const closeSchedule = document.getElementById("closeSchedule");
  const appointmentsList = document.getElementById("appointmentsList");
  
  viewScheduleBtn.addEventListener("click", async function() {
    appointmentsList.innerHTML = "";
    try {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      if (querySnapshot.empty) {
        appointmentsList.innerHTML = "<p>No appointments scheduled.</p>";
      } else {
        const list = document.createElement("ul");
        querySnapshot.forEach((doc) => {
          const appData = doc.data();
          const li = document.createElement("li");
          li.innerHTML = `<strong>${appData.name}</strong> - ${appData.email} - ${appData.date} at ${appData.time}`;
          list.appendChild(li);
        });
        appointmentsList.appendChild(list);
      }
    } catch (error) {
      console.error("Error fetching appointments: ", error);
      appointmentsList.innerHTML = "<p>Error loading appointments.</p>";
    }
    scheduleModal.style.display = "block";
  });
  
  closeSchedule.addEventListener("click", function() {
    scheduleModal.style.display = "none";
  });
  
  window.addEventListener("click", function(e) {
    if (e.target === scheduleModal) {
      scheduleModal.style.display = "none";
    }
  });
  
  // Cookie Consent - Check and save acceptance to localStorage
  const cookieConsent = document.getElementById("cookieConsent");
  const acceptCookies = document.getElementById("acceptCookies");
  
  if (localStorage.getItem("cookiesAccepted") === "true") {
    cookieConsent.style.display = "none";
  }
  
  acceptCookies.addEventListener("click", function() {
    cookieConsent.style.display = "none";
    localStorage.setItem("cookiesAccepted", "true");
  });
  