import ShowCard from "./show-card";

type Show = {
  id: number;
  title: string;
  description: string | null;
  genre: string | null;
  status: "PLANNED" | "WATCHING" | "COMPLETED" | "DROPPED";
  rating: number | null;
};

type ShowListProps = {
  shows: Show[];
  loading: boolean;
  onEdit: (show: Show) => void;
  onDelete: (id: number) => void;
};

export default function ShowList({
  shows,
  loading,
  onEdit,
  onDelete,
}: ShowListProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-2xl border border-gray-200 bg-white"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {shows.map((show) => (
        <ShowCard
          key={show.id}
          show={show}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}