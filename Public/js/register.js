// ---------------------------
// Get selected role from localStorage
// ---------------------------
const selectedRole = localStorage.getItem("selectedRole") || "User";

// Update heading
const selectedRoleHeading = document.getElementById("selected-role");
if (selectedRoleHeading) {
  selectedRoleHeading.innerText = selectedRole;
}

// Pre-fill hidden role input
const roleInput = document.getElementById("roleInput");
if (roleInput) {
  roleInput.value = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
}

// ---------------------------
// Add role-specific fields dynamically
// ---------------------------
const roleFields = document.getElementById("role-specific-fields");
if (roleFields) {
  if (selectedRole === "Farmer") {
    roleFields.innerHTML = `
      <div class="form-group">
        <label for="farm-location">Farm Location</label>
        <input type="text" id="farm-location" name="farmLocation" required>
      </div>
      <div class="form-group">
        <label for="farm-size">Farm Size (in acres)</label>
        <input type="number" id="farm-size" name="farmSize" required>
      </div>
    `;
  } else if (selectedRole === "Merchant") {
    roleFields.innerHTML = `
      <div class="form-group">
        <label for="shop-name">Shop / Business Name</label>
        <input type="text" id="shop-name" name="shopName" required>
      </div>
    `;
  } else if (selectedRole === "Buyer") {
    roleFields.innerHTML = `
      <div class="form-group">
        <label for="address">Delivery Address</label>
        <input type="text" id="address" name="address" required>
      </div>
    `;
  } else if (selectedRole === "Government Official") {
    roleFields.innerHTML = `
      <div class="form-group">
        <label for="department">Department</label>
        <input type="text" id="department" name="department" required>
      </div>
    `;
  }
}

// ---------------------------
// Password toggle
// ---------------------------
const passwordInput = document.getElementById("password");
const togglePassword = document.querySelector(".toggle-password");
togglePassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.style.color = "#32cd32";
  } else {
    passwordInput.type = "password";
    togglePassword.style.color = "#ccc";
  }
});

// ---------------------------
// Handle registration form submission
// ---------------------------
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Common fields
  const fullName = document.getElementById("full-name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value;
  const aadhar = document.getElementById("aadhar").value;
  let role = document.getElementById("roleInput").value;

  // Map Government Official to 'Gov' for ENUM
  if (role === "Government Official") role = "Gov";

  // Role-specific fields
  let roleData = {};
  if (role === "Farmer") {
    roleData = {
      farmLocation: document.getElementById("farm-location").value,
      farmSize: document.getElementById("farm-size").value
    };
  } else if (role === "Merchant") {
    roleData = { shopName: document.getElementById("shop-name").value };
  } else if (role === "Buyer") {
    roleData = { address: document.getElementById("address").value };
  } else if (role === "Gov") {
    roleData = { department: document.getElementById("department").value };
  }

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password, phone, aadhar, role, ...roleData })
    });

    const data = await response.json();

    alert(data.message);

    if (data.success) {
      // Redirect to login page
      window.location.href = "/login.html";
    }

  } catch (err) {
    console.error("Registration Error:", err);
    alert("Something went wrong. Please try again later.");
  }
});
