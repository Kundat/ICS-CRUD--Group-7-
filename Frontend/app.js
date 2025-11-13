// app.js
const API = 'http://127.0.0.1:3000/api/lineup';
const tbody = document.querySelector('#lineupTbl tbody');

async function loadItems() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    tbody.innerHTML = '';
    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.id}</td>
        <td>${escapeHtml(row.festival_name)}</td>
        <td>${escapeHtml(row.artist_name)}</td>
        <td>${escapeHtml(row.stage)}</td>
        <td>${escapeHtml(row.day)}</td>
        <td>${row.time ? row.time.slice(0,5) : ''}</td>
        <td>${escapeHtml(row.genre || '')}</td>
        <td>${escapeHtml(row.notes || '')}</td>
        <td class="actions">
          <button data-id="${row.id}" class="edit">Edit</button>
          <button data-id="${row.id}" class="del">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    alert('Failed to load items. Is the API running?');
  }
}

function escapeHtml(unsafe) {
  return String(unsafe).replace(/[&<>"'`=\/]/g, function(s) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    })[s];
  });
}

const form = document.getElementById('lineupForm');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelEdit');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('recordId').value;
  const payload = {
    festival_name: document.getElementById('festival_name').value.trim(),
    artist_name: document.getElementById('artist_name').value.trim(),
    stage: document.getElementById('stage').value.trim(),
    day: document.getElementById('day').value.trim(),
    time: document.getElementById('time').value,
    genre: document.getElementById('genre').value.trim(),
    notes: document.getElementById('notes').value.trim()
  };

  if (!payload.festival_name || !payload.artist_name || !payload.stage || !payload.day || !payload.time) {
    alert('Please fill festival, artist, stage, day and time');
    return;
  }

  try {
    if (id) {
      // update
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        alert('Update failed: ' + (err.error || res.statusText));
      } else {
        resetForm();
        loadItems();
      }
    } else {
      // create
      const res = await fetch(API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      if (res.status === 201) {
        resetForm();
        loadItems();
      } else {
        const err = await res.json();
        alert('Create failed: ' + (err.error || res.statusText));
      }
    }
  } catch (err) {
    console.error(err);
    alert('Network error');
  }
});

tbody.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains('del')) {
    if (!confirm('Delete this record?')) return;
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (res.status === 204) loadItems();
    else {
      const err = await res.json();
      alert('Delete failed: ' + (err.error || res.statusText));
    }
  }
  if (e.target.classList.contains('edit')) {
    // fetch single record and populate form
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) {
      alert('Failed to fetch record');
      return;
    }
    const row = await res.json();
    document.getElementById('recordId').value = row.id;
    document.getElementById('festival_name').value = row.festival_name;
    document.getElementById('artist_name').value = row.artist_name;
    document.getElementById('stage').value = row.stage;
    document.getElementById('day').value = row.day;
    document.getElementById('time').value = row.time ? row.time.slice(0,5) : '';
    document.getElementById('genre').value = row.genre || '';
    document.getElementById('notes').value = row.notes || '';
    submitBtn.textContent = 'Save';
    cancelBtn.classList.remove('hidden');
  }
});

cancelBtn.addEventListener('click', (e) => {
  resetForm();
});

function resetForm() {
  document.getElementById('recordId').value = '';
  form.reset();
  submitBtn.textContent = 'Add';
  cancelBtn.classList.add('hidden');
}

loadItems();
