'use strict';

// ===== DOCUMENTS DATA =====
const DOCUMENTS = {
  fiches: {
    label: 'Fiches de Préparation',
    icon: 'fi-fiches',
    tablerIcon: 'ti ti-clipboard-list',
    files: [
      {
        name: 'Fiche_Algo_Boucles.pdf',
        description: 'Séance sur les structures de contrôle — boucles et itérations',
        date: 'Oct. 2024',
        type: 'pdf',
        path: 'docs/fiches/Fiche_Algo_Boucles.pdf'
      },
      {
        name: 'Fiche_Python_Variables.pdf',
        description: 'Introduction aux variables et types de données en Python',
        date: 'Nov. 2024',
        type: 'pdf',
        path: 'docs/fiches/Fiche_Python_Variables.pdf'
      },
      {
        name: 'Fiche_Reseaux_Modele_OSI.pdf',
        description: 'Présentation du modèle OSI et des couches réseau',
        date: 'Jan. 2025',
        type: 'pdf',
        path: 'docs/fiches/Fiche_Reseaux_Modele_OSI.pdf'
      },
      {
        name: 'Fiche_BDD_Introduction.pdf',
        description: 'Introduction aux bases de données relationnelles et SQL',
        date: 'Mars 2025',
        type: 'pdf',
        path: 'docs/fiches/Fiche_BDD_Introduction.pdf'
      }
    ]
  },
  grilles: {
    label: 'Grilles d\'Observation',
    icon: 'fi-grilles',
    tablerIcon: 'ti ti-eye',
    files: [
      {
        name: 'Grille_Obs_Seance1.jpg',
        description: 'Grille d\'observation de la première séance encadrée',
        date: 'Oct. 2024',
        type: 'img',
        path: 'docs/grilles/Grille_Obs_Seance1.jpg'
      },
      {
        name: 'Grille_Evaluation_Competences.pdf',
        description: 'Grille d\'évaluation par compétences pour les élèves',
        date: 'Déc. 2024',
        type: 'pdf',
        path: 'docs/grilles/Grille_Evaluation_Competences.pdf'
      },
      {
        name: 'Grille_Autoeval_Formateur.pdf',
        description: 'Grille d\'autoévaluation remplie avec le formateur',
        date: 'Fév. 2025',
        type: 'pdf',
        path: 'docs/grilles/Grille_Autoeval_Formateur.pdf'
      }
    ]
  },
  supports: {
    label: 'Supports de Cours',
    icon: 'fi-supports',
    tablerIcon: 'ti ti-presentation',
    files: [
      {
        name: 'Cours_Python_Intro.pptx',
        description: 'Présentation d\'introduction à Python avec exemples interactifs',
        date: 'Nov. 2024',
        type: 'ppt',
        path: 'docs/supports/Cours_Python_Intro.pptx'
      },
      {
        name: 'Support_Reseaux_TCP_IP.pdf',
        description: 'Document de cours complet sur le protocole TCP/IP',
        date: 'Jan. 2025',
        type: 'pdf',
        path: 'docs/supports/Support_Reseaux_TCP_IP.pdf'
      },
      {
        name: 'Support_BDD_SQL.pdf',
        description: 'Guide pratique SQL avec exercices corrigés',
        date: 'Mars 2025',
        type: 'pdf',
        path: 'docs/supports/Support_BDD_SQL.pdf'
      }
    ]
  },
  pff: {
    label: 'Projet de Fin de Formation',
    icon: 'fi-pff',
    tablerIcon: 'ti ti-file-text',
    files: [
      {
        name: 'PFF_Salma_TICE_Enseignement.pdf',
        description: 'Mémoire complet — L\'apport des TICE dans l\'enseignement de l\'informatique au secondaire qualifiant',
        date: 'Mai 2025',
        type: 'pdf',
        path: 'docs/pff/PFF_Salma_TICE_Enseignement.pdf'
      }
    ]
  },
  productions: {
    label: 'Autres Productions',
    icon: 'fi-productions',
    tablerIcon: 'ti ti-sparkles',
    files: [
      {
        name: 'Quiz_Kahoot_Algorithmique.pdf',
        description: 'Export du quiz Kahoot utilisé pour la révision en classe',
        date: 'Déc. 2024',
        type: 'pdf',
        path: 'docs/productions/Quiz_Kahoot_Algorithmique.pdf'
      },
      {
        name: 'Enonce_Projet_Calculatrice.pdf',
        description: 'Énoncé du mini-projet collaboratif sur Replit',
        date: 'Fév. 2025',
        type: 'pdf',
        path: 'docs/productions/Enonce_Projet_Calculatrice.pdf'
      }
    ]
  }
};

// ===== HELPERS =====
function totalDocs() {
  return Object.values(DOCUMENTS).reduce((sum, cat) => sum + cat.files.length, 0);
}

function typeBadge(type) {
  const map = {
    pdf: ['badge-pdf', 'PDF'],
    doc: ['badge-doc', 'DOC'],
    ppt: ['badge-ppt', 'PPT'],
    img: ['badge-img', 'IMG']
  };
  const [cls, label] = map[type] || ['badge-other', type.toUpperCase()];
  return `<span class="doc-type-badge ${cls}">${label}</span>`;
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
      // Animate skill bars and KPI counters when visible
      if (sectionId === 'cv') animateSkillBars();
      if (['accueil', 'rapport'].includes(sectionId)) animateKPIs(target);
    }
    if (navItem) navItem.classList.add('active');
  }

  navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const sectionId = item.getAttribute('data-section');
      showSection(sectionId);
      if (window.innerWidth <= 768) closeMobileSidebar();
    });
  });

  // Nav triggers (buttons/links inside sections)
  document.addEventListener('click', e => {
    const trigger = e.target.closest('.nav-trigger');
    if (trigger) {
      e.preventDefault();
      const target = trigger.getAttribute('data-target');
      showSection(target);
    }
  });

  // Init first section
  showSection('accueil');
  animateKPIs(document.getElementById('accueil'));
}

