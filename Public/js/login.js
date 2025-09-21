// Select form elements
const loginForm = document.getElementById("loginForm");
const togglePassword = document.querySelector(".toggle-password");
const passwordInput = document.querySelector("#password");

// Show/Hide password
togglePassword.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  togglePassword.style.color = type === "password" ? "#ccc" : "#32cd32";
});

// Handle login form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
console.log("first");

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("second");

    if (data.success) {
      // Save user in session storage
      sessionStorage.setItem("loggedInUser", JSON.stringify(data.user));

      // Show toast notification
      const toast = document.getElementById("toast");
      toast.classList.add("show");

      setTimeout(() => {
        toast.classList.remove("show");

        // Redirect based on role
        const role = data.user.role;
        switch (role) {
          case "Farmer":
            window.location.href = "/dashboards/farmer.html";
            break;
          case "Merchant":
            window.location.href = "/dashboards/merchant.html";
            break;
          case "Buyer":
            window.location.href = "/dashboards/buyer.html";
            break;
          case "Gov":   // DB stores "Gov", not "Government Official"
            window.location.href = "/dashboards/gov.html";
            break;
          default:
            window.location.href = "/";
        }
      }, 1200);

    } else {
      alert(data.message || "Login failed");
    }

  } catch (err) {
    console.error("Login error:", err);
    alert("Server error. Try again.");
  }
});
