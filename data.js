// data.js - Gestion du chargement et affichage des données

// Clés de stockage
const STORAGE_KEYS = {
    experiences: 'portfolio_experiences',
    formations: 'portfolio_formations',
    competences: 'portfolio_competences',
    certifications: 'portfolio_certifications',
    projets: 'portfolio_projets',
    langues: 'portfolio_langues'
};

// Charger les données depuis localStorage ou fichiers JSON
async function loadPortfolioData() {
    const data = {
        experiences: await loadData('experiences'),
        formations: await loadData('formations'),
        competences: await loadData('competences'),
        certifications: await loadData('certifications'),
        projets: await loadData('projets'),
        langues: await loadData('langues')
    };
    return data;
}

async function loadData(type) {
    // D'abord, vérifier si les données sont dans localStorage
    const stored = localStorage.getItem(STORAGE_KEYS[type]);
    if (stored) {
        return JSON.parse(stored);
    }

    // Sinon, charger depuis le fichier JSON
    try {
        const response = await fetch(`./data/${type}.json`);
        if (response.ok) {
            const data = await response.json();
            // Sauvegarder dans localStorage pour la prochaine fois
            localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(data));
            return data;
        }
    } catch (error) {
        console.warn(`Impossible de charger ${type}.json:`, error);
    }

    return [];
}

// Afficher les expériences
function displayExperiences(experiences) {
    const container = document.getElementById('experiences');
    if (!container || experiences.length === 0) return;

    const experiencesList = container.querySelector('.experiences-list') || container;
    
    // Supprimer les anciens éléments (excepté le titre et les boutons)
    const items = experiencesList.querySelectorAll('.experience-item');
    items.forEach(item => item.remove());

    // Ajouter les nouvelles expériences
    const section = container.closest('section') || container;
    experiences.forEach((exp, index) => {
        const item = document.createElement('div');
        item.className = 'experience-item';
        item.innerHTML = `
            <h3 class="editable" id="exp${index}-title">${exp.title}</h3>
            <p class="editable" id="exp${index}-company"><strong>${exp.company}</strong> | ${exp.startDate} – ${exp.endDate}</p>
            <ul>
                ${exp.description.map((desc, i) => `<li class="editable" id="exp${index}-desc${i}">${desc}</li>`).join('')}
            </ul>
        `;
        section.appendChild(item);
    });
}

// Afficher les formations
function displayFormations(formations) {
    const container = document.getElementById('formation');
    if (!container || formations.length === 0) return;

    const section = container.closest('section') || container;
    
    // Supprimer les anciens éléments
    const items = section.querySelectorAll('.education-item');
    items.forEach(item => item.remove());

    // Ajouter les nouvelles formations
    formations.forEach((edu, index) => {
        const item = document.createElement('div');
        item.className = 'education-item';
        item.innerHTML = `
            <h3 class="editable" id="edu${index}-title">${edu.title}</h3>
            <p class="editable" id="edu${index}-school">${edu.school} | ${edu.startDate} – ${edu.endDate}</p>
            ${edu.details ? `<p class="editable" id="edu${index}-details">${edu.details}</p>` : ''}
        `;
        section.appendChild(item);
    });
}

// Afficher les compétences
function displaySkills(competences) {
    const container = document.querySelector('.skills-list');
    if (!container || competences.length === 0) return;

    // Supprimer les anciennes catégories
    container.querySelectorAll('.skill-category').forEach(cat => cat.remove());

    // Ajouter les nouvelles compétences
    competences.forEach((skill, index) => {
        const category = document.createElement('div');
        category.className = 'skill-category';
        category.innerHTML = `
            <h3 class="editable" id="skill${index}-category">${skill.category}</h3>
            <p class="editable" id="skill${index}-skills">${skill.skills}</p>
        `;
        container.appendChild(category);
    });
}

// Afficher les certifications
function displayCertifications(certifications) {
    const section = document.querySelector('section:has(h2:contains("Certifications"))');
    if (!section || certifications.length === 0) return;

    // Supprimer les anciens éléments
    section.querySelectorAll('.certification-item').forEach(item => item.remove());

    // Ajouter les nouvelles certifications
    certifications.forEach((cert, index) => {
        const item = document.createElement('div');
        item.className = 'certification-item experience-item';
        item.innerHTML = `
            <h3 class="editable" id="cert${index}-title">${cert.title}</h3>
            <p class="editable" id="cert${index}-issuer"><strong>${cert.issuer}</strong> | ${cert.date}</p>
            ${cert.details ? `<p class="editable" id="cert${index}-details">${cert.details}</p>` : ''}
        `;
        section.appendChild(item);
    });
}

// Afficher les projets
function displayProjects(projets) {
    const section = document.querySelector('section:has(h2:contains("Projets"))');
    if (!section || projets.length === 0) return;

    // Supprimer les anciens projets
    section.querySelectorAll('.project-item').forEach(item => item.remove());

    // Ajouter les nouveaux projets
    projets.forEach((proj, index) => {
        const item = document.createElement('div');
        item.className = 'project-item experience-item';
        item.innerHTML = `
            <h3 class="editable" id="proj${index}-title">${proj.title}</h3>
            <p class="editable" id="proj${index}-tech"><strong>Technologies:</strong> ${proj.technologies}</p>
            <p class="editable" id="proj${index}-desc">${proj.description}</p>
            ${proj.link ? `<p><a href="${proj.link}" target="_blank" style="color: #007bff;">Voir le projet →</a></p>` : ''}
        `;
        section.appendChild(item);
    });
}

// Afficher les langues
function displayLanguages(langues) {
    const section = document.querySelector('#competences');
    if (!section || langues.length === 0) return;

    const languagesList = section.querySelector('ul');
    if (!languagesList) return;

    // Supprimer les anciennes langues
    languagesList.querySelectorAll('li').forEach(li => li.remove());

    // Ajouter les nouvelles langues
    langues.forEach((lang, index) => {
        const li = document.createElement('li');
        li.className = 'editable';
        li.id = `lang${index}`;
        li.textContent = `${lang.language} : ${lang.level}`;
        languagesList.appendChild(li);
    });
}

// Initialiser le portfolio
async function initializePortfolio() {
    const data = await loadPortfolioData();
    
    displayExperiences(data.experiences);
    displayFormations(data.formations);
    displaySkills(data.competences);
    displayCertifications(data.certifications);
    displayProjects(data.projets);
    displayLanguages(data.langues);

    // Réappliquer les styles éditables si en mode édition
    if (window.editMode) {
        document.querySelectorAll('.editable').forEach(el => {
            el.contentEditable = 'true';
            el.style.border = '1px dashed #007bff';
            el.style.padding = '5px';
        });
    }
}

// Charger au démarrage
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que les autres scripts se chargent
    setTimeout(() => {
        initializePortfolio();
    }, 100);
});