type EmptyStateProps = {
  hasFilters: boolean;
  onClearFilters: () => void;
  onAdd: () => void;
};

export default function EmptyState({
  hasFilters,
  onClearFilters,
  onAdd,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
        📺
      </div>

      <h2 className="mt-4 text-lg font-semibold text-gray-900">
        {hasFilters ? "No shows found" : "Your watchlist is empty"}
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
        {hasFilters
          ? "Try changing your search or status filter."
          : "Add your first show to start building your watchlist."}
      </p>

      <div className="mt-5">
        {hasFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            Clear filters
          </button>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Add your first show
          </button>
        )}
      </div>
    </div>
  );
}