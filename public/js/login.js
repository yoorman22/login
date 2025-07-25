document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const messageDiv = document.getElementById("message");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username.length < 3 || password.length < 6) {
      messageDiv.textContent = "Debe completar los campos correctamente.";
      messageDiv.className = "alert alert-danger";
      messageDiv.classList.remove("d-none");
      return;
    }

    const formData = new FormData();
    formData.append("accion", "login");
    formData.append("username", username);
    formData.append("password", password);

    fetch("index.php?pagina=login", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Cambiar redirección a la página de inicio después del login
          window.location.href = "index.php?pagina=inicio";
        } else {
          messageDiv.textContent = data.message || "Credenciales inválidas.";
          messageDiv.className = "alert alert-danger";
          messageDiv.classList.remove("d-none");
        }
      })
      .catch(() => {
        messageDiv.textContent = "Error en la conexión.";
        messageDiv.className = "alert alert-danger";
        messageDiv.classList.remove("d-none");
      });
  });
});
