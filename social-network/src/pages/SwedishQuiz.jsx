import React from 'react';
import QuizPage from '../components/QuizPage';

const SwedishQuiz = () => (
  <QuizPage
    language="sv"
    languageCode="sv"
    pageTitle="Glatt Samtal 🇸🇪"
    subtitle="Lär dig svenska med glädje! (Learn with joy)"
    rawData={`Nybörjare|How do you say 'Happy' in Swedish?|Glad|Ledsen||Arg||Trött
Nybörjare|The most common greeting for 'Hello':|Hej|Hej då||Tack||Varsågod
Nybörjare|How do you say 'Thank you'?|Tack|Varsågod||Ursäkta||Välkommen
Nybörjare|What is 'Friend' in Swedish?|Vän|Fiende||Granne||Bror
Nybörjare|How do you say 'Good morning'?|God morgon|God kväll||God natt||God dag
Nybörjare|What does 'Vackert' mean?|Beautiful|Fult||Kallt||Långt
Nybörjare|Which word means 'Smile'?|Leende|Tår||Sömn||Mat
Nybörjare|How to say 'I love you'?|Jag älskar dig|Jag ser dig||Jag hör dig||Jag väntar
Nybörjare|What is 'Success'?|Framgång|Misslyckande||Rädsla||Slut
Nybörjare|How to say 'Welcome'?|Välkommen|Hej då||Ursäkta||Förlåt
Nybörjare|Word for 'Sun':|Sol|Måne||Stjärna||Moln
Nybörjare|How do you say 'Water'?|Vatten|Eld||Jord||Luft
Nybörjare|What is 'Mat'?|Food|Dryck||Sömn||Lek
Nybörjare|Word for 'Big':|Stor|Liten||Hög||Låg
Nybörjare|How do you say 'House'?|Hus|Skola||Kontor||Affär
Nybörjare|What is 'Kärlek'?|Love|Hat||Hopp||Fred
Nybörjare|Translate 'Today':|Idag|Imorgon||Igår||Ikväll
Nybörjare|How to say '1'?|Ett|Två||Tre||Fyra
Nybörjare|What is 'Skola'?|School|Sjukhus||Bibliotek||Park
Nybörjare|Word for 'Dog':|Hund|Katt||Fågel||Fisk
Nybörjare|How to say 'I'm sorry'?|Förlåt|Hej||Tack||Snälla
Nybörjare|What does 'Kallt' mean?|Cold|Varmt||Svalt||Torrt
Nybörjare|Word for 'Child':|Barn|Vuxen||Farbror||Moster
Nybörjare|How to say 'Yes' in Swedish?|Ja|Nej||Kanske||Aldrig
Nybörjare|What is 'Natt'?|Night|Dag||Morgon||Kväll
Nybörjare|Word for 'Strong':|Stark|Svag||Snabb||Långsam
Nybörjare|How to say 'No'?|Nej|Ja||Ofta||Alltid
Nybörjare|What is 'Fisk'?|Fish|Fågel||Katt||Hund
Nybörjare|Word for 'White':|Vit|Svart||Grå||Brun
Nybörjare|How to say 'Please' (requesting)?|Snälla|Tack||Ja||Nej
Nybörjare|What does 'Ljus' mean?|Light|Mörker||Skugga||Natt
Nybörjare|Word for 'Life':|Liv|Död||Sömn||Dröm
Nybörjare|How do you say 'Book'?|Bok|Penna||Papper||Bord
Nybörjare|What is 'Måne'?|Moon|Sol||Stjärna||Himmel
Nybörjare|Word for 'Green':|Grön|Röd||Blå||Gul
Medel|How do you say 'Good luck'?|Lycka till|Ha en resa||Smaklig måltid||Sov gott
Medel|What is 'Hope' in Swedish?|Hopp|Förtvivlan||Glädje||Fred
Medel|Translate: 'Everything is fine.'|Allt är bra|Allt är dåligt||Jag vet inte||Vänta lite
Medel|What does 'Sakta' mean?|Slowly|Snabbt||Hårt||Tyst
Medel|How to say 'I am proud of you'?:|Jag är stolt över dig|Jag är arg på dig||Jag väntar på dig||Jag ser dig
Medel|What is 'Överraskning' in English?|Surprise|Tråkigt||Sorg||Ilska
Medel|Translate 'Experience':|Erfarenhet|Hopp||Dröm||Uppgift
Medel|How do you say 'Opportunity'?|Möjlighet|Hinder||Problem||Misslyckande
Medel|What does 'Var försiktig' mean?|Be careful|Var glad||Var snabb||Var tyst
Medel|Translate 'Important':|Viktigt|Lätt||Snabbt||Billigt
Medel|How do you say 'Health'?|Hälsa|Styrka||Rikedom||Skönhet
Medel|What is 'Självförtroende'?|Self-confidence|Blyg||Rädd||Lat
Medel|Translate 'Environment':|Miljö|Rum||Hus||Gata
Medel|How do you say 'Challenge'?|Utmaning|Present||Hjälp||Stöd
Medel|What is 'Hårt arbete'?|Hard work|Lat dag||Enkel uppgift||Fritid
Medel|Translate 'Progress':|Framsteg|Bakslag||Död||Födelse
Medel|How to say 'I agree'?|Jag håller med|Jag vill inte||Jag är förvirrad||Jag går
Medel|What does 'Olika' mean?|Different|Lika||Samma||Gemensam
Medel|Translate 'Respect':|Respekt|Hat||Rädsla||Ilska
Medel|How to say 'Believe'?|Tro|Tveka||Fråga||Tystnad
Medel|What is 'Framtiden'?|The future|Det förflutna||Nutiden||Idag
Medel|Translate 'Create':|Skapa|Förstöra||Vänta||Söka
Medel|How do you say 'Freedom'?|Frihet|Beroende||Plikt||Börda
Medel|What is 'Samarbete'?|Collaboration|Konkurrens||Konflikt||Undvikande
Medel|Translate 'Change':|Förändring|Ordning||Tystnad||Slut
Medel|How to say 'Happy' (formal)?|Lycklig|Olycklig||Besviken||Arg
Medel|What is 'Känslor'?|Feelings|Tankar||Handlingar||Vision
Medel|Translate 'Grateful':|Tacksam|Klagande||Arg||Ledsen
Medel|How to say 'Celebrate'?|Fira|Gråta||Lämna||Glömma
Medel|What is 'Inspiration'?|Inspiration|Tristess||Tystnad||Rädsla
Medel|Translate 'Honest':|Ärlig|Oärlig||Rädd||Tveksam
Medel|How to say 'Beautiful' (scenery)?|Vacker|Ful||Okej||Smutsig
Medel|What is 'Kommunikation'?|Communication|Tystnad||Gräl||Kamp
Medel|Translate 'Kindness':|Vänlighet|Elakhet||Hat||Ilska
Medel|How to say 'Patience'?|Tålamod|Ilska||Oro||Rädsla
Expert|What is 'Fröjd'?:|Joy / Happiness|Arbete||Sorg||Snabbhet
Expert|Translate 'Peace':|Fred|Krig||Vrede||Oljud
Expert|Final one! How do you say 'Stay happy'?:|Var glad|Var ledsen||Gå bort||Arbeta hårt
Expert|What is 'Mångfald'?|Diversity|Enfald||Likhet||Samma
Expert|Translate 'Integritet':|Integrity|Slarv||Lögn||Fusk
Expert|Meaning of 'Välfärd'?|Welfare|Fattigdom||Elände||Problem
Expert|What is 'Självständighet'?|Independence|Beroende||Svaghet||Rädsla
Expert|Translate 'Solidaritet':|Solidarity|Splittring||Hat||Avund
Expert|What is 'Visdom'?|Wisdom|Dårskap||Okunnighet||Girighet
Expert|Translate 'Medkänsla':|Compassion|Grymhet||Hat||Ilska
Expert|Meaning of 'Hållbarhet'?|Sustainability|Förstörelse||Förorening||Slöseri
Expert|What is 'Rättvisa'?|Justice|Orättvisa||Kaos||Korruption
Expert|Translate 'Harmoni':|Harmony|Konflikt||Buller||Ilska
Expert|Meaning of 'Oberoende'?|Independence|Slaveri||Kolonialism||Styre
Expert|What is 'Elegans'?|Elegance|Klumpighet||Fulhet||Grovhet
Expert|Translate 'Bibliotek':|Library|Bokhandel||Skola||Klassrum
Expert|Meaning of 'Lojalitet'?|Loyalty|Svek||Hat||Ilska
Expert|What is 'Kreativitet'?|Creativity|Efterlikning||Tristess||Lata
Expert|Translate 'Mod':|Courage|Rädsla||Feghet||Blyghet
Expert|Meaning of 'Uppriktighet'?|Sincerity|Hypokrisi||Lögn||Girighet
Expert|What is 'Ära'?|Glory / Honor|Skam||Förlust||Nederlag
Expert|Translate 'Psykisk hälsa':|Mental health|Fysisk smärta||Sjuk kropp||Svag ande
Expert|Meaning of 'Gästvänlighet'?|Hospitality|Oartighet||Kyla||Ilska
Expert|What is 'Mirakel'?|Mirakel|Katastrof||Olycka||Vanligt
Expert|Translate 'Empowerment':|Egenmakt|Begränsning||Svaghet||Rädsla
Expert|Meaning of 'Uthållighet'?|Endurance / Perseverance|Slut||Stopp||Slöseri
Expert|What is 'Generositet'?|Generosity|Girighet||Själviskhet||Snålhet
Expert|Translate 'Innovation':|Innovation|Stagnation||Tradition||Gammalt`}
    speechLocale="sv-SE"
    primaryColor="#3b82f6"
    primaryHover="#2563eb"
    resultTitle="Fantastiskt! (Fantastic!)"
    resultMessage="Du är fantastisk på svenska!"
    retryLabel="Försök igen"
    levelLabels={{
      "Nybörjare": "Beginner",
      "Medel": "Intermediate",
      "Expert": "Expert"
    }}
  />
);

export default SwedishQuiz;
