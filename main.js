/* 1. VARIABLES GLOBALES */
let data = []; // On prépare une liste vide qui recevra les données du JSON

const navButtons = document.querySelectorAll('.nav-btn');
const cards = document.querySelectorAll('.activity-card');

// Dictionnaire pour le texte de la période précédente
const timeframeMsg = {
  daily: 'Yesterday',
  weekly: 'Last Week',
  monthly: 'Last Month'
};

/* 2. RÉCUPÉRATION DES DONNÉES (FETCH) */
// C'est ici qu'on va lire le fichier externe data.json
fetch('./data.json')
  .then(response => {
    // On vérifie si la connexion s'est bien passée
    if (!response.ok) {
      console.log('Erreur de chargement du JSON');
      return; 
    }
    return response.json(); // On convertit la réponse en objet JS utilisable
  })
  .then(jsonData => {
    // Une fois les données reçues :
    data = jsonData; // 1. On remplit notre variable globale 'data'
    
    // 2. On initialise l'affichage (par défaut sur Weekly comme sur la maquette)
    updateCards('weekly'); 
  })
  .catch(error => console.log('Erreur :', error));


/* 3. FONCTION DE MISE À JOUR (Identique à avant) */
function updateCards(timeframe) {
  cards.forEach(card => {
    // On récupère le type d'activité (Work, Play...) depuis le HTML
    const titleElement = card.querySelector('h2');
    const activityTitle = titleElement.innerText;

    // On cherche les chiffres correspondants dans les données chargées
    const activityData = data.find(item => item.title === activityTitle);

    if (activityData) {
      const currentHoursEl = card.querySelector('.current-hours');
      const previousPeriodEl = card.querySelector('.previous-period');
      
      const timeframeData = activityData.timeframes[timeframe];

      // Mise à jour du texte dans le DOM
      currentHoursEl.innerText = `${timeframeData.current}hrs`;
      previousPeriodEl.innerText = `${timeframeMsg[timeframe]} - ${timeframeData.previous}hrs`;
    }
  });
}

/* 4. GESTION DES CLICS (Identique à avant) */
navButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    navButtons.forEach(btn => btn.classList.remove('nav-btn--active'));
    e.target.classList.add('nav-btn--active');

    const clickedTimeframe = e.target.dataset.timeframe;
    
    // On ne lance la mise à jour que si les données sont bien arrivées
    if (data.length > 0) {
      updateCards(clickedTimeframe);
    }
  });
});