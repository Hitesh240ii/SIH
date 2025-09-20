// Get role from localStorage (set when user selects card on front page)
const selectedRole = localStorage.getItem("selectedRole") || "User";

// Update heading with selected role if you have a span with id="selected-role"
const selectedRoleHeading = document.getElementById("selected-role");
if (selectedRoleHeading) {
  selectedRoleHeading.innerText = selectedRole;
}

// Pre-fill role input field
const roleInput = document.getElementById("roleInput");
if (roleInput) {
  roleInput.value = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
}

// Add role-specific fields dynamically
const roleFields = document.getElementById("role-specific-fields");
if (roleFields) {
  if (selectedRole === "Farmer") {
    roleFields.innerHTML = `
      <div class="form-group">
        <label for="farm-location">Farm Location</label>
        <input type="text" id="farm-location" required>
      </div>
      <div class="form-group">
        <label for="farm-size">Farm Size (in acres)</label>
        <input type="number" id="farm-size" required>
      </div>
    `;
  } else if (selectedRole === "Merchant") {
    roleFields.innerHTML = `
      <div class="form-group">
        <label for="shop-name">Shop / Business Name</label>
        <input type="text" id="shop-name" required>
      </div>
    `;
  } else if (selectedRole === "Buyer") {
    roleFields.innerHTML = `
      <div class="form-group">
        <label for="address">Delivery Address</label>
        <input type="text" id="address" required>
      </div>
    `;
  } else if (selectedRole === "Government Official") {
    roleFields.innerHTML = `
      <div class="form-group">
        <label for="department">Department</label>
        <input type="text" id="department" required>
      </div>
    `;
  }
}

// Handle registration form submission
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Gather form data
    const formData = new FormData(registerForm);
    let roleSpecificData = {};
    if (selectedRole === "Farmer") {
      roleSpecificData = {
        farmLocation: formData.get("farm-location"),
        farmSize: formData.get("farm-size")
      };
    } else if (selectedRole === "Merchant") {
      roleSpecificData = { shopName: formData.get("shop-name") };
    } else if (selectedRole === "Buyer") {
      roleSpecificData = { address: formData.get("address") };
    } else if (selectedRole === "Government Official") {
      roleSpecificData = { department: formData.get("department") };
    }

    alert(`Registration successful for role: ${selectedRole}`);
    console.log("Form Data:", Object.fromEntries(formData.entries()));
    console.log("Role-specific Data:", roleSpecificData);

    // Later: Send formData + roleSpecificData to backend
  });
}

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("full-name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value;
  const role = document.getElementById("roleInput").value;

  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password, phone, role })
  });

  const data = await response.json();
  alert(data.message);
});

const passwordInput = document.getElementById("password");
const togglePassword = document.querySelector(".toggle-password");

togglePassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.style.color = "#32cd32"; // optional highlight
  } else {
    passwordInput.type = "password";
    togglePassword.style.color = "#ccc";
  }
});
