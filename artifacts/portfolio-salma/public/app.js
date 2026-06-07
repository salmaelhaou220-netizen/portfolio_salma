'use strict';

// ===== CONFIG =====
const API_BASE = '/api';

// ===== CATEGORY META =====
const CAT_META = {
  fiches:      { label: "Fiches de Préparation",   iconClass: "fi-fiches",      tablerIcon: "ti ti-clipboard-list" },
  grilles:     { label: "Grilles d'Observation",    iconClass: "fi-grilles",     tablerIcon: "ti ti-eye" },
  supports:    { label: "Supports de Cours",        iconClass: "fi-supports",    tablerIcon: "ti ti-presentation" },
  pff:         { label: "Projet de Fin de Formation", iconClass: "fi-pff",       tablerIcon: "ti ti-file-text" },
  productions: { label: "Autres Productions",       iconClass: "fi-productions", tablerIcon: "ti ti-sparkles" },
};

// ===== STATE =====
let allDocs = [];
let isAdmin = false;
let currentFilter = 'all';
let currentSearch = '';
let editingDocId = null;

// ===== API HELPERS =====
async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur réseau' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ===== LOAD DOCUMENTS =====
async function loadDocuments() {
  try {
    allDocs = await apiFetch('/documents');
  } catch (e) {
    allDocs = [];
  }
  updateBadge();
  renderFolders();
}

function updateBadge() {
  document.getElementById('nav-badge-count').textContent = allDocs.length;
}

// ===== HELPERS =====
function typeBadge(type) {
  const map = { pdf: ['badge-pdf','PDF'], doc: ['badge-doc','DOC'], ppt: ['badge-ppt','PPT'], img: ['badge-img','IMG'] };
  const [cls, label] = map[type] || ['badge-other', type.toUpperCase()];
  return `<span class="doc-type-badge ${cls}">${label}</span>`;
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function escJs(s) {
  return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
}

// ===== RENDER FOLDERS =====
function renderFolders() {
  const grid = document.getElementById('foldersGrid');
  if (!grid) return;

  const catKeys = currentFilter === 'all' ? Object.keys(CAT_META) : [currentFilter];
  const filtered = catKeys.filter(k => CAT_META[k]);

  grid.innerHTML = '';
  filtered.forEach(catKey => {
    const meta = CAT_META[catKey];
    let catDocs = allDocs.filter(d => d.category === catKey);
    if (currentSearch) {
      catDocs = catDocs.filter(d => d.name.toLowerCase().includes(currentSearch));
    }

    const block = document.createElement('div');
    block.className = 'folder-block';
    block.setAttribute('data-cat', catKey);

    if (currentFilter !== 'all' || currentSearch) block.classList.add('open');

    const adminAdd = isAdmin
      ? `<button class="btn-admin-add" onclick="openDocForm(null,'${escJs(catKey)}')"><i class="ti ti-plus"></i> Ajouter</button>`
      : '';

    block.innerHTML = `
      <div class="folder-header">
        <div class="folder-icon ${meta.iconClass}"><i class="${meta.tablerIcon}"></i></div>
        <span class="folder-title">${esc(meta.label)}</span>
        <span class="folder-count">${catDocs.length} fichier${catDocs.length !== 1 ? 's' : ''}</span>
        ${adminAdd}
        <i class="ti ti-chevron-down folder-chevron"></i>
      </div>
      <div class="folder-body">
        <ul class="doc-list">
          ${catDocs.length === 0 ? '<li class="doc-empty">Aucun document dans cette catégorie.</li>' : catDocs.map(renderDocItem).join('')}
        </ul>
      </div>
    `;

    block.querySelector('.folder-header').addEventListener('click', e => {
      if (e.target.closest('.btn-admin-add')) return;
      block.classList.toggle('open');
    });

    grid.appendChild(block);
  });
}

function renderDocItem(doc) {
  const adminBtns = isAdmin ? `
    <button class="btn-doc btn-edit" onclick="openDocForm(${doc.id})"><i class="ti ti-pencil"></i></button>
    <button class="btn-doc btn-del" onclick="deleteDoc(${doc.id},'${escJs(doc.name)}')"><i class="ti ti-trash"></i></button>
  ` : '';

  return `
    <li class="doc-item" data-id="${doc.id}">
      ${typeBadge(doc.type)}
      <div class="doc-info">
        <div class="doc-name">${esc(doc.name)}</div>
        <div class="doc-desc">${esc(doc.description)}</div>
      </div>
      <span class="doc-date">${esc(doc.date)}</span>
      <div class="doc-actions">
        <button class="btn-doc btn-view" onclick="openDocModal('${escJs(doc.path)}','${escJs(doc.name)}','${escJs(doc.type)}')">
          <i class="ti ti-eye"></i> Visualiser
        </button>
        <button class="btn-doc btn-download" onclick="downloadDoc('${escJs(doc.path)}','${escJs(doc.name)}')">
          <i class="ti ti-download"></i> Télécharger
        </button>
        ${adminBtns}
      </div>
    </li>
  `;
}

// ===== NAVIGATION =====
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');

  function showSection(sectionId) {
    sections.forEach(s => s.classList.remove('active'));
    navItems.forEach(n => n.classList.remove('active'));
    const target = document.getElementById(sectionId);
    const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
    if (target) {
      target.classList.add('active');
      window.scrollTo(0, 0);
      if (sectionId === 'cv') animateSkillBars();
      if (['accueil', 'rapport'].includes(sectionId)) animateKPIs(target);
    }
    if (navItem) navItem.classList.add('active');
  }

  navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      showSection(item.getAttribute('data-section'));
      if (window.innerWidth <= 768) closeMobileSidebar();
    });
  });

  document.addEventListener('click', e => {
    const trigger = e.target.closest('.nav-trigger');
    if (trigger) {
      e.preventDefault();
      showSection(trigger.getAttribute('data-target'));
    }
  });

  showSection('accueil');
  animateKPIs(document.getElementById('accueil'));
}

