// Import Firebase modules from the CDN using the modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc 
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

// Import FullCalendar ESM modules
import { Calendar } from "https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.7/index.esm.js";
import dayGridPlugin from "https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@6.1.7/index.esm.js";
import timeGridPlugin from "https://cdn.jsdelivr.net/npm/@fullcalendar/timegrid@6.1.7/index.esm.js";
import interactionPlugin from "https://cdn.jsdelivr.net/npm/@fullcalendar/interaction@6.1.7/index.esm.js";

// Firebase configuration (replace with your actual config)
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
const auth = getAuth(app);
const db = getFirestore(app);

// DOM References
const loginContainer = document.getElementById("loginContainer");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const adminContent = document.getElementById("adminContent");
const logoutBtn = document.getElementById("logoutBtn");
const calendarEl = document.getElementById("calendar");

// Edit Modal Elements
const editModal = document.getElementById("editModal");
const closeEditModal = document.getElementById("closeEditModal");
const appointmentInfoEl = document.getElementById("appointmentInfo");
const newDateInput = document.getElementById("newDate");
const newTimeInput = document.getElementById("newTime");
const rescheduleBtn = document.getElementById("rescheduleBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Global variable to store the selected appointment's document ID
let selectedAppointmentId = null;

// Handle login form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginError.textContent = "";
  } catch (error) {
    loginError.textContent = error.message;
  }
});

// Handle logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // If admin is logged in, show admin content and load appointments
    loginContainer.style.display = "none";
    adminContent.style.display = "block";
    loadAppointments();
  } else {
    // If no user, show login form and clear calendar
    loginContainer.style.display = "block";
    adminContent.style.display = "none";
    calendarEl.innerHTML = "";
  }
});

// Function to load appointments from Firestore and render them on FullCalendar
async function loadAppointments() {
  try {
    const querySnapshot = await getDocs(collection(db, "appointments"));
    const events = [];
    querySnapshot.forEach((docSnap) => {
      const appData = docSnap.data();
      // Combine date and time into a JavaScript Date object
      const eventDateTime = new Date(`${appData.date}T${appData.time}`);
      events.push({
        id: docSnap.id, // Save the Firestore document ID for later updates
        title: `${appData.name} (${appData.email})`,
        start: eventDateTime.toISOString(),
        allDay: false,
        extendedProps: {
          date: appData.date,
          time: appData.time,
          name: appData.name,
          email: appData.email
        }
      });
    });
    
    // Initialize and render FullCalendar with event click handler for editing
    const calendar = new Calendar(calendarEl, {
      plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: events,
      eventClick: function(info) {
        // Open the edit modal when an event is clicked
        selectedAppointmentId = info.event.id;
        const { name, email, date, time } = info.event.extendedProps;
        appointmentInfoEl.textContent = `${name} (${email}) - ${date} at ${time}`;
        // Pre-fill reschedule inputs with current date and time
        newDateInput.value = date;
        newTimeInput.value = time;
        editModal.style.display = "block";
      }
    });
    calendar.render();
    
  } catch (error) {
    console.error("Error loading appointments: ", error);
    calendarEl.innerHTML = "<p>Error loading appointments.</p>";
  }
}

// Close edit modal when clicking the close icon
closeEditModal.addEventListener("click", () => {
  editModal.style.display = "none";
});

// When clicking outside the modal, close it
window.addEventListener("click", (e) => {
  if (e.target === editModal) {
    editModal.style.display = "none";
  }
});

// Handle reschedule action
rescheduleBtn.addEventListener("click", async () => {
  const newDate = newDateInput.value;
  const newTime = newTimeInput.value;
  if (!newDate || !newTime) {
    alert("Please enter both a new date and time.");
    return;
  }
  try {
    // Update the appointment in Firestore
    const appointmentRef = doc(db, "appointments", selectedAppointmentId);
    await updateDoc(appointmentRef, {
      date: newDate,
      time: newTime
    });
    alert("Appointment rescheduled successfully.");
    editModal.style.display = "none";
    // Reload the appointments to update the calendar view
    loadAppointments();
  } catch (error) {
    console.error("Error rescheduling appointment: ", error);
    alert("There was an error rescheduling the appointment.");
  }
});

// Handle cancel action
cancelBtn.addEventListener("click", async () => {
  const confirmCancel = confirm("Are you sure you want to cancel this appointment?");
  if (!confirmCancel) return;
  try {
    // Delete the appointment from Firestore
    await deleteDoc(doc(db, "appointments", selectedAppointmentId));
    alert("Appointment canceled successfully.");
    editModal.style.display = "none";
    // Reload the appointments to update the calendar view
    loadAppointments();
  } catch (error) {
    console.error("Error canceling appointment: ", error);
    alert("There was an error canceling the appointment.");
  }
});
