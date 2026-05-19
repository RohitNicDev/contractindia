import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ═════════════════════════════════════════════════════════════
// Polyfills for Windows 7 / Chrome 109 Compatibility
// ═════════════════════════════════════════════════════════════

// Ensure Promise exists (Chrome 109 has it, but this is defensive)
if (typeof window !== 'undefined' && !window.Promise) {
  console.warn('[Polyfill] Promise polyfill needed');
  window.Promise = Promise;
}

// Polyfill Object.entries for older environments
if (!Object.entries) {
  Object.entries = function(obj) {
    return Object.keys(obj).map(key => [key, obj[key]]);
  };
}

// Polyfill Array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      const O = Object(this);
      const len = parseInt(O.length) || 0;
      if (len === 0) {
        return false;
      }
      const n = parseInt(fromIndex) || 0;
      let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }
      while (k < len) {
        if (sameValueZero(O[k], searchElement)) {
          return true;
        }
        k++;
      }
      return false;
    },
  });
}

// Polyfill Object.assign for Chrome 109
if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    value: function assign(target) {
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      const to = Object(target);
      for (let index = 1; index < arguments.length; index++) {
        const nextSource = arguments[index];
        if (nextSource !== null && nextSource !== undefined) {
          for (const nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true,
  });
}

import { router } from "./routes";
import { AppToaster } from "./components/ui/sonner";

import "./index.css";
import "./styles.css";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <AppToaster />
    </QueryClientProvider>
  </React.StrictMode>,
);
