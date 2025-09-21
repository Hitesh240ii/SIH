// Quick Login Buttons
document.querySelectorAll(".login-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    alert(`Logged in as: ${btn.innerText}`);
  });
});

// Quick Login toggle
const quickLogin = document.querySelector(".quick-login");
const toggleBtn = document.querySelector(".quick-login-toggle");

toggleBtn.addEventListener("click", () => {
  quickLogin.classList.toggle("expanded");
  toggleBtn.innerText = quickLogin.classList.contains("expanded")
    ? "Quick Login ▲"
    : "Quick Login ▼";
});

// Smooth scroll from "Get Started Today" button to roles section
document.querySelector(".btn-primary").addEventListener("click", () => {
  document.querySelector("#roles").scrollIntoView({ behavior: "smooth" });
});

// Smooth scroll for "Learn More" button
document.querySelector(".btn-secondary").addEventListener("click", () => {
  document.querySelector("#info-section").scrollIntoView({ behavior: "smooth" });
});

// Role Selection Logic
const roleCards = document.querySelectorAll(".role-cards .card");
const continueBtn = document.querySelector(".continue-btn");

roleCards.forEach(card => {
  const btn = card.querySelector("button");

  card.addEventListener("click", () => {
    // Deselect all cards
    roleCards.forEach(c => {
      c.classList.remove("selected");
      c.querySelector("button").innerText = `Join as ${c.classList[1].charAt(0).toUpperCase() + c.classList[1].slice(1)}`;
    });

    // Select this card
    card.classList.add("selected");
    btn.innerText = "SELECTED";
  });
});

// Continue Button Logic
continueBtn.addEventListener("click", () => {
  const selectedCard = document.querySelector(".role-cards .card.selected");
  if (!selectedCard) {
    alert("Please select a role before continuing!");
    return;
  }
  const role = selectedCard.classList[1]; // class name: farmer, merchant, buyer, govt
  localStorage.setItem("selectedRole", role);
  continueBtn.innerText = "Processing...";
  continueBtn.disabled = true;
  // Navigate to registration page
  setTimeout(() => {
    window.location.href = "register.html";
  }, 500); // small delay to show feedback
});

document.querySelectorAll(".login-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    // Save role if needed
    const role = btn.classList[1];
    localStorage.setItem("selectedRole", role);

    // Redirect to login page
    window.location.href = "login.html";
  });
});
