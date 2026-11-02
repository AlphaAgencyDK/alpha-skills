---
name: alphaai-linkedin-post
description: Writes LinkedIn posts in alpha.ai's company brand voice (Danish) and renders a matching branded graphic to JPG/PNG from one of seven templates (statement, big number, chat, dashboard, diagonal, orange, photo). Use when someone asks for an alpha.ai LinkedIn post, a company post, a brand post, a post "for the alpha.ai page", or an alpha.ai SoMe graphic. Not for personal-profile posts or client emails.
---

# alpha.ai LinkedIn-opslag: brand-stemme + branded grafik

Du laver et LinkedIn-opslag der repræsenterer **firmaet alpha.ai**, ikke en person. Det
giver to ting: (1) opslagets tekst, (2) en branded grafik renderet til JPG.

Er opslaget til en personlig profil, er det ikke denne skill. Ved tvivl, spørg.

Skill-mappen er den mappe denne SKILL.md ligger i. Den har:
- `references/brand.md`: stemme, budskab, målgruppe og visuel identitet fra Alpha AI Brand
  Guide 05. **Læs den først.**
- `references/templates.md`: hvilken skabelon der passer til hvad.
- `templates/*.html`: de syv grafik-skabeloner.
- `scripts/render.mjs`: renderer HTML til JPG/PNG på Windows, macOS og Linux.

## Kerneprincipper

1. **Hvert opslag trækker mod et business goal**, oftest at de rigtige SMV'er ser alpha.ai
   som dem der finder *hvor* software og AI skaber værdi, med en blød pegen mod en gratis
   snak eller audit. Aldrig hårdt salg.
2. **Brand-stemme, ikke personlig stemme.** "I/jer", hele sætninger, professionel varme.
   Reglerne står i `references/brand.md` og gælder også teksten i grafikken.
3. **Anti-hype virker.** Afmonter AI-hype frem for at puste til den.
4. **Grafikken bærer én pointe** fra opslaget. Ikke AI-genererede illustrationer, ikke Canva.
5. **Tekst i chatten, billede som fil.** Byg først grafikken når brugeren har valgt.
6. **Intet går live uden godkendelse.** Skillen leverer udkast. Den poster aldrig selv.
7. **Brug ikke usikker positionering.** Afsnit i `brand.md` markeret
   [AFVENTER BEKRÆFTELSE] er retning, ikke citat. Ingen tagline i grafik.

## Workflow

```
- [ ] 0. Intake: mål, tema, segment, vinkel
- [ ] 1. Læs references/brand.md
- [ ] 2. Skriv 1-2 opslag i chatten
- [ ] 3. Brugeren vælger opslag, hook-linje, skabelon og format
- [ ] 4. Byg grafikken fra skabelonen
- [ ] 5. Render og se billedet
- [ ] 6. Mind om godkendelse før opslaget postes
```

### 0. Intake

Saml fire ting, men spørg kun om det brugeren ikke allerede har givet. Brug
`AskUserQuestion` hvis værktøjet findes, ellers ét kort spørgsmål i chatten.

| Spørgsmål | Eksempler |
|---|---|
| Business goal | Awareness hos SMV'er (standard) · en bestemt ydelse · en case · rekruttering |
| Tema | "Software skal passe til jer" · ejerskab, ingen lock-in · "AI behøver ikke være stort" · en case |
| Segment | Bredt SMV (standard) · en branche fra `brand.md` |
| Vinkel | Anti-hype (virker bedst) · rådgivende · case/bevis · holdning |

Foreslå gerne 2-3 konkrete tema-vinkler hvis brugeren er i tvivl.

### 1. Kontekst

Læs `references/brand.md` helt. Standardmålet er awareness hos SMV'er med en blød pegen mod
en gratis snak eller audit.

### 2. Skriv opslaget

Følg buen, men lad den føles naturlig:
1. **Hook**: en påstand der modsiger noget folk tror, eller et genkendeligt kundecitat
   ("Vi skal også til at lave noget med AI.").
2. **Indsigt**: afmonter misforståelsen roligt.
3. **Reframe**: den lille, universelle sandhed.
4. **Sådan ser vi det i praksis**: 3-4 konkrete punkter, gerne hele sætninger.
5. **Afrunding og blød CTA**: slut med et ægte spørgsmål til læseren.

150-300 ord. Lever 1-2 udkast og skriv kort hvilket mål hvert trækker mod.

Tjek før du viser dem: ingen "du/din", ingen tankestreg (—), intet ord fra forbudslisten.

### 3. Brugeren vælger

Få at vide: hvilket opslag, hvilken linje der bliver grafikkens hook, hvilken skabelon
(foreslå én ud fra `references/templates.md`) og hvilket format:

| Format | `--size` | Brug |
|---|---|---|
| Stående 4:5 | `1080x1350` | Standard. Fylder mest i mobil-feedet |
| Kvadrat | `1080x1080` | Når brugeren beder om det |

### 4. Byg grafikken

1. Kopiér skabelonen fra `templates/` til en arbejdsmappe uden for skill-mappen (skill-mappen
   bliver overskrevet ved opdateringer). Brug brugerens nuværende mappe, eller en
   `alphaai-grafik/`-mappe i deres hjemmemappe. Navn: `linkedin-alphaai-<slug>.html`.
2. Redigér kun tekstfelterne beskrevet i kommentaren øverst i filen. Rør ikke logo-SVG'en
   eller farverne (de følger brand guiden). Juster kun en skriftstørrelse hvis teksten ikke
   kan passe.
3. Foto-skabelonen: sæt `src` til billedets absolutte `file:///`-sti.

### 5. Render og se billedet

```
node "<skill-mappe>/scripts/render.mjs" "<arbejdsfil>.html" "<arbejdsfil>.jpg" --size 1080x1350
```

Scriptet finder selv Chrome, Edge, Chromium eller Brave og tjekker at billedet har de rigtige
mål. Brug `.png` som endelse for PNG. `CHROME_PATH` kan pege på en bestemt browser.

**Hvis Node ikke er installeret**, kør browseren direkte med samme flag:

```
<browser> --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --virtual-time-budget=6000 --window-size=1080,1350 --screenshot=<ud>.jpg file:///<arbejdsfil>.html
```

Typiske stier: Windows `C:\Program Files\Google\Chrome\Application\chrome.exe` eller
`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`; macOS
`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`; Linux `google-chrome` eller
`chromium`. Tilføj `--no-sandbox` på Linux.

**Hvis der ingen browser er** (fx i claude.ai), giv brugeren HTML-filen og sig at den skal
renderes fra Claude Code på deres egen computer, eller åbnes i Chrome og gemmes som billede i
1080×1350. Sig det ligeud; lad være med at påstå at billedet er lavet.

Åbn altid det færdige billede og se på det før du melder færdig: ingen afklippet tekst, accent
på det rigtige ord, rammen hel, logoet synligt nederst i midten. Giv brugeren den fulde sti.

### 6. Godkendelse

Brand-opslag skal godkendes af ledelsen før de postes. Mind brugeren om det når du leverer
tekst og billede.

## Typiske fejl

| Fejl | Gør i stedet |
|---|---|
| "Du/din" i tekst eller grafik | "I/jer". Det gælder også skabelonernes eksempeltekst, hvis den genbruges |
| Tankestreg (—) | Komma eller punktum |
| Gammel tagline eller opfundne tal | Kun bekræftet positionering og offentliggjorte cases |
| Arbejdsfil gemt i skill-mappen | Den forsvinder ved næste opdatering. Gem uden for |
| Melder færdig uden at se billedet | Åbn det og tjek det |
| Lover at opslaget går live | Skillen laver udkast. Ledelsen godkender |
