//what in here?
//Site feedback

const feedbackForm = document.getElementById("feedbackForm");
const feedbackInput = document.getElementById("feedbackInput");
const feedbackStatus = document.getElementById("feedbackStatus");

if (feedbackForm) {
  feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const feedbackText = feedbackInput.value.trim();
    const user = firebase.auth().currentUser;

    if (!user) {
      feedbackStatus.textContent = "❌ You must be logged in to submit feedback.";
      feedbackStatus.style.color = "red";
      return;
    }

    if (!feedbackText) {
      feedbackStatus.textContent = "⚠️ Please write something before submitting.";
      feedbackStatus.style.color = "orange";
      return;
    }

    try {
      await firebase.firestore()
        .collection("feedback")
        .add({
          uid: user.uid,
          email: user.email,
          text: feedbackText,
          submitted: firebase.firestore.FieldValue.serverTimestamp()
        });

      feedbackStatus.textContent = "✅ Thank you for your feedback! 🙌";
      feedbackStatus.style.color = "black";
      feedbackInput.value = "";
    } catch (err) {
      console.error("Feedback submit error:", err);
      feedbackStatus.textContent = "❌ Error submitting feedback. Please try again.";
      feedbackStatus.style.color = "red";
    }
  });
}
