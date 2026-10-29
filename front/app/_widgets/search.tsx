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
    <div>
      <input
        placeholder="Input filter query"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      ></input>
      <button
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
        Filter
      </button>
    </div>
  );
}
