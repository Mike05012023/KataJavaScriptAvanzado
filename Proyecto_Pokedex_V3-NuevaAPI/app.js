// Clase para manejar los datos de cada Pokémon
class Pokemon {
    constructor(data) {
        this.name = data.name;
        this.imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;
        this.baseExperience = data.base_experience;
        this.abilities = data.abilities.map(a => a.ability.name).join(', ');
        this.gameIndices = data.game_indices.map(g => g.version.name).join(', ');
        this.soundUrl = data.cries ? data.cries.latest : '';  // Verifica si hay sonido
    }
}

// Clase principal para manejar la Pokédex
class Pokedex {
    constructor() {
        this.pokemonList = [];
        this.filteredPokemonList = [];
        this.apiBaseUrl = 'https://pokeapi.co/api/v2/pokemon/';
        this.limit = 50; // Número de Pokémon por página en la API
        this.offset = 0; // Offset inicial
    }

    async init() {
        await this.loadAllPokemonData();
        this.displayPokemon();
        this.setupEventListeners();
    }

    // Función para cargar todos los Pokémon usando paginación
    async loadAllPokemonData() {
        try {
            let hasMoreData = true;
            while (hasMoreData) {
                const response = await fetch(`${this.apiBaseUrl}?limit=${this.limit}&offset=${this.offset}`);
                const data = await response.json();
                const pokemonPromises = data.results.map(p => this.loadPokemonDetails(p.url));
                
                // Espera a que se resuelvan todas las promesas de detalles
                const pokemonData = await Promise.all(pokemonPromises);
                this.pokemonList.push(...pokemonData);

                // Actualiza el offset para la próxima página
                this.offset += this.limit;
                hasMoreData = data.next !== null;
            }

            // Copia la lista completa para filtrar sin perder datos originales
            this.filteredPokemonList = [...this.pokemonList];
        } catch (error) {
            console.error("Error al cargar los datos de Pokémon:", error);
        }
    }

    // Función para cargar detalles individuales del Pokémon
    async loadPokemonDetails(url) {
        const response = await fetch(url);
        const data = await response.json();
        return new Pokemon(data);
    }

    // Muestra la lista de Pokémon en el contenedor principal
    displayPokemon() {
        const container = document.getElementById('pokemon-container');
        container.innerHTML = '';
        this.filteredPokemonList.forEach(pokemon => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <h3>${pokemon.name}</h3>
                <img src="${pokemon.imageUrl}" alt="${pokemon.name}">
            `;
            card.addEventListener('click', () => this.showModal(pokemon));
            container.appendChild(card);
        });
    }

    // Configura el filtro y eventos de cierre del modal
    setupEventListeners() {
        document.getElementById('search-input').addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            this.filteredPokemonList = this.pokemonList.filter(pokemon =>
                pokemon.name.toLowerCase().includes(searchTerm)
            );
            this.displayPokemon();
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            document.getElementById('modal').style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === document.getElementById('modal')) {
                document.getElementById('modal').style.display = 'none';
            }
        });
    }

    // Muestra un modal con detalles del Pokémon seleccionado
    showModal(pokemon) {
        document.getElementById('pokemon-name').textContent = pokemon.name;
        document.getElementById('pokemon-image').src = pokemon.imageUrl;
        document.getElementById('pokemon-experience').textContent = pokemon.baseExperience;
        document.getElementById('pokemon-abilities').textContent = pokemon.abilities;
        document.getElementById('pokemon-game-indices').textContent = pokemon.gameIndices;
        
        // Configura el sonido si está disponible
        const soundSource = document.getElementById('sound-source');
        if (pokemon.soundUrl) {
            soundSource.src = pokemon.soundUrl;
            document.getElementById('pokemon-sound').style.display = 'block';
            document.getElementById('pokemon-sound').load();
        } else {
            document.getElementById('pokemon-sound').style.display = 'none';
        }

        document.getElementById('modal').style.display = 'flex';
    }
}

// Inicializa la Pokédex
const pokedex = new Pokedex();
pokedex.init();