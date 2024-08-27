export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold mb-2">Support</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="hover:underline"
              >
                Help Center
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline"
              >
                Safety information
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline"
              >
                Cancellation options
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Company</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="hover:underline"
              >
                About us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline"
              >
                Careers
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline"
              >
                Press
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-2xl"
            >
              📘
            </a>
            <a
              href="#"
              className="text-2xl"
            >
              🐦
            </a>
            <a
              href="#"
              className="text-2xl"
            >
              📸
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
