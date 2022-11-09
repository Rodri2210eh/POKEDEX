const pokemonCount = 300;
var pokedex = {}; // {1 : {"name" : "bulbsaur", "img" : url, "type" : ["grass", "poison"], "desc" : "...."} }

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

    document.getElementById("pokemon-description").innerText = pokedex[1]["desc"];

    console.log(pokedex);
}

async function getPokemon(num) {
    let url = "https://pokeapi.co/api/v2/pokemon/" + num.toString();

    let res = await fetch(url);
    let pokemon = await res.json();
    //console.log(pokemon);

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
    //console.log(listAbilitiesName);

    //console.log(pokemonEggsGroup["egg_groups"]);
    let listEggsGroupName = await getPokemonEgssGroupName(pokemonEggsGroup["egg_groups"]);
    //console.log(listEggsGroupName);

    pokedex[num] = {
        "name" : pokemonName, 
        "img" : pokemonImg, 
        "types" : pokemonType, 
        "weight" : pokemonWeight, 
        "height": pokemonHeight,
        "species": pokemonSpecies,
        "abilities": listAbilitiesName,
        "eggsGroup": listEggsGroupName
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
    let length = Object.keys(pokemonEggsGroup).length;
    let listEggsGroupName = []
    let i = 0;
    while (i < length) {
        listEggsGroupName.push(pokemonEggsGroup[i.toString()]["name"]);
        i += 1
    }
    return listEggsGroupName;
}

function updatePokemon(){
    document.getElementById("pokemon-img").src = pokedex[this.id]["img"];

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

    //update description
    document.getElementById("pokemon-name").innerText = pokedex[this.id]["name"];
}