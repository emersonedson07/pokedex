const pokemonName = document.getElementById('pokemon-name');
const pokemonNumber = document.getElementById('pokemon-number');
const pokemonImage = document.getElementById('pokemon-image');
const typesDiv = document.getElementById('types');
const abilitiesDiv = document.getElementById('abilities');
const statsDiv = document.getElementById('stats');
const searchInput = document.getElementById('search-input');
const speciesText = document.getElementById('species');
const toggleBtn = document.getElementById('toggle-button');
const pokedexContent = document.querySelector('.pokedex-content');

let currentPokemon = 1;

const typeTranslations = {
  normal: "Normal", fighting: "Lutador", flying: "Voador", poison: "Venenoso",
  ground: "Terrestre", rock: "Pedra", bug: "Inseto", ghost: "Fantasma",
  steel: "Aço", fire: "Fogo", water: "Água", grass: "Grama",
  electric: "Elétrico", psychic: "Psíquico", ice: "Gelo", dragon: "Dragão",
  dark: "Sombrio", fairy: "Fada", shadow: "Sombra", unknown: "Desconhecido"
};

const abilityTranslations = {
  "overgrow": "Crescimento", "chlorophyll": "Clorofila", "blaze": "Chama",
  "torrent": "Torrente", "shield-dust": "Pó de Escudo", "run-away": "Fuga",
  "adaptability": "Adaptabilidade", "solar-power": "Poder Solar"
};

const statsTranslations = {
  "hp": "HP", "attack": "Ataque", "defense": "Defesa",
  "special-attack": "Ataque Especial", "special-defense": "Defesa Especial",
  "speed": "Velocidade"
};

function translateType(type) {
  return typeTranslations[type] || type;
}

function translateAbility(ability) {
  return abilityTranslations[ability] || ability;
}

function translateStat(stat) {
  return statsTranslations[stat] || stat;
}

async function fetchPokemon(pokemon) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  if (!res.ok) throw new Error('Pokémon não encontrado');
  const data = await res.json();
  const speciesRes = await fetch(data.species.url);
  const speciesData = await speciesRes.json();
  return { data, speciesData };
}

function createStatBar(stat, value) {
  return `<div>${stat}: ${value}<div class="stat-bar"><div class="fill" style="width:${value}%"></div></div></div>`;
}

async function renderPokemon(pokemon) {
  try {
    pokemonName.textContent = 'Carregando...';
    const { data, speciesData } = await fetchPokemon(pokemon);
    currentPokemon = data.id;

    const ptName = speciesData.names.find(n => n.language.name === 'pt');
    pokemonName.textContent = ptName ? ptName.name : data.name;

    pokemonNumber.textContent = `#${String(data.id).padStart(3, '0')}`;
    pokemonImage.src = data.sprites.other['official-artwork'].front_default;
    pokemonImage.alt = ptName ? ptName.name : data.name;

    typesDiv.innerHTML = '';
    data.types.forEach(t => {
      const span = document.createElement('span');
      span.textContent = translateType(t.type.name);
      span.className = t.type.name;
      typesDiv.appendChild(span);
    });

    abilitiesDiv.innerHTML = '';
    data.abilities.forEach(abil => {
      const abilName = translateAbility(abil.ability.name);
      abilitiesDiv.innerHTML += abil.is_hidden ? `<em>Oculta:</em> ${abilName}<br>` : `${abilName}<br>`;
    });

    statsDiv.innerHTML = '';
    data.stats.forEach(stat => {
      const statName = translateStat(stat.stat.name);
      statsDiv.innerHTML += createStatBar(statName, stat.base_stat);
    });

    const genus = speciesData.genera.find(g => g.language.name === 'pt');
    speciesText.textContent = genus ? genus.genus : '';
  } catch {
    alert('Pokémon não encontrado!');
  }
}

function searchPokemon() {
  const query = searchInput.value.trim().toLowerCase();
  if (query) renderPokemon(query);
}

function previousPokemon() {
  if (currentPokemon > 1) renderPokemon(currentPokemon - 1);
}

function nextPokemon() {
  renderPokemon(currentPokemon + 1);
}

toggleBtn.addEventListener('click', () => {
  const isVisible = pokedexContent.style.display !== 'none';
  if (isVisible) {
    pokedexContent.style.display = 'none';
    toggleBtn.textContent = 'Pokédex: Desligada';
    toggleBtn.setAttribute('aria-pressed', 'false');
  } else {
    pokedexContent.style.display = 'flex';
    toggleBtn.textContent = 'Pokédex: Ligada';
    toggleBtn.setAttribute('aria-pressed', 'true');
  }
});

renderPokemon(currentPokemon);
