/**
 * Simpel function för att visa eller gömma läggtill rutan... 
 * 
 */
var addForm = document.getElementById("formContainer");
function showAddForm(){
    if(addForm.style.display === "none"){
        addForm.style.display = "block";
    }
    else{
        addForm.style.display = "none";
    }
}