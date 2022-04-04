//Pour lancer l'affichage du formulaire
document.getElementById('contact_button').addEventListener("keyup", event => {if(event.keyCode === 13){displayModal()}})
document.getElementById('contact_button').addEventListener("mouseup",  displayModal)

//Pour fermer le formulaire 
document.getElementById('contact_modal').addEventListener("keyup", event => {if(event.keyCode === 27){console.log('2');closeModal()}})
document.getElementById('contact_close_button').addEventListener("mouseup",  closeModal)
document.getElementById('contact_close_button').addEventListener("keyup", event => {if(event.keyCode===13){console.log('3'); closeModal()}})

//Pour envoyer le formulaire 
const button_send = document.querySelector('#contact_modal .contact_button')
button_send.addEventListener("keyup", event => {if(event.keyCode === 13){sendForm(idUser, namePhotographer)}})

//Ouvrir la modal
function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "block";
}
//Fermer la modal
function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}
//Fonction exécuter lors de la validation du formulaire
// permettant de formater l'url avec tous les paramètres nécessaires
function sendForm(idUser, namePhotographer) {
    const firstname = document.querySelector("#contact_modal input[name='firstname']").value;
    const lastname = document.querySelector("#contact_modal input[name='lastname']").value;
    const email = document.querySelector("#contact_modal input[name='email']").value;
    const message = document.querySelector("#contact_modal textarea").value;
    window.location.href = 'http://127.0.0.1:5500/photographer.html?id='+idUser+'&namePhotographer='+namePhotographer+'&firstname='+firstname+'&lastname='+lastname+'&email='+email+'&message='+message;
}

