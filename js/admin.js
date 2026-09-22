/**
 * admin.js
 * CRUD local sur les données du portfolio + export/import de data.json.
 * Aucune écriture serveur : les modifications vivent en localStorage
 * jusqu'à export manuel, cohérent avec un site 100% statique (GitHub Pages).
 */

const CLE_LOCALSTORAGE = 'portfolio-data-draft';
let donnees = null;

document.addEventListener('DOMContentLoaded', async () => {
  donnees = chargerBrouillon() || await chargerDonnees();
  rendreTout();
  brancherActionsGlobales();
  sauvegarderBrouillon();
});

/* ----- Persistance locale ----- */
function chargerBrouillon() {
  const brut = localStorage.getItem(CLE_LOCALSTORAGE);
  return brut ? JSON.parse(brut) : null;
}

function sauvegarderBrouillon() {
  localStorage.setItem(CLE_LOCALSTORAGE, JSON.stringify(donnees));
  const statut = document.getElementById('statut-sauvegarde');
  statut.textContent = `Brouillon sauvegardé — ${new Date().toLocaleTimeString('fr-FR')}`;
}

function genererId(prefixe) {
  return `${prefixe}-${Date.now().toString(36)}`;
}

/* ----- Rendu global ----- */
function rendreTout() {
  remplirFormulaireProfil();
  rendreCompetences();
  rendreExperiences();
  rendreFormations();
  rendreLangues();
}

/* ----- Profil ----- */
function remplirFormulaireProfil() {
  const form = document.getElementById('form-profil');
  const p = donnees.profil;
  form.prenom.value = p.prenom;
  form.nom.value = p.nom;
  form.titre.value = p.titre;
  form.resume.value = p.resume;
  form.email.value = p.email;
  form.localisation.value = p.localisation;
  form.github.value = p.github;
  form.telephones.value = p.telephones.join(', ');

  form.addEventListener('input', () => {
    p.prenom = form.prenom.value;
    p.nom = form.nom.value;
    p.titre = form.titre.value;
    p.resume = form.resume.value;
    p.email = form.email.value;
    p.localisation = form.localisation.value;
    p.github = form.github.value;
    p.telephones = form.telephones.value.split(',').map(t => t.trim()).filter(Boolean);
    sauvegarderBrouillon();
  });
}

