import React from 'react';
import QuizPage from '../components/QuizPage';

const DutchQuiz = () => (
  <QuizPage
    language="nl"
    languageCode="nl"
    pageTitle="HAPPYY TALK Dutch 🇳🇱"
    subtitle="Leer Nederlands met plezier! (Learn with pleasure!)"
    rawData={`Beginner|Hoe zeg je 'Happy' in het Nederlands?|Blij|Verdrietig||Boos||Moe
Beginner|Wat is de meest voorkomende begroeting voor 'Hallo'?|Hallo|Doei||Bedankt||Alstublieft
Beginner|Hoe zeg je 'Dank je'?|Dank u wel|Graag gedaan||Sorry||Pardon
Beginner|Wat is 'Vriend' in het Nederlands?|Vriend|Vijand||Buurman||Broer
Beginner|Hoe zeg je 'Goedemorgen'?|Goedemorgen|Goedenavond||Goedenacht||Dag
Beginner|Wat betekent 'Mooi'?|Beautiful|Lelijk||Koud||Ver away
Beginner|Welk woord betekent 'Glimlach'?|Glimlach|Traan||Slaap||Eten
Beginner|Hoe zeg je 'Ik hou van jou'?|Ik hou van jou|Ik zie je||Ik hoor je||Ik wacht
Beginner|Wat is 'Succes'?|Succes|Fout||Angst||Einde
Beginner|Vertaal 'Welkom':|Welkom|Doei||Pardon||Klaar
Beginner|Woord voor 'Zon':|Zon|Maan||Ster||Wolk
Beginner|Hoe zeg je 'Water'?|Water|Vuur||Aarde||Lucht
Beginner|Wat is 'Eten'?|To eat|Drinken||Slapen||Spelen
Beginner|Woord for 'Groot':|Groot|Klein||Hoog||Laag
Beginner|Hoe zeg je 'Huis'?|Huis|School||Kantoor||Winkel
Beginner|Wat is 'Liefde'?|Love|Haat||Hoop||Vrede
Beginner|Vertaal 'Vandaag':|Vandaag|Morgen||Gisteren||Vanavond
Beginner|Hoe zeg je '1'?|Een|Twee||Drie||Vier
Beginner|Wat is 'School'?|School|Ziekenhuis||Bibliotheek||Park
Beginner|Woord voor 'Hond':|Hond|Kat||Vogel||Vis
Beginner|Hoe zeg je 'Sorry'?|Sorry|Hallo||Bedankt||Alsjeblieft
Beginner|Wat betekent 'Koud'?|Cold|Warm||Heet||Droog
Beginner|Woord voor 'Kind':|Kind|Volwassene||Oom||Tante
Beginner|Hoe zeg je 'Ja' in het Nederlands?|Ja|Nee||Misschien||Nooit
Beginner|Wat is 'Nacht'?|Night|Dag||Morgen||Avond
Beginner|Woord voor 'Sterk':|Sterk|Zwak||Snel||Langzaam
Beginner|Hoe zeg je 'Nee'?|Nee|Ja||Vaak||Altijd
Beginner|Wat is 'Vis'?|Fish|Vogel||Kat||Hond
Beginner|Woord voor 'Wit':|Wit|Zwart||Grijs||Bruin
Beginner|Hoe zeg je 'Alsjeblieft' (requesting)?|Alsjeblieft|Bedankt||Ja||Nee
Beginner|Wat betekent 'Licht'?|Light|Donker||Schaduw||Nacht
Beginner|Woord voor 'Leven':|Leven|Dood||Slaap||Droom
Beginner|Hoe zeg je 'Boek'?|Boek|Pen||Papier||Tafel
Beginner|What is 'Maan'?|Moon|Zon||Ster||Hemel
Beginner|Woord voor 'Groen':|Groen|Rood||Blauw||Geel
Beginner|Hoe zeg je 'Moeder'?|Moeder|Vader||Broer||Zus
Gemiddeld|Hoe zeg je 'Veel geluk'?|Veel geluk|Goede reis||Eet smakelijk||Beterschap
Gemiddeld|What is 'Hoop' in het Nederlands?|Hoop|Wanhoop||Geluk||Vrede
Gemiddeld|Vertaal: 'Alles is goed.'|Alles is goed|Alles is kapot||Ik weet het niet||Wacht even
Gemiddeld|Wat betekent 'Langzaam'?|Slowly|Snel||Hard||Stil
Gemiddeld|Hoe zeg je 'Ik ben trots op je'?:|Ik ben trots op je|Ik ben boos op je||Ik wacht op je||Ik zie je
Gemiddeld|Wat is 'Verrassing' in het Engels?|Surprise|Verveling||Verdriet||Woede
Gemiddeld|Vertaal 'Ervaring':|Ervaring|Hoop||Droom||Opdracht
Gemiddeld|Hoe zeg je 'Kans'?|Kans|Hindernis||Probleem||Fout
Gemiddeld|Wat betekent 'Pas op' mean?|Be careful|Wees blij||Wees snel||Wees stil
Gemiddeld|Vertaal 'Belangrijk':|Belangrijk|Makkelijk||Snel||Goedkoop
Gemiddeld|Hoe zeg je 'Gezondheid'?|Gezondheid|Kracht||Rijkdom||Schoonheid
Gemiddeld|Wat is 'Zelfvertrouwen'?|Self-confidence|Verlegen||Bang||Lui
Gemiddeld|Vertaal 'Milieu':|Milieu|Kamer||Huis||Straat
Gemiddeld|Hoe zeg je 'Uitdaging'?|Uitdaging|Cadeau||Hulp||Steun
Gemiddeld|Wat is 'Hard werken'?|Hard work|Luie dag||Makkelijke taak||Vrije tijd
Gemiddeld|Vertaal 'Vooruitgang':|Vooruitgang|Achteruitgang||Dood||Geboorte
Gemiddeld|Hoe zeg je 'Ik ben het ermee eens'?|Ik ben het ermee eens|Ik wil niet||Ik ben in de war||Ik ga
Gemiddeld|Wat betekent 'Anders'?|Different|Hetzelfde||Gelijk||Soortgelijk
Gemiddeld|Vertaal 'Respect':|Respect|Haat||Angst||Woede
Gemiddeld|Hoe zeg je 'Geloven'?|Geloven|Twijfelen||Vragen||Zwijgen
Gemiddeld|Wat is 'Toekomst'?|Future|Verleden||Heden||Vandaag
Gemiddeld|Vertaal 'Creëren':|Creëren|Vernietigen||Wachten||Zoeken
Gemiddeld|Hoe zeg je 'Vrijheid'?|Vrijheid|Afhankelijkheid||Plicht||Last
Gemiddeld|Wat is 'Samenwerking'?|Collaboration|Concurrentie||Conflict||Vermijden
Gemiddeld|Vertaal 'Verandering':|Verandering|Orde||Cisza||Einde
Gemiddeld|Hoe zeg je 'Gelukkig' (formal)?|Gelukkig|Ongelukkig||Teleurgesteld||Boos
Gemiddeld|Wat is 'Gevoelens'?|Feelings|Gedachten||Acties||Visie
Gemiddeld|Vertaal 'Dankbaar':|Dankbaar|Klagend||Boos||Verdrietig
Gemiddeld|Hoe zeg je 'Viering'?|Vieren|Huilen||Verlaten||Vergeten
Gemiddeld|Wat is 'Inspiratie'?|Inspiration|Verveling||Stilte||Angst
Gemiddeld|Vertaal 'Eerlijk':|Eerlijk|Oneerlijk||Bang||Twijfelachtig
Gemiddeld|Hoe zeg je 'Mooi' (scenery)?|Prachtig|Lelijk||Oké||Vies
Gemiddeld|Wat is 'Communicatie'?|Communication|Stilte||Ruzie||Gevecht
Gemiddeld|Vertaal 'Vriendelijkheid':|Vriendelijkheid|Gemenheid||Haat||Woede
Gemiddeld|Hoe zeg je 'Geduld'?|Geduld|Woede||Onrust||Angst
Expert|Wat is 'Vrijheid'?|Vrijheid|Gevangenis||Werk||Geld
Expert|Wat betekent 'Hup Holland Hup'?|Hup Holland Go!|Stop de regen||Koop kaas||Slaap lekker
Expert|Vertaal 'Vrede':|Vrede|Oorlog||Ruzie||Lawaai
Expert|Wat is 'Zonneschijn'?|Zonneschijn|Regen||Sneeuw||Wind
Expert|Laatste! Hoe zeg je 'Doei' informeel?|Doei!|Hallo||Ja||Nee
Expert|Wat is 'Diversiteit'?|Diversity|Eenheid||Gelijkheid||Hetzelfde
Expert|Vertaal 'Integriteit':|Integriteit|Nalatigheid||Leugen||Fraude
Expert|Wat betekent 'Welvaart'?|Prosperity / Welfare|Armoede||Ellende||Probleem
Expert|Wat is 'Onafhankelijkheid'?|Independence|Afhankelijkheid||Zwakte||Angst
Expert|Vertaal 'Solidariteit':|Solidariteit|Verdeeldheid||Haat||Afgunst
Expert|Wat is 'Wijsheid'?|Wijsheid|Dwaasheid||Onwetendheid||Hebzucht
Expert|Vertaal 'Medeleven':|Compassion|Wreedheid||Haat||Woede
Expert|Wat betekent 'Duurzaamheid'?|Sustainability|Vernietiging||Vervuiling||Verspilling
Expert|Wat is 'Rechtvaardigheid'?|Justice|Onrechtvaardigheid||Chaos||Corruptie
Expert|Vertaal 'Harmonie':|Harmonie|Conflict||Lawaai||Woede
Expert|Wat betekent 'Soevereiniteit'?|Sovereignty|Slavernij||Kolonialisme||Bestuur
Expert|Wat is 'Elegantie'?|Elegance|Onhandigheid||Lelijkheid||Ruwigheid
Expert|Vertaal 'Bibliotheek':|Bibliotheek|Boekwinkel||School||Klaslokaal
Expert|Wat betekent 'Loyaliteit'?|Loyaliteit|Verraad||Haat||Woede
Expert|Wat is 'Creativiteit'?|Creativiteit|Imitatie||Verveling||Luiheid
Expert|Vertaal 'Moed':|Moed|Angst||Lafheid||Verlegenheid
Expert|Wat betekent 'Oprechtheid'?|Sincerity|Hypocrisie||Leugen||Hebzucht
Expert|Wat is 'Glorie'?|Glory / Honor|Schande||Verlies||Nederlaag
Expert|Vertaal 'Geestelijke gezondheid':|Mentale gezondheid|Fysieke pijn||Ziek lichaam||Zwakke geest
Expert|Wat betekent 'Gastvrijheid'?|Hospitality|Onbeleefdheid||Kou||Woede
Expert|Wat is 'Wonder'?|Mirakel|Catastrofe||Ongeluk||Gewoon
Expert|Vertaal 'Empowerment':|Empowerment|Beperking||Zwakte||Angst
Expert|Wat betekent 'Volharding'?|Persistence / Endurance|Einde||Stop||Verspilling
Expert|Wat is 'Vrijgevigheid'?|Generosity|Hebzucht||Zelfzuchtigheid||Gemenheid
Expert|Vertaal 'Innovatie':|Innovatie|Stagnatie||Traditie||Oud`}
    speechLocale="nl-NL"
    primaryColor="#3b82f6"
    primaryHover="#2563eb"
    resultTitle="Geweldig gedaan! (Great job!)"
    resultMessage="Je Nederlands is uitstekend!"
    retryLabel="Opnieuw spelen"
    levelLabels={{
      Beginner: 'Beginner',
      Gemiddeld: 'Intermediate',
      Expert: 'Expert'
    }}
  />
);

export default DutchQuiz;