// ===== SKILL BARS =====
function animateSkillBars() {
  document.querySelectorAll('.skill-fill').forEach(fill => {
    const w = fill.getAttribute('data-width');
    fill.style.width = '0';
    setTimeout(() => { fill.style.width = w + '%'; }, 100);
  });
}

// ===== KPI COUNTER =====
function animateKPIs(container) {
  container.querySelectorAll('.kpi-value[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    let current = 0;
    el.textContent = '0';
    const step = Math.ceil(target / 40);
    const iv = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(iv);
    }, 30);
  });
}

// ===== STARS =====
function renderStars() {
  document.querySelectorAll('.stars[data-stars]').forEach(el => {
    const n = parseInt(el.getAttribute('data-stars'), 10);
    el.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const icon = document.createElement('i');
      icon.className = i <= n ? 'ti ti-star-filled star-icon' : 'ti ti-star star-empty';
      el.appendChild(icon);
    }
  });
}

// ===== SIDEBAR =====
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const toggleBtn = document.getElementById('sidebarToggle');
  const burgerBtn = document.getElementById('burgerBtn');
  const overlay = document.getElementById('overlay');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('sidebar-collapsed');
  });

  burgerBtn.addEventListener('click', () => {
    sidebar.classList.add('mobile-open');
    overlay.classList.add('active');
  });

  overlay.addEventListener('click', closeMobileSidebar);
}

function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('overlay').classList.remove('active');
}
window.closeMobileSidebar = closeMobileSidebar;

// ===== DOCS TOOLBAR =====
function initDocsToolbar() {
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.getAttribute('data-filter');
      renderFolders();
    });
  });

  document.getElementById('docSearch').addEventListener('input', e => {
    currentSearch = e.target.value.toLowerCase().trim();
    renderFolders();
  });
}

// ===== DOC VIEWER MODAL =====
function openDocModal(path, name, type) {
  const overlay = document.getElementById('modalOverlay');
  document.getElementById('modalTitle').textContent = name;
  const body = document.getElementById('modalBody');

  if (type === 'img') {
    body.innerHTML = `<div class="modal-placeholder"><i class="ti ti-photo"></i><h4>Image bientôt disponible</h4><p>Ce document sera publié prochainement.</p></div>`;
  } else if (type === 'ppt' || type === 'doc') {
    body.innerHTML = `<div class="modal-placeholder"><i class="ti ti-download"></i><h4>Téléchargement requis</h4><p>Ce format ne peut pas être affiché dans le navigateur.<br>Utilisez le bouton <strong>Télécharger</strong>.</p></div>`;
  } else {
    body.innerHTML = `<div class="modal-placeholder"><i class="ti ti-file-text"></i><h4>Document bientôt disponible</h4><p>Ce document sera publié prochainement.<br>Vous pourrez le visualiser et le télécharger dès sa mise en ligne.</p></div>`;
  }
  overlay.classList.add('open');
}
window.openDocModal = openDocModal;

function downloadDoc(path, name) {
  const link = document.createElement('a');
  link.href = path;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
window.downloadDoc = downloadDoc;

function initViewerModal() {
  const overlay = document.getElementById('modalOverlay');
  document.getElementById('modalClose').addEventListener('click', closeViewerModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeViewerModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeViewerModal(); closeLoginModal(); closeDocFormModal(); } });
}

function closeViewerModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('modalBody').innerHTML = '';
}

// ===== CONTACT FORM =====
function handleFormSubmit(e) {
  e.preventDefault();
  document.getElementById('contactForm').classList.add('hidden');
  document.getElementById('formSuccess').classList.remove('hidden');
}
window.handleFormSubmit = handleFormSubmit;

// ===== AUTH =====
async function checkAuth() {
  try {
    const data = await apiFetch('/auth/me');
    isAdmin = data.isAdmin === true;
  } catch {
    isAdmin = false;
  }
  updateAdminUI();
}

function updateAdminUI() {
  // Sidebar lock icon
  const lockBtn = document.getElementById('adminLockBtn');
  if (isAdmin) {
    lockBtn.innerHTML = '<i class="ti ti-lock-open"></i><span>Admin connecté</span>';
    lockBtn.classList.add('admin-active');
  } else {
    lockBtn.innerHTML = '<i class="ti ti-lock"></i><span>Administration</span>';
    lockBtn.classList.remove('admin-active');
  }
  renderFolders();
}

