"use client";

import { useEffect, useState } from "react";

type Show = {
  id: number;
  title: string;
  description: string | null;
  genre: string | null;
  status: "PLANNED" | "WATCHING" | "COMPLETED" | "DROPPED";
  rating: number | null;
};

const statuses = [
  "PLANNED",
  "WATCHING",
  "COMPLETED",
  "DROPPED",
] as const;

type ShowFormProps = {
  show: Show | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function ShowForm({
  show,
  onClose,
  onSaved,
}: ShowFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] =
    useState<Show["status"]>("PLANNED");
  const [rating, setRating] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(show?.title ?? "");
    setDescription(show?.description ?? "");
    setGenre(show?.genre ?? "");
    setStatus(show?.status ?? "PLANNED");
    setRating(show?.rating?.toString() ?? "");
    setError(null);
  }, [show]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (
      rating &&
      (Number(rating) < 0 || Number(rating) > 10)
    ) {
      setError("Rating must be between 0 and 10.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const body = {
        title: title.trim(),
        description: description.trim() || null,
        genre: genre.trim() || null,
        status,
        rating: rating ? Number(rating) : null,
      };

      const response = await fetch(
        show ? `/api/shows/${show.id}` : "/api/shows",
        {
          method: show ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save show."
        );
      }

      onSaved();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="show-form-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2
              id="show-form-title"
              className="text-xl font-semibold text-gray-900"
            >
              {show ? "Edit Show" : "Add Show"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {show
                ? "Update the details for this show."
                : "Add a new show to your watchlist."}
            </p>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Title
            </label>

            <input
              id="title"
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Breaking Bad"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="genre"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Genre
            </label>

            <input
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g. Drama"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="status"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as Show["status"])
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {formatStatus(item)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="rating"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Rating
              </label>

              <input
                id="rating"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="0–10"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : show
                  ? "Save Changes"
                  : "Add Show"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}