document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
  if (!user) {
    alert("You must be logged in.");
    window.location.href = "/login.html";
    return;
  }

  document.getElementById("farmer-name").innerText = user.name;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
  });

  // Tab switching
  document.querySelectorAll(".tab-nav li").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab-nav li").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const tabId = tab.dataset.tab;
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
      document.getElementById(tabId).classList.add("active");
    });
  });

  const farmerId = user.id;

  try {
    const res = await fetch(`/api/farmer/dashboard/${farmerId}`);
    const data = await res.json();

    if (!data.success) throw new Error("Failed to fetch dashboard data");

    const d = data.data;

    // Update stats cards
    document.getElementById("total-sales-value").innerText = `₹${d.total_sales}`;
    document.getElementById("active-listings-value").innerText = d.active_listings;
    document.getElementById("rating-value").innerText = d.rating;
    document.getElementById("district-rank-value").innerText = `#${d.district_rank}`;

    // Recent activity
    const activityList = document.getElementById("recent-activity-list");
    activityList.innerHTML = d.recentActivity.map(
      a => `<li>${a.description} <small>${new Date(a.created_at).toLocaleString()}</small></li>`
    ).join("");

    // Leaderboard
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = d.leaderboard.map(
      (f, i) => `
        <div class="leaderboard-card">
          <strong>#${i + 1} ${f.name}</strong><br>
          ${f.farm_location}<br>
          ⭐ ${f.rating} | ₹${f.total_sales}
        </div>
      `
    ).join("");

    document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-nav li");
  const slider = document.querySelector(".tab-slider");

  function updateSlider(tab) {
    slider.style.width = `${tab.offsetWidth}px`;
    slider.style.left = `${tab.offsetLeft}px`;
  }

  // Initialize slider on page load
  const activeTab = document.querySelector(".tab-nav li.active");
  if (activeTab) updateSlider(activeTab);

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Switch active class
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // Move slider
      updateSlider(tab);

      // Show corresponding tab pane
      const tabId = tab.dataset.tab;
      document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Optional: adjust slider on window resize
  window.addEventListener("resize", () => {
    const activeTab = document.querySelector(".tab-nav li.active");
    if (activeTab) updateSlider(activeTab);
  });
});


  } catch (err) {
    console.error("Dashboard fetch error:", err);
  }
});



// Populate Recent Activity
const activityList = document.getElementById("recent-activity-list");
if (d.recentActivity.length > 0) {
  activityList.innerHTML = d.recentActivity.map(
    a => `<li>${a.description} <small>${new Date(a.created_at).toLocaleString()}</small></li>`
  ).join("");
} else {
  activityList.innerHTML = "<li>No recent activity</li>";
}

// Populate District Leaderboard
const leaderboard = document.getElementById("leaderboard");
if (d.leaderboard.length === 0) {
  // If database empty, show only current user as #1
  leaderboard.innerHTML = `
    <div class="leaderboard-card">
      <div class="leader-info">
        <i class="fas fa-trophy trophy"></i>
        <span>#1 ${user.name}</span>
      </div>
      <div>
        ⭐ ${d.rating} | ₹${d.total_sales} | ${user.region || "Your Region"}
      </div>
    </div>
  `;
} else {
  // Sort leaderboard by total_sales descending
  const sortedLeaderboard = d.leaderboard.sort((a, b) => b.total_sales - a.total_sales);

  leaderboard.innerHTML = sortedLeaderboard.map((f, i) => `
    <div class="leaderboard-card">
      <div class="leader-info">
        ${i === 0 ? '<i class="fas fa-trophy trophy"></i>' : ''}
        <span>#${i + 1} ${f.name}</span>
      </div>
      <div>
        ⭐ ${f.rating} | ₹${f.total_sales} | ${f.farm_location}
      </div>
    </div>
  `).join("");
}