// ===== LOGIN MODAL =====
function openLoginModal() {
  if (isAdmin) {
    showLogoutConfirm();
    return;
  }
  document.getElementById('loginOverlay').classList.add('open');
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginError').textContent = '';
  setTimeout(() => document.getElementById('loginPassword').focus(), 50);
}
window.openLoginModal = openLoginModal;

function closeLoginModal() {
  document.getElementById('loginOverlay').classList.remove('open');
}
window.closeLoginModal = closeLoginModal;

async function showLogoutConfirm() {
  if (!confirm('Voulez-vous vous déconnecter du panneau administrateur ?')) return;
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
    isAdmin = false;
    updateAdminUI();
    showToast('Déconnexion réussie.', 'info');
  } catch (e) {
    showToast('Erreur lors de la déconnexion.', 'error');
  }
}

function initLoginModal() {
  const lo = document.getElementById('loginOverlay');
  if (!lo) return;
  lo.addEventListener('click', e => {
    if (e.target === lo) closeLoginModal();
  });

  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const pwd = document.getElementById('loginPassword').value;
    const errEl = document.getElementById('loginError');
    const btn = document.getElementById('loginSubmitBtn');

    btn.disabled = true;
    btn.textContent = 'Connexion…';
    errEl.textContent = '';

    try {
      await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ password: pwd }) });
      isAdmin = true;
      updateAdminUI();
      closeLoginModal();
      showToast('Connecté en tant qu\'administrateur.', 'success');
    } catch (err) {
      errEl.textContent = err.message || 'Mot de passe incorrect.';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Se connecter';
    }
  });
}

// ===== DOC FORM MODAL (Add / Edit) =====
function openDocForm(docId, defaultCategory) {
  editingDocId = docId;
  const modal = document.getElementById('docFormOverlay');
  const title = document.getElementById('docFormTitle');
  const form = document.getElementById('docForm');

  form.reset();

  if (docId) {
    const doc = allDocs.find(d => d.id === docId);
    if (!doc) return;
    title.textContent = 'Modifier le document';
    form.fCategory.value = doc.category;
    form.fName.value = doc.name;
    form.fDesc.value = doc.description;
    form.fDate.value = doc.date;
    form.fType.value = doc.type;
    form.fPath.value = doc.path;
  } else {
    title.textContent = 'Ajouter un document';
    if (defaultCategory) form.fCategory.value = defaultCategory;
  }

  document.getElementById('docFormError').textContent = '';
  modal.classList.add('open');
}
window.openDocForm = openDocForm;

function closeDocFormModal() {
  document.getElementById('docFormOverlay').classList.remove('open');
  editingDocId = null;
}
window.closeDocFormModal = closeDocFormModal;

function initDocFormModal() {
  const dfo = document.getElementById('docFormOverlay');
  if (!dfo) return;
  dfo.addEventListener('click', e => {
    if (e.target === dfo) closeDocFormModal();
  });

  document.getElementById('docForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      category: form.fCategory.value,
      name: form.fName.value.trim(),
      description: form.fDesc.value.trim(),
      date: form.fDate.value.trim(),
      type: form.fType.value,
      path: form.fPath.value.trim(),
    };

    const errEl = document.getElementById('docFormError');
    const btn = document.getElementById('docFormSubmitBtn');
    btn.disabled = true;
    errEl.textContent = '';

    try {
      if (editingDocId) {
        const updated = await apiFetch(`/documents/${editingDocId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        allDocs = allDocs.map(d => d.id === editingDocId ? updated : d);
        showToast('Document modifié avec succès.', 'success');
      } else {
        const created = await apiFetch('/documents', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        allDocs.push(created);
        showToast('Document ajouté avec succès.', 'success');
      }
      updateBadge();
      closeDocFormModal();
      renderFolders();
    } catch (err) {
      errEl.textContent = err.message || 'Une erreur est survenue.';
    } finally {
      btn.disabled = false;
    }
  });
}

// ===== DELETE DOC =====
async function deleteDoc(id, name) {
  if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return;
  try {
    await apiFetch(`/documents/${id}`, { method: 'DELETE' });
    allDocs = allDocs.filter(d => d.id !== id);
    updateBadge();
    renderFolders();
    showToast('Document supprimé.', 'info');
  } catch (err) {
    showToast(`Erreur : ${err.message}`, 'error');
  }
}
window.deleteDoc = deleteDoc;

// ===== TOAST =====
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = { success: 'ti-circle-check', error: 'ti-circle-x', info: 'ti-info-circle' }[type] || 'ti-info-circle';
  toast.innerHTML = `<i class="ti ${icon}"></i><span>${esc(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  initNavigation();
  initSidebar();
  initDocsToolbar();
  initViewerModal();
  initLoginModal();
  initDocFormModal();
  renderStars();
  await checkAuth();
  await loadDocuments();
});