/* ----- Compétences ----- */
function rendreCompetences() {
  const conteneur = document.getElementById('admin-competences');
  conteneur.innerHTML = donnees.competences.map(cat => `
    <div class="admin-card" data-id="${cat.id}">
      <div class="admin-card-header">
        <input type="text" class="champ-categorie" value="${cat.categorie}" placeholder="Nom de la catégorie">
        <button class="btn btn-danger" data-action="supprimer-competence" data-id="${cat.id}">Supprimer</button>
      </div>
      <div class="liste-items" data-items>
        ${cat.items.map((item, i) => `
          <div class="item-ligne">
            <input type="text" value="${item}" data-index="${i}">
            <button class="btn btn-danger" data-action="supprimer-item-competence" data-id="${cat.id}" data-index="${i}">✕</button>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-outline" data-action="ajouter-item-competence" data-id="${cat.id}">+ item</button>
    </div>
  `).join('');

  conteneur.querySelectorAll('.admin-card').forEach(carte => {
    const id = carte.dataset.id;
    const cat = donnees.competences.find(c => c.id === id);

    carte.querySelector('.champ-categorie').addEventListener('input', e => {
      cat.categorie = e.target.value;
      sauvegarderBrouillon();
    });

    carte.querySelectorAll('[data-items] input').forEach(input => {
      input.addEventListener('input', e => {
        cat.items[Number(e.target.dataset.index)] = e.target.value;
        sauvegarderBrouillon();
      });
    });
  });
}

/* ----- Expériences ----- */
function rendreExperiences() {
  const conteneur = document.getElementById('admin-experiences');
  conteneur.innerHTML = donnees.experiences.map(exp => `
    <div class="admin-card" data-id="${exp.id}">
      <div class="admin-card-header">
        <strong>${exp.poste || 'Nouvelle expérience'}</strong>
        <button class="btn btn-danger" data-action="supprimer-experience" data-id="${exp.id}">Supprimer</button>
      </div>
      <label class="champ">Poste <input type="text" data-champ="poste" value="${exp.poste}"></label>
      <label class="champ">Type <input type="text" data-champ="type" value="${exp.type}"></label>
      <label class="champ">Entreprise <input type="text" data-champ="entreprise" value="${exp.entreprise}"></label>
      <label class="champ">Période <input type="text" data-champ="periode" value="${exp.periode}"></label>
      <label class="champ">Missions (une par ligne)
        <textarea rows="3" data-champ="missions">${exp.missions.join('\n')}</textarea>
      </label>
    </div>
  `).join('');

  conteneur.querySelectorAll('.admin-card').forEach(carte => {
    const exp = donnees.experiences.find(e => e.id === carte.dataset.id);
    carte.querySelectorAll('[data-champ]').forEach(champ => {
      champ.addEventListener('input', () => {
        if (champ.dataset.champ === 'missions') {
          exp.missions = champ.value.split('\n').map(m => m.trim()).filter(Boolean);
        } else {
          exp[champ.dataset.champ] = champ.value;
        }
        sauvegarderBrouillon();
      });
    });
  });
}

/* ----- Formations ----- */
function rendreFormations() {
  const conteneur = document.getElementById('admin-formations');
  conteneur.innerHTML = donnees.formations.map(form => `
    <div class="admin-card" data-id="${form.id}">
      <div class="admin-card-header">
        <strong>${form.diplome || 'Nouvelle formation'}</strong>
        <button class="btn btn-danger" data-action="supprimer-formation" data-id="${form.id}">Supprimer</button>
      </div>
      <label class="champ">Diplôme <input type="text" data-champ="diplome" value="${form.diplome}"></label>
      <label class="champ">Établissement <input type="text" data-champ="etablissement" value="${form.etablissement}"></label>
      <label class="champ">Période <input type="text" data-champ="periode" value="${form.periode}"></label>
    </div>
  `).join('');

  conteneur.querySelectorAll('.admin-card').forEach(carte => {
    const form = donnees.formations.find(f => f.id === carte.dataset.id);
    carte.querySelectorAll('[data-champ]').forEach(champ => {
      champ.addEventListener('input', () => {
        form[champ.dataset.champ] = champ.value;
        sauvegarderBrouillon();
      });
    });
  });
}

/* ----- Langues ----- */
function rendreLangues() {
  const conteneur = document.getElementById('admin-langues');
  conteneur.innerHTML = donnees.langues.map(l => `
    <div class="admin-card" data-id="${l.id}">
      <div class="admin-card-header">
        <button class="btn btn-danger" data-action="supprimer-langue" data-id="${l.id}">Supprimer</button>
      </div>
      <label class="champ">Langue <input type="text" data-champ="langue" value="${l.langue}"></label>
      <label class="champ">Niveau <input type="text" data-champ="niveau" value="${l.niveau}"></label>
    </div>
  `).join('');

  conteneur.querySelectorAll('.admin-card').forEach(carte => {
    const l = donnees.langues.find(x => x.id === carte.dataset.id);
    carte.querySelectorAll('[data-champ]').forEach(champ => {
      champ.addEventListener('input', () => {
        l[champ.dataset.champ] = champ.value;
        sauvegarderBrouillon();
      });
    });
  });
}

/* ----- Actions globales (ajout / suppression / export / import) ----- */
function brancherActionsGlobales() {
  document.body.addEventListener('click', e => {
    const action = e.target.dataset.action;
    if (!action) return;

    const id = e.target.dataset.id;

    switch (action) {
      case 'ajouter-competence':
        donnees.competences.push({ id: genererId('comp'), categorie: '', items: [] });
        rendreCompetences();
        break;
      case 'supprimer-competence':
        donnees.competences = donnees.competences.filter(c => c.id !== id);
        rendreCompetences();
        break;
      case 'ajouter-item-competence':
        donnees.competences.find(c => c.id === id).items.push('');
        rendreCompetences();
        break;
      case 'supprimer-item-competence':
        donnees.competences.find(c => c.id === id).items.splice(Number(e.target.dataset.index), 1);
        rendreCompetences();
        break;
      case 'ajouter-experience':
        donnees.experiences.push({ id: genererId('exp'), poste: '', type: '', entreprise: '', periode: '', missions: [] });
        rendreExperiences();
        break;
      case 'supprimer-experience':
        donnees.experiences = donnees.experiences.filter(x => x.id !== id);
        rendreExperiences();
        break;
      case 'ajouter-formation':
        donnees.formations.push({ id: genererId('form'), diplome: '', etablissement: '', periode: '' });
        rendreFormations();
        break;
      case 'supprimer-formation':
        donnees.formations = donnees.formations.filter(x => x.id !== id);
        rendreFormations();
        break;
      case 'ajouter-langue':
        donnees.langues.push({ id: genererId('lang'), langue: '', niveau: '' });
        rendreLangues();
        break;
      case 'supprimer-langue':
        donnees.langues = donnees.langues.filter(x => x.id !== id);
        rendreLangues();
        break;
      default:
        return;
    }
    sauvegarderBrouillon();
  });

  document.getElementById('btn-exporter').addEventListener('click', exporterDonnees);
  document.getElementById('btn-importer').addEventListener('click', () => {
    document.getElementById('fichier-import').click();
  });
  document.getElementById('fichier-import').addEventListener('change', importerDonnees);
}

function exporterDonnees() {
  const blob = new Blob([JSON.stringify(donnees, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement('a');
  lien.href = url;
  lien.download = 'data.json';
  lien.click();
  URL.revokeObjectURL(url);
}

function importerDonnees(e) {
  const fichier = e.target.files[0];
  if (!fichier) return;
  const lecteur = new FileReader();
  lecteur.onload = () => {
    donnees = JSON.parse(lecteur.result);
    rendreTout();
    sauvegarderBrouillon();
  };
  lecteur.readAsText(fichier);
}