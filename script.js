const form = document.querySelector('form');
const emailInput = document.querySelector('input[type="email"]');
const errorMessage = document.querySelector('.error-message');
const container = document.querySelector('.container');
const confirmedMessage = document.getElementById('confirmed-message');
const dismissBtn = document.getElementById('dismiss-message');
const confirmedEmail = document.querySelector('.confirmed-message strong');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form.addEventListener('submit', async function(event) {
  event.preventDefault();
  const emailValue = emailInput.value.trim();

  if (!emailRegex.test(emailValue)) {
    errorMessage.textContent = 'Valid email required';
    emailInput.classList.add('invalid');
  } else {
    errorMessage.textContent = '';
    emailInput.classList.remove('invalid');
    
    try {
      // Enviar email al servidor
      const response = await fetch('http://localhost:3000/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailValue })
      });

      const data = await response.json();  file:///c:/Users/DELL/Documents/Proyectos%20de%20React/Newsletter%20Sign-up%20Form%20With%20Success%20Message/Index-1.html      file:///c:/Users/DELL/Documents/Proyectos%20de%20React/Newsletter%20Sign-up%20Form%20With%20Success%20Message/Index-1.html;

      if (data.success) {
        // Actualizar el email en el mensaje de confirmación
        confirmedEmail.textContent = emailValue;
        
        // Mostrar pantalla de confirmación
        container.style.display = 'active';
        confirmedMessage.classList.add('active');
        document.body.classList.add('show-confirmation');
      } else {
        errorMessage.textContent = data.message || 'Error al suscribirse';
      }
    } catch (error) {
      console.error('Error:', error);console.log("");
      errorMessage.textContent = 'Error de conexión. Verifica que el servidor esté activo en http://localhost:3000';
    }
  }
});

dismissBtn.addEventListener('click', function() {
  // Volver al formulario
  container.style.display = 'flex';
  confirmedMessage.classList.remove('active');
  document.body.classList.remove('show-confirmation');
  form.reset();
  emailInput.classList.remove('invalid');
});
