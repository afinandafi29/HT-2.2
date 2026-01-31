import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AIChatBox from '../components/AIChatBox';

const GermanQuiz = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [options, setOptions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const answeredRef = useRef(false);

  const rawData = useMemo(
    () =>
      `Anfänger|Wie sagt man 'Happy' auf Deutsch?|Glücklich|Traurig||Wütend||Müde
Anfänger|Ein fröhlicher Gruß am Morgen:|Guten Morgen!|Gute Nacht||Auf Wiedersehen||Geh weg
Anfänger|Was macht man, wenn man lacht?|Lächeln|Weinen||Schreien||Schlafen
Anfänger|Das Gegenteil von 'schlecht' ist...|Gut|Kalt||Groß||Alt
Anfänger|Wie sagt man 'Thank you very much'?|Vielen Dank!|Bitte nicht||Vielleicht||Keine Ahnung
Anfänger|Ein 'Friend' auf Deutsch ist ein...|Freund|Feind||Fremder||Feuer
Anfänger|Die Sonne ist heute sehr...|Hell|Dunkel||Nass||Traurig
Anfänger|Essen das gut schmeckt ist...|Lecker|Sauer||Bitter||Schrecklich
Anfänger|Wie sagt man 'I love you'?|Ich liebe dich|Ich hasse dich||Ich sehe dich||Ich höre dich
Anfänger|Was sagt man zum Geburtstag?|Herzlichen Glückwunsch!|Schade||Gute Besserung||Viel Erfolg
Anfänger|Blumen sind...|Schön|Hässlich||Böse||Kalt
Anfänger|Ein positives Wort für 'Funny':|Lustig|Langweilig||Ernst||Dumm
Anfänger|Was ist 'Peace'?|Frieden|Krieg||Lärm||Streit
Anfänger|Wenn alles okay ist, ist es...|Prima|Kaputt||Schlecht||Verloren
Anfänger|Wie sagt man 'Great'?|Toll|Klein||Wenig||Grau
Anfänger|Ein anderes Wort für 'Happy' (Alegre):|Froh|Hart||Kurz||Dick
Anfänger|Was gibt man jemandem zur Begrüßung?|Eine Umarmung|Einen Stoß||Einen Schreck||Einen Korb
Anfänger|Musik ist...|Wunderbar|Leise||Schrecklich||Alt
Anfänger|Ich bin so ___ heute!|Zufrieden|Sauer||Krank||Müde
Anfänger|Wie heißt 'Gift'?|Geschenk|Gift||Geld||Gefahr
Anfänger|Ein schöner Tag hat viel...|Sonnenschein|Regen||Schnee||Sturm
Anfänger|Was sagt man, wenn man Hilfe bekommt?|Danke|Nein||Stopp||Warum
Anfänger|Ein positives Tier (Symbol):|Marienkäfer|Spinne||Hai||Wolf
Anfänger|Wie ist ein Urlaub?|Erlebnisreich|Anstrengend||Blöd||Teuer
Anfänger|Wie sagt man 'See you soon'?|Bis bald!|Niemals||Gestern||Vielleicht
Fortgeschritten|Ich freue mich ___ das Wochenende.|auf|über||mit||an
Fortgeschritten|Das ist die ___ Nachricht des Tages!|beste|gut||besser||guten
Fortgeschritten|Du hast mir eine große Freude ___.|gemacht|getan||gegeben||gehabt
Fortgeschritten|Ich bin ___ über deinen Erfolg.|begeistert|traurig||wütend||neidisch
Fortgeschritten|Alles Gute ___ Geburtstag!|zum|für||am||im
Fortgeschritten|Wir haben viel ___.|gelacht|geweint||geschlafen||gearbeitet
Fortgeschritten|Welches Wort bedeutet 'Encouraging'?|Ermutigend|Enttäuschend||Ermüdend||Einfach
Fortgeschritten|Er hat ein ___ Lächeln.|gewinnendes|verlierendes||altes||kleines
Fortgeschritten|Ich wünsche dir viel ___!|Vergnügen|Angst||Arbeit||Pech
Fortgeschritten|Das Wetter ist heute einfach ___.|herrlich|dunkel||nass||kalt
Fortgeschritten|Sie ist eine ___ Person.|herzliche|kalte||fremde||böse
Fortgeschritten|Ich fühle mich hier sehr ___.|wohl|krank||schlecht||falsch
Fortgeschritten|Lass uns den Moment ___.|genießen|vergessen||zerstören||beenden
Fortgeschritten|Du bist sehr ___.|hilfsbereit|unhöflich||faul||laut
Fortgeschritten|Ich bin voller ___ für die Zukunft.|Zuversicht|Angst||Sorge||Zweifel
Fortgeschritten|Ein Synonym für 'wundervoll':|Prachtvoll|Einfach||Gering||Hässlich
Fortgeschritten|Das war ein ___ Erlebnis.|einzigartiges|normales||langweiliges||schlechtes
Fortgeschritten|Wir feiern ein ___ Fest.|rauschendes|stilles||trauriges||kleines
Fortgeschritten|Danke für deine ___.|Gastfreundschaft|Rechnung||Verspätung||Kritik
Fortgeschritten|Ich bin heute ___ aufgelegt.|gut|schlecht||gar nicht||müde
Fortgeschritten|Das hat meine Erwartungen ___.|übertroffen|enttäuscht||beendet||verpasst
Fortgeschritten|Du siehst heute ___ aus.|bezaubernd|müde||alt||grau
Fortgeschritten|Ich schätze deine ___.|Ehrlichkeit|Lügen||Fehler||Pause
Fortgeschritten|Es ist ein ___ Gefühl.|großartiges|kleines||bitteres||kaltes
Fortgeschritten|Kopf ___! Es wird alles gut.|hoch|runter||weg||an
Profi|Was bedeutet 'Lebenslust'?|Freude am Leben|Angst vor dem Tod||Hunger||Müdigkeit
Profi|Ein Wort für 'Pure Bliss':|Glückseligkeit|Traurigkeit||Zorn||Langeweile
Profi|Was ist 'Vorfreude'?|Freude auf etwas Kommendes|Reue||Angst||Erinnerung
Profi|Ein 'Lichtblick' ist...|Etwas Positives in einer Krise|Eine Taschenlampe||Ein Sonnenbrand||Ein Gewitter
Profi|Was bedeutet 'ausgelassen'?|Fröhlich und unbeschwert|Vergessen||Traurig||Vorsichtig
Profi|Synonym für 'optimistisch':|Zuversichtlich|Zweifelnd||Zaghaft||Zornig
Profi|Was ist 'Geborgenheit'?|Sicherheit und Liebe|Gefängnis||Einsamkeit||Gefahr
Profi|Eine 'herzensgute' Person ist...|Sehr gütig|Kardiologe||Sportlich||Reich
Profi|Was bedeutet 'beschwingt'?|Voller Elan und Freude|Schwerfällig||Betrunken||Langsam
Profi|Was ist 'Nächstenliebe'?|Altruismus|Romantik||Egoismus||Hass
Profi|Ein 'Glückspilz' ist jemand, der...|Viel Glück hat|Pilze sammelt||Giftig ist||Im Wald lebt
Profi|Was bedeutet 'ermunternd'?|Aufmunternd|Einschläfernd||Böse||Laut
Profi|Was ist 'Eintracht'?|Harmonie|Streit||Jagd||Vogel
Profi|Ein 'unvergesslicher' Moment ist...|Ewig in Erinnerung|Sofort vergessen||Schlecht||Normal
Profi|Was bedeutet 'begehrenswert'?|Sehr attraktiv/positiv|Billig||Hässlich||Alt
Profi|Was ist 'Heiterkeit'?|Frohsinn|Dunkelheit||Gewitter||Ernst
Profi|Ein 'Prachtstück' ist...|Etwas Wunderbares|Etwas Kaputtes||Ein Stein||Ein Fehler
Profi|Was bedeutet 'vollkommen'?|Perfekt|Halb||Leer||Schlecht
Profi|Was ist 'Zusammenhalt'?|Solidarität|Trennung||Kleber||Flucht
Profi|Ein 'Glanzlicht' ist ein...|Highlight|Schatten||Spiegel||Feuerwerk
Profi|Was bedeutet 'unbeschwert'?|Ohne Sorgen|Sehr schwer||Krank||Traurig
Profi|Was ist 'Tatendrang'?|Lust, etwas zu tun|Faulheit||Angst||Schlaf
Profi|Was bedeutet 'erquickend'?|Erfrischend|Ermüdend||Bitter||Heiß
Profi|Was ist 'Herzklopfen' (positiv)?|Aufregung vor Freude|Herzinfarkt||Angst||Sport
Profi|Was bedeutet 'überwältigend'?|Sehr beeindruckend|Normal||Schwach||Hässlich
Experte|Was bedeutet 'Schwein haben'?|Glück haben|Ein Tier kaufen||Dreckig sein||Hunger haben
Experte|Was bedeutet 'Auf Wolke sieben schweben'?|Sehr verliebt/glücklich sein|Fliegen lernen||Regen erwarten||Träumen
Experte|Was bedeutet 'Das Leben in vollen Zügen genießen'?|Das Leben maximal genießen|Viel Bahn fahren||Viel trinken||Schnell laufen
Experte|Was ist 'Freudestrahlend'?|Sehr glücklich aussehen|Radioaktiv sein||Licht anmachen||Sonne putzen
Experte|Was bedeutet 'Ein Stein fällt mir vom Herzen'?|Erleichtert sein|Einen Unfall haben||Krank sein||Gewicht verlieren
Experte|Was bedeutet 'Honigkuchenpferd' (lächeln wie ein...)?|Über das ganze Gesicht strahlen|Hungrig sein||Süßigkeiten essen||Ein Pferd reiten
Experte|Was bedeutet 'Alles im grünen Bereich'?|Alles ist in Ordnung|Im Wald sein||Gras mähen||Frühling
Experte|Was ist 'Gänsehaut' (vor Freude)?|Starke emotionale Rührung|Frieren||Erschrecken||Vogel sein
Experte|Was bedeutet 'Die Korken knallen lassen'?|Groß feiern|Müll machen||Laut sein||Wein trinken
Experte|Was bedeutet 'Wie Gott in Frankreich leben'?|Ein luxuriöses/gutes Leben führen|Religiös sein||Französisch lernen||Urlaub machen
Experte|Was ist 'Herzenslust' (nach...)?|So viel man will|Herzkrankheit||Liebeskummer||Sport
Experte|Was bedeutet 'Ein Lächeln auf den Lippen haben'?|Freundlich/glücklich sein|Lippenstift tragen||Essen||Sprechen
Experte|Was ist 'Freudentaumel'?|Zustand höchster Beglückung|Schwindelgefühl||Tanzkurs||Sturz
Experte|Was bedeutet 'Auf der Sonnenseite des Lebens stehen'?|Viel Glück/Erfolg haben|Einen Sonnenbrand haben||Draußen wohnen||Sommer
Experte|Was bedeutet 'Jemandem den Tag versüßen'?|Jemanden glücklich machen|Zucker geben||Kochen||Einkaufen
Experte|Was ist 'Glückssträhne'?|Serie von Erfolgen|Haarteil||Seil||Gewinnspiel
Experte|Was bedeutet 'Friede, Freude, Eierkuchen'?|Alles scheint perfekt (manchmal ironisch)|Frühstück machen||Kochen||Backen
Experte|Was ist 'Wonnewinter' (eher poetisch)?|Ein herrlicher Winter|Kalter Winter||Schnee||Eis
Experte|Was bedeutet 'Luftsprünge machen'?|Sich riesig freuen|Sport treiben||Fliegen||Atmen
Experte|Was ist 'Seelenfrieden'?|Innere Ruhe|Geisterhaus||Tod||Kirche
Experte|Was bedeutet 'Butter bei die Fische' (eher norddeutsch, positiv)?|Klartext reden/Nägel mit Köpfen machen|Kochen||Angeln||Fett essen
Experte|Was ist 'Gipfelstürmer'?|Erfolgreiche Person|Bergsteiger||Wind||Wolke
Experte|Was bedeutet 'Gold wert sein'?|Sehr nützlich/toll sein|Viel Geld kosten||Aus Gold sein||Schwer sein
Experte|Was ist 'Herzensangelegenheit'?|Etwas, das einem sehr wichtig ist|Herz-OP||Liebesbrief||Sport
Experte|Was bedeutet 'Da lacht das Herz'?|Darüber freut man sich sehr|Das Herz ist laut||Medizin||Scherz`,
    [],
  );

  const questions = useMemo(() => {
    const parsed = rawData
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('|');
        const [l, q, a, ...rest] = parts;
        const wRaw = rest.join('|');
        const w = wRaw.split('||').filter(Boolean);
        return { l, q, a, w };
      });
    return parsed.sort(() => Math.random() - 0.5);
  }, [rawData]);

  const speak = useCallback(
    (text) => {
      if (isMuted) return;
      if (typeof window === 'undefined') return;
      if (!('speechSynthesis' in window)) return;
      const cleanText = String(text).replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
        '',
      );
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9;
      utterance.lang = 'de-DE';
      window.speechSynthesis.speak(utterance);
    },
    [isMuted],
  );

  const shuffle = useCallback((arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, []);

  const loadQuestion = useCallback(
    (index) => {
      const q = questions[index];
      if (!q) return;
      answeredRef.current = false;
      setSelected(null);
      setOptions(shuffle([q.a, ...q.w]));
    },
    [questions, shuffle],
  );

  useEffect(() => {
    loadQuestion(0);
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [loadQuestion]);

  const handleSelect = (choice) => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    setSelected(choice);
    speak(choice);
    const correct = questions[currentQuestion]?.a;
    if (choice === correct) setScore((s) => s + 1);
  };

  const next = () => {
    const nextIndex = currentQuestion + 1;
    if (nextIndex >= questions.length) {
      setShowResults(true);
      return;
    }
    setCurrentQuestion(nextIndex);
    loadQuestion(nextIndex);
  };

  const restart = () => {
    setShowResults(false);
    setCurrentQuestion(0);
    setScore(0);
    loadQuestion(0);
  };

  if (showResults) {
    return (
      <div className={`ht-voice ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <style>{voiceCss}</style>
        <div className="external-controls">
          <button className="back-button" onClick={() => navigate('/learning-languages')}>
            ← Back
          </button>
          <div className="theme-buttons">
            <button className={`theme-btn ${!isDarkMode ? 'active' : ''}`} onClick={() => setIsDarkMode(false)}>
              ☀️ Light
            </button>
            <button className={`theme-btn ${isDarkMode ? 'active' : ''}`} onClick={() => setIsDarkMode(true)}>
              🌙 Dark
            </button>
          </div>
        </div>
        <div className="container">
          <div className="result-screen">
            <h2>Wunderbar!</h2>
            <div className="score" style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--primary-blue)', margin: '20px 0' }}>
              {score}/{questions.length}
            </div>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
              {score > 80 ? "Ausgezeichnet! Du bist ein Deutsch-Profi." : "Gut gemacht! Übung macht den Meister."}
            </p>
            <button type="button" onClick={restart} className="try-again">
              Nochmal versuchen
            </button>
            <button
              type="button"
              onClick={() => setIsAIChatOpen(true)}
              style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                zIndex: 1000,
              }}
              aria-label="Open AI Chat"
            >
              🤖
            </button>
            <AIChatBox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} language="de" />
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];
  const levelClass = String(q?.l || '').toLowerCase();
  const correct = q?.a;
  const canGoNext = answeredRef.current;

  return (
    <div className={`ht-voice ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <style>{voiceCss}</style>
      <div className="external-controls">
        <button className="back-button" onClick={() => navigate('/learning-languages')}>
          ← Back
        </button>
        <div className="theme-buttons">
          <button className={`theme-btn ${!isDarkMode ? 'active' : ''}`} onClick={() => setIsDarkMode(false)}>
            ☀️ Light
          </button>
          <button className={`theme-btn ${isDarkMode ? 'active' : ''}`} onClick={() => setIsDarkMode(true)}>
            🌙 Dark
          </button>
        </div>
      </div>
      <div className="container">
        <div className="question-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={`level-badge ${levelClass}`}>{q?.l}</span>
            <span className="qnum">Frage {currentQuestion + 1} / 100</span>
          </div>
          <h2 style={{ marginTop: '15px', fontSize: '1.3rem' }}>{q?.q}</h2>
          <div className="options">
            {options.map((opt) => {
              const isCorrect = answeredRef.current && opt === correct;
              const isWrong = answeredRef.current && selected === opt && opt !== correct;
              const cls = `option${isCorrect ? ' correct' : ''}${isWrong ? ' wrong' : ''}`;
              return (
                <div key={opt} className={cls} onClick={() => handleSelect(opt)}>
                  {opt}
                </div>
              );
            })}
          </div>
        </div>

        <button id="nextBtn" type="button" disabled={!canGoNext} onClick={next}>
          Nächste Frage →
        </button>
        <button
          type="button"
          onClick={() => setIsAIChatOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
            zIndex: 1000,
          }}
          aria-label="Open AI Chat"
        >
          🤖
        </button>
        <AIChatBox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} language="de" />
      </div>
    </div>
  );
};

