import { Button } from "@/components/ui/button";
import { Globe, Home, Menu, MessageCircle, PlusCircle, Search } from "lucide-react";
import Link from "next/link";

export default function SideHeader() {
  return (
    <header className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="text-primary font-bold text-2xl"
        >
          <Home className="w-8 h-8" />
          <span className="sr-only">Airbnb</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
        >
          <Menu className="w-5 h-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </div>
      <nav className="space-y-4 mb-8">
        <NavLink
          href="#"
          icon={<Search className="w-5 h-5" />}
          text="Explore"
        />
        <NavLink
          href="#"
          icon={<PlusCircle className="w-5 h-5" />}
          text="Host your home"
        />
        <NavLink
          href="#"
          icon={<MessageCircle className="w-5 h-5" />}
          text="Messages"
        />
      </nav>
      <div className="mt-auto">
        <Button
          variant="outline"
          className="w-full"
        >
          <Globe className="w-5 h-5 mr-2" />
          Language
        </Button>
      </div>
    </header>
  );
}

function NavLink({ href, icon, text }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}
