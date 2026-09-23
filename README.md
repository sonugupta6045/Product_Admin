# Product Admin Dashboard

A full-featured product management dashboard built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Axios** — wired to the free [DummyJSON API](https://dummyjson.com).

## Features

| Feature | Details |
|---|---|
| **Auth** | Login / Logout with HttpOnly cookie session; server-side middleware route guard |
| **Product list** | Responsive table (desktop) + cards (mobile) from a single fetch |
| **Pagination** | Page buttons, Prev/Next, page-size selector (10/20/50), "Showing X–Y of Z" |
| **Search** | Debounced (~500 ms), race-condition safe (AbortController), resets to page 1 |
| **Filter & Sort** | Category filter + sort by price/rating/title; all state in URL params |
| **Product details** | Image gallery, description, reviews, not-found state |
| **Add / Edit** | Validated form, submit guard, optimistic local state |
| **Delete** | Confirmation dialog, optimistic local state |
| **Async states** | Loading skeletons, empty states, error banners with Retry on every page |

## ⚠️ Important: DummyJSON Mutations

> DummyJSON **does not persist** Add / Edit / Delete operations server-side.
> All mutation API calls are made (visible in DevTools Network tab), but the responses are used only to update **local React state** for the current session.
> Changes will **reset on page refresh**.
>
> This is an API limitation of DummyJSON, not a bug. A real production app would point to a writable backend.

## DummyJSON Search + Category Limitation

DummyJSON's `/products/search?q=` and `/products/category/:name` are separate endpoints that cannot be combined. **Decision**: category filtering is disabled while a search term is active, with an on-screen notice. Sorting works in both modes (client-side over the current page).

## Tech Decisions

- **No React Query / SWR** — fetching, caching, and abort logic are written with plain hooks.
- **No table/pagination library** — all built from scratch.
- **One Axios instance** (`lib/axios.ts`) — the only file that imports `axios` directly; all others import from it.
- **URL-driven state** — page, search, category, and sort are query params, so links are shareable and refresh-safe.

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

**Demo credentials:** username `emilys` / password `emilyspass`

## Project Structure

```
app/
  login/page.tsx               # Login form
  products/page.tsx            # List + search + filter + sort + pagination
  products/[id]/page.tsx       # Detail page
  products/[id]/edit/page.tsx  # Edit form
  products/new/page.tsx        # Add form
  api/auth/login/route.ts      # HttpOnly cookie setter
  api/auth/logout/route.ts     # Cookie clear
middleware.ts                  # /products/** route guard
lib/
  axios.ts                     # Shared Axios instance + interceptors
  api/auth.ts                  # Auth API calls
  api/products.ts              # Product API calls
  hooks/useProducts.ts         # Fetch + abort + URL param sanitisation
  hooks/useDebounce.ts         # Generic debounce
components/
  Sidebar.tsx                  # Navigation + logout
  ProductTable.tsx             # Desktop table
  ProductCards.tsx             # Mobile cards
  Pagination.tsx               # Page controls
  SearchBar.tsx                # Debounced search input
  FilterSortBar.tsx            # Category + sort dropdowns
  ProductForm.tsx              # Add/edit form with validation
  ConfirmDialog.tsx            # Delete confirmation modal
  AsyncState.tsx               # Loading / empty / error wrapper
types/index.ts                 # Shared TypeScript types
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/product-admin-dashboard)

> No environment variables required — uses the public DummyJSON API.
