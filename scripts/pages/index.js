//On récupère les données du fichier JSON photographers.json (uniquement les photographes)
async function getPhotographers() {
  return fetch("./data/photographers.json")
  .then(response => {
    return response.json();
  })
  .then((jsondata) => { return jsondata.photographers})
}

//Permet d'afficher les cartes de chaque photographe
async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");
  photographers.forEach((photographer) => {
    const photographerModel = photographerFactory(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
};

async function init() {
  const photographers = await getPhotographers();
  displayData(photographers);
};
    
init();
    