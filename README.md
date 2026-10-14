# Vayron Visual Technologies, web stranica

Statička web stranica za Vayron Visual Technologies: mašinski izrađena 3D svjetleća i nesvjetleća slova.
Čisti HTML, CSS i JavaScript, bez build koraka i bez zavisnosti.

## Struktura

```
vayron-web/
├── index.html              # sav sadržaj stranice (početna + podstranice modela)
├── css/style.css           # svi stilovi, boje i fontovi su definisani kao varijable u :root
├── js/main.js              # meni, konfigurator, katalog modela, forme, video, rutiranje
└── assets/
    ├── img/
    │   ├── wordmark.png        # VAYRON logo (bijeli, providna pozadina, koristi se kao CSS maska)
    │   ├── favicon.svg         # V simbol
    │   ├── hero-poster.jpg     # prvi kadar dok se video učitava
    │   ├── svjetleca.jpg       # slika za tip "Svjetleća 3D slova"
    │   ├── nesvjetleca.jpg     # slika za tip "Nesvjetleća 3D slova"
    │   ├── logo-3d.jpg         # 3D zlatni logo (trenutno se ne koristi na stranici)
    │   └── logo-3d-original.png
    └── video/hero.mp4      # hero animacija (9 s, petlja, bez zvuka)
```

## Pokretanje lokalno

Otvorite `index.html` u pregledniku, ili pokrenite mali server (preporučeno, zbog videa):

```bash
python3 -m http.server 8000
# zatim otvorite http://localhost:8000
```

## Sekcije i podstranice

Početna: Hero (video) → Za vaš objekat → Zašto Vayron → Proizvodi → Konfigurator → Kako naručiti → Partnerski program → Upit i kontakt.

Podstranice modela otvaraju se preko hash linka i prikazuju se umjesto početne:

- `index.html#svjetleca`: modeli svjetlećih 3D slova
- `index.html#nesvjetleca`: modeli nesvjetlećih 3D slova

Podaci o modelima su u `js/main.js`, u objektu `MP`. Tipovi osvjetljenja za konfigurator su u nizu `TYPES`.

## Fontovi

Učitavaju se s Google Fonts (Michroma, Figtree, JetBrains Mono, te Archivo Black, Montserrat, Playfair Display i Bebas Neue za konfigurator). Svi su pod SIL Open Font License.

## Šta još treba uraditi

- [ ] Pravi kontakt podaci (telefon, email, adresa, društvene mreže): trenutno su izmišljeni
- [ ] Provjeriti tehničke podatke (tolerancija, visine, dubine) i partnerske popuste
- [ ] Povezati forme (partner prijava i upit) sa slanjem emaila, npr. Formspree, Netlify Forms ili vlastiti backend. Trenutno forme samo provjere podatke i prikažu potvrdu.
- [ ] Engleska verzija (dugme EN je isključeno)
- [ ] Prave slike za pojedinačne modele
- [ ] Hero video bez engleskog teksta, za bosansku verziju

## Hosting

Stranica radi na bilo kojem statičkom hostingu: GitHub Pages, Netlify, Vercel, Cloudflare Pages ili klasični hosting (upload preko FTP-a).
Za GitHub Pages: Settings → Pages → Source: "Deploy from a branch" → `main` / root.
