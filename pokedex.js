const pokemonCount = 151;
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

    console.log(pokedex);
}

async function getPokemon(num) {
    try {
        let url = `https://pokeapi.co/api/v2/pokemon/${num}`;

        let res = await fetch(url);
        let pokemon = await res.json();

        let pokemonName = pokemon["name"];
        let pokemonType = pokemon["types"];
        let pokemonImg = pokemon["sprites"]["front_shiny"];

        // Fetch abilities details in Spanish
        const abilitiesPromises = pokemon.abilities.map(async (ability) => {
            const abilityResponse = await fetch(ability.ability.url);
            const abilityData = await abilityResponse.json();
            return abilityData.names.find(name => name.language.name === "es").name;
        });

        const abilities = await Promise.all(abilitiesPromises);

        let pokemonDesc = '';

        // Fetching the description from the species endpoint
        res = await fetch(pokemon["species"]["url"]);
        let pokemonDescData = await res.json();

        // Find the Spanish flavor text entry
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

    // Clear previous type
    let typesDiv = document.getElementById("pokemon-types");
    while (typesDiv.firstChild) {
        typesDiv.firstChild.remove();
    }

    // Update types
    let types = pokedex[this.id]["types"];
    for (let i = 0; i < types.length; i++) {
        let type = document.createElement("span");
        type.innerText = types[i]["type"]["name"].toUpperCase();
        type.classList.add("type-box");
        type.classList.add(types[i]["type"]["name"]); // Adds background color and font color
        typesDiv.append(type);
    }

    // Update abilities
    let abilitiesDiv = document.getElementById("pokemon-ability");
    abilitiesDiv.innerText = `Habilidades: ${pokedex[this.id]["abilities"].join(', ')}`;

    // Update description
    document.getElementById("pokemon-description").innerText = pokedex[this.id]["desc"];
    
}

async function getTypeData(typeName) {
    const url = `https://pokeapi.co/api/v2/type/${typeName}`;
    const res = await fetch(url);
    const typeData = await res.json();
    return typeData;
}
