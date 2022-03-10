//On récupere l'id du photographe passé en paramètre de l'URL
const paramsURL = new URLSearchParams(window.location.search);
const idUser = paramsURL.get('id')
const name = paramsURL.get('name')

const text = document.querySelector('.modal header h2').innerHTML;
document.querySelector('.modal header h2').innerHTML =  `${text} ${name}`

async function getDetailsPhotographer(idUser) {
  //On récupère les données du fichier JSON photographers.json 
  return fetch("./data/photographers.json")
  .then(response => {
    return response.json();
  })
  .then((jsondata) => { return (jsondata.photographers).filter(x => x.id === parseInt(idUser))[0] })
}
async function getDetailsPublications(id){
  return fetch("./data/photographers.json")
  .then(response => {
    return response.json();
  })
  .then((jsondata) => {
    return (jsondata.media).filter(x => x.photographerId === parseInt(id))
  })
}

async function displayBannerPhotographer( photographer ){
  const banner = document.querySelector('.photograph-header')
  const photographerModel = photographerFactory(photographer);
  banner.appendChild(photographerModel.getUserInformation());
  banner.appendChild(photographerModel.getUserPicture());
}   
async function displayPublication( publication ){
    const publicationBody = document.querySelector('#publication #list_publication');
    const publicationModel = publicationFactory(publication);
    publicationBody.appendChild(publicationModel.getPublicationCardDOM());
}
async function init() {
  // Récupère les datas du photographe en fonction de son id
  const photographer = await getDetailsPhotographer(idUser);
  displayBannerPhotographer(photographer);
  // Récupère les données des publications d'un photographe en fonction de son id
  const publications = await getDetailsPublications(idUser);
  publications.forEach(pub => {
    displayPublication(pub);
  });
  document.querySelector("body").appendChild(photographerFactory(photographer).getBannerPriceLikePhotographer());
};

init();

let dropbox = document.querySelector('.dropbox');
dropbox.onclick = function(){
  dropbox.classList.toggle('active');
}

function showListOptions(){
  dropbox.classList.toggle('active');
}

function setOption(text, id){
  document.querySelector('#publication .dropbox .inputBox').value = text;
  let option = document.getElementById(id);
  document.getElementById(id).remove();
  let container = document.querySelector('#publication .dropbox .option')
  container.appendChild(option)
}
setOption('Popularité', 'popularity');


