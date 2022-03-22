let publications = []
let jsonPublications = {}
//On récupere l'id du photographe passé en paramètre de l'URL
const paramsURL = new URLSearchParams(window.location.search);
const idUser = paramsURL.get('id')
const name = paramsURL.get('name')

const text = document.querySelector('.modal header h2').innerHTML;
document.querySelector('.modal header h2').innerHTML =  `${text} ${name}`

async function getDetailsPhotographer(idUser, typeSort) {
  //On récupère les données du fichier JSON photographers.json 
  return fetch("./data/photographers.json")
  .then(response => response.json().then(jsondata => {
    return (jsondata.photographers).filter(x => x.id === parseInt(idUser))[0]
  }))
}
async function getDetailsPublications(){
  console.log('Get Detail Publication')

  return await fetch("./data/photographers.json")
  .then(response => response.json().then(jsondata => {
    return (jsondata.media).filter(x => x.photographerId === parseInt(idUser))
  }))
}
async function getSortedPublications(typeSort, jsonPublications){
  console.log('Sort Publication')
  return jsonPublications.then((publications) => {
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
function displayTotalLike(likes){
  const content = document.getElementById('totalLike');
  content.innerHTML = likes;
  const i = document.createElement( 'i' );
  i.classList.add('fa-solid','fa-heart');
  content.appendChild(i);
}


async function init() {
  console.log("init");
  // Récupère les données du photographe en fonction de son id
  const photographer = await getDetailsPhotographer(idUser);
  //On réalise l'affichage de sa bannière
  displayBannerPhotographer(photographer);
  //Initialisation de la barre de filtre
  setDisplayOption('Popularité', 'popularity');
  // Récupère et réalise un tri par défaut sur les données des publications d'un photographe en fonction de son id
  jsonPublications = getDetailsPublications();
  listPublication = await getAndDisplayListPublicationAccordingOption('popularity', jsonPublications);
  //On additionne le nombre de like, pour ensuite afficher le nombre total de like à l'endroit prévu à cet effet 
  let totalLike = 0;
  listPublication.forEach(publication => {
    totalLike += publication.likes;
  });
  document.querySelector("body").appendChild(photographerFactory(photographer).getBannerPriceLikePhotographer());
  displayTotalLike(totalLike)
};

init();

let dropbox = document.querySelector('.dropbox');
dropbox.onclick = function(){
  dropbox.classList.toggle('active');
}

function showListOptions(){
  dropbox.classList.toggle('active');
}
async function clickLike(id){
  console.log('Clicklike')
  document.querySelector('#pub_'+id+' .fa-heart').classList.add("clicked");
  //setTimeout(function(){document.querySelector('#pub_'+id+' .fa-heart').classList.remove("clicked")}, 500);

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

    

  //incrémentation des likes total
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
  console.log('getAndDisplayListPublicationAccordingOption')
  document.getElementById('list_publication').innerHTML = "";
  listPublication = await getSortedPublications(idSort, jsonPublications);
  listPublication.forEach(publication => {
    displayPublication(publication);
  });
  return listPublication;
}

//Affichage les élèments, on fonction du changement de filtre appliqué
function setDisplayOption(text, id){
  console.log('setDisplayOption')
  document.querySelector('#publication .dropbox .inputBox').value = text;
  let option = document.getElementById(id);
  document.getElementById(id).remove();
  let container = document.querySelector('#publication .dropbox .option')
  container.appendChild(option)
}
async function setOption(text, id){
  console.log('setOption');
  if(document.querySelector('#publication .dropbox .inputBox').value != text){
    setDisplayOption(text, id);
    listPublication = await getAndDisplayListPublicationAccordingOption(id, jsonPublications);
  }
}
function openView(id){
  document.getElementById('lightbox').style.display = "block";
  document.querySelector('.view').id = id;
  const publication = listPublication.filter(x => x.id === parseInt(id));
  publicationModel = publicationFactory(publication[0]);
  const container = document.querySelector('#lightbox .view');
  console.log(publicationModel.getImgDOM())
  container.appendChild(publicationModel.getImgDOM());
}

function closeLightbox(){
  document.getElementById('lightbox').style.display = "none";
  document.querySelector('#lightbox .view').innerHTML = '';
  document.querySelector('.view').id = '';
}
function switchNext(){
  id = document.querySelector('.view').id;
  let index = listPublication.indexOf(listPublication.filter(x => x.id === parseInt(id))[0])
  if(index == listPublication.length-1){
    index = -1
  }
  document.querySelector('#lightbox .view').innerHTML = '';
  openView(listPublication[index+1].id);
}
function switchPrevious(){
  id = document.querySelector('.view').id;
  let index = listPublication.indexOf(listPublication.filter(x => x.id === parseInt(id))[0])
  if(index == 0){
    index = listPublication.length
  }
  document.querySelector('#lightbox .view').innerHTML = '';
  openView(listPublication[index-1].id);
}