// ===== SKILL BARS =====
function animateSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  fills.forEach(fill => {
    const width = fill.getAttribute('data-width');
    // Reset then animate
    fill.style.width = '0';
    setTimeout(() => {
      fill.style.width = width + '%';
    }, 100);
  });
}

// ===== KPI COUNTER =====
function animateKPIs(container) {
  const kpiValues = container.querySelectorAll('.kpi-value[data-count]');
  kpiValues.forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    let current = 0;
    el.textContent = '0';
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(interval);
    }, 30);
  });
}

// ===== STARS RENDERING =====
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

// ===== SIDEBAR TOGGLE =====
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

  function closeMobileSidebar() {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
  }

  window.closeMobileSidebar = closeMobileSidebar;
}

// ===== DOCUMENTS SECTION =====
function initDocuments() {
  const total = totalDocs();
  document.getElementById('nav-badge-count').textContent = total;

  renderFolders('all');

  // Filter pills
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.getAttribute('data-filter');
      renderFolders(filter);
    });
  });

  // Search
  document.getElementById('docSearch').addEventListener('input', e => {
    const query = e.target.value.toLowerCase().trim();
    filterDocsBySearch(query);
  });
}

function renderFolders(filter) {
  const grid = document.getElementById('foldersGrid');
  grid.innerHTML = '';

  const cats = filter === 'all' ? Object.keys(DOCUMENTS) : [filter].filter(k => DOCUMENTS[k]);

  cats.forEach(catKey => {
    const cat = DOCUMENTS[catKey];
    const block = document.createElement('div');
    block.className = 'folder-block';
    block.setAttribute('data-cat', catKey);

    block.innerHTML = `
      <div class="folder-header">
        <div class="folder-icon ${cat.icon}"><i class="${cat.tablerIcon}"></i></div>
        <span class="folder-title">${cat.label}</span>
        <span class="folder-count">${cat.files.length} fichier${cat.files.length > 1 ? 's' : ''}</span>
        <i class="ti ti-chevron-down folder-chevron"></i>
      </div>
      <div class="folder-body">
        <ul class="doc-list">
          ${cat.files.map((file, idx) => renderDocItem(file, idx, catKey)).join('')}
        </ul>
      </div>
    `;

    // Toggle open/close
    block.querySelector('.folder-header').addEventListener('click', () => {
      block.classList.toggle('open');
    });

    // Open by default if single filter
    if (filter !== 'all') block.classList.add('open');

    grid.appendChild(block);
  });
}

function renderDocItem(file, idx, catKey) {
  return `
    <li class="doc-item" data-name="${file.name.toLowerCase()}" data-cat="${catKey}">
      ${typeBadge(file.type)}
      <div class="doc-info">
        <div class="doc-name">${file.name}</div>
        <div class="doc-desc">${file.description}</div>
      </div>
      <span class="doc-date">${file.date}</span>
      <div class="doc-actions">
        <button class="btn-doc btn-view" onclick="openDocModal('${escStr(file.path)}','${escStr(file.name)}','${file.type}')">
          <i class="ti ti-eye"></i> Visualiser
        </button>
        <button class="btn-doc btn-download" onclick="downloadDoc('${escStr(file.path)}','${escStr(file.name)}')">
          <i class="ti ti-download"></i> Télécharger
        </button>
      </div>
    </li>
  `;
}

function escStr(s) {
  return s.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function filterDocsBySearch(query) {
  document.querySelectorAll('.doc-item').forEach(item => {
    const name = item.getAttribute('data-name') || '';
    item.classList.toggle('hidden', query !== '' && !name.includes(query));
  });

  // Open all folders when searching
  if (query) {
    document.querySelectorAll('.folder-block').forEach(b => b.classList.add('open'));
  }
}

// ===== MODAL =====
function openDocModal(path, name, type) {
  const overlay = document.getElementById('modalOverlay');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  title.textContent = name;

  // Check if file is a placeholder (doesn't physically exist)
  // We always show the "prochainement" UI since files are placeholders
  if (type === 'pdf') {
    body.innerHTML = `
      <div class="modal-placeholder">
        <i class="ti ti-file-text"></i>
        <h4>Document bientôt disponible</h4>
        <p>Ce document sera publié prochainement.<br>
           Vous pourrez le visualiser et le télécharger dès sa mise en ligne.</p>
      </div>
    `;
  } else if (type === 'img') {
    body.innerHTML = `
      <div class="modal-placeholder">
        <i class="ti ti-photo"></i>
        <h4>Image bientôt disponible</h4>
        <p>Ce document sera publié prochainement.</p>
      </div>
    `;
  } else if (type === 'ppt' || type === 'doc') {
    body.innerHTML = `
      <div class="modal-placeholder">
        <i class="ti ti-download"></i>
        <h4>Visualisation non disponible</h4>
        <p>Ce format nécessite un téléchargement pour être ouvert.<br>
           Utilisez le bouton <strong>Télécharger</strong> ci-dessous.</p>
      </div>
    `;
  }

  overlay.classList.add('open');
}

function downloadDoc(path, name) {
  const link = document.createElement('a');
  link.href = path;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('modalBody').innerHTML = '';
}

// Expose to inline handlers
window.openDocModal = openDocModal;
window.downloadDoc = downloadDoc;

// ===== CONTACT FORM =====
function handleFormSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  form.classList.add('hidden');
  success.classList.remove('hidden');
}

window.handleFormSubmit = handleFormSubmit;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSidebar();
  initDocuments();
  initModal();
  renderStars();
});
