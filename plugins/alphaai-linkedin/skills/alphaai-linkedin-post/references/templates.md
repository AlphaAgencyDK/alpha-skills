# Grafik-skabeloner

Alle skabeloner ligger i `templates/` i skill-mappen. De er selvstændige HTML-filer og fylder
præcis den størrelse de renderes i, så samme fil virker til 1080×1350 (stående, standard) og
1080×1080 (kvadrat). Hver fil har en kommentar øverst med præcis hvad man redigerer.

| Skabelon | Fil | Brug den når | Tekstmængde |
|---|---|---|---|
| Statement | `statement.html` | Én skarp påstand fra opslaget. Standardvalget. Mørk variant: `<body class="dark">` | Hook 3-8 ord, subline 1 linje |
| Stort tal | `bignumber.html` | Et konkret resultat fra en offentliggjort case ("5 uger") | Tal 1-3 tegn, headline 1-2 linjer |
| Chat | `chat.html` | En AI-agent der svarer en kunde (kundeservice, booking) | 2-4 korte bobler |
| Dashboard | `dashboard.html` | Et custom system, ejerskab af egne data | 3 tal, 4-5 menupunkter |
| Diagonal | `diagonal.html` | Problem → løsning i to dele | Problem 1-2 linjer, svar 1 linje |
| Orange | `orange.html` | Kort, højt brand-statement (ejerskab, holdning) | Headline 2-4 ord |
| Foto | `photo.html` | Et rigtigt billede af en fra holdet | Headline 2 linjer |

Regler for alle:
- Én pointe per grafik. Den skal kunne læses på ét sekund.
- Orange accent på ét ord eller én frase, ikke flere.
- Ingen tankestreg (—). "I/jer", aldrig "du".
- Ingen rigtige kundedata, navne eller tal i chat/dashboard, medmindre det er en
  offentliggjort case.
- Foto: kun billeder personen har sagt ja til bruges på firmasiden.
