// import {ts,publicKey,hashVal} from './api.js';
const inputBox = document.querySelector('#search-container input');
const searchButton = document.querySelector('#search-container button');
const listBox = document.querySelector('#list');
const searchResults = document.querySelector('#d1')
//for creating api key.
const date = new Date();
// console.log(date.getTime());

const[timestamp,apiKey,hashValue] = [ts,publicKey,hashVal];
// console.log(timestamp)
// console.log(apiKey);
// console.log(hashValue);
var arr ="";

//fetching values from marvel server.
async function getData(value=""){
    let url;
    if(value === ""){
         url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}`;
    }
    else{
        url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&name=${value}`;
    }
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

//obtaining a list of characters and single character based on val. 
async function getList(val=""){
    let data;
    if(val === "")
        data = await getData();
    else
        data = val; //no need to fetch as val already has the fetched data.
    // console.log(`data = ${data}`);
    data.forEach((element) => {
        const div1 = document.createElement('div');
        div1.classList.add('list-container');
        const div2 = document.createElement('div')
        div2.classList.add('img-container');
        const img = document.createElement('img');
        img.src=`${element.thumbnail.path}.${element.thumbnail.extension}`;
        div2.appendChild(img);
        div1.appendChild(div2);
        const div3 = document.createElement('div');
        div3.classList.add('description');
        const a = document.createElement('a');
        a.textContent = `${element.name}`;
        a.href = "superHeroPage.html";
        // a.target = "_blank";
        const p1 = document.createElement('p');
        p1.textContent = `${element.description}`;
        const p2 = document.createElement('p');
        p2.textContent = `Comics : ${element.comics.available} Events : ${element.events.available} Series : ${element.series.available}
        Stories : ${element.stories.available}`;
        const span = document.createElement('span');
        span.textContent = "+";
        p1.append(span);
        div3.append(a,p1,p2);
        div1.appendChild(div3);
        listBox.append(div1);

    });
}

//getting text from search bar function.
async function fetchData(){
    if(inputBox.value.trim()<1)
        alert("Invalid input!");
    listBox.innerHTML = "";
     const res = await getData(inputBox.value);
     if(res.length === 0){
        alert("Invalid name!");
        location.reload();
    }
    getList(res);   //It already has the data of single character so no need to fetch again in getList function.
}

// make a favourites key for storing all favourites hero's id in local storage if not available
if (localStorage.getItem("favourites")==null) {
    localStorage.setItem("favourites",JSON.stringify([])); //creating a key value pair in localStorage to make favourite persistent.
}else{
    var arr = JSON.parse(localStorage.getItem("favourites")); //reinitiallising arr with localStorage data.
}

// function for adding name value in local storage favourites key if not available this name 
function addFavourite(name) {
    if (!arr.includes(name) == true) {  //If character not in arr , add it.
      arr.push(name);
      localStorage.setItem("favourites", JSON.stringify(arr));
      alert("your hero added in favourites")
    }else{
      alert("your hero already added in favourites")  //If already in arr don't add it.
    }
}

//listining to list div for appropriate action.
listBox.addEventListener("click",async (e)=>{
    // console.log(e.target.textContent);
    if(e.target.tagName === "A"){
        localStorage.setItem("name",e.target.textContent); //If name is clicked , redirect to new page with more info of it.
    }
    else if(e.target.tagName === "SPAN"){
        // alert("Added to favourites!");
        addFavourite(e.target.parentElement.parentElement.firstChild.textContent); //for adding in the favourite list.
    }
})
function removeElements(){
    searchResults.innerHTML="";
}

function displayWords(v){
    inputBox.value = v;
    removeElements();
}
inputBox.addEventListener('keyup',async ()=>{
    removeElements();
    if(inputBox.value.length < 4){
        return false;
    }
    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&nameStartsWith=${inputBox.value}`;
    const res = await fetch(url);
    const sd = await res.json();
    sd.data.results.forEach((ele)=>{
        let nam = ele.name;
        let div = document.createElement('div');
        div.id="search-results";
        div.style.cursor = "pointer";
        div.setAttribute("onclick","displayWords('"+nam+"')");
        let word = "<b>"+ nam.substr(0,inputBox.value.length)+"</b>";
        word+=nam.substr(inputBox.value.length);
        div.innerHTML = `<p class="item">${word}</p>`;
        searchResults.appendChild(div);
    })
})

//show results of all characters on page load.
window.onload = ()=>{
    getList();
}
