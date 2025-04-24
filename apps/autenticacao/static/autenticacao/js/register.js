document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const passwordInput = form.querySelector('input[name="senha"]');
    const confirmPasswordInput = form.querySelector('input[name="confirm-password"]');
    const msgErro = document.getElementById('msg-erro');
  
    form.addEventListener('submit', function (event) {
      msgErro.innerHTML = ''; // limpa antes
  
      if (passwordInput.value !== confirmPasswordInput.value) {
        event.preventDefault();
        msgErro.innerHTML = '<p style="color: red;">Senhas não coincidem. Por favor, verifique.</p>';
      }
    });
  });
  