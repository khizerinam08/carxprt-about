# CarXprt website

The CarXprt About page and the home page redesign, built with Next.js 15 (App Router), React 19 and CSS Modules.

Live: https://carxprt-about.vercel.app

| Route | What it is |
| --- | --- |
| `/` | About us |
| `/home` | Home page, first version |
| `/home-v2` | Home page, current version: hero, pinned dealer-map walkthrough (desktop and phone), comparison, bento, plans, questions, close |

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
- `web/components` – sections; `home/` is shared by both home versions, `home-v2/` is the current one's own
- `web/lib` – content and sample data (each file checks its own numbers with `console.assert`)
- `web/public` – images and icons
- `PRODUCT.md` – what the product is and the rules the design follows
- `compare-sources.md` – sources for the comparison with other car sites

Deal figures, dealer names and chat lines on the site are sample content.
