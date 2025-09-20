// document.querySelectorAll("button").forEach(btn => {
//   btn.addEventListener("click", () => {
//     alert(`You clicked: ${btn.innerText}`);
//   });
// });

document.querySelectorAll(".login-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    alert(`Logged in as: ${btn.innerText}`);
    // Later: Redirect to role-specific dashboard page
    // window.location.href = `${btn.classList[1]}-dashboard.html`;
  });
});

// Quick Login toggle
// Quick Login toggle
const quickLogin = document.querySelector(".quick-login");
const toggleBtn = document.querySelector(".quick-login-toggle");

toggleBtn.addEventListener("click", () => {
  quickLogin.classList.toggle("expanded");
  if (quickLogin.classList.contains("expanded")) {
    toggleBtn.innerText = "Quick Login ▲";
  } else {
    toggleBtn.innerText = "Quick Login ▼";
  }
});

// Smooth scroll from "Get Started Today" button to roles section
document.querySelector(".btn-primary").addEventListener("click", () => {
  document.querySelector("#roles").scrollIntoView({
    behavior: "smooth"
  });
});
