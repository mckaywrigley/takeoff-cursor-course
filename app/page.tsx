export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="text-4xl font-bold">Takeoff: Cursor Course</div>
      <div>
        Full Course Here:{" "}
        <a
          className="text-blue-500"
          href="https://www.jointakeoff.com/courses/cursor"
        >
          https://www.jointakeoff.com/courses/cursor
        </a>
      </div>
    </div>
  );
}
