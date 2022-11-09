const pokemonCount = 300;
var pokedex = {}; // {1 : {"name" : "bulbsaur", "img" : url, "type" : ["grass", "poison"], "desc" : "...."} }
let lastUpdate = 0
window.onload = async function() {

    for (let i = 1; i <= pokemonCount; i++) {
        await getPokemon(i);
        var img=document.createElement("img");
        img.src= pokedex[i]["img"];
        img.classList.add("img-pokemon-index");

        var name = document.createElement("LABEL")
        name.innerText = pokedex[i]["name"];
        name.classList.add("pokemon-name-index");

        var id = document.createElement("LABEL")
        switch(i.toString().length) {
            case 3:
                id.innerText = "#" + i.toString();
              break;
            case 2:
                id.innerText = "#0" + i.toString();
              break;
            default:
                id.innerText = "#00" + i.toString();
        }
        id.classList.add("pokemon-id-index");
        
        let pokemon = document.createElement("div");
        pokemon.id = i;
        pokemon.classList.add("pokemon-row");

        pokemon.appendChild(img);
        pokemon.appendChild(name);
        pokemon.appendChild(id);

        pokemon.addEventListener("click", updatePokemon);
        document.getElementById("pokemon-list").append(pokemon);
    }
}

async function getPokemon(num) {
    let url = "https://pokeapi.co/api/v2/pokemon/" + num.toString();

    let res = await fetch(url);
    let pokemon = await res.json();

    let pokemonName = pokemon["name"];
    let pokemonType = pokemon["types"];
    let pokemonImg = pokemon["sprites"]["front_default"];
    let pokemonAbilities = pokemon["abilities"]
    let pokemonWeight = pokemon["weight"];
    let pokemonHeight = pokemon["height"];
    let pokemonSpecies = pokemon["species"]["name"];

    res = await fetch(pokemon["species"]["url"]);
    let pokemonEggsGroup = await res.json();

    let listAbilitiesName = await getAbilitiesName(pokemonAbilities);
    
    let listEggsGroupName = await getPokemonEgssGroupName(pokemonEggsGroup["egg_groups"]);

    let evolutions = await getEvolutions(num, pokemonName);
    pokedex[num] = {
        "name" : pokemonName, 
        "img" : pokemonImg, 
        "types" : pokemonType, 
        "weight" : pokemonWeight, 
        "height": pokemonHeight,
        "species": pokemonSpecies,
        "abilities": listAbilitiesName,
        "eggsGroup": listEggsGroupName,
        "evolutions": evolutions
    };

}
function getAbilitiesName(pokemonAbilities){
    let length = Object.keys(pokemonAbilities).length;
    let listAbilitiesName = []
    let i = 0;
    while (i < length) {
        listAbilitiesName.push(pokemonAbilities[i.toString()]["ability"]["name"]);
        i += 1
    }
    return listAbilitiesName;

}

function getPokemonEgssGroupName(pokemonEggsGroup) {
    //get a string of pokemon eggs group
    let length = Object.keys(pokemonEggsGroup).length;
    let listEggsGroupName = []
    let i = 0;
    while (i < length) {
        listEggsGroupName.push(pokemonEggsGroup[i.toString()]["name"]);
        i += 1
    }
    return listEggsGroupName;
}

async function getEvolutions(id, name){
    //get the chain of evolutions
    
    let url = "https://pokeapi.co/api/v2/evolution-chain/" + id;
    let res = await fetch(url);
    let temp = await res.json();
    let chain = temp["chain"];

    let evolution = [];
    
    let i = Object.keys(chain["evolves_to"]).length;
    let pokemonName = chain["species"]["name"];
    if (name !== pokemonName){
        let j = 1;
        while (j < id){
            let url = "https://pokeapi.co/api/v2/evolution-chain/" + j;
            let res = await fetch(url);
            let temp = await res.json();
            let chain = temp["chain"];
            if (name === chain["species"]["name"]){
                while (i != 0){
                    let stage = {};
                    pokemonName = chain["species"]["name"];
                    let url = "https://pokeapi.co/api/v2/pokemon/" + pokemonName;
                    let res = await fetch(url);
                    let pokemon = await res.json();
                    let pokemonImg = pokemon["sprites"]["front_default"];
            
                    stage = {
                        "name": pokemonName,
                        "img": pokemonImg
                    };
                    evolution.push(stage);
            
                    i = Object.keys(chain["evolves_to"]).length
                    if (i != 0){
                        chain = chain["evolves_to"]["0"];
                    }
                }
                return evolution;
            }
            j += 1;
        }
        return evolution;
    }


    while (i != 0){
        let stage = {};
        pokemonName = chain["species"]["name"];
        let url = "https://pokeapi.co/api/v2/pokemon/" + pokemonName;
        let res = await fetch(url);
        let pokemon = await res.json();
        let pokemonImg = pokemon["sprites"]["front_default"];

        stage = {
            "name": pokemonName,
            "img": pokemonImg
        };
        evolution.push(stage);

        i = Object.keys(chain["evolves_to"]).length
        if (i != 0){
            chain = chain["evolves_to"]["0"];
        }
    }
    return evolution;
}