const voiceCss = `
  :root {
    --primary-blue: #3b82f6;
    --light-blue: #eff6ff;
    --accent-gold: #d4af37;
    --white: #ffffff;
    --text-dark: #1a1a1a;
  }

  .dark-mode {
    --primary-blue: #3b82f6;
    --light-blue: #1a1a1a;
    --accent-gold: #d4af37;
    --white: #0d0d0d;
    --text-dark: #ffffff;
    --bg-blue: #000000;
  }

  .light-mode {
    --primary-blue: #3b82f6;
    --light-blue: #f5f5f5;
    --accent-gold: #d4af37;
    --white: #ffffff;
    --text-dark: #1a1a1a;
    --bg-blue: #fafafa;
  }

  .ht-voice {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--bg-blue);
    margin: 0;
    padding: 20px;
    color: var(--text-dark);
    min-height: 100vh;
    transition: all 0.3s ease;
  }

  .external-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1000px;
    margin: 0 auto 20px auto;
    padding: 0 10px;
  }

  .back-button {
    background: var(--primary-blue);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .back-button:hover {
    background: #2563eb;
    transform: translateY(-2px);
  }

  .theme-buttons {
    display: flex;
    gap: 8px;
    background: var(--light-blue);
    padding: 4px;
    border-radius: 25px;
    border: 2px solid var(--primary-blue);
  }

  .theme-btn {
    background: transparent;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    transition: all 0.3s ease;
    color: var(--text-dark);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .theme-btn:hover {
    background: rgba(59, 130, 246, 0.12);
  }

  .theme-btn.active {
    background: var(--primary-blue);
    color: white;
  }

  .container {
    max-width: 650px;
    margin: 0 auto;
    background: var(--white);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    position: relative;
    border-left: 10px solid var(--primary-blue);
    min-height: 600px;
    transition: all 0.3s ease;
  }

  .question-box {
    background: var(--light-blue);
    border-radius: 15px;
    padding: 25px;
    margin-bottom: 20px;
    border: 1px solid #bfdbfe;
  }

  .qnum {
    color: var(--primary-blue);
    font-weight: bold;
    font-size: 0.85rem;
  }

  .options {
    display: grid;
    gap: 12px;
    margin-top: 15px;
  }

  .option {
    background: var(--white);
    border: 2px solid #e1e8e1;
    border-radius: 10px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1.1rem;
  }

  .option.correct {
    background: var(--primary-blue) !important;
    color: white !important;
  }
  .option.wrong {
    background: #ffebee !important;
    border-color: #ef5350 !important;
    color: #c62828 !important;
  }

  button#nextBtn {
    background: var(--primary-blue);
    color: white;
    border: none;
    padding: 16px;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 50px;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
  }
  button#nextBtn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .result-screen {
    text-align: center;
    padding: 40px 10px;
  }

  .try-again {
    background: var(--primary-blue);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
  }

  .level-badge {
    display: inline-block;
    padding: 5px 12px;
    border-radius: 5px;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .anfänger {
    background: #dbeafe;
    color: #1e3a8a;
  }
  .fortgeschritten {
    background: #bfdbfe;
    color: #1e3a8a;
  }
  .profi {
    background: #60a5fa;
    color: #fff;
  }
  .experte {
    background: #2563eb;
    color: #fff;
  }
`;

export default GermanQuiz;
