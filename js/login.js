// Form submit
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  // Check in localStorage for prototype
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email && u.password === password);

  if(user) {
    alert(`Login successful! Welcome ${user.fullName}`);
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    // window.location.href = "dashboard.html"; // Redirect later
  } else {
    alert("Invalid email or password. Please try again.");
  }
});

// Show/Hide password
// Select the toggle icon and password input
const togglePassword = document.querySelector(".toggle-password");
const passwordInput = document.querySelector("#password");

togglePassword.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  // Optional: toggle eye icon color
  togglePassword.style.color = type === "password" ? "#ccc" : "#32cd32";
});
