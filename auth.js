 // Use the same firebaseConfig as your HTML page
  const firebaseConfig = {
    apiKey: "AIzaSyAnfVHRG6zXhUHURD8-z_7Wiwy2pO4qxF8",
    authDomain: "fairway-fusion-3a4d4.firebaseapp.com",
    projectId: "fairway-fusion-3a4d4",
    storageBucket: "fairway-fusion-3a4d4.appspot.com",
    messagingSenderId: "161862648502",
    appId: "1:161862648502:web:3d59d3f6a8930197c26b16"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  // Login
  document.getElementById("loginBtn").addEventListener("click", function(e){
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        alert("Login successful!");
        console.log("Logged in user:", userCredential.user);
      })
      .catch(err => alert("Login failed: " + err.message));
  });

  // Signup
  document.getElementById("signupBtn").addEventListener("click", function(e){
    e.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        alert("Signup successful!");
        console.log("Signed up user:", userCredential.user);
      })
      .catch(err => alert("Signup failed: " + err.message));
  });

  // Track login state
  auth.onAuthStateChanged(user => {
    if(user){
      document.getElementById('userEmail').textContent = user.email;
      document.getElementById('userEmail').classList.remove('d-none');
      document.getElementById('logoutBtn').classList.remove('d-none');
      document.getElementById('loginLink').classList.add('d-none');
    } else {
      document.getElementById('userEmail').classList.add('d-none');
      document.getElementById('logoutBtn').classList.add('d-none');
      document.getElementById('loginLink').classList.remove('d-none');
    }
  });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => auth.signOut());
