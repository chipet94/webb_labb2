
/**
 * Sparar nyckel i script istället för localdata då jag inte vill ändra inställningar i chrome. 
 */
var currentKey = "";
var baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=';
var books = [];

class Book{
    constructor(id, title, author, updated){
        this.id = id,
        this.title = title,
        this.author = author,
        this.updated = updated
    }
}
/**
 * Egen klass för meddelanden som ska skickas till servern. 
 * tar en array av argument och ett nummer, nummret används mellan functioner för att kontrollera så man inte paserat 10 försök.
 */
class Message{
    constructor(args, count = 1){
        this.args = args,
        this.count = count
    };
    toUri(){
        var _temp = "";
        this.args.forEach(arg => {
            _temp += arg;
        });
        return _temp;
    }
}
/**
 * 
 * requestData = frågar efter listan med böcker bundet till nyckeln. 
 */
async function requestData(count){
    books = [];
    var op = '&op=select';
    var tes = [baseUrl, currentKey, op];
    var uri = new Message(tes, count)
    request(uri, handleData)
}
/**
 * Function som skickar meddelandet. 
 */
async function request(message, callbk){
    var url = message.toUri();
    fetch(url)
    .then(response => response.json())
    .then(data => {
        return callbk(data, message)
    })
    .catch(error => {
        alert(error)
    })
}

async function addBookRequest(count){
    var op = '&op=insert';
    var title = document.getElementById("book_title").value;
    var author = document.getElementById("book_author").value;
    var op_title = "&title=" ;
    var op_author = "&author=";
    var args = [baseUrl , currentKey ,op , op_title ,title , op_author , author];
    var message = new Message(args, count)
    await request(message, handleAdd)
}

function handleAdd(data, message){
    if(data.status == "success"){
        requestData();
        console.log(message.args[6])
        showBooks();
        alert("Book added after " + message.count + " Tries..");
    }
    if(data.status == "error"){
        if(message.count < 10){
            addBookRequest(message.count +1);
        }
        else{  
            alert("get data request timedout... need to refresh")
            return false;
        }
    }
}

function handleData(data, message) {
    if(data.status == "success"){
        data.data.forEach(e => {
           var a = new Book(e.id, e.title, e.author, e.updated)
           books.push(a)
        });
        showBooks()
        console.log("got it after: " + message.count + " tries...")
    }else if(data.status == "error"){
        if(message.count < 10){
            requestData(message.count +1);
        }
        else{
            alert("get data request timedout...")
        }
    }
}

function clearTable(table){
    while (table.rows.length > 1) {
        table.deleteRow(1);
      }
}

function showBooks(){
    var list = document.getElementById("List");
    clearTable(list);
    if(books.length >= 1){
        books.forEach(book => {
            var row = list.insertRow();
            var title = row.insertCell(0);
            var author = row.insertCell(1);
            var button = row.insertCell(2);
            title.innerHTML = book.title;
            author.innerHTML = book.author;
            button.innerHTML = '<button onclick="RemoveBook('+book.id+')">remove</button>'
        });
    }
    else{
        var row = list.insertRow();
        var title = row.insertCell(0);
        var author = row.insertCell(1);
        var button = row.insertCell(2);
        title.innerHTML = "No";
        author.innerHTML = "Titles";
        button.innerHTML = '<button onclick="">Null</button>'
    }
}

function RemoveBook(id, count){
    var op = '&op=delete';
    var op_id = "&id=";
    var requestUri = baseUrl + currentKey + op+ op_id;
    var args = [baseUrl, currentKey, op, op_id, id]
    var message = new Message(args, count)
    console.log("trying to remove" + id)
    request(message, handleRemove)
}

function handleRemove(data, message){
    var id = message.args[4]; 
    if(data.status == "success"){
        alert("Removed book after " + message.count + " tries");         
        requestData(message.count+1);
    }
    if(data.status == "error"){
        if(message.count< 10){
            RemoveBook(id, message.count + 1);
        }
        else{
            alert("remove request timedout... " + data.message)
        }
    }
}

async function requestNewKey(){
    var args = ["https://www.forverkliga.se/JavaScript/api/crud.php?requestKey"];
    var message = new Message(args)
    await request(message, handleKey);
    await requestData();
}

function handleKey(data){
    currentKey = data.key;
    document.getElementById("result").innerHTML = "Current Key: " + currentKey;
}
