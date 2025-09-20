// login.js

// Get the form element
const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("login-password");
const showPasswordCheckbox = document.getElementById("show-password");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission

  const email = document.getElementById("login-email").value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  // Prototype: check credentials in localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    alert(`Login successful! Welcome ${user.fullName}`);
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    // Redirect to dashboard or homepage
    // window.location.href = "dashboard.html";
    return;
  }

  // Optionally: send request to backend
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert(`Login successful! Role: ${data.role}`);
      // redirect to role-specific dashboard if needed
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Login failed. Please try again later.");
  }
});

// Show/Hide Password
showPasswordCheckbox.addEventListener("change", () => {
  passwordInput.type = showPasswordCheckbox.checked ? "text" : "password";
});
