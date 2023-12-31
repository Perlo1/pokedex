const pokemonCount = 386;
var pokedex = {}; 

window.onload = async function () {
    for (let i = 1; i <= pokemonCount; i++) {
        await getPokemon(i);
        let pokemon = document.createElement("div");
        pokemon.id = i;
        pokemon.innerText = i.toString() + ". " + pokedex[i]["name"].toUpperCase();
        pokemon.classList.add("pokemon-name");
        pokemon.addEventListener("click", updatePokemon);
        document.getElementById("pokemon-list").append(pokemon);
    }

    document.getElementById("pokemon-description").innerText = pokedex[1]["desc"];

    // Display the first Pokémon's name in the pokemon-name div
    displayPokemonName(1);

    console.log(pokedex);
}

function displayPokemonName(id) {
    const pokemonNameDiv = document.getElementById("pokemon-name");
    if (pokedex[id]) {
        pokemonNameDiv.innerText = pokedex[id]["name"].toUpperCase();
    }
}
async function getPokemon(num) {
    try {
        let url = `https://pokeapi.co/api/v2/pokemon/${num}`;

        let res = await fetch(url);
        let pokemon = await res.json();

        let pokemonName = pokemon["name"];
        let pokemonType = pokemon["types"];
        let pokemonImg = pokemon["sprites"]["front_shiny"];

        // Fetch habilidades
        const abilitiesPromises = pokemon.abilities.map(async (ability) => {
            const abilityResponse = await fetch(ability.ability.url);
            const abilityData = await abilityResponse.json();
            return abilityData.names.find(name => name.language.name === "es").name;
        });

        const abilities = await Promise.all(abilitiesPromises);

        let pokemonDesc = '';

        // Fetching la descripcion
        res = await fetch(pokemon["species"]["url"]);
        let pokemonDescData = await res.json();

        // Texto espanol
        const spanishEntry = pokemonDescData.flavor_text_entries.find(entry => entry.language.name === "es");
        if (spanishEntry) {
            pokemonDesc = spanishEntry.flavor_text;
        }

        pokedex[num] = {
            "name": pokemonName,
            "img": pokemonImg,
            "types": pokemonType,
            "desc": pokemonDesc,
            "abilities": abilities
        };

    } catch (error) {
        console.error('Error fetching Pokemon information:', error.message);
        throw error;
    }
}


function updatePokemon() {
    document.getElementById("pokemon-img").src = pokedex[this.id]["img"];

    // Limpiar tipo anterior
    let typesDiv = document.getElementById("pokemon-types");
    while (typesDiv.firstChild) {
        typesDiv.firstChild.remove();
    }

    // Actualizar tipos
    let types = pokedex[this.id]["types"];
    for (let i = 0; i < types.length; i++) {
        let type = document.createElement("span");
        type.innerText = types[i]["type"]["name"].toUpperCase();
        type.classList.add("type-box");
        type.classList.add(types[i]["type"]["name"]); // Adds background color and font color
        typesDiv.append(type);
    }

    // Actualizar Habilidad
    let abilitiesDiv = document.getElementById("pokemon-ability");
    abilitiesDiv.innerText = `Habilidades: ${pokedex[this.id]["abilities"].join(', ')}`;

    // Actualizar descripcion
    document.getElementById("pokemon-description").innerText = pokedex[this.id]["desc"];

    // nombre
    displayPokemonName(this.id);
}


async function getTypeData(typeName) {
    const url = `https://pokeapi.co/api/v2/type/${typeName}`;
    const res = await fetch(url);
    const typeData = await res.json();
    return typeData;
}

function displayPokemonName(id) {
    const pokemonNameDiv = document.getElementById("pokemon-name");
    if (pokedex[id]) {
        pokemonNameDiv.innerText = pokedex[id]["name"].toUpperCase();
    }
}
