document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    const users = [
      {
        username: "admin",
        password: "1234",
        role: "admin",
        dashboardURL: "admin_dashboard.html",
      },
      {
        username: "user1",
        password: "password1",
        role: "user",
        dashboardURL: "user1_dashboard.html",
      },
      {
        username: "user2",
        password: "password2",
        role: "user",
        dashboardURL: "user2_dashboard.html",
      },
    ];

    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      sessionStorage.setItem("loggedIn", "true");
      sessionStorage.setItem("username", user.username);
      sessionStorage.setItem("role", user.role);

      // Redirect to the appropriate dashboard
      window.location.href = user.dashboardURL;
    } else {
      // Show error message for incorrect credentials
      errorMessage.textContent = "Incorrect username or password";
      errorMessage.style.display = "block";
    }
  });
