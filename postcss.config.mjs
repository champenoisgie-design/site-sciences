<<<<<<< HEAD
// postcss.config.mjs
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [tailwindcss, autoprefixer],
=======
/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
>>>>>>> 47c9ff3 (chore(postcss): config v4 (@tailwindcss/postcss + autoprefixer) + import Tailwind)
};
