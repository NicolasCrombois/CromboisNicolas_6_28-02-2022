document.getElementById('contact_button').addEventListener("keyup", event => {checkKeyUpForOpenModal(event)})
document.getElementById('contact_button').addEventListener("click",  displayModal)

document.getElementById('contact_close_button').addEventListener("keyup", event => {checkKeyUpForCloseModal(event)})
document.getElementById('contact_close_button').addEventListener("click",  closeModal)



function checkKeyUpForOpenModal(event){
    if(event.keyCode === 13){
        displayModal()
    }
}
function checkKeyUpForCloseModal(event){
    if(event.keyCode === 13){
        closeModal()
    }
}
function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}
