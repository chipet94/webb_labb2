/**
 * Uppdatera resultaten ut efter vad du söker efter.  
 * 
 */
function Search() {
    var input, filter, tbl, tr, td, i, text_val
    input = document.getElementById("search_bar");
    filter = input.value.toUpperCase();
    tbl = document.getElementById("List");
    tr = tbl.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        text_val = td.innerText;
        if (text_val.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}
