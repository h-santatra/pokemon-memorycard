import { useState, useEffect } from "react";
import PokemonCards from "./PokemonCards.jsx";
import Switch from "./Switch.jsx";

export default function MainPokemon() {
  const TOTAL_POKEMON = 1025;
  const NUM_RANDOM = 18;
  const shuffle = (list) => {
    const array = [...list];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const [randomSet1, setRandomSet1] = useState([]);
  const [randomSet2, setRandomSet2] = useState([]);
  const [arrayJoin, setArrayJoin] = useState([]);
  const [arrayChecking, setArrayChecking] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [reset, setReset] = useState(0);
  const [loading, setLoading] = useState(true); // Loader state
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme !== null) {
      return Number(savedTheme);
    }
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? 1 : 0;
  });

  useEffect(() => {
    if (theme === 1) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleScore() {
    setScore((prevScore) => prevScore + 1);
  }

  function handleItemClick(item) {
    const exists = arrayChecking.includes(item);

    if (!exists) {
      const newArrayChecking = [...arrayChecking, item];
      setArrayChecking(newArrayChecking);
      handleScore();

      // Shuffle arrayJoin and update state
      const shuffled = shuffle(arrayJoin);
      setArrayJoin(shuffled);
    } else {
      // Update best score before resetting
      if (score > bestScore) {
        setBestScore(score);
      }

      // Reset everything
      setArrayChecking([]);
      setScore(0);

      setArrayJoin(shuffle(arrayJoin));
    }
  }

  function handleReset() {
    setLoading(true);
    setScore(0);
    setBestScore(0);
    setReset((prev) => prev + 1);
  }

  useEffect(() => {
    const combined = [...randomSet1, ...randomSet2];
    const shufled = shuffle(combined);
    setArrayJoin(shufled);
  }, [randomSet1, randomSet2]);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
  }

  async function getPokemon(id) {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTPS error status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error fetching data", error);
      return null;
    }
  }
  useEffect(() => {
    async function fetchRandomPokemonList() {
      setLoading(true);
      try {
        const randomIds = new Set();
        while (randomIds.size < NUM_RANDOM) {
          randomIds.add(getRandomInt(TOTAL_POKEMON));
        }
        const pokemonIds = Array.from(randomIds);

        const pokemonPromises = pokemonIds.map((id) => getPokemon(id));
        const pokedetails = await Promise.all(pokemonPromises);
        const filteredDetails = pokedetails.filter(Boolean).map((pokemon) => ({
          name: pokemon.name,
          type: pokemon.types[0].type.name,
          id: pokemon.id,
          image: pokemon.sprites.other["official-artwork"].front_default,
        }));
        await Promise.all(
          filteredDetails.map((poke) => {
            return new Promise((resolve) => {
              const img = new Image();
              img.src = poke.image;
              img.onload = resolve;
              img.onerror = resolve; // still resolve if error to prevent stuck
            });
          })
        );
        setRandomSet1(shuffle(filteredDetails));
        setRandomSet2(shuffle(filteredDetails));
      } catch (error) {
        console.log("Error fecthing  data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRandomPokemonList();
  }, [reset]);

  return (
    <>
      {loading ? (
        <div className="h-screen w-screen flex items-center justify-center dark:bg-gray-500">
          <div className="u-bounce c-loader o-pokeball "></div>
        </div>
      ) : (
        <div className="bg-[url('https://images.unsplash.com/photo-1647892591711-f310c2a3ab7c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-no-repeat bg-cover dark:text-white transition-colors duration-300">
          <div className="dark:bg-gray-900/20 bg-zinc-100/10">
            <div>
              <div className="sticky top-0 z-50 w-full bg-gray-400 dark:bg-gray-800 transition-all duration-300">
                {/* Smooth animated full header */}
                <div
                  className={`transition-all duration-500 overflow-hidden ${
                    atTop ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="absolute top-0 right-0 transform scale-[0.75] origin-top-left pt-2">
                    <Switch theme={theme} setTheme={setTheme} />
                  </div>
                  <h2 className="text-center text-4xl p-3 font-semibold underline">
                    Memory Card Game : Pokemon{" "}
                    <span className="hidden md:inline">version</span>
                  </h2>
                  <h4 className="hidden md:block text-xl text-center">
                    Get points by clicking on a pokemon image but don't click on
                    any more than once!
                  </h4>
                  <h4 className="text-xl font-semibold text-center">
                    Catch 18 Pokemon if you can.
                  </h4>
                </div>

                {/* Always visible score & button */}
                <div className="flex justify-between items-center px-4 py-2 shadow-md">
                  <div className="bg-orange-400 dark:bg-amber-700 rounded px-2 font-bold">
                    <div>Score : {score}</div>
                    <div>Best Score : {bestScore}</div>
                  </div>
                  <button
                    type="button"
                    className="btn text-lg font-bold bg-teal-300 dark:bg-teal-700 dark:text-white border-none dark:shadow-white"
                    onClick={handleReset}
                  >
                    New Game
                  </button>
                </div>
              </div>

              <div className="maincard opacity-90">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-3">
                  {arrayJoin.map((pokemon, index) => (
                    <PokemonCards
                      key={`${pokemon.id}-${index}`}
                      pokeName={pokemon.name}
                      pokeType={pokemon.type}
                      pokeId={pokemon.id}
                      pokeImage={pokemon.image}
                      pokemon={pokemon.name}
                      onClick={() => handleItemClick(pokemon)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
