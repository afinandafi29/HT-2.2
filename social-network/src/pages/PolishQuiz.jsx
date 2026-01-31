import React from 'react';
import QuizPage from '../components/QuizPage';

const PolishQuiz = () => (
  <QuizPage
    language="pl"
    languageCode="pl"
    pageTitle="Wesoła Rozmowa 🇵🇱"
    subtitle="Ucz się polskiego z radością! (Learn with joy)"
    rawData={`Początkujący|How do you say 'Happy' in Polish?|Szczęśliwy|Smutny||Zły||Zmęczony
Początkujący|The most common greeting for 'Hello':|Cześć|Żegnaj||Dziękuję||Proszę
Początkujący|How do you say 'Thank you'?|Dziękuję|Proszę||Przepraszam||Witaj
Początkujący|What is 'Friend' in Polish?|Przyjaciel|Wróg||Sąsiad||Brat
Początkujący|How do you say 'Good morning'?|Dzień dobry|Dobry wieczór||Dobranoc||Cześć
Początkujący|What does 'Pięknie' mean?|Beautiful|Brzydko||Zimno||Daleko
Początkujący|Which word means 'Smile'?|Uśmiech|Łza||Sen||Jedzenie
Początkujący|How to say 'I love you'?|Kocham cię|Widzę cię||Słyszę cię||Czekam
Początkujący|What is 'Success'?|Sukces|Porażka||Strach||Koniec
Początkujący|How to say 'Welcome'?|Witaj|Żegnaj||Przepraszam||Tak
Początkujący|Word for 'Sun':|Słońce|Księżyc||Gwiazda||Chmura
Początkujący|How do you say 'Water'?|Woda|Ogień||Ziemia||Powietrze
Początkujący|What is 'Jedzenie'?|Food|Picie||Sen||Zabawa
Początkujący|Word for 'Big':|Duży|Mały||Wysoki||Niski
Początkujący|How do you say 'House'?|Dom|Szkoła||Biuro||Sklep
Początkujący|What is 'Miłość'?|Love|Nienawiść||Nadzieja||Pokój
Początkujący|Translate 'Today':|Dzisiaj|Jutro||Wczoraj||Wieczorem
Początkujący|How to say '1'?|Jeden|Dwa||Trzy||Cztery
Początkujący|What is 'Szkoła'?|School|Szpital||Biblioteka||Park
Początkujący|Word for 'Dog':|Pies|Kot||Ptak||Ryba
Początkujący|How to say 'I'm sorry'?|Przepraszam|Cześć||Dziękuję||Proszę
Początkujący|What does 'Zimno' mean?|Cold|Gorąco||Ciepło||Sucho
Początkujący|Word for 'Child':|Dziecko|Dorosły||Wujek||Ciocia
Początkujący|How to say 'Yes' in Polish?|Tak|Nie||Może||Nigdy
Początkujący|What is 'Noc'?|Night|Dzień||Rano||Wieczór
Początkujący|Word for 'Strong':|Silny|Słaby||Szybki||Wolny
Początkujący|How to say 'No'?|Nie|Tak||Często||Zawsze
Początkujący|What is 'Ryba'?|Fish|Ptak||Kot||Pies
Początkujący|Word for 'White':|Biały|Czarny||Szary||Brązowy
Początkujący|How to say 'Please' (requesting)?|Proszę|Dziękuję||Tak||Nie
Początkujący|What does 'Jasny' mean?|Bright|Ciemny||Cień||Noc
Początkujący|Word for 'Life':|Życie|Śmierć||Sen||Marzenie
Początkujący|How do you say 'Book'?|Książka|Długopis||Papier||Stół
Początkujący|What is 'Księżyc'?|Moon|Słońce||Gwiazda||Niebo
Początkujący|Word for 'Green':|Zielony|Czerwony||Niebieski||Żółty
Średnio zaawansowany|How do you say 'Good luck'?|Powodzenia|Dobrej podróży||Smacznego||Dobranoc
Średnio zaawansowany|What is 'Hope' in Polish?|Nadzieja|Rozpacz||Radość||Pokój
Średnio zaawansowany|Translate: 'Everything is fine.'|Wszystko w porządku|Wszystko jest źle||Nie wiem||Zatrzymaj się
Średnio zaawansowany|What does 'Powoli' mean?|Slowly|Szybko||Mocno||Cicho
Średnio zaawansowany|How to say 'I am proud of you'?:|Jestem z ciebie dumny|Jestem na ciebie zły||Czekam na ciebie||Nie znam cię
Średnio zaawansowany|What is 'Niespodzianka' in English?|Surprise|Nuda||Smutek||Złość
Średnio zaawansowany|Translate 'Experience':|Doświadczenie|Nadzieja||Marzenie||Zadanie
Średnio zaawansowany|How do you say 'Opportunity'?|Okazja|Przeszkoda||Problem||Porażka
Średnio zaawansowany|What does 'Uważaj' mean?|Be careful|Bądź szczęśliwy||Bądź szybki||Bądź cichy
Średnio zaawansowany|Translate 'Important':|Ważne|Łatwe||Szybkie||Tanie
Średnio zaawansowany|How do you say 'Health'?|Zdrowie|Siła||Bogactwo||Piękno
Średnio zaawansowany|What is 'Pewność siebie'?|Self-confidence|Nieśmiałość||Strach||Lenistwo
Średnio zaawansowany|Translate 'Environment':|Środowisko|Pokój||Dom||Ulica
Średnio zaawansowany|How do you say 'Challenge'?|Wyzwanie|Prezent||Pomoc||Wsparcie
Średnio zaawansowany|What is 'Ciężka praca'?|Hard work|Leniwy dzień||Łatwe zadanie||Czas wolny
Średnio zaawansowany|Translate 'Progress':|Postęp|Regres||Śmierć||Narodziny
Średnio zaawansowany|How to say 'I agree'?|Zgadzam się|Nie chcę||Jestem zmieszany||Idę
Średnio zaawansowany|What does 'Inny' mean?|Different|Taki sam||Równy||Podobny
Średnio zaawansowany|Translate 'Respect':|Szacunek|Nienawiść||Strach||Złość
Średnio zaawansowany|How to say 'Believe'?|Wierzyć|Wątpić||Pytać||Milczeć
Średnio zaawansowany|What is 'Przyszłość'?|Future|Przeszłość||Teraźniejszość||Dzisiaj
Średnio zaawansowany|Translate 'Create':|Tworzyć|Niszczyć||Czekać||Szukać
Średnio zaawansowany|How do you say 'Freedom'?|Wolność|Zależność||Obowiązek||Ciężar
Średnio zaawansowany|What is 'Współpraca'?|Collaboration|Konkurencja||Konflikt||Unikanie
Średnio zaawansowany|Translate 'Change':|Zmiana|Porządek||Cisza||Koniec
Średnio zaawansowany|How to say 'Happy' (formal)?|Szczęśliwy|Nieszczęśliwy||Rozczarowany||Zły
Średnio zaawansowany|What is 'Uczucia'?|Feelings|Myśli||Działania||Wizja
Średnio zaawansowany|Translate 'Grateful':|Wdzięczny|Narzekający||Zły||Smutny
Średnio zaawansowany|How to say 'Celebrate'?|Świętować|Płakać||Opuszczać||Zapominać
Średnio zaawansowany|What is 'Inspiracja'?|Inspiration|Nuda||Cisza||Strach
Średnio zaawansowany|Translate 'Honest':|Uczciwy|Nieuczciwy||Ręka||Wątpliwy
Średnio zaawansowany|How to say 'Beautiful' (scenery)?|Piękny|Brzydki||Okej||Brudny
Średnio zaawansowany|What is 'Komunikacja'?|Communication|Cisza||Kłótnia||Walka
Średnio zaawansowany|Translate 'Kindness':|Dobroć|Zło||Nienawiść||Złość
Średnio zaawansowany|How to say 'Patience'?|Cierpliwość|Złość||Niepokój||Strach
Ekspert|What is 'Spokój'?:|Peace / Serenity|Chaos||Bogactwo||Szybka muzyka
Ekspert|Meaning of 'Gościnność'?:|Hospitality|Jedzenie||Taniec||Czapka
Ekspert|What is 'Radość'?:|Joy / Happiness|Praca||Smutek||Szybkość
Ekspert|Translate 'Peace':|Pokój|Wojna||Złość||Hałas
Ekspert|Final one! How do you say 'Stay happy'?:|Bądź szczęśliwy|Bądź smutny||Idź stąd||Pracuj dużo
Ekspert|What is 'Różnorodność'?|Diversity|Jednostajność||Podobieństwo||To samo
Ekspert|Translate 'Integritet':|Integrity|Zaniedbanie||Kłamstwo||Oszustwo
Ekspert|Meaning of 'Dobrobyt'?|Prosperity / Welfare|Bieda||Nieszczęście||Trudność
Ekspert|What is 'Niezależność'?|Independence|Zależność||Słabość||Strach
Ekspert|Translate 'Solidarność':|Solidarity|Podział||Nienawiść||Zazdrość
Ekspert|What is 'Mądrość'?|Wisdom|Głupota||Ignorancja||Chciwość
Ekspert|Translate 'Współczucie':|Compassion|Okrucieństwo||Nienawiść||Złość
Ekspert|Meaning of 'Zrównoważony rozwój'?|Sustainability|Zniszczenie||Zanieczyszczenie||Marnotrawstwo
Ekspert|What is 'Sprawiedliwość'?|Justice|Niesprawiedliwość||Chaos||Korupcja
Ekspert|Translate 'Harmonia':|Harmony|Konflikt||Hałas||Złość
Ekspert|Meaning of 'Suwerenność'?|Sovereignty|Niewola||Kolonializm||Rządy
Ekspert|What is 'Elegancja'?|Elegance|Niezdarność||Brzydota||Chamstwo
Ekspert|Translate 'Biblioteka':|Library|Księgarnia||Szkoła||Klasa
Ekspert|Meaning of 'Lojalność'?|Loyalty|Zdrada||Nienawiść||Złość
Ekspert|What is 'Kreatywność'?|Creativity|Naśladownictwo||Nuda||Lenistwo
Ekspert|Translate 'Odwaga':|Courage|Strach||Tchórzostwo||Nieśmiałość
Ekspert|Meaning of 'Szczerość'?|Sincerity|Hipokryzja||Kłamstwo||Chciwość
Ekspert|What is 'Chwała'?|Glory / Honor|Wstyd||Porażka||Strata
Ekspert|Translate 'Zdrowie psychiczne':|Mental health|Ból fizyczny||Chore ciało||Słaby duch
Ekspert|Meaning of 'Uprzejmość'?|Politeness / Kindness|Chamstwo||Chłód||Złość
Ekspert|What is 'Cud'?|Miracle|Katastrofa||Wypadek||Zwyczajny
Ekspert|Translate 'Empowerment':|Upodmiotowienie|Ograniczenie||Słabość||Strach
Ekspert|Meaning of 'Wytrwałość'?|Persistence / Endurance|Koniec||Stop||Marnotrawstwo
Ekspert|What is 'Hojność'?|Generosity|Chciwość||Egoizm||Złośliwość
Ekspert|Translate 'Innowacja':|Innovation|Stagnacja||Tradycja||Stare`}
    speechLocale="pl-PL"
    primaryColor="#3b82f6"
    primaryHover="#2563eb"
    resultTitle="Fantastycznie! (Fantastic!)"
    resultMessage="Jesteś wspaniały w polskim!"
    retryLabel="Spróbuj ponownie"
    levelLabels={{
      "Początkujący": "Beginner",
      "Średnio zaawansowany": "Intermediate",
      "Ekspert": "Expert"
    }}
  />
);

export default PolishQuiz;
