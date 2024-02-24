const cardCon = document.querySelector("#card-container");
var arr = JSON.parse(localStorage.getItem("favourites"));
// console.log(arr);

const[timestamp,apiKey,hashValue] = [ts,publicKey,hashVal];

//fetching data of favourite super heroes.
async function fetchD(val){
    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&name=${val}`;
    const response = await fetch(url);
    try{
            if(!response.ok)
                throw err;
        }
    catch(err){
            console.log(err);
        }
    const jsonData = await response.json();
    // console.log(jsonData.data.results);
    return jsonData.data.results;
}

//To remove super heroes from favourite list.
function removeFav(name){
    var index=arr.indexOf(name);
    // console.log(index);
    arr.splice(index,1);
    // console.log(arr);
    localStorage.setItem("favourites",JSON.stringify(arr));
    alert("your hero remove successfulled");
    location.reload();
}

//displaying super heroes in cards.
async function display(){
    if(arr.length === 0){
        cardCon.innerHTML = `<h1>Please add characters in favourites...</h1>`;
        setTimeout(()=>{
            window.location.href = "index.html";
        },2000);
    }
    for(let i of arr){
        let d = await fetchD(i);
        const div = document.createElement('div');
        div.id = "card";
        const img = document.createElement('img');
        img.src = `${d[0].thumbnail.path}.${d[0].thumbnail.extension}`;
        const h2 = document.createElement('h2');
        h2.textContent = `${d[0].name}`;
        const h3 = document.createElement('h3');
        h3.textContent = "Remove";
        div.append(img,h2,h3);
        cardCon.append(div);
    }
}

//Event to remove cards.
cardCon.addEventListener('click',(e)=>{
    if(e.target.tagName === "H3"){
        removeFav(e.target.previousSibling.textContent);
    }
})

window.onload = ()=>{
    display();
}