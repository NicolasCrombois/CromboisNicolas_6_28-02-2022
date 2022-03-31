let publications = []
let jsonPublications = {}

//On récupere l'id et le nom du photographe passé en paramètre de l'URL
const paramsURL = new URLSearchParams(window.location.search);
const idUser = paramsURL.get('id')
const name = paramsURL.get('name')

//On initialiser le titre de la modal de formulaire avec le nom du photographe
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
  return await fetch("./data/photographers.json")
  .then(response => response.json().then(jsondata => {
    return (jsondata.media).filter(x => x.photographerId === parseInt(idUser))
  }))
}

//Fonction permettant de trier le fichier JSON en fonction du filtre a appliquer
async function getSortedPublications(typeSort, jsonPublications){
  if(!jsonPublications.length>0 ){
    return jsonPublications
  }
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
async function displayPublication( publication, id ){
    const publicationBody = document.querySelector('#publication #list_publication');
    var publicationModel = publicationFactory(publication);
    publicationModel = publicationModel.getPublicationCardDOM()
    publicationBody.appendChild(publicationModel);
}
function displayTotalLike(likes){
  const content = document.getElementById('totalLike');
  content.innerHTML = likes;
  const i = document.createElement( 'i' );
  i.classList.add('fa-solid','fa-heart');
  content.appendChild(i);
}


async function init() {
  // Récupère les données du photographe en fonction de son id
  const photographer = await getDetailsPhotographer(idUser);
  //On réalise l'affichage de sa bannière
  displayBannerPhotographer(photographer);
  //Initialisation de la barre de filtre
  setDisplayOption('Popularité', 'popularity');
  // Récupère et réalise un tri par défaut sur les données des publications d'un photographe en fonction de son id
  jsonPublications = getDetailsPublications();
  let totalLike = 0;
  if(jsonPublications!=null){
    listPublication = await getAndDisplayListPublicationAccordingOption('popularity', jsonPublications);
    //On additionne le nombre de like, pour ensuite afficher le nombre total de like à l'endroit prévu à cet effet 
    listPublication.forEach(publication => {
      totalLike += publication.likes;
    })
  }
  document.querySelector("body").appendChild(photographerFactory(photographer).getBannerPriceLikePhotographer());
  displayTotalLike(totalLike);
  closeLightbox();
};


init();



//Ensemble de fonction permettant de réaliser les diffèrentes actions (Clique et navigation clavier)
let dropbox = document.querySelector('.dropbox');
dropbox.addEventListener("click", function(){
  dropbox.classList.toggle('active');
})
dropbox.addEventListener("keyup", event => {
  if(event.keyCode === 13){
  dropbox.classList.toggle('active');
  }
})

function checkKeyUpEnterForFilter(event, text, id){
  if(event.keyCode === 13){
    setOption(text, id)
  }
}
function checkKeyUpEnterForCloseLightbox(event){
  if(event.keyCode === 13){
    closeLightbox()
  }
}
function checkKeyUpEnterForNext(event){
  if(event.keyCode === 13){
    switchNext()
  }
}
function checkNextPublicationLightbox(event){
  if(event.keyCode === 13){
    switchPrevious()
  }
}
function checkSwitchPublicationKeyboard(event){
  if(document.getElementById('lightbox').style.display=='block'){
    if(event.keyCode === 68 || event.keyCode === 102 || event.keyCode === 39){
      switchNext()
    }
    if(event.keyCode === 81 || event.keyCode === 100 || event.keyCode === 37){
      switchPrevious()
    }
    if(event.keyCode === 27){
      closeLightbox()
    }
  }
}
function checkKeyEnterOpenView(event, id){
  if(event.keyCode === 13){
    openView(id)
  }
}
document.getElementById('popularity').addEventListener("keyup",  event => {checkKeyUpEnterForFilter(event, 'Popularité', 'popularity')});
document.getElementById('popularity').addEventListener("click",  setOption('Popularité', 'popularity'));
document.getElementById('title').addEventListener("keyup", event => {checkKeyUpEnterForFilter(event, 'Titre', 'title')});
document.getElementById('title').addEventListener("click", setOption('Titre', 'title'));
document.getElementById('date').addEventListener("keyup", event => {checkKeyUpEnterForFilter(event, 'Date', 'date')});
document.getElementById('date').addEventListener("click", setOption('Date', 'date'));
document.getElementById('closeModal').addEventListener("keyup", event => {checkKeyUpEnterForCloseLightbox(event)});
document.getElementById('closeModal').addEventListener("click",  closeLightbox);
document.getElementById('arrow-right').addEventListener("keyup", event => {checkKeyUpEnterForNext(event)});
document.getElementById('arrow-right').addEventListener("click",  switchNext);
document.getElementById('arrow-left').addEventListener("keyup", event => {checkKeyUpEnterForPrevious(event)});
document.getElementById('arrow-left').addEventListener("click",  switchPrevious);
document.addEventListener("keyup", event => {checkSwitchPublicationKeyboard(event)});



function showListOptions(){
  dropbox.classList.toggle('active');
}
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
  document.getElementById('list_publication').innerHTML = "";
  listPublication = await getSortedPublications(idSort, jsonPublications);
  if(listPublication.length>0){
    listPublication.forEach(publication => {
      displayPublication(publication, publication.id);
    });
  }
  return listPublication;
}

//Permet de gérer l'affichage deu bon filtre choisi
function setDisplayOption(text, id){
  document.querySelector('#publication .dropbox .inputBox').value = text;
  let option = document.getElementById(id);
  document.getElementById(id).remove();
  let container = document.querySelector('#publication .dropbox .option')
  container.appendChild(option)
}

//On récupère l'ordre de la liste des publications souhaité par l'utilisateur 
async function setOption(text, id){
  if(document.querySelector('#publication .dropbox .inputBox').value != text){
    setDisplayOption(text, id);
    listPublication = await getAndDisplayListPublicationAccordingOption(id, jsonPublications);
  }
}
function openView(id){
  console.log('view')
  document.getElementById('lightbox').style.display = "block";
  document.querySelector('.view').id = id;
  const publication = listPublication.filter(x => x.id === parseInt(id));
  publicationModel = publicationFactory(publication[0]);
  const container = document.querySelector('#lightbox .view');
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
