"use client";

import { useCallback, useEffect, useState } from "react";
import ShowForm from "@/components/show-form";
import ShowList from "@/components/show-list";
import EmptyState from "@/components/empty-state";

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

export default function Home() {
  const [shows, setShows] = useState<Show[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);

  const fetchShows = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (search) {
        params.set("search", search);
      }

      if (status) {
        params.set("status", status);
      }

      const response = await fetch(
        `/api/shows?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load shows."
        );
      }

      setShows(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load shows."
      );
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  async function deleteShow(id: number) {
    if (!confirm("Are you sure you want to delete this show?")) {
      return;
    }

    try {
      setError(null);

      const response = await fetch(`/api/shows/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete show."
        );
      }

      await fetchShows();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete show."
      );
    }
  }

  function openAddForm() {
    setEditingShow(null);
    setShowForm(true);
  }

  function openEditForm(show: Show) {
    setEditingShow(show);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingShow(null);
  }

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setStatus("");
  }

  const hasFilters = Boolean(searchInput || status);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
              Personal Library
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Watchlist
            </h1>

            <p className="mt-1 text-gray-500">
              Keep track of the shows you want to watch.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            + Add Show
          </button>
        </header>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={fetchShows}
              className="shrink-0 font-medium underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Filters */}
        <section
          aria-label="Watchlist filters"
          className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <label htmlFor="search" className="sr-only">
                Search shows
              </label>

              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                ⌕
              </span>

              <input
                id="search"
                type="search"
                placeholder="Search shows..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label htmlFor="status-filter" className="sr-only">
                Filter by status
              </label>

              <select
                id="status-filter"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black sm:w-44"
              >
                <option value="">All statuses</option>

                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {formatStatus(item)}
                  </option>
                ))}
              </select>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* Count */}
        {!loading && !error && (
          <div className="mb-4 text-sm text-gray-500">
            {shows.length} {shows.length === 1 ? "show" : "shows"}
          </div>
        )}

        {/* List */}
        {!loading && shows.length === 0 ? (
          <EmptyState
            hasFilters={hasFilters}
            onClearFilters={clearFilters}
            onAdd={openAddForm}
          />
        ) : (
          <ShowList
            shows={shows}
            loading={loading}
            onEdit={openEditForm}
            onDelete={deleteShow}
          />
        )}
      </div>

      {showForm && (
        <ShowForm
          show={editingShow}
          onClose={closeForm}
          onSaved={async () => {
            closeForm();
            await fetchShows();
          }}
        />
      )}
    </main>
  );
}

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}