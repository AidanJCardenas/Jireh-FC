fetch("/api/signin", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ username, password }),
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Sign-in failed");
    }
    // Redirect to the dashboard after successful sign-in
    window.location.href = "/dashboard";
  })
  .catch((error) => {
    document.getElementById("error").innerText = error.message;
  });
