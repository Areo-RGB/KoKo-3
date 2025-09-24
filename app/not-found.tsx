export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-xl text-gray-600">Seite nicht gefunden</p>
        <p className="mt-2 text-gray-500">
          Die angeforderte Seite existiert nicht.
        </p>
        <a
          href="/"
          className="mt-6 inline-block rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Zur Startseite
        </a>
      </div>
    </div>
  );
}
