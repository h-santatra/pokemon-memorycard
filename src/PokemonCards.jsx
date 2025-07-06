export default function PokemonCards({
  pokeName,
  pokeType,
  pokeId,
  pokeImage,
  pokemon,
  onClick,
}) {
  return (
    <>
      <button
        className="card cursor-pointer border bg-gray-200 hover:shadow-lg shadow-gray-500 py-2 dark:bg-gray-500"
        onClick={() => onClick(pokemon)}
      >
        <header>
          <div className="font-semibold text-center capitalize text-nowrap overflow-hidden text-ellipsis text-[clamp(1.2rem,2.5vw,1.5rem)]">
            {pokeName}
          </div>
        </header>
        <main className="flex flex-col justify-content-end dark:">
          <img src={pokeImage} alt="pokeImage" className=""></img>
          <span className="w-18 bg-green-300 dark:bg-green-600 rounded-full px-2 m-2 text-sm ">
            ID : {pokeId}
          </span>
        </main>
        <div className="capitalize text-center text-nowrap overflow-hidden text-ellipsis text-[clamp(0.75rem,2.5vw,1rem)]">
          Type : {pokeType}
        </div>
      </button>
    </>
  );
}
