
//what in here?
//Handcap cal and handicap chart

window.addEventListener('DOMContentLoaded', () => {
  // ... all your code here ...

// Track current handicap in memory
let currentHandicapValue = null;

// DOM elements
const handicapForm = document.getElementById('handicapForm');
const handical = document.getElementById('handical');
const loginToUseHandicap = document.getElementById('loginToUseHandicap');
const saveHandicapBtn = document.getElementById('saveHandicapBtn');
const savedHandicapDisplay = document.getElementById('savedHandicapDisplay');
const handicapResult = document.getElementById('handicapResult');

// Listen for form submit
handicapForm.addEventListener('submit', function (e) {
  e.preventDefault();
  calculateHandicap();
});

// Handicap calculation logic
function calculateHandicap() {
  let totalDifferential = 0;
  let count = 0;

  for (let i = 0; i < 3; i++) {
    const score = parseFloat(document.getElementById(`score${i}`).value);
    const rating = parseFloat(document.getElementById(`rating${i}`).value);
    const slope = parseFloat(document.getElementById(`slope${i}`).value);

    if (!isNaN(score) && !isNaN(rating) && !isNaN(slope) && slope !== 0) {
      const differential = ((score - rating) * 113) / slope;
      totalDifferential += differential;
      count++;
    }
  }

  if (count > 0) {
    const average = totalDifferential / count;
    const handicap = Math.round(average * 10) / 10;
    handicapResult.innerText = `Your Handicap: ${handicap}`;
    saveHandicapBtn.classList.remove('d-none');
    currentHandicapValue = handicap;
  } else {
    handicapResult.innerText = `Please enter at least one valid round.`;
    saveHandicapBtn.classList.add('d-none');
    currentHandicapValue = null;
  }
}

// Save handicap to Firebase
saveHandicapBtn.addEventListener('click', async () => {
  const user = firebase.auth().currentUser;
  if (!user || currentHandicapValue === null) return;

  try {
    const userRef = firebase.firestore().collection('users').doc(user.uid);

    // 1. Save latest handicap to profile
    await userRef.set({ handicap: currentHandicapValue }, { merge: true });

    // 2. Add to handicap history
    await userRef.collection('handicapHistory').add({
      handicap: currentHandicapValue,
      date: firebase.firestore.FieldValue.serverTimestamp()
    });

    updateSavedHandicapDisplay(currentHandicapValue);
    loadHandicapChart(); // Reload chart
  } catch (error) {
    console.error("Error saving handicap:", error);
    alert("There was an error saving your handicap. Please try again.");
  }
});

// Display saved handicap
function updateSavedHandicapDisplay(handicap) {
  savedHandicapDisplay.innerHTML = '';

  if (handicap === null || handicap === undefined) {
    savedHandicapDisplay.textContent = 'No saved handicap yet.';
    savedHandicapDisplay.className = 'text-muted mt-3';
    return;
  }

  // Color & message
  let colorClass = 'text-light';
  let message = "Great job! Keep it up!";

  if (handicap > 20) {
    colorClass = 'text-danger';
    message = "Keep practicing!";
  } else if (handicap > 10) {
    colorClass = 'text-warning';
    message = "Nice work! You're improving!";
  }

  savedHandicapDisplay.innerHTML = `
    <div class="alert alert-light p-2 border ${colorClass}" style="background-color: #359447;">
      <strong>Your Saved Handicap:</strong> <span style="font-size: 1rem;">${handicap}</span>
      <br/>
      <small>${message}</small>
    </div>
  `;
}

// Handicap progression chart
let handicapChartInstance = null;

async function loadHandicapChart() {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const historySnap = await firebase.firestore()
    .collection("users")
    .doc(user.uid)
    .collection("handicapHistory")
    .orderBy("date", "asc")
    .get();

  const labels = [];
  const dataPoints = [];

  historySnap.forEach(doc => {
    const data = doc.data();
    if (data.handicap !== undefined && data.date) {
      const dateObj = data.date.toDate();
      labels.push(dateObj.toLocaleDateString());
      dataPoints.push(data.handicap);
    }
  });

  const ctx = document.getElementById("handicapChart").getContext("2d");

  if (handicapChartInstance) {
    handicapChartInstance.destroy();
  }

  handicapChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Handicap Over Time',
        data: dataPoints,
        fill: false,
        borderColor: '#359447',
        backgroundColor: '#fad02e',
        tension: 0.2
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Handicap' }
        },
        x: {
          title: { display: true, text: 'Date' }
        }
      }
    }
  });
}

// Auth state listener
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    handical.classList.remove('d-none');
    loginToUseHandicap.classList.add('d-none');

    firebase.firestore().collection('users').doc(user.uid).get().then(doc => {
      if (doc.exists && doc.data().handicap !== undefined) {
        updateSavedHandicapDisplay(doc.data().handicap);
      } else {
        updateSavedHandicapDisplay(null);
      }
    });

    loadHandicapChart();
  } else {
    handical.classList.add('d-none');
    loginToUseHandicap.classList.remove('d-none');
    updateSavedHandicapDisplay(null);
  }
});

// Optional scroll reset
setTimeout(() => window.scrollTo(0, 0), 1000);
});