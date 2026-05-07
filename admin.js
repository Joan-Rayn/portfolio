// admin.js - Gestion CRUD avec localStorage

const DATA_KEYS = {
    experiences: 'portfolio_experiences',
    formations: 'portfolio_formations',
    competences: 'portfolio_competences',
    certifications: 'portfolio_certifications',
    projets: 'portfolio_projets',
    langues: 'portfolio_langues'
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
});

// ===== GESTION DES ONGLETS =====
function switchTab(tabName) {
    // Masquer tous les onglets
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Afficher l'onglet sélectionné
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    // Charger les données de l'onglet
    loadAllData();
}

// ===== GESTION DU STOCKAGE =====
function loadData(key) {
    const data = localStorage.getItem(DATA_KEYS[key]);
    return data ? JSON.parse(data) : [];
}

function saveData(key, data) {
    localStorage.setItem(DATA_KEYS[key], JSON.stringify(data));
    showMessage('✅ Données sauvegardées', 'success');
}

function loadAllData() {
    renderExperiences();
    renderFormations();
    renderCompetences();
    renderCertifications();
    renderProjects();
    renderLangues();
}

// ===== EXPÉRIENCES =====
function addExperience() {
    const title = document.getElementById('exp-title').value;
    const company = document.getElementById('exp-company').value;
    const startDate = document.getElementById('exp-start').value;
    const endDate = document.getElementById('exp-end').value;
    const desc = document.getElementById('exp-desc').value;

    if (!title || !company || !startDate || !endDate || !desc) {
        showMessage('⚠️ Veuillez remplir tous les champs', 'error');
        return;
    }

    const experiences = loadData('experiences');
    const newExperience = {
        id: Math.max(...experiences.map(e => e.id || 0), 0) + 1,
        title,
        company,
        startDate,
        endDate,
        description: desc.split('\n').filter(d => d.trim())
    };

    experiences.push(newExperience);
    saveData('experiences', experiences);

    // Réinitialiser le formulaire
    document.getElementById('exp-title').value = '';
    document.getElementById('exp-company').value = '';
    document.getElementById('exp-start').value = '';
    document.getElementById('exp-end').value = '';
    document.getElementById('exp-desc').value = '';

    renderExperiences();
}

function deleteExperience(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette expérience?')) {
        let experiences = loadData('experiences');
        experiences = experiences.filter(e => e.id !== id);
        saveData('experiences', experiences);
        renderExperiences();
    }
}

function renderExperiences() {
    const experiences = loadData('experiences');
    const container = document.getElementById('experiences-list');
    
    if (experiences.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center;">Aucune expérience ajoutée</p>';
        return;
    }

    container.innerHTML = experiences.map(exp => `
        <div class="item">
            <div class="item-content">
                <h3>${exp.title}</h3>
                <p><strong>${exp.company}</strong> | ${exp.startDate} - ${exp.endDate}</p>
                <p>${exp.description.join(' • ')}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger btn-sm" onclick="deleteExperience(${exp.id})">Supprimer</button>
            </div>
        </div>
    `).join('');
}

// ===== FORMATIONS =====
function addFormation() {
    const title = document.getElementById('edu-title').value;
    const school = document.getElementById('edu-school').value;
    const startDate = document.getElementById('edu-start').value;
    const endDate = document.getElementById('edu-end').value;
    const details = document.getElementById('edu-details').value;

    if (!title || !school || !startDate || !endDate) {
        showMessage('⚠️ Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }

    const formations = loadData('formations');
    const newFormation = {
        id: Math.max(...formations.map(f => f.id || 0), 0) + 1,
        title,
        school,
        startDate,
        endDate,
        details
    };

    formations.push(newFormation);
    saveData('formations', formations);

    document.getElementById('edu-title').value = '';
    document.getElementById('edu-school').value = '';
    document.getElementById('edu-start').value = '';
    document.getElementById('edu-end').value = '';
    document.getElementById('edu-details').value = '';

    renderFormations();
}

function deleteFormation(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation?')) {
        let formations = loadData('formations');
        formations = formations.filter(f => f.id !== id);
        saveData('formations', formations);
        renderFormations();
    }
}

function renderFormations() {
    const formations = loadData('formations');
    const container = document.getElementById('formations-list');
    
    if (formations.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center;">Aucune formation ajoutée</p>';
        return;
    }

    container.innerHTML = formations.map(edu => `
        <div class="item">
            <div class="item-content">
                <h3>${edu.title}</h3>
                <p><strong>${edu.school}</strong> | ${edu.startDate} - ${edu.endDate}</p>
                <p>${edu.details}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger btn-sm" onclick="deleteFormation(${edu.id})">Supprimer</button>
            </div>
        </div>
    `).join('');
}

// ===== COMPÉTENCES =====
function addSkill() {
    const category = document.getElementById('skill-category').value;
    const skills = document.getElementById('skill-list').value;

    if (!category || !skills) {
        showMessage('⚠️ Veuillez remplir tous les champs', 'error');
        return;
    }

    const competences = loadData('competences');
    const newSkill = {
        id: Math.max(...competences.map(c => c.id || 0), 0) + 1,
        category,
        skills
    };

    competences.push(newSkill);
    saveData('competences', competences);

    document.getElementById('skill-category').value = '';
    document.getElementById('skill-list').value = '';

    renderCompetences();
}

function deleteSkill(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette compétence?')) {
        let competences = loadData('competences');
        competences = competences.filter(c => c.id !== id);
        saveData('competences', competences);
        renderCompetences();
    }
}

function renderCompetences() {
    const competences = loadData('competences');
    const container = document.getElementById('competences-list');
    
    if (competences.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center;">Aucune compétence ajoutée</p>';
        return;
    }

    container.innerHTML = competences.map(skill => `
        <div class="item">
            <div class="item-content">
                <h3>${skill.category}</h3>
                <p>${skill.skills}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger btn-sm" onclick="deleteSkill(${skill.id})">Supprimer</button>
            </div>
        </div>
    `).join('');
}

