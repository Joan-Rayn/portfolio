/**
 * main.js
 * Rendu dynamique de la partie publique (index.html) à partir de data.json.
 */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const donnees = await chargerDonnees();
    afficherProfil(donnees.profil);
    afficherCompetences(donnees.competences);
    afficherExperiences(donnees.experiences);
    afficherFormations(donnees.formations);
    afficherLangues(donnees.langues);
    afficherContact(donnees.profil);
  } catch (erreur) {
    console.error(erreur);
    document.querySelector('main').innerHTML =
      '<p class="erreur-chargement">Le contenu n\'a pas pu être chargé. Réessayez plus tard.</p>';
  }

  document.getElementById('annee-courante').textContent = new Date().getFullYear();
  initMenuMobile();
  initAccesAdmin();
});

/* ----- Profil ----- */
function afficherProfil(profil) {
  document.getElementById('profil-nom').textContent = `${profil.prenom} ${profil.nom}`;
  document.getElementById('profil-titre').textContent = profil.titre;
  document.getElementById('profil-resume').textContent = profil.resume;
  document.getElementById('profil-localisation').textContent = profil.localisation;

  const lienGithub = document.getElementById('profil-github');
  lienGithub.href = profil.github;
}

/* ----- Compétences ----- */
function afficherCompetences(competences) {
  const conteneur = document.getElementById('competences-list');
  conteneur.innerHTML = competences.map(cat => `
    <div class="competence-card">
      <h3>${cat.categorie}</h3>
      <ul>${cat.items.map(item => `<li>${item}</li>`).join('')}</ul>
    </div>
  `).join('');
}

/* ----- Expériences ----- */
function afficherExperiences(experiences) {
  const conteneur = document.getElementById('experiences-list');
  conteneur.innerHTML = experiences.map(exp => `
    <div class="timeline-item">
      <span class="periode">${exp.periode}</span>
      <h3>${exp.poste}${exp.type ? ` — ${exp.type}` : ''}</h3>
      ${exp.entreprise ? `<p class="entreprise">${exp.entreprise}</p>` : ''}
      <ul>${exp.missions.map(m => `<li>${m}</li>`).join('')}</ul>
    </div>
  `).join('');
}

/* ----- Formations ----- */
function afficherFormations(formations) {
  const conteneur = document.getElementById('formations-list');
  conteneur.innerHTML = formations.map(form => `
    <div class="timeline-item">
      <span class="periode">${form.periode}</span>
      <h3>${form.diplome}</h3>
      <p class="entreprise">${form.etablissement}</p>
    </div>
  `).join('');
}

/* ----- Langues ----- */
function afficherLangues(langues) {
  const conteneur = document.getElementById('langues-list');
  conteneur.innerHTML = langues.map(l => `
    <li><strong>${l.langue}</strong> — ${l.niveau}</li>
  `).join('');
}

/* ----- Contact ----- */
function afficherContact(profil) {
  const conteneur = document.getElementById('contact-list');
  const telephones = profil.telephones.map(tel =>
    `<li><strong>Téléphone</strong> — <a href="tel:${tel.replace(/\s/g, '')}">${tel}</a></li>`
  ).join('');

  conteneur.innerHTML = `
    <li><strong>Email</strong> — <a href="mailto:${profil.email}">${profil.email}</a></li>
    ${telephones}
  `;
}

/* ----- Menu mobile ----- */
function initMenuMobile() {
  const bouton = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  bouton.addEventListener('click', () => {
    const estOuvert = nav.classList.toggle('is-open');
    bouton.setAttribute('aria-expanded', estOuvert);
  });

  // Ferme le menu après clic sur un lien (mobile)
  nav.querySelectorAll('a').forEach(lien => {
    lien.addEventListener('click', () => nav.classList.remove('is-open'));
  });
}

/* ----- Accès admin caché ----- */
function initAccesAdmin() {
  const zone = document.getElementById('admin-access');
  zone.addEventListener('click', () => {
    window.location.href = 'admin.html';
  });
}

function initAccesAdmin() {
  const zone = document.getElementById('admin-access');
  const aller = () => window.location.href = 'admin.html';

  zone.addEventListener('click', aller);
  zone.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      aller();
    }
  });
}