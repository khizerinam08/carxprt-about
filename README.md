# CarXprt website

The CarXprt About page and the home page redesign, built with Next.js 15 (App Router), React 19 and CSS Modules.

Live: https://carxprt-about.vercel.app

| Route | What it is |
| --- | --- |
| `/` | Home page: hero, pinned dealer-map walkthrough (desktop and phone), comparison, bento, plans, questions, close |
| `/about` | About us |

## Run it

Needs Node 20 or later.

```bash
cd web
npm install
npm run dev
```

Then open http://localhost:3000. `npm run build` makes a production build.

## Layout

- `web/app` – routes and global styles (`globals.css` holds the design tokens)
- `web/components` – sections; the home page's are in `home/` (hero, walkthrough, questions, the shared bento cell) and `home-v2/` (the rest)
- `web/lib` – content and sample data (each file checks its own numbers with `console.assert`)
- `web/public` – images and icons
- `PRODUCT.md` – what the product is and the rules the design follows
- `compare-sources.md` – sources for the comparison with other car sites

Deal figures, dealer names and chat lines on the site are sample content.