function updatePokemon(){
    //update box in the right site on html
    document.getElementById("pokemon-img").src = pokedex[this.id]["img"];

    let second = document.getElementById("second-div")
    while (second.lastChild) {
        second.lastChild.remove();
    }

    let chain = document.getElementById("pokemon-evolution");
    while (chain.lastChild) {
        chain.lastChild.remove();
    }

    //clear previous type
    let typesDiv = document.getElementById("pokemon-types");
    while (typesDiv.firstChild) {
        typesDiv.firstChild.remove();
    }

    //update types
    let types = pokedex[this.id]["types"];
    for (let i = 0; i < types.length; i++) {
        let type = document.createElement("span");
        type.innerText = types[i]["type"]["name"];
        type.classList.add("type-box");
        type.classList.add(types[i]["type"]["name"]);
        typesDiv.append(type);
    }

    let weightInfo = pokedex[this.id]["weight"] + '"';
    let weightTitle = "Weight: ";

    insertNewInformation(weightTitle, weightInfo);

    let heightInfo = pokedex[this.id]["height"] + '"';
    let heightTitle = "Height: ";

    insertNewInformation(heightTitle, heightInfo);

    let speciesInfo = pokedex[this.id]["species"];
    let speciesTitle = "Species: ";

    insertNewInformation(speciesTitle, speciesInfo);

    let eggsGroupInfoList = pokedex[this.id]["eggsGroup"];
    let eggsGroupInfo = "";
    let i = 0;
    while (i < Object.keys(eggsGroupInfoList).length) {
        if (eggsGroupInfo !== ""){
            eggsGroupInfo += ", " + eggsGroupInfoList[i];
        } else {
            eggsGroupInfo = eggsGroupInfoList[i];
        }
        i += 1
    }
    let eggsGroupTitle = "Egss Group: ";

    insertNewInformation(eggsGroupTitle, eggsGroupInfo);

    let abilitiesInfoList = pokedex[this.id]["abilities"];
    let abilitiesInfo = "";
    i = 0;
    while (i < Object.keys(abilitiesInfoList).length) {
        if (abilitiesInfo !== ""){
            abilitiesInfo += ", " + abilitiesInfoList[i];
        } else {
            abilitiesInfo = abilitiesInfoList[i];
        }
        i += 1
    }
    let abilitiesTitle = "Abilities: ";

    insertNewInformation(abilitiesTitle, abilitiesInfo);

    document.getElementById("pokemon-name").innerText = pokedex[this.id]["name"];

    let evolutionList = pokedex[this.id]["evolutions"]
    i = 0;
    while (i != Object.keys(evolutionList).length) {
        var imgEvo=document.createElement("img");
        imgEvo.src= evolutionList[i]["img"];
        imgEvo.classList.add("img-pokemon-evolution");

        var nameLabel = document.createElement("figcaption");
        nameLabel.innerText = evolutionList[i]["name"];
        nameLabel.classList.add("evolution-titles");

        let divEvolution = document.createElement("div");
        divEvolution.classList.add("pokemon-general-div");

        divEvolution.appendChild(imgEvo);
        divEvolution.appendChild(nameLabel);

        document.getElementById("pokemon-evolution").append(divEvolution);
        i+= 1
    }

}

function insertNewInformation(title, info){
    var infoLabel = document.createElement("LABEL");
    infoLabel.innerText = info;
    infoLabel.classList.add("pokemon-general-info");

    var titleLabel = document.createElement("LABEL");
    titleLabel.innerText = title;
    titleLabel.classList.add("pokemon-title-info");
    
    let pokemonGeneralRow = document.createElement("div");
    pokemonGeneralRow.classList.add("pokemon-general-div");

    pokemonGeneralRow.appendChild(titleLabel);
    pokemonGeneralRow.appendChild(infoLabel);

    document.getElementById("second-div").append(pokemonGeneralRow);
}