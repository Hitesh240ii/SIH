document.addEventListener("DOMContentLoaded", async () => {
  // Get logged-in user from sessionStorage
  const user = JSON.parse(sessionStorage.getItem("loggedInUser"));

  if (!user || user.role !== "Farmer") {
    window.location.href = "../login.html"; // redirect if not logged in
    return;
  }

  // Display welcome message
  const welcomeMsg = document.getElementById("welcome-msg");
  if (welcomeMsg) {
    welcomeMsg.innerText = `Welcome, ${user.name}!`;
  }

  // Fetch farmer stats from server
  try {
    const res = await fetch(`/farmer/stats?id=${user.id}`);
    if (!res.ok) throw new Error("Failed to fetch stats");

    const stats = await res.json();

    document.getElementById("total-sales").innerText = `₹${stats.totalSales}`;
    document.getElementById("active-listings").innerText = stats.activeListings;
    document.getElementById("rating").innerText = stats.rating;
    document.getElementById("district-rank").innerText = stats.districtRank;
  } catch (err) {
    console.error("Error fetching stats:", err);
  }

  // Tab switching logic
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      const tabId = tab.dataset.tab;
      document.getElementById(tabId).classList.add("active");
    });
  });
});
