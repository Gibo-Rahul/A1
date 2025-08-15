document.addEventListener('DOMContentLoaded', () => {
  // Smooth fade-in for elements with .fade-up
  document.querySelectorAll('.fade-up').forEach((el,i)=>{
    el.style.animationDelay = `${0.12 * (i+1)}s`;
  });

  // Menu filter (on menu.html)
  const grid = document.querySelector('#menuGrid');
  const filters = document.querySelectorAll('[data-filter]');
  if (grid && filters.length){
    filters.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        filters.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        grid.querySelectorAll('.menu-item').forEach(card=>{
          card.style.display = (f==='all' || card.dataset.category===f) ? '' : 'none';
        });
      });
    });
  }

  // Feedback form
  const fbForm = document.getElementById('feedbackForm');
  if (fbForm){
    fbForm.addEventListener('submit', e=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(fbForm).entries());
      localStorage.setItem(`feedback_${Date.now()}`, JSON.stringify(data));
      const toastEl = document.getElementById('fbToast');
      if (toastEl){
        const t = new bootstrap.Toast(toastEl);
        t.show();
      } else {
        alert('Thanks for your feedback!');
      }
      fbForm.reset();
    });
  }

  // Reservation form
  const resForm = document.getElementById('reservationForm');
  if (resForm){
    // set min date = today
    const d = document.getElementById('resDate');
    if (d){ d.min = new Date().toISOString().split('T')[0]; }
    resForm.addEventListener('submit', e=>{
      e.preventDefault();
      const fd = new FormData(resForm);
      const payload = Object.fromEntries(fd.entries());
      if (!payload.name || !payload.date || !payload.time || !payload.guests){
        alert('Please fill all required fields.');
        return;
      }
      payload.id = `res_${Date.now()}`;
      localStorage.setItem(payload.id, JSON.stringify(payload));

      // modal confirm
      const body = document.getElementById('confBody');
      if (body){
        body.innerHTML = `
          <p>Thank you, <strong>${escapeHtml(payload.name)}</strong>!</p>
          <p>Your table for <strong>${escapeHtml(payload.guests)}</strong> on <strong>${escapeHtml(payload.date)}</strong> at <strong>${escapeHtml(payload.time)}</strong> is booked.</p>
          <p class="mb-0">Reservation ID: <code>${payload.id}</code></p>`;
        const m = new bootstrap.Modal('#confModal');
        m.show();
      } else {
        alert('Reservation confirmed!');
      }
      resForm.reset();
    });
  }

  // Night Mode Toggle
  const nightModeToggle = document.getElementById('nightModeToggle');
  const secretLink = document.getElementById('secretLink');
  const body = document.body;

  // Load saved preference
  if (localStorage.getItem('nightMode') === 'enabled') {
    body.classList.add('night-mode');
    if (nightModeToggle) nightModeToggle.checked = true;
    if (secretLink) secretLink.classList.remove('d-none'); // Reveal secret link
  }

  if (nightModeToggle) {
    nightModeToggle.addEventListener('change', () => {
      if (nightModeToggle.checked) {
        body.classList.add('night-mode');
        localStorage.setItem('nightMode', 'enabled');
        if (secretLink) secretLink.classList.remove('d-none'); // Reveal secret link
      } else {
        body.classList.remove('night-mode');
        localStorage.setItem('nightMode', 'disabled');
        if (secretLink) secretLink.classList.add('d-none'); // Hide secret link
      }
    });
  }
});

function escapeHtml(s=''){
  return String(s).replace(/[&<>"']/g, (m)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
