# Video Tracker

A simple client progress tracker for a videography business — like a parcel tracker, but for video projects.

A client enters their unique code (e.g. `VID-7K2Q9X`) and instantly sees where their project is: whether the shoot is done, when the video will be delivered, and any notes from the business. No login needed.

> **Note:** All client data in this repo is fake and used for development only.

## How it works

```
┌───────────────┐      ┌──────────────────────┐      ┌──────────────┐
│ Google Sheet  │ ───▶ │  Apps Script API     │ ───▶ │  Web page    │
│ (client data) │      │  ?code=VID-7K2Q9X    │      │ (index.html) │
└───────────────┘      │  returns JSON        │      └──────────────┘
                       └──────────────────────┘
```

1. **Google Sheet** — the business owner keeps one row per client (code, name, project type, shoot status, dates, notes).
2. **Apps Script API** (`api/Code.gs`) — a small backend published as a web app. It takes a client code from the URL, searches the sheet, and returns only that client's data as JSON.
3. **Web page** (`index.html`) — the client types their code, the page calls the API with `fetch`, and displays the result.

When the owner updates the sheet, clients see the change straight away — no redeploy needed.

### Example API response

`GET .../exec?code=VID-7K2Q9X`

```json
{
  "found": true,
  "name": "Sarah Mitchell",
  "project": "Wedding",
  "shoot_status": "Done",
  "shoot_date": "2026-10-18",
  "delivery_date": "2026-11-14",
  "delivery_note": "Final video sent by email"
}
```

Unknown code:

```json
{ "found": false }
```

## Tech used

- **Google Sheets** — data storage
- **Google Apps Script** — backend API (`doGet`, `SpreadsheetApp`, `ContentService`)
- **JavaScript** — `fetch`, `async`/`await`, JSON, DOM manipulation
- **HTML**
- **Git & GitHub**

## What I learned

- **How APIs work** — requests, responses, and query parameters (`?code=...`)
- **Building an API** — reading a sheet, looping through rows to find a match, and returning consistent JSON for both found and not-found cases
- **Consuming an API** — calling it from a web page with `fetch` and handling the response
- **Deployments** — the difference between Apps Script's `/dev` (latest saved code, owner only) and `/exec` (a published version anyone can use)
- **Debugging a real date bug** — dates from the sheet were showing a day early (e.g. `2026-10-15T13:00:00.000Z` instead of `2026-10-16`) because `JSON.stringify` converts dates to UTC. I fixed it with a `formatDate` helper that formats dates in the sheet's own time zone. Along the way I found that `instanceof Date` doesn't reliably detect sheet dates in Apps Script, and switched to `Object.prototype.toString.call(value) === "[object Date]"`.
- **Debugging approach** — adding a temporary marker field to confirm which version of the code was running, instead of guessing
- **Reading browser console errors** — e.g. working out that a CORS error was really a side effect of a 404 from a wrong URL

## How I used AI

I built this project with an AI coding assistant (Claude), using it deliberately: AI for the parts that don't teach me much, and writing the core logic myself so I understand every line.

**What AI did**

- Generated the fake client data (`sample-clients.csv`)
- Wrote the starter HTML layout (the input box, button and result area)
- Drafted this README, which I then edited
- Explained concepts as I went (APIs, JSON, `async`/`await`, CORS) and reviewed my code, pointing out bugs without rewriting it for me
- Suggested the `formatDate` helper and the `Object.prototype.toString` date check once I'd tracked down the time-zone bug

**What I wrote myself**

- The API logic in `doGet`: the loop that searches rows, the code comparison, and the found / not-found JSON responses
- The front-end JavaScript: reading and cleaning the input (`trim`, `toUpperCase`), calling the API with `fetch`, and handling the not-found case
- The debugging: testing codes, reading console errors, and adding a marker field to find out which code was running
- Git setup, commits and pushing to GitHub

**The rule I followed:** I only kept AI-written code I could explain line by line. When AI found a bug, I asked it to explain the cause instead of just fixing it.

## Running it yourself

1. Create a Google Sheet and import `sample-clients.csv` (**File → Import → Upload → Replace current sheet**).
2. In the sheet, open **Extensions → Apps Script** and paste in the contents of `api/Code.gs`.
3. **Deploy → New deployment → Web app**, with *Execute as: Me* and *Who has access: Anyone*. Copy the `/exec` URL.
4. In `index.html`, set `API_URL` to your `/exec` URL.
5. Open `index.html` in a browser and try a code like `VID-7K2Q9X`.

## Next steps

- [ ] Show progress as a visual pipeline (Shoot → Delivery) with done / current / upcoming stages
- [ ] Style the page and make it mobile-friendly
- [ ] Host it with GitHub Pages
- [ ] Add an AI assistant that answers client questions ("When will my video be ready?") using this API as a tool
- [ ] Use it with a real business's data
