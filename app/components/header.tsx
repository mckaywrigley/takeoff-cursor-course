import Image from "next/image";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <Image
        src="/logo.svg"
        alt="Airbnb"
        width={102}
        height={32}
      />
      <nav className="flex items-center space-x-4">
        <button className="font-medium">Become a Host</button>
        <div className="w-8 h-8 bg-gray-500 rounded-full"></div>
      </nav>
    </header>
  );
}