// ===== CERTIFICATIONS =====
function addCertification() {
    const title = document.getElementById('cert-title').value;
    const issuer = document.getElementById('cert-issuer').value;
    const date = document.getElementById('cert-date').value;
    const details = document.getElementById('cert-details').value;

    if (!title || !issuer || !date) {
        showMessage('⚠️ Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }

    const certifications = loadData('certifications');
    const newCert = {
        id: Math.max(...certifications.map(c => c.id || 0), 0) + 1,
        title,
        issuer,
        date,
        details
    };

    certifications.push(newCert);
    saveData('certifications', certifications);

    document.getElementById('cert-title').value = '';
    document.getElementById('cert-issuer').value = '';
    document.getElementById('cert-date').value = '';
    document.getElementById('cert-details').value = '';

    renderCertifications();
}

function deleteCertification(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette certification?')) {
        let certifications = loadData('certifications');
        certifications = certifications.filter(c => c.id !== id);
        saveData('certifications', certifications);
        renderCertifications();
    }
}

function renderCertifications() {
    const certifications = loadData('certifications');
    const container = document.getElementById('certifications-list');
    
    if (certifications.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center;">Aucune certification ajoutée</p>';
        return;
    }

    container.innerHTML = certifications.map(cert => `
        <div class="item">
            <div class="item-content">
                <h3>${cert.title}</h3>
                <p><strong>${cert.issuer}</strong> | ${cert.date}</p>
                <p>${cert.details}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger btn-sm" onclick="deleteCertification(${cert.id})">Supprimer</button>
            </div>
        </div>
    `).join('');
}

// ===== PROJETS =====
function addProject() {
    const title = document.getElementById('proj-title').value;
    const tech = document.getElementById('proj-tech').value;
    const desc = document.getElementById('proj-desc').value;
    const link = document.getElementById('proj-link').value;

    if (!title || !tech || !desc) {
        showMessage('⚠️ Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }

    const projets = loadData('projets');
    const newProject = {
        id: Math.max(...projets.map(p => p.id || 0), 0) + 1,
        title,
        technologies: tech,
        description: desc,
        link
    };

    projets.push(newProject);
    saveData('projets', projets);

    document.getElementById('proj-title').value = '';
    document.getElementById('proj-tech').value = '';
    document.getElementById('proj-desc').value = '';
    document.getElementById('proj-link').value = '';

    renderProjects();
}

function deleteProject(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet?')) {
        let projets = loadData('projets');
        projets = projets.filter(p => p.id !== id);
        saveData('projets', projets);
        renderProjects();
    }
}

function renderProjects() {
    const projets = loadData('projets');
    const container = document.getElementById('projets-list');
    
    if (projets.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center;">Aucun projet ajouté</p>';
        return;
    }

    container.innerHTML = projets.map(proj => `
        <div class="item">
            <div class="item-content">
                <h3>${proj.title}</h3>
                <p><strong>Tech:</strong> ${proj.technologies}</p>
                <p>${proj.description}</p>
                ${proj.link ? `<p><a href="${proj.link}" target="_blank" style="color: #667eea;">Voir le projet →</a></p>` : ''}
            </div>
            <div class="item-actions">
                <button class="btn btn-danger btn-sm" onclick="deleteProject(${proj.id})">Supprimer</button>
            </div>
        </div>
    `).join('');
}

// ===== LANGUES =====
function addLanguage() {
    const name = document.getElementById('lang-name').value;
    const level = document.getElementById('lang-level').value;

    if (!name || !level) {
        showMessage('⚠️ Veuillez remplir tous les champs', 'error');
        return;
    }

    const langues = loadData('langues');
    const newLanguage = {
        id: Math.max(...langues.map(l => l.id || 0), 0) + 1,
        language: name,
        level
    };

    langues.push(newLanguage);
    saveData('langues', langues);

    document.getElementById('lang-name').value = '';
    document.getElementById('lang-level').value = '';

    renderLangues();
}

function deleteLanguage(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette langue?')) {
        let langues = loadData('langues');
        langues = langues.filter(l => l.id !== id);
        saveData('langues', langues);
        renderLangues();
    }
}

function renderLangues() {
    const langues = loadData('langues');
    const container = document.getElementById('langues-list');
    
    if (langues.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center;">Aucune langue ajoutée</p>';
        return;
    }

    container.innerHTML = langues.map(lang => `
        <div class="item">
            <div class="item-content">
                <h3>${lang.language}</h3>
                <p>Niveau: <strong>${lang.level}</strong></p>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger btn-sm" onclick="deleteLanguage(${lang.id})">Supprimer</button>
            </div>
        </div>
    `).join('');
}

// ===== IMPORT/EXPORT =====
function exportAllData() {
    const allData = {
        experiences: loadData('experiences'),
        formations: loadData('formations'),
        competences: loadData('competences'),
        certifications: loadData('certifications'),
        projets: loadData('projets'),
        langues: loadData('langues'),
        exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showMessage('✅ Données exportées avec succès', 'success');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.experiences) saveData('experiences', data.experiences);
            if (data.formations) saveData('formations', data.formations);
            if (data.competences) saveData('competences', data.competences);
            if (data.certifications) saveData('certifications', data.certifications);
            if (data.projets) saveData('projets', data.projets);
            if (data.langues) saveData('langues', data.langues);

            showMessage('✅ Données importées avec succès', 'success');
            loadAllData();
        } catch (error) {
            showMessage('❌ Erreur lors de l\'importation: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);

    // Réinitialiser l'input
    event.target.value = '';
}

// ===== MESSAGES =====
function showMessage(message, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    
    setTimeout(() => {
        messageEl.className = 'message';
    }, 3000);
}