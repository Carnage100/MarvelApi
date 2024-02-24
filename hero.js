const contain = document.querySelector("#container");
const a =localStorage.getItem("name"); //extracting name from localStrorage for fetching its data.
// console.log(a);

const[timestamp,apiKey,hashValue] = [ts,publicKey,hashVal];

//fetching particular character's data.
async function fetchData(val){
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

//displaying the results of the character.
async function getDetails(){
    contain.innerHTML = "";
    const b = await fetchData(a);
    // console.log(b);
    b.forEach((element) => {
        const div1 = document.createElement('div');
        div1.classList.add('img-container');
        const img = document.createElement('img');
        img.src = `${element.thumbnail.path}.${element.thumbnail.extension}`;
        div1.appendChild(img);
        const div2 = document.createElement('div');
        div2.classList.add('description');
        const h2 = document.createElement('h2');
        h2.textContent = `${element.name}`;
        const p1 = document.createElement('p');
        p1.textContent = `${element.description}`
        const p2 = document.createElement('p');
        p2.textContent = `Comics : ${element.comics.available} Events : ${element.events.available} Series : ${element.series.available}
        Stories : ${element.stories.available}`;
        div2.append(h2,p1,p2);
        contain.append(div1,div2);
});
    // console.log(await (await fetch(`${b[0].comics.collectionURI}?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}`)).json());
}

//fetching and displaying the comics of the character.
async function comic(){
    const c = await fetchData(a);
    const d = await (await fetch(`${c[0].comics.collectionURI}?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}`)).json();
    const div = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = "Comics";
    div.append(h3);
    const div3 = document.createElement('div');
    div3.classList.add('comic-img-container');
    d.data.results.forEach((ele)=>{
        const img = document.createElement('img');
        img.classList.add('comic-img');
        img.src = `${ele.images[0].path}.${ele.images[0].extension}`;
        img.alt = "Comic Image";
        div3.append(img);
        div.append(div3);
    });
    const p = document.createElement('p');
    p.innerHTML = d.attributionHTML;
    div.append(p);
    contain.append(div);
}


localStorage.removeItem("name"); //removing that character so that new character can be added.Thus it is not persistent.

window.onload = ()=>{
    getDetails();
    comic();
}