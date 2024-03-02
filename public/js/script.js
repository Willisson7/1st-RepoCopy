// password visible script.js

function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    var toggleIcon = document.querySelector(".toggle-password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        toggleIcon.textContent = "Show";
    }
}
