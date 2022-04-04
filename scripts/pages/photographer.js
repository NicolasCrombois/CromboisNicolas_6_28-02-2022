let publications = []
let jsonPublications = {}

//Ensemble des EventListener permettant d'effectuer des actions au clique ou à l'aide du clavier
document.getElementById('popularity').addEventListener("keyup",  event => {if(event.keyCode === 13){setOption('Popularité', 'popularity')}});
document.getElementById('title').addEventListener("keyup", event => {if(event.keyCode === 13){setOption('Titre', 'title')}});
document.getElementById('date').addEventListener("keyup", event => {if(event.keyCode === 13){setOption('Date', 'date')}});


//On récupere l'id et le nom du photographe passé en paramètre de l'URL
const paramsURL = new URLSearchParams(window.location.search);
const idUser = paramsURL.get('id')
const namePhotographer = paramsURL.get('namePhotographer')
const firstname = paramsURL.get('firstname')
const lastname = paramsURL.get('lastname')
const email = paramsURL.get('email')
const message = paramsURL.get('message')


//Permet d'afficher le contenu du formulaire (si au moins un champ a été saisie)
if(email || firstname || lastname || email){
    console.log('Prénom : '+ firstname )
    console.log('Nom : '+ lastname )
    console.log('Email : '+ email )
    console.log('Message : '+ message )
}


//On initialise le titre de la modal de formulaire avec le nom du photographe
const text = document.querySelector('.modal header h2').innerHTML;
document.querySelector('.modal header h2').innerHTML =  `${text} ${namePhotographer}`


//Fonction permettant d'initiliser l'ensemble du projet
async function init() {
  // Récupère les données du photographe en fonction de son id
  const photographer = await getDetailsPhotographer(idUser);
  //On réalise l'affichage de sa bannière
  displayBannerPhotographer(photographer);
  //Initialisation de la barre de filtre
  setDisplayOption('Popularité', 'popularity');
  // Récupère et réalise un tri par défaut sur les données des publications d'un photographe en fonction de son id
  jsonPublications = getDetailsPublications(idUser);
  let totalLike = 0;
  if(jsonPublications!=null){
    listPublication = await getAndDisplayListPublicationAccordingOption('popularity', jsonPublications);
    //On additionne le nombre de like, pour ensuite afficher le nombre total de like à l'endroit prévu à cet effet 
    listPublication.forEach(publication => {
      totalLike += publication.likes;
    })
  }
  //Permet d'afficher la barre d'information statique concernant le prix et le nombre de "J'aime" total
  document.querySelector("body").appendChild(photographerFactory(photographer).getBannerPriceLikePhotographer());
  displayTotalLike(totalLike);
};

init();

//On récupère les données concernant un photographe identifié par son id dans le fichier JSON photographers.json 
async function getDetailsPhotographer(idUser) {
  return fetch("./data/photographers.json")
  .then(response => response.json().then(jsondata => {
    return (jsondata.photographers).filter(x => x.id === parseInt(idUser))[0]
  }))
}

//On récupère l'ensemble des informations des publications d'un photographe identifié par son id
async function getDetailsPublications(idUser){
  return await fetch("./data/photographers.json")
  .then(response => response.json().then(jsondata => {
    return (jsondata.media).filter(x => x.photographerId === parseInt(idUser))
  }))
}

//Fonction permettant de trier l'ensemble des publications réaliser par un photographe en fonction du filtre appliqué
async function getSortedPublications(typeSort, jsonPublications){
  return jsonPublications.then((publications) => {
    if(publications.length == 0){return publications}
    if(typeSort == "popularity"){
      return publications.sort(function (a, b) {return b.likes - a.likes});
    }
    if(typeSort == "title"){
      return publications.sort(function (a, b) {
        if(a.title < b.title) { return -1; }
        if(a.title > b.title) { return 1; }
        return 0;
      });
    }
    if(typeSort == "date"){
      return publications.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
    }
    return publications
  })
}
//Permet l'affichage de la bannière contenant les informations du photographe
async function displayBannerPhotographer( photographer ){
  const banner = document.querySelector('.photograph-header')
  const photographerModel = photographerFactory(photographer);
  banner.appendChild(photographerModel.getUserInformation());
  banner.appendChild(photographerModel.getUserPicture());
} 
//Permet l'affichage d'une publication 
async function displayPublication( publication, id ){
  const publicationBody = document.querySelector('#publication #list_publication');
  var publicationModel = publicationFactory(publication);
  publicationModel = publicationModel.getPublicationCardDOM()
  publicationBody.appendChild(publicationModel);
}
//Permet l'affichage du nombre total de like (utile lorsque l'utilisateur ajoute un like sur une publications)
function displayTotalLike(likes){
  const content = document.getElementById('totalLike');
  content.innerHTML = likes;
  const i = document.createElement( 'i' );
  i.classList.add('fa-solid','fa-heart');
  content.appendChild(i);
}

//Permet d'afficher ou cacher l'ensemble de la dropbox contenant les filtres
function showListOptions(){
  dropbox.classList.toggle('active');
}
let dropbox = document.querySelector('.dropbox');
dropbox.addEventListener("click", function(){
  showListOptions()
})
dropbox.addEventListener("keyup", event => {
  if(event.keyCode === 13){
    showListOptions()
  }
})

//Incrément le nombre de like de la publication concernée (désignée par son 'id')
async function clickLike(id){
  document.querySelector('#pub_'+id+' .fa-heart').classList.add("clicked");
  jsonPublication = jsonPublications.then((publications) => {
    publications.forEach(publication => {
      if(publication.id == id){
        publication.likes += 1
        publicationModel = publicationFactory(publication);
        const parentNode = document.querySelector('#pub_'+id+' .information-publication');
        document.querySelector('#pub_'+id+' .information-publication p').remove()
        parentNode.appendChild(publicationModel.getLikeDOM())
      }
    });
  })
  //incrémentation du nombre total de like
  const likeTotal = document.querySelector("#likeAndPrice #totalLike");
  const contentLikeTotal = likeTotal.innerHTML;
  var startBalise  = contentLikeTotal.search(/</);
  const valueLikeTotal = contentLikeTotal.substr(0, startBalise)
  likeTotal.innerHTML = (parseInt(valueLikeTotal)+1)+' ';
  const iWithoutOnclick = document.createElement( 'i' );
  iWithoutOnclick.classList.add('fa-solid','fa-heart');
  likeTotal.appendChild(iWithoutOnclick);
}

//On récupère la liste de publications en fonction du filtre de tri
//Et on applique les changements sur les élèments du DOM 
async function getAndDisplayListPublicationAccordingOption(idSort, jsonPublications){
  document.getElementById('list_publication').innerHTML = "";
  listPublication = await getSortedPublications(idSort, jsonPublications);
  if(listPublication.length>0){
    listPublication.forEach(publication => {
      displayPublication(publication, publication.id);
    });
  }
  return listPublication;
}

//Permet de gérer l'affichage du filtre choisi par l'utilisateur
function setDisplayOption(text, id){
  document.querySelector('#publication .dropbox .inputBox').value = text;
  let option = document.getElementById(id);
  document.getElementById(id).remove();
  let container = document.querySelector('#publication .dropbox .option')
  container.appendChild(option)
}
//On récupère l'ordre de la liste des publications souhaité par l'utilisateur et afficher le filtre sélectionné  
async function setOption(text, id){
  if(document.querySelector('#publication .dropbox .inputBox').value != text){
    setDisplayOption(text, id);
    listPublication = await getAndDisplayListPublicationAccordingOption(id, jsonPublications);
  }
}
