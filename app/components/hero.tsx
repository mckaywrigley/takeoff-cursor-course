export default function Hero() {
  return (
    <section
      className="relative h-[70vh] bg-cover bg-center"
      style={{ backgroundImage: 'url("/hero-image.jpg")' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Find your next stay</h1>
          <form className="flex space-x-2">
            <input
              type="text"
              placeholder="Where are you going?"
              className="border p-2 rounded"
            />
            <input
              type="date"
              placeholder="Check-in"
              className="border p-2 rounded"
            />
            <input
              type="date"
              placeholder="Check-out"
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Guests"
              min="1"
              className="border p-2 rounded"
            />
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
