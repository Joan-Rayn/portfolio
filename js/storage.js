/**
 * storage.js
 * Couche d'accès à data.json.
 * En lecture seule ici : admin.js ajoutera la logique d'édition/export.
 */

const DATA_PATH = 'data.json';

/**
 * Charge data.json et retourne l'objet parsé.
 * @returns {Promise<Object>}
 */
async function chargerDonnees() {
  const reponse = await fetch(DATA_PATH, { cache: 'no-store' });
  if (!reponse.ok) {
    throw new Error(`Impossible de charger ${DATA_PATH} (statut ${reponse.status})`);
  }
  return reponse.json();
}