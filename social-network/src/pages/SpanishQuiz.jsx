import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AIChatBox from '../components/AIChatBox';

const SpanishQuiz = () => {
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
      `Principiante|¿Cómo se dice 'Happy' en español?|Feliz|Triste||Enojado||Cansado
Principiante|Una respuesta positiva a '¿Cómo estás?'|¡Muy bien, gracias!|Mal||Más o menos||No sé
Principiante|¿Qué haces cuando algo es gracioso?|Reír|Llorar||Dormir||Comer
Principiante|El sol es...|Brillante|Oscuro||Frío||Triste
Principiante|Color de la alegría:|Amarillo|Gris||Negro||Marrón
Principiante|¿Cómo saludas positivamente?|¡Hola, buen día!|Adiós||Cállate||¿Qué quieres?
Principiante|Un amigo es...|Especial|Feo||Malo||Aburrido
Principiante|Opuesto de 'triste':|Alegre|Lento||Alto||Rojo
Principiante|Me gusta mucho el...|Helado|Dolor||Humo||Ruido
Principiante|¡___ cumpleaños!|Feliz|Triste||Viejo||Mal
Principiante|Dar un ___ es amoroso.|Abrazo|Grito||Golpe||Susto
Principiante|La música es...|Fantástica|Horrible||Sorda||Rara
Principiante|¡Qué ___ día hace!|Bonito|Fó||Gris||Sucio
Principiante|Los dulces son...|Ricos|Amargos||Salados||Feos
Principiante|Mi familia me ___.|Ama|Odia||Olvida||Pega
Principiante|Una fiesta es...|Divertida|Seria||Larga||Triste
Principiante|¡___ gracias!|Muchas|Pocas||Nada||Cero
Principiante|Yo quiero ___.|Jugar|Llorar||Pelear||Gritar
Principiante|El cielo está...|Azul|Negro||Roto||Sucio
Principiante|Las flores son...|Hermosas|Malas||Tristes||Gris
Principiante|¡Te ___ mucho!|Quiero|Muerdo||Miro||Llamo
Principiante|Hoy es un día ___.|Genial|Malo||Peor||Normal
Principiante|Dormir bien es...|Bueno|Malo||Raro||Feo
Principiante|¡Eres muy ___!|Simpático|Pesado||Tonto||Gritón
Principiante|La paz es ___.|Linda|Mala||Ruidosa||Dura
Intermedio|Yo ___ muy feliz hoy.|Estoy|Soy||Tengo||Hago
Intermedio|Espero que tú ___ un buen día.|Tengas|Tienes||Tuviste||Tenía
Intermedio|Nosotros nos ___ mucho en la fiesta.|Divertimos|Aburrimos||Dormimos||Fuimos
Intermedio|¡___ suerte!|Buena|Mala||Bien||Mejor
Intermedio|Ella siempre ___ una sonrisa.|Tiene|Llora||Dice||Hace
Intermedio|Si ganamos, ___ muy felices.|Estaremos|Estuvimos||Estamos||Estaban
Intermedio|Me ___ mucho bailar.|Encanta|Odia||Dolió||Parece
Intermedio|Tú eres la persona ___ amable del mundo.|Más|Menos||Tan||Muy
Intermedio|¡Qué alegría ___!|Verte|Mirar||Visto||Viendo
Intermedio|Gracias por ___.|Ayudarme|Pegarme||Irme||Gritar
Intermedio|Estamos ___ por las noticias.|Emocionados|Tristes||Enojados||Cansados
Intermedio|Siempre ___ lo positivo.|Busco|Pierdo||Huyo||Miro
Intermedio|¡Lo ___ muy bien!|Hiciste|Haces||Hacer||Haciendo
Intermedio|Este regalo es ___ ti.|Para|Por||Con||De
Intermedio|Me siento ___ en casa.|Cómodo|Mal||Raro||Lejos
Intermedio|¡Eres el ___!|Mejor|Peor||Medio||Último
Intermedio|Me ___ que estés aquí.|Alegra|Triste||Enoja||Duele
Intermedio|Mañana ___ un día excelente.|Será|Fue||Era||Es
Intermedio|Tengo mucha ___ por el viaje.|Ilusión|Miedo||Hambre||Sueño
Intermedio|¡Sigue ___!|Así|No||Mal||Atrás
Intermedio|Es un placer ___.|Conocerte|Odiarte||Irse||Ver
Intermedio|¡Qué sorpresa tan ___!|Grata|Mala||Fea||Triste
Intermedio|Todo va a salir ___.|Bien|Mal||Peor||Lento
Intermedio|Me gusta tu ___ de ser.|Forma|Cosa||Día||Pelo
Intermedio|¡___ por tu éxito!|Felicidades|Lo siento||Hola||Nada
Avanzado|Sinónimo de 'muy feliz':|Radiante|Apático||Melancólico||Severo
Avanzado|¿Qué es estar 'Eufórico'?|Extremadamente alegre|Muy cansado||Con mucho miedo||Sin hambre
Avanzado|Una persona llena de vida es...|Vivaz|Inerte||Lenta||Triste
Avanzado|La 'plenitud' es un estado de...|Felicidad total|Vacío||Hambre||Duda
Avanzado|Sentir 'regocijo' es sentir...|Gran alegría|Gran dolor||Mucho frío||Envidia
Avanzado|Un momento 'inolvidable' es...|Que se recuerda con cariño|Que se olvida rápido||Que es aburrido||Malo
Avanzado|Ser 'optimista' significa...|Ver el lado bueno|Ver el lado oscuro||Ser realista||Estar enojado
Avanzado|La 'gratitud' es...|Saber dar las gracias|Saber pedir dinero||Tener orgullo||Estar solo
Avanzado|Un clima 'apacible' es...|Tranquilo y agradable|Tormentoso||Muy caluroso||Horrible
Avanzado|Estar 'fascinado' es...|Muy impresionado y feliz|Muy aburrido||Dormido||Perdido
Avanzado|La 'bondad' es una virtud...|Positiva|Negativa||Extraña||Rara
Avanzado|Un 'agasajo' es...|Una muestra de afecto|Un insulto||Un grito||Un robo
Avanzado|Estar 'contento' es estar...|Satisfecho|Enojado||Hambriento||Loco
Avanzado|La 'armonía' es...|Equilibrio y paz|Guerra||Ruido||Caos
Avanzado|Ser 'altruista' es...|Ayudar a los demás|Pensar en uno mismo||Ser egoísta||Ser rico
Avanzado|Una sonrisa 'sincera' es...|Honesta|Falsa||Fea||Rápida
Avanzado|El 'bienestar' es importante para...|La salud|La guerra||El dolor||Nadie
Avanzado|Tener 'esperanza' es...|Confiar en el futuro|Tener miedo||Llorar||Rendirse
Avanzado|Un 'brindis' se hace para...|Celebrar algo bueno|Pelear||Dormir||Comer solo
Avanzado|Ser 'hospitalario' es...|Recibir bien a la gente|Estar enfermo||Ser malo||Cerrar la puerta
Avanzado|La 'amistad' es un tesoro ___.|Invaluable|Barato||Malo||Sucio
Avanzado|Un éxito 'rotundo' es...|Un gran éxito|Un fracaso||Algo pequeño||Una duda
Avanzado|Estar 'maravillado' es...|Lleno de asombro positivo|Asustado||Cansado||Hambriento
Avanzado|El 'entusiasmo' nos ayuda a...|Lograr metas|Fallar||Dormir||Rendirse
Avanzado|Vivir en 'paz' es...|Lo ideal|Imposible||Malo||Aburrido
Experto|¿Qué significa 'Estar en las nubes'?|Estar muy feliz o distraído|Tener frío||Ser un avión||Estar mojado
Experto|'Ser un sol' significa que eres...|Una persona excelente|Muy caliente||Amarillo||Muy redondo
Experto|'Estar como un niño con zapatos nuevos' es...|Estar muy ilusionado|Necesitar ropa||Tener pies pequeños||Estar cansado
Experto|'Hacer buenas migas' significa...|Llevarse muy bien con alguien|Cocinar pan||Pelear||Limpiar la mesa
Experto|¿Qué es 'Ver la vida de color de rosa'?|Ser muy optimista|Tener problemas de vista||Pintar la casa||Estar triste
Experto|'Dar en el clavo' significa...|Acertar perfectamente|Construir algo||Lastimarse la mano||Perder un juego
Experto|'Estar de un humor de perros' es el opuesto de...|Estar feliz|Estar cansado||Tener mascotas||Tener hambre
Experto|'Miel sobre hojuelas' significa...|Algo que está excelente|Mucha azúcar||Comida mala||Tener abejas
Experto|'Estar en su salsa' significa...|Estar en un lugar donde eres feliz|Estar cocinando||Estar sucio||Tener calor
Experto|'Tirar la casa por la ventana' se hace para...|Celebrar a lo grande|Limpiar||Mudarse||Enojarse
Experto|'Pan comido' significa que algo es...|Muy fácil y agradable|Hora de comer||Muy duro||Caro
Experto|'Estar como pez en el agua' es...|Sentirse muy cómodo|Estar mojado||Tener frío||No poder respirar
Experto|'Pedir boca' significa...|Que algo salió perfecto|Tener hambre||Hablar mucho||Ir al médico
Experto|'Quedarse con la boca abierta' es por...|Asombro positivo|Sueño||Hambre||Dolor
Experto|'Sacar pecho' es sentirse...|Orgulloso de algo bueno|Enfermo||Cansado||Con frío
Experto|'Tener un corazón de oro' es ser...|Muy buena persona|Muy rico||Estar enfermo||Ser un robot
Experto|'Ir sobre ruedas' significa que todo va...|Excelente|Muy rápido||En coche||Lento
Experto|'Hacer el agosto' significa...|Tener mucho éxito|Ir de vacaciones||Tener calor||Esperar un mes
Experto|'A pedir de boca' significa...|Exactamente como querías|Que tienes hambre||Que hablas mucho||Mal
Experto|'No caber en sí de gozo' es...|Estar inmensamente feliz|Estar gordo||Estar apretado||Estar triste
Experto|'Estar de racha' es...|Tener muchos éxitos seguidos|Tener mucho viento||Tener mala suerte||Estar cansado
Experto|'Ponerse las botas' suele ser...|Disfrutar mucho de algo|Tener frío||Caminar mucho||Comprar zapatos
Experto|'Saltar de alegría' es...|Estar muy emocionado|Hacer ejercicio||Tener miedo||Estar loco
Experto|'Tener ángel' es...|Tener un encanto especial|Ser un pájaro||Estar muerto||Ser invisible
Experto|'Dormir como un tronco' es...|Descansar perfectamente|Ser de madera||Estar muerto||Tener pesadillas`,
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
      utterance.pitch = 1.1;
      utterance.lang = 'es-ES';
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
            <h2>¡Entrenamiento Completado!</h2>
            <div className="score" style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
              {score}/{questions.length}
            </div>
            <button type="button" onClick={restart} className="try-again">
              Reiniciar
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
            <AIChatBox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} language="es" />
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
          <span className={`level-badge ${levelClass}`}>{q?.l}</span>
          <div className="qnum">
            {currentQuestion + 1}/{questions.length}
          </div>
          <h2>{q?.q}</h2>
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
          Siguiente Pregunta →
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
        <AIChatBox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} language="es" />
      </div>
    </div>
  );
};

const voiceCss = `
  :root {
    --primary-green: #3b82f6;
    --light-green: #eff6ff;
    --accent-green: #2563eb;
    --white: #ffffff;
    --text-dark: #212121;
  }

  .dark-mode {
    --primary-green: #3b82f6;
    --light-green: #1a1a1a;
    --accent-green: #2563eb;
    --white: #0d0d0d;
    --text-dark: #ffffff;
    --bg-green: #000000;
  }

  .light-mode {
    --primary-green: #3b82f6;
    --light-green: #f5f5f5;
    --accent-green: #2563eb;
    --white: #ffffff;
    --text-dark: #333333;
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
    background: var(--primary-green);
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
    background: var(--accent-green);
    transform: translateY(-2px);
  }

  .theme-buttons {
    display: flex;
    gap: 8px;
    background: var(--light-green);
    padding: 4px;
    border-radius: 25px;
    border: 2px solid var(--primary-green);
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
    background: var(--primary-green);
    color: white;
  }

  .container {
    max-width: 650px;
    margin: 0 auto;
    background: var(--white);
    border-radius: 24px;
    padding: 30px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
    position: relative;
    min-height: 600px;
    transition: all 0.3s ease;
  }

  .question-box {
    background: var(--light-green);
    border-radius: 18px;
    padding: 25px;
    margin: 20px 0;
    border: 1px solid #bfdbfe;
    position: relative;
  }

  .qnum {
    position: absolute;
    top: -15px;
    left: 20px;
    background: var(--primary-green);
    color: white;
    padding: 5px 15px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 14px;
  }

  .options {
    display: grid;
    gap: 12px;
    margin-top: 20px;
  }

  .option {
    background: var(--white);
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 1.1rem;
  }

  .option.correct {
    background: #2563eb !important;
    color: white !important;
    border-color: #1d4ed8 !important;
  }
  .option.wrong {
    background: #ffebee !important;
    border-color: #ef5350 !important;
    color: #c62828 !important;
  }

  button#nextBtn {
    background: var(--primary-green);
    color: white;
    border: none;
    padding: 15px 40px;
    font-size: 1.1rem;
    border-radius: 50px;
    cursor: pointer;
    margin: 20px auto;
    display: block;
  }
  button#nextBtn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .result-screen {
    text-align: center;
    padding: 40px 20px;
  }

  .try-again {
    padding: 12px 25px;
    border-radius: 25px;
    cursor: pointer;
    border: 1px solid #bfdbfe;
    background: var(--white);
    color: var(--primary-green);
    font-weight: bold;
  }

  .level-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .principiante {
    background: #dbeafe;
    color: #1e3a8a;
  }
  .intermedio {
    background: #93c5fd;
    color: #fff;
  }
  .avanzado {
    background: #3b82f6;
    color: #fff;
  }
  .experto {
    background: #2563eb;
    color: #fff;
  }
`;

export default SpanishQuiz;
