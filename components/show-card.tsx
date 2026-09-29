type Show = {
  id: number;
  title: string;
  description: string | null;
  genre: string | null;
  status: "PLANNED" | "WATCHING" | "COMPLETED" | "DROPPED";
  rating: number | null;
};

type ShowCardProps = {
  show: Show;
  onEdit: (show: Show) => void;
  onDelete: (id: number) => void;
};

export default function ShowCard({
  show,
  onEdit,
  onDelete,
}: ShowCardProps) {
  return (
    <article className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-gray-900">
            {show.title}
          </h2>

          {show.genre && (
            <p className="mt-1 text-sm text-gray-500">
              {show.genre}
            </p>
          )}
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
            show.status
          )}`}
        >
          {formatStatus(show.status)}
        </span>
      </div>

      <div className="min-h-20">
        {show.description ? (
          <p className="line-clamp-3 text-sm leading-6 text-gray-600">
            {show.description}
          </p>
        ) : (
          <p className="text-sm italic text-gray-400">
            No description
          </p>
        )}
      </div>

      {show.rating !== null && (
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gray-700">
          <span aria-hidden="true">★</span>
          <span>{show.rating}/10</span>
        </div>
      )}

      <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => onEdit(show)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(show.id)}
          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function statusClass(status: Show["status"]) {
  switch (status) {
    case "WATCHING":
      return "bg-blue-100 text-blue-700";
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "DROPPED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}