import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AIChatBox from '../components/AIChatBox';

const ItalianQuiz = () => {
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
      `Principiante|Come si dice 'Happy' in italiano?|Felice|Triste||Arrabbiato||Stanco
Principiante|Un saluto positivo per la mattina:|Buongiorno!|Buonanotte||Arrivederci||Zitto
Principiante|Cosa fai quando sei contento?|Sorridere|Piangere||Urlare||Dormire
Principiante|Il contrario di 'Cattivo' è...|Buono|Piccolo||Freddo||Grigio
Principiante|Come dici 'Thank you very much'?|Grazie mille!|Prego||Scusa||Basta
Principiante|Una persona gentile è...|Amabile|Cattiva||Brutta||Lontana
Principiante|Il sole oggi è...|Splendente|Nero||Freddo||Triste
Principiante|Il gelato è...|Delizioso|Brutto||Cattivo||Triste
Principiante|Come dici 'I love you'?|Ti amo|Ti odio||Ti vedo||Ti sento
Principiante|Un amico è molto ___.|Simpatico|Vecchio||Noioso||Sporco
Principiante|La vita è ___.|Bella|Grigia||Rotta||Dura
Principiante|Cosa si dice per augurare fortuna?|In bocca al lupo!|Vai via||Peccato||Forse
Principiante|A oggi è una giornata ___!|Fantastica|Pessima||Normale||Noiosa
Principiante|Guardare un film ___.|Divertente|Triste||Lungo||Brutto
Principiante|Cosa significa 'Bravo'?|Good / Skilled|Bad||Angry||Blue
Principiante|Un regalo fa sempre ___.|Piacere|Paura||Male||Rumore
Principiante|Come saluti un amico?|Ciao!|Addio||Prego||Cosa
Principiante|Il cielo è ___.|Azzurro|Arrabbiato||Triste||Sporco
Principiante|Amo i ___ colorati.|Fiori|Dolori||Gridi||Problemi
Principiante|Sei molto ___ !|Intelligente|Nullo||Grigio||Piccolo
Principiante|Miam! È ___.|Dolce|Amaro||Triste||Salato
Principiante|Buona ___ !|Fortuna|Pioggia||Tristezza||Fine
Principiante|C'è un bel ___ fuori.|Sole|Buio||Freddo||Mostro
Principiante|È tutto ___.|Perfetto|Sbagliato||Rotto||Brutto
Principiante|Andiamo in ___!|Vacanze|Ufficio||Scuola||Ospedale
Intermedio|Oggi mi ___ molto felice.|Sento|Faccio||Vado||Dico
Intermedio|È il giorno ___ della mia vita!|Più bello|Peggiore||Meno bello||Piccolo
Intermedio|Spero che tu ___ una bella giornata.|Passi|Passassi||Passare||Passato
Intermedio|Ci siamo divertiti ___.|Un sacco|Poco||Niente||Mai
Intermedio|Che ___ sorpresa!|Piacevole|Brutta||Triste||Lunga
Intermedio|___-ti bene!|Divertiti|Dormi||Taci||Va
Intermedio|Sono orgoglioso di ___.|Te|Me||Lui||Niente
Intermedio|Tutto ___ bene.|Andrà|Fatto||Stato||Detto
Intermedio|Hai fatto un ___ lavoro!|Ottimo|Pessimo||Piccolo||Inutile
Intermedio|Ti trovo molto ___ oggi.|In forma|Stanco||Triste||Malato
Intermedio|Il futuro è ___.|Promettente|Buio||Finito||Grigio
Intermedio|___ a tutti per l'aiuto.|Grazie|Ciao||Scusa||No
Intermedio|È stato un piacere ___.|Conoscerti|Perderti||Odiarti||Dimenticarti
Intermedio|Che bella ___!|Atmosfera|Paura||Noia||Rabbia
Intermedio|Sei ___ gentile.|Davvero|Poco||Meno||Mica
Intermedio|Voglio ___ con te.|Festeggiare|Piangere||Dormire||Litigare
Intermedio|Il tuo sorriso è ___.|Contagioso|Brutto||Lontano||Grigio
Intermedio|Mi piace il tuo ___ dell'umorismo.|Senso|Freddo||Modo||Pezzo
Intermedio|Abbiamo avuto molta ___.|Fortuna|Noia||Fame||Sete
Intermedio|Ti auguro ogni ___.|Bene|Male||Cosa||Fine
Intermedio|È un panorama ___.|Mozzafiato|Brutto||Comune||Grigio
Intermedio|Grazie di ___ cuore.|Tutto|Poco||Mezzo||Niente
Intermedio|Siamo una bella ___.|Squadra|Guerra||Lite||Noia
Intermedio|Che bella ___ hai avuto!|Idea|Paura||Fame||Scusa
Intermedio|Sono molto ___ di vederti.|Contento|Triste||Stanco||Stufo
Avanzato|Sinonimo di 'molto felice':|Radioso|Cupo||Apatico||Severo
Avanzato|Cosa significa 'Entusiasta'?|Pieno di gioia|Molto stanco||Pieno di dubbi||Arrabbiato
Avanzato|Un momento 'indimenticabile':|Che resta nel cuore|Noioso||Brutto||Sbagliato
Avanzato|Vivere in ___.|Armonia|Guerra||Disordine||Odio
Avanzato|Essere 'grato' significa...|Riconoscente|Preoccupato||Stanco||Offeso
Avanzato|Una persona 'solare' è...|Allegra e luminosa|Che scotta||Triste||Che dorme
Avanzato|L'___ è la chiave del successo.|Ottimismo|Pigrizia||Rabbia||Paura
Avanzato|Un gesto 'altruista':|Generoso verso gli altri|Egoista||Cattivo||Piccolo
Avanzato|La 'serenità' è ___.|Pace interiore|Rumore||Stress||Tristezza
Avanzato|Guardare il mondo con ___.|Meraviglia|Disprezzo||Noia||Odio
Avanzato|Un successo ___.|Strepitoso|Inutile||Brutto||Piccolo
Avanzato|La 'gentilezza' è ___.|Una virtù|Un errore||Un peso||Un vizio
Avanzato|Un'accoglienza ___.|Calorosa|Fredda||Cattiva||Lenta
Avanzato|Essere 'al settimo cielo':|Essere felicissimi|Essere un pilota||Avere freddo||Dormire
Avanzato|Uno spirito ___.|Vivace|Morto||Triste||Grigio
Avanzato|Una 'prelibatezza' è ___.|Un cibo squisito|Una bugia||Un errore||Un peso
Avanzato|Sentirsi 'rigenerato':|Pieno di nuova energia|Nuovamente stanco||Rotto||Vecchio
Avanzato|Una notizia ___.|Splendida|Pessima||Vecchia||Grigia
Avanzato|La 'prosperità' è ___.|Benessere|Povertà||Fame||Guerra
Avanzato|Ridere di ___.|Cuore|Pancia||Piede||Mano
Avanzato|Un legame ___.|Indissolubile|Fragile||Brutto||Breve
Avanzato|La 'complicità' tra amici:|Intesa perfetta|Lotta||Noia||Distanza
Avanzato|Un traguardo ___.|Ambizioso|Inutile||Facile||Piccolo
Avanzato|L'___ di vivere.|Entusiasmo|Paura||Noia||Fine
Avanzato|Cogliere l'___.|Attimo|Errore||Freddo||Buio
Esperto|Cosa significa 'Avere un cuore d'oro'?|Essere molto buoni|Essere ricchi||Essere malati||Avere un gioiello
Esperto|'Toccare il cielo con un dito' significa:|Essere al massimo della gioia|Essere molto alti||Volare||Avere sete
Esperto|'Essere un pezzo di pane' indica una persona:|Molto buona e mite|Che mangia molto||Morbida||Noiosa
Esperto|Cosa significa 'Mettercela tutta'?|Impegnarsi al massimo|Mettere tutto in borsa||Essere stanchi||Perdere tempo
Esperto|'Avere un diavolo per capello' significa:|Essere molto arrabbiati|Essere felici||Avere i capelli rossi||Essere spettinati
Esperto|Che significa 'Sputare il rospo'?|Dire finalmente la verità|Essere maleducati||Mangiare rane||Parlare male
Esperto|'Ogni lasciata è persa' significa:|Sfrutta ogni opportunità|Hai perso tutto||Non andare via||Dimentica tutto
Esperto|'A caval donato non si guarda in bocca' significa:|Accetta i regali con gratitudine|I cavalli sono belli||Non guardare i denti||Fai attenzione
Esperto|'Tutto è bene quel che finisce bene' significa:|La fine positiva salva tutto|La fine è vicina||Va tutto male||È tardi
Esperto|'Vedere tutto rosa' significa:|Essere molto ottimisti|Avere occhiali colorati||Amare i fiori||Essere femminili
Esperto|'Fare i salti di gioia' significa:|Essere entusiasti|Fare ginnastica||Essere pazzi||Cadere
Esperto|'Restare a bocca aperta' significa:|Essere meravigliati|Avere fame||Dormire||Parlare troppo
Esperto|'Essere in una botte di ferro' significa:|Essere al sicuro|Essere prigionieri||Essere pesanti||Lavorare il metallo
Esperto|'Ridere a crepapelle' significa:|Ridere tantissimo|Ridere piano||Stare male||Avere la pelle secca
Esperto|'Avere la marcia in più' significa:|Avere una qualità superiore|Guidare veloce||Essere meccanico||Essere di fretta
Esperto|'Tutto fumo e niente arrosto' significa:|Molte parole, pochi fatti|Cucinare male||C'è un incendio||Avere fame
Esperto|'Andare a gonfie vele' significa:|Andare benissimo|Andare in barca||C'è molto vento||Avere sete
Esperto|'Essere l'anima della festa' significa:|Essere molto divertenti e socievoli|Essere un fantasma||Essere soli||Cantare bene
Esperto|'Prendere due piccioni con una fava' significa:|Ottenere due risultati con un gesto|Cacciare uccelli||Cucinare fave||Sprecare tempo
Esperto|'In un batter d'occhio' significa:|In un istante|Avere sonno||Vederci male||Piano piano
Esperto|'Essere un vulcano di idee' significa:|Essere molto creativi|Essere pericolosi||Avere caldo||Vivere a Napoli
Esperto|'Oggi mi sento un leone!' significa:|Mi sento forte e carico|Ho fame||Sono allo zoo||Voglio dormire
Esperto|'Scherza coi fanti ma lascia stare i santi' significa:|Non scherzare su cose serie|Gioca con gli amici||Prega sempre||Non ridere
Esperto|'Meglio tardi che mai' significa:|L'importante è che accada|Sei in ritardo||Non venire più||È troppo tardi
Esperto|'Chi dorme non piglia pesci' significa:|Bisogna darsi da fare|I pesci dormono||Vai a pescare||Buonanotte`,
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
      utterance.rate = 0.95;
      utterance.lang = 'it-IT';
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
            <h2>Eccellente!</h2>
            <div className="score" style={{ fontSize: '4rem', fontWeight: '900', color: 'var(--primary-blue)', margin: '20px 0' }}>
              {score}/{questions.length}
            </div>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
              {score > 80 ? "Fantastico! Parli italiano come un vero locale." : "Ottimo lavoro! Continua a praticare la 'Dolce Vita'."}
            </p>
            <button type="button" onClick={restart} className="try-again">
              Ricomincia
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
            <AIChatBox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} language="it" />
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
            <span className="qnum">Domanda {currentQuestion + 1} / 100</span>
          </div>
          <h2 style={{ marginTop: '15px', fontSize: '1.3rem' }}>{q?.q}</h2>
          <div className="options" style={{ marginTop: '20px' }}>
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
          Prossima Domanda →
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
        <AIChatBox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} language="it" />
      </div>
    </div>
  );
};

const voiceCss = `
  :root {
    --primary-blue: #00457E;
    --light-blue: #E3F2FD;
    --accent-gold: #FFD700;
    --white: #ffffff;
    --text-dark: #2C3E50;
  }

  .dark-mode {
    --primary-blue: #00457E;
    --light-blue: #1a1a1a;
    --accent-gold: #FFD700;
    --white: #0d0d0d;
    --text-dark: #ffffff;
    --bg-green: #000000;
  }

  .light-mode {
    --primary-blue: #00457E;
    --light-blue: #f5f5f5;
    --accent-gold: #FFD700;
    --white: #ffffff;
    --text-dark: #2C3E50;
    --bg-green: #fafafa;
  }

  .ht-voice {
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: var(--bg-green);
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
    background: #00335E;
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
    background: rgba(0, 69, 126, 0.1);
  }

  .theme-btn.active {
    background: var(--primary-blue);
    color: white;
  }

  .container {
    max-width: 650px;
    margin: 0 auto;
    background: var(--white);
    border-radius: 25px;
    padding: 30px;
    box-shadow: 0 15px 35px rgba(0, 69, 126, 0.1);
    position: relative;
    border-top: 10px solid var(--primary-blue);
    min-height: 600px;
    transition: all 0.3s ease;
  }

  .question-box {
    background: var(--light-blue);
    border-radius: 20px;
    padding: 25px;
    margin-bottom: 20px;
    border: 1px solid #BBDEFB;
  }

  .qnum {
    color: #2E86C1;
    font-weight: bold;
    font-size: 0.9rem;
  }

  .options {
    display: grid;
    gap: 12px;
    margin-top: 15px;
  }

  .option {
    background: var(--white);
    border: 2px solid #D6EAF8;
    border-radius: 12px;
    padding: 18px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 1.1rem;
  }

  .option.correct {
    background: #27AE60 !important;
    color: white !important;
    border-color: #1E8449 !important;
  }
  .option.wrong {
    background: #FDEDEC !important;
    border-color: #E74C3C !important;
    color: #C0392B !important;
  }

  button#nextBtn {
    background: var(--primary-blue);
    color: white;
    border: none;
    padding: 18px;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 15px;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
    transition: background 0.3s;
  }
  button#nextBtn:hover:not(:disabled) { background: #00335E; }
  button#nextBtn:disabled { background: #BDC3C7; cursor: not-allowed; }

  .result-screen {
    text-align: center;
    padding: 40px 10px;
  }

  .try-again {
    background: var(--primary-blue);
    color: white;
    border: none;
    padding: 15px 40px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
  }

  .level-badge {
    display: inline-block;
    padding: 5px 15px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .principiante { background: #BBDEFB; color: #0D47A1; }
  .intermedio { background: #90CAF9; color: #0D47A1; }
  .avanzato { background: #42A5F5; color: #fff; }
  .esperto { background: #1565C0; color: #fff; }
`;

export default ItalianQuiz;
