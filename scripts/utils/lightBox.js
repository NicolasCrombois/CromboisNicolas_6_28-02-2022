//Ensemble des EventListener permettant d'effectuer des actions au clique ou à l'aide du clavier
document.getElementById('closeModal').addEventListener("keyup", event => {  if(event.keyCode === 13){closeLightbox()}});
document.getElementById('arrow-right').addEventListener("keyup", event => {  if(event.keyCode === 13){switchNext()}});
document.getElementById('arrow-left').addEventListener("keyup", event => {  if(event.keyCode === 13){switchPrevious()}});
document.addEventListener("keyup", event => {checkLightboxKeyboard(event)});

//Permet de vérifier sur quelle touche l'utilisateur appuie, afin de réaliser ou non la navigation
function checkLightboxKeyboard(event){
    if(document.getElementById('lightbox').style.display=='block'){
        //Touches 'D', '6' (pad num.), '►' permettent de faire défiller les publications suivantes
        if(event.keyCode === 68 || event.keyCode === 102 || event.keyCode === 39){
            switchNext()
        }
        //Touches 'Q', '4' (pad num.), '◄' permettent de faire défiller les publications précédentes
        if(event.keyCode === 81 || event.keyCode === 100 || event.keyCode === 37){
            switchPrevious()
        }
        //La touche 'Échap' permet de fermer la lightbox
        if(event.keyCode === 27){
            closeLightbox()
        }
    }
}

  
//Permet d'afficher la publication (désigné par son 'id') dans la lightbox
function openView(id){
    document.getElementById('lightbox').style.display = "block";
    document.querySelector('.view').id = id;
    const publication = listPublication.filter(x => x.id === parseInt(id));
    publicationModel = publicationFactory(publication[0]);
    const container = document.querySelector('#lightbox .view');
    container.innerHTML = ''
    container.appendChild(publicationModel.getImgDOM());
}
//Permet de fermer la lightbox
function closeLightbox(){
    document.getElementById('lightbox').style.display = "none";
    document.querySelector('#lightbox .view').innerHTML = '';
    document.querySelector('.view').id = '';
}
//Permet de passé à la publication suivante (dans la lightbox)
function switchNext(){
    id = document.querySelector('.view').id;
    let index = listPublication.indexOf(listPublication.filter(x => x.id === parseInt(id))[0])
    if(index == listPublication.length-1){
        index = -1
    }
    document.querySelector('#lightbox .view').innerHTML = '';
    openView(listPublication[index+1].id);
}
//Permet de revenir à la publication précédante (dans la lightbox)
function switchPrevious(){
    id = document.querySelector('.view').id;
    let index = listPublication.indexOf(listPublication.filter(x => x.id === parseInt(id))[0])
    if(index == 0){
        index = listPublication.length
    }
    document.querySelector('#lightbox .view').innerHTML = '';
    openView(listPublication[index-1].id);
}