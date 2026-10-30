"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function makeSearchQuery(input: string) {
  return new URLSearchParams({ q: input }).toString();
}

export function Search() {
  const router = useRouter();
  const params = useSearchParams();

  const [query, setQuery] = useState(params.get("q") ?? "");

  return (
    <div className="input-group shadow-none outline-none">
      <input
        placeholder="Input filter query"
        type="text"
        className="form-control"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      ></input>
      <button
        className="btn btn-dark right-button"
        onClick={() => {
          const url = new URL(window.location.toString());
          if (query !== "") {
            url.search = makeSearchQuery(query);
          } else {
            url.search = "";
          }

          url.pathname = "/";
          router.push(url.toString());
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-search"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </button>
    </div>
  );
}
