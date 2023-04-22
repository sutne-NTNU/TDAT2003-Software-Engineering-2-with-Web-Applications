# Miniprosjekt i 'Systemutvikling 2' - Assignment 3 and 12

### om oppgaven:

Jeg har valgt å endre problemstillingen noe. og har valgt å lage et Student-forum hvor alle kan legge in
alt student relatert som f.eks. lure middagsideer, invitasjoner til aktiviteter, tips til eksamen,
dele forelesningsnotater osv.

### Dette er jeg fornøyd med

Jeg er meget fornøyd emd resultatet av denne nettsiden, til tross for en del problemer underveis fikk jeg til det
jeg mener er en godt strukturert og behagelig nettside, hvor all funksjonalitet fungerer slik den skal, og alle
kravene som ble stilt er oppfylt. Når det er sagt føler jeg ikke at nettsiden er ferdig.

### Dette skulle jeg ønske jeg kunne forbedre

Det jeg ikke er særlig fornøyd med er at jeg ikke fikk tid til å fullføre overgangen til sequalize på grunn
av dårlig planlegging fra min side, og mangel på tid (den uferdige koden er forøvrig lagt inn unnder /server/src/Sequalize).
Det eneste som manglet var å implementere testene ordentelig, men rakk dessverre ikke det.

Hadde også håpet å få byttet om til websockets istedenfor å polle databasen for å sjekke
etter nye artikler, men av samme årsak som tidligere, tid, så får jeg utsette dette til neste prosjekt.

Angående klient tester, er dette noe jeg følte meg meget usikker på, for det første var dette noe vi har hatt minimalt
med stoff om, for det andre var det var vanskelig å sette seg inn i eksempelkoden og tilpasse dette til mine egne
widgets og fortsatt få noe brukbart ut av testene, dermed falt de nedover på prioriteringene mine og ble byttet ut
med andre oppgaver jeg mener var viktigere og/eller morsommere.

# Oppstart og kjøring:

## Client:

Fra øverste mappe:

```sh
cd client
npm install
npm test
npm start
```

## Server:

Programmet bruker min database, så ikke noe behov for å sette opp noe database selv.

dersom du derimot ønsker ligger et script for å opprette tabellene og data under:

/server/src/create_tables_and_data.sql

Fra øverste mappe:

```sh
cd server
npm install
npm test
npm start
```

## Åpne programmet

når serveren er startet:

følg denne lenken: http://localhost:8888
