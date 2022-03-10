async function getPhotographers() {
  //On récupère les données du fichier JSON photographers.json 
  return fetch("./data/photographers.json")
  .then(response => {
    return response.json();
  })
  .then((jsondata) => { return jsondata.photographers})
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");
  photographers.forEach((photographer) => {
    const photographerModel = photographerFactory(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
};

async function init() {
  // Récupère les datas des photographes
  const photographers = await getPhotographers();
  displayData(photographers);
};
    
init();
    