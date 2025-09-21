document.addEventListener("DOMContentLoaded", async () => {
  // Check if user is logged in
  const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
  if (!user) {
    alert("You must be logged in.");
    window.location.href = "/login.html";
    return;
  }

  document.getElementById("merchant-name").innerText = user.name;

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
  });

  // Tab navigation with slider
  const tabs = document.querySelectorAll(".tab-nav li");
  const slider = document.querySelector(".tab-slider");

  function updateSlider(tab) {
    slider.style.width = `${tab.offsetWidth}px`;
    slider.style.left = `${tab.offsetLeft}px`;
  }

  const activeTab = document.querySelector(".tab-nav li.active");
  if (activeTab) updateSlider(activeTab);

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      updateSlider(tab);

      const tabId = tab.dataset.tab;
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
      document.getElementById(tabId).classList.add("active");
    });
  });

  window.addEventListener("resize", () => {
    const activeTab = document.querySelector(".tab-nav li.active");
    if (activeTab) updateSlider(activeTab);
  });

  const merchantId = user.id;

  try {
    // Fetch dashboard stats
    const res = await fetch(`/api/merchant/dashboard/${merchantId}`);
    const data = await res.json();
    if (!data) throw new Error("Failed to fetch dashboard data");

    // Update stats cards
    document.getElementById("total-purchases-value").innerText = `₹${data.total_purchases}`;
    document.getElementById("active-orders-value").innerText = data.active_orders;
    document.getElementById("suppliers-value").innerText = data.suppliers;
    document.getElementById("profit-margin-value").innerText = `₹${data.profit_margin}`;

    // Fetch recent activity
    const activityRes = await fetch(`/api/merchant/activity/${merchantId}`);
    const activities = await activityRes.json();
    const activityList = document.getElementById("recent-activity-list");
    activityList.innerHTML = activities.map(a => 
      `<li>${a.description} <small>${new Date(a.created_at).toLocaleString()}</small></li>`
    ).join("");

  } catch (err) {
    console.error("Dashboard fetch error:", err);
  }
});
