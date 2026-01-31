import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AIChatBox from '../components/AIChatBox';

const EnglishQuiz = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [levelFilter, setLevelFilter] = useState('Basic');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [options, setOptions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const answeredRef = useRef(false);

  const rawData = useMemo(
    () =>
      `Beginner|What is a happy way to say hello?|Greetings and sunshine! ☀️|Go away||Stop talking||Whatever
Beginner|Which word means 'very good'?|Wonderful|Bad||Sad||Angry
Beginner|How do you feel when you win a game?|Excited!|Bored||Sleepy||Scared
Beginner|Choose the happy fruit color.|Bright yellow lemon 🍋|Grey apple||Dark cloud||Black rain
Beginner|What do you do with your mouth when happy?|Smile|Cry||Scream||Yawn
Beginner|A person who is nice is...|Kind|Mean||Loud||Fast
Beginner|Opposite of 'frown'?|Grin|Shout||Run||Jump
Beginner|When the sun is out, it is...|Bright|Dark||Cold||Midnight
Beginner|I ___ my new puppy!|love|hate||fear||ignore
Beginner|A 'party' is usually...|Fun|Tiring||Sad||Lonely
Beginner|What do you say after a gift?|Thank you!|Is that it?||No thanks||Take it back
Beginner|I am ___ to meet you!|glad|mad||sad||bad
Beginner|A happy baby ___.|giggles|cries||fights||works
Beginner|Friends are ___.|great|scary||boring||small
Beginner|If you have 'joy', you are...|Happy|Hungry||Thirsty||Lost
Beginner|A 'treat' makes people...|Smile|Angry||Cough||Run
Beginner|How is a sunny day?|Beautiful|Ugly||Terrible||Awful
Beginner|What color is often 'happy'?|Yellow|Grey||Black||Brown
Beginner|When you like a joke, you...|Laugh|Sleep||Knit||Bake
Beginner|Best way to start a day?|A big hug!|A loud yell||A sad song||A broken cup
Intermediate|I ___ so happy if you come to the party.|would be|was being||am been||were
Intermediate|She has been ___ all morning.|beaming|beamed||beam||beams
Intermediate|Everything ___ going perfectly today!|is|are||am||be
Intermediate|We ___ celebrate your success!|must|shouldn't||might not||never
Intermediate|Choose the correct exclamation.|How wonderful this is!|What wonderful this is!||How wonder this is!||Which wonderful this!
Intermediate|I'm looking forward ___ seeing you.|to|for||at||with
Intermediate|Neither the rain ___ the wind could stop our joy.|nor|or||and||but
Intermediate|This is the ___ day of my life!|happiest|happier||more happy||happyest
Intermediate|You ___ amazing in that dress!|look|looks||looking||looked like
Intermediate|The music sounds ___.|delightful|delightfully||delight||delighting
Advanced|Synonym for 'extremely happy'?|Elated|Content||Miserable||Apathetic
Advanced|A person full of energy and cheer is ___.|Exuberant|Lethargic||Morose||Placid
Advanced|Meaning of 'Euphoria'?|Intense happiness|Deep sleep||Sudden fear||Quiet anger
Advanced|Which word describes a bright, glowing smile?|Radiant|Dim||Opaque||Vague
Advanced|A 'blissful' state is one of ___.|Perfect happiness|Extreme danger||Total confusion||Deep hunger
Advanced|To 'revel' in something means to ___.|Enjoy it greatly|Hide it||Forget it||Fear it
Advanced|What is 'Jubilation'?|A feeling of great triumph|A feeling of regret||A state of boredom||A minor illness
Advanced|If a person is 'jovial', they are...|Cheerful and friendly|Cruel and fast||Serious and quiet||Young and small
Advanced|Synonym for 'enigmatic'?|Mysterious|Obvious||Simple||Clear
Advanced|What does 'ubiquitous' mean?|Found everywhere|Rare||Hidden||Small
Advanced|To 'alleviate' something is to:|Make it less severe|Increase it||Ignore it||Describe it
Advanced|What is the meaning of 'pragmatic'?|Dealing with things practically|Idealistic||Unrealistic||Lazy
Advanced|'Ephemeral' means:|Lasting for a very short time|Eternal||Strong||Bright
Advanced|Which word means 'to express strong disapproval'?|Condemn|Praise||Support||Ignore
Advanced|Synonym for 'resilient'?|Able to recover quickly|Fragile||Weak||Stiff
Advanced|Meaning of 'meticulous'?|Showing great attention to detail|Careless||Fast||Lazy
Advanced|'Ambiguous' means:|Open to more than one interpretation|Very clear||Single-minded||Certain
Advanced|To 'corroborate' a story is to:|Confirm or give support to|Deny it||Change it||Forget it
Advanced|What does 'eloquent' mean?|Fluent or persuasive in speaking|Quiet||Shy||Confused
Advanced|'Humble' is the opposite of:|Arrogant|Modest||Kind||Quiet
Advanced|To 'scrutinize' is to:|Examine closely|Glance at||Ignore||Accept
Advanced|Meaning of 'volatile'?|Liable to change rapidly and unexpectedly|Stable||Slow||Fixed
Advanced|What is a 'plethora'?|An excessive amount|A lack||A small piece||A secret
Advanced|'Amiable' means:|Friendly and pleasant|Hostile||Angry||Boring
Advanced|Synonym for 'precarious'?|Uncertain or dangerously unstable|Safe||Strong||Certain
Advanced|To 'mitigate' a risk is to:|Make it less severe|Increase it||Start it||Welcome it
Advanced|'Superfluous' means:|Unnecessary, more than enough|Essential||Detailed||Missing
Advanced|Meaning of 'venerable'?|Accorded a great deal of respect|Disrespected||Young||Weak
Advanced|'Obsolete' means:|No longer produced or used|Brand new||Useful||Trendy
Advanced|To 'placate' someone is to:|Make them less angry|Provoke them||Ignore them||Hire them
Advanced|What is 'tenacity'?|The quality of being very determined|Weakness||Politeness||Speed
Advanced|'Benevolent' means:|Well meaning and kindly|Malicious||Greedy||Cruel
Advanced|Synonym for 'indifferent'?|Having no particular interest|Passionate||Angry||Excited
Advanced|'Magnanimous' means:|Very generous or forgiving|Selfish||Small-minded||Cruel
Advanced|To 'reiterate' is to:|Say something again for emphasis|Whisper||Forget||Listen
Advanced|'Trepidation' means:|A feeling of fear or agitation|Confidence||Joy||Boredom
Advanced|Meaning of 'insatiable'?|Impossible to satisfy|Easily pleased||Full||Bored
Advanced|'Cognizant' means:|Having knowledge or being aware|Ignorant||Blind||Asleep
Advanced|To 'procrastinate' is to:|Delay or postpone action|Act quickly||Succeed||Fail
Advanced|Synonym for 'formidable'?|Inspiring fear or respect|Weak||Funny||Simple
Advanced|'Lethargic' means:|Affected by lethargy; sluggish|Energetic||Happy||Quick
Advanced|What does 'sporadic' mean?|Occurring at irregular intervals|Constant||Daily||Never
Advanced|To 'exacerbate' a problem is to:|Make it worse|Solve it||Ignore it||Document it
Advanced|'Inevitably' means:|As is certain to happen|Unlikely||Maybe||Never
Advanced|Meaning of 'scrutiny'?|Critical observation or examination|Neglect||Ignorance||Praise
Advanced|'Ostentatious' means:|Designed to impress or attract notice|Modest||Plain||Simple
Advanced|To 'assimilate' information is to:|Take in and understand fully|Reject it||Lose it||Doubt it
Advanced|'Diligent' means:|Showing care and conscientiousness|Lazy||Fast||Strict
Advanced|What is 'integrity'?|The quality of being honest|Dishonesty||Wealth||Fame
Advanced|'Verbose' means:|Using or expressed in more words than needed|Concise||Silent||Strict
Advanced|To 'abbreviate' is to:|Shorten a word or phrase|Lengthen it||Translate it||Define it
Advanced|'Candid' means:|Truthful and straightforward|Deceptive||Shy||Secretive
Advanced|Synonym for 'diverse'?|Showing a great deal of variety|Same||Small||Limited
Advanced|'Empower' means:|Give someone the authority or power|Restrain||Ignore||Defeat
Advanced|Meaning of 'fluctuate'?|Rise and fall irregularly|Stay still||Sink||Explode
Advanced|'Gregarious' means:|Fond of company; sociable|Reclusive||Angry||Shy
Advanced|To 'implore' is to:|Beg someone earnestly or desperately|Command||Refuse||Ignore
Advanced|'Juxtaposition' means:|Placing things together for contrast|Separation||Matching||Balance
Advanced|Meaning of 'loquacious'?|Tending to talk a great deal|Quiet||Angry||Sleepy
Advanced|'Nimble' means:|Quick and light in movement or action|Clumsy||Slow||Stiff
Advanced|To 'nurture' is to:|Care for and encourage growth|Neglect||Harm||Ignore
Advanced|'Pensive' means:|Engaged in deep or serious thought|Thoughtless||Happy||Angry
Advanced|Synonym for 'reside'?|Have one's permanent home in a place|Travel||Visit||Leave
Advanced|'Stoic' means:|Enduring pain without showing feelings|Emotional||Complaining||Weak
Advanced|To 'transcend' is to:|Surpass or go beyond|Follow||Stay behind||Fail
Advanced|'Aesthetic' relates to:|Beauty or the appreciation of beauty|Logic||Sports||Science
Advanced|Meaning of 'capricious'?|Given to sudden changes of mood|Steady||Calm||Boring
Advanced|To 'discern' is to:|Perceive or recognize|Ignore||Blindly follow||Forget
Advanced|'Facetious' means:|Treating serious issues with inappropriate humor|Serious||Kind||Truthful
Advanced|Meaning of 'gratuitous'?|Uncalled for; lacking good reason|Deserved||Necessary||Kind
Advanced|To 'hinder' is to:|Make it difficult for someone to do something|Help||Speed up||Observe
Advanced|'Inherent' means:|Existing in something as a permanent attribute|Temporary||External||Acquired
Advanced|Synonym for 'judicious'?|Having or showing good judgment|Foolish||Rash||Loud
Advanced|'Kindle' means:|Set on fire or inspire|Extinguish||Dull||Forget
Advanced|To 'lament' is to:|Express passionate grief or sorrow|Celebrate||Laugh||Ignore
Advanced|What is 'malleable'?|Able to be hammered or pressed out of shape|Brittle||Hard||Fixed
Advanced|'Nebulous' means:|In the form of a cloud; hazy|Clear||Solid||Bright
Advanced|To 'obliterate' is to:|Destroy utterly; wipe out|Create||Save||Build
Advanced|'Paradigm' means:|A typical example or pattern of something|Exception||Mistake||Secret
Advanced|Meaning of 'quintessential'?|Representing the most perfect example|Inferior||Average||Bad
Advanced|To 'rectify' is to:|Put something right; correct|Break||Worsen||Ignore
Advanced|'Sanguine' means:|Optimistic or positive|Pessimistic||Angry||Sad
Advanced|Synonym for 'tangible'?|Perceptible by touch|Imaginary||Ghostly||Vague
Advanced|'Uncanny' means:|Strange or mysterious in an unsettling way|Normal||Common||Boring
Advanced|To 'vacillate' is to:|Alternate or waver between opinions|Decide||Stay still||Agree
Advanced|'Wary' means:|Feeling or showing caution|Brave||Careless||Eager
Advanced|Meaning of 'zealous'?|Having or showing great energy or enthusiasm|Indifferent||Lazy||Calm
Advanced|To 'abhor' is to:|Regard with disgust and hatred|Love||Like||Admire
Advanced|'Belligerent' means:|Hostile and aggressive|Peaceful||Kind||Quiet
Advanced|Synonym for 'chasm'?|A profound difference between viewpoint|Bridge||Link||Agreement
Advanced|'Dearth' means:|A scarcity or lack of something|Abundance||Wealth||Surplus
Advanced|To 'elicit' is to:|Evoke or draw out a response|Hide||Suppress||Ignore
Advanced|'Frivolous' means:|Not having any serious purpose or value|Serious||Important||Cruel
Advanced|Meaning of 'gullible'?|Easily persuaded to believe something|Skeptical||Wise||Smart
Advanced|To 'incite' is to:|Encourage or stir up violent behavior|Stop||Prevent||Calm
Advanced|'Jaded' means:|Tired, bored, or lacking enthusiasm|Excited||Fresh||Hyper
Advanced|Synonym for 'knave'?|A dishonest or unscrupulous man|Hero||King||Saint
Advanced|'Languid' means:|Displaying or having a disinclination for effort|Energetic||Quick||Strong
Advanced|To 'mollify' is to:|Appease the anger or anxiety of|Anger||Provoke||Ignore
Advanced|'Nonchalant' means:|Feeling or appearing casually calm|Anxious||Worried||Eager
Advanced|Meaning of 'opulent'?|Ostentatiously rich and luxurious|Poor||Simple||Cheap
Advanced|To 'peruse' is to:|Read something typically in a thorough way|Skim||Ignore||Burn
Advanced|'Quaint' means:|Attractively unusual or old-fashioned|Modern||Ugly||Common
Advanced|Synonym for 'revered'?|Feel deep respect or admiration for|Despised||Ignored||Mocked
Advanced|'Sullen' means:|Bad-tempered and sulky; gloomy|Cheerful||Bright||Happy
Advanced|To 'thwart' is to:|Prevent someone from accomplishing something|Help||Assist||Allow
Advanced|'Unabashed' means:|Not embarrassed, disconnected, or ashamed|Shy||Ashamed||Modest
Advanced|Meaning of 'vicious'?|Deliberately cruel or violent|Kind||Gentle||Soft
Expert|What does 'on cloud nine' mean?|To be extremely happy|To be high up||To be confused||To be sleepy
Expert|'Full of the joys of spring' means ___.|Very happy and energetic|Having allergies||Being young||Liking flowers
Expert|'Tickled pink' means you are ___.|Very pleased|Sick with a fever||Itchy||Embarrassed
Expert|'Having a whale of a time' means ___.|Enjoying yourself immensely|Being very large||Swimming in the ocean||Wasting time
Expert|What is 'a walk in the park'?|Something very easy/pleasant|An exercise routine||A difficult task||A lost dog
Expert|To 'light up someone's life' means ___.|To bring them great happiness|To pay their electricity bill||To wake them up||To be annoying`,
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

    // Filter by level
    const filtered = parsed.filter((q) => {
      if (levelFilter === 'Basic') {
        return q.l === 'Beginner' || q.l === 'Intermediate';
      } else {
        return q.l === 'Advanced' || q.l === 'Expert';
      }
    });

    return filtered.sort(() => Math.random() - 0.5);
  }, [rawData, levelFilter]);

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
      utterance.lang = 'en-US';
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
  }, [loadQuestion, levelFilter]);

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

  const handleLevelChange = (level) => {
    setLevelFilter(level);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    answeredRef.current = false;
    setSelected(null);
  };

  if (showResults) {
    return (
      <div className={`ht-voice ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <style>{voiceCss}</style>
        <div className="external-controls">
          <button className="back-button" onClick={() => navigate('/learning-languages')}>
            ← Back
          </button>
          <div className="level-buttons">
            <button
              className={`level-btn ${levelFilter === 'Basic' ? 'active' : ''}`}
              onClick={() => handleLevelChange('Basic')}
            >
              Basic
            </button>
            <button
              className={`level-btn ${levelFilter === 'Advanced' ? 'active' : ''}`}
              onClick={() => handleLevelChange('Advanced')}
            >
              Advanced
            </button>
          </div>
          <div className="theme-buttons" style={{ marginLeft: 'auto' }}>
            <button className={`theme-btn ${!isDarkMode ? 'active' : ''}`} onClick={() => setIsDarkMode(false)}>
              ☀️ Light
            </button>
            <button className={`theme-btn ${isDarkMode ? 'active' : ''}`} onClick={() => setIsDarkMode(true)}>
              🌙 Dark
            </button>
          </div>
        </div>
        <div className="container">
          <h1>HAPPYY TALK English 🌿</h1>
          <div className="subtitle">Quiz Complete!</div>

          <div className="result-screen">
            <h2>Training Complete!</h2>
            <div className="score" style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
              {score}/{questions.length}
            </div>
            <button type="button" onClick={restart} className="try-again">
              Try Again
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
            <AIChatBox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} language="en" />
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
        <div className="level-buttons">
          <button
            className={`level-btn ${levelFilter === 'Basic' ? 'active' : ''}`}
            onClick={() => handleLevelChange('Basic')}
          >
            Basic
          </button>
          <button
            className={`level-btn ${levelFilter === 'Advanced' ? 'active' : ''}`}
            onClick={() => handleLevelChange('Advanced')}
          >
            Advanced
          </button>
        </div>
        <div className="theme-buttons" style={{ marginLeft: 'auto' }}>
          <button className={`theme-btn ${!isDarkMode ? 'active' : ''}`} onClick={() => setIsDarkMode(false)}>
            ☀️ Light
          </button>
          <button className={`theme-btn ${isDarkMode ? 'active' : ''}`} onClick={() => setIsDarkMode(true)}>
            🌙 Dark
          </button>
        </div>
      </div>
      <div className="container">

        <h1>HAPPYY TALK English 🌿</h1>
        <div className="subtitle">Learn English through happiness!</div>

        <div id="quiz-area">
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
            Next Question →
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
          <AIChatBox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} language="en" />
        </div>
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
    --text-dark: #4b4b4b;
    --border-green: #2563eb;
    --bg-green: #f0f9ff;
  }

  .dark-mode {
    --primary-green: #3b82f6;
    --light-green: #1a1a1a;
    --accent-green: #2563eb;
    --white: #0d0d0d;
    --text-dark: #ffffff;
    --border-green: #2563eb;
    --bg-green: #000000;
  }

  .light-mode {
    --primary-green: #3b82f6;
    --light-green: #f5f5f5;
    --accent-green: #2563eb;
    --white: #ffffff;
    --text-dark: #333333;
    --border-green: #2563eb;
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
    gap: 12px;
    max-width: 1000px;
    margin: 0 auto 20px auto;
    padding: 0 10px;
    flex-wrap: nowrap;
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
  }

  .back-button:hover {
    background: var(--border-green);
    transform: translateY(-2px);
  }

  .level-buttons {
    display: flex;
    gap: 8px;
    background: transparent;
    padding: 0;
    border-radius: 0;
    border: none;
  }

  .level-btn {
    background: var(--primary-green) !important;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    transition: all 0.3s ease;
    color: white !important;
  }

  .level-btn:hover {
    background: var(--accent-green) !important;
    transform: translateY(-1px);
  }

  .level-btn.active {
    background: var(--accent-green) !important;
    color: white !important;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
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
  }

  .theme-btn:hover {
    background: rgba(59, 130, 246, 0.12);
  }

  .theme-btn.active {
    background: var(--primary-green);
    color: white;
  }

  .container {
    max-width: 1000px;
    margin: 0 auto;
    background: var(--white);
    border-radius: 24px;
    padding: 40px 40px 80px 40px;
    box-shadow: 0 15px 35px rgba(37, 99, 235, 0.15);
    border: 2px solid var(--primary-green);
    position: relative;
    min-height: 650px;
  }


  h1 {
    text-align: center;
    color: var(--primary-green);
    margin-bottom: 20px;
    font-weight: 800;
    font-size: 32px;
  }

  .subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 40px;
    font-style: italic;
    font-size: 16px;
  }

  .question-box h2 {
    font-size: 22px;
    color: var(--text-dark);
    margin: 15px 0;
    line-height: 1.5;
    word-wrap: break-word;
  }

  .level-badge {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 10px;
    border: 2px solid var(--primary-green);
  }

  .beginner {
    background: var(--light-green);
    color: var(--primary-green);
  }

  .intermediate {
    background: var(--primary-green);
    color: var(--white);
  }

  .advanced {
    background: var(--border-green);
    color: var(--white);
  }

  .expert {
    background: #2563eb;
    color: var(--white);
  }

  .question-box {
    background: var(--light-green);
    border-radius: 18px;
    padding: 25px;
    margin: 20px 0;
    border: 2px solid var(--primary-green);
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
    border: 2px solid var(--primary-green);
    border-radius: 12px;
    padding: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
    font-weight: 500;
  }

  .option:hover {
    background: var(--light-green);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }

  .option.correct {
    background: var(--primary-green) !important;
    color: white !important;
    border-color: var(--border-green) !important;
  }

  .option.wrong {
    background: #ffebee !important;
    border-color: #ef5350 !important;
    color: #c62828 !important;
  }

  button#nextBtn {
    background: linear-gradient(135deg, var(--primary-green), var(--border-green));
    color: white;
    border: none;
    padding: 18px 50px;
    font-size: 1.2rem;
    font-weight: bold;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: block;
    margin: 30px auto 0;
    width: 100%;
  }

  button#nextBtn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
  }

  button#nextBtn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .result-screen {
    text-align: center;
    padding: 40px 20px;
  }

  .result-screen h2 {
    color: var(--primary-green);
    font-size: 2em;
    margin-bottom: 20px;
  }

  .try-again {
    background: var(--primary-green);
    color: white;
    border: none;
    padding: 15px 40px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
    transition: all 0.2s;
    margin-top: 20px;
  }

  .try-again:hover {
    background: var(--border-green);
    transform: scale(1.05);
  }

  /* Mobile Responsive Styles */
  @media (max-width: 768px) {
    .ht-voice {
      padding: 10px;
    }

    .external-controls {
      flex-direction: row;
      gap: 6px;
      align-items: center;
      margin-bottom: 15px;
      flex-wrap: nowrap;
      justify-content: flex-start;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .back-button {
      padding: 8px 14px;
      font-size: 11px;
      flex-shrink: 0;
      white-space: nowrap;
    }

    .level-buttons {
      justify-content: center;
      flex-shrink: 0;
      padding: 2px;
    }

    .level-btn {
      padding: 6px 12px;
      font-size: 10px;
      white-space: nowrap;
    }

    .theme-buttons {
      justify-content: center;
      flex-shrink: 0;
      padding: 2px;
    }

    .theme-btn {
      padding: 6px 10px;
      font-size: 10px;
      white-space: nowrap;
    }

    .container {
      max-width: 100%;
      padding: 20px 15px 100px 15px;
      border-radius: 16px;
      min-height: auto;
      margin: 0 5px;
    }


    h1 {
      font-size: 24px;
      margin-bottom: 15px;
    }

    .subtitle {
      font-size: 14px;
      margin-bottom: 25px;
    }

    .question-box {
      padding: 20px 15px;
      margin: 15px 0;
      border-radius: 14px;
    }

    .qnum {
      top: -12px;
      left: 15px;
      padding: 4px 12px;
      font-size: 12px;
    }

    .level-badge {
      padding: 5px 12px;
      font-size: 0.7rem;
      margin-bottom: 8px;
    }

    h2 {
      font-size: 18px;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .options {
      gap: 10px;
      margin-top: 15px;
    }

    .option {
      padding: 12px 15px;
      font-size: 14px;
      border-radius: 10px;
      min-height: 48px;
      display: flex;
      align-items: center;
    }

    button#nextBtn {
      padding: 14px 30px;
      font-size: 1rem;
      border-radius: 12px;
      margin: 25px auto 0;
      width: 100%;
    }

    .result-screen {
      padding: 30px 15px;
    }

    .result-screen h2 {
      font-size: 1.5em;
      margin-bottom: 15px;
    }

    .score {
      font-size: 2.5rem !important;
      margin: 20px 0;
    }

    .try-again {
      padding: 12px 30px;
      font-size: 0.9rem;
      width: 100%;
      max-width: 300px;
    }

    /* AI Chat Button - Mobile adjustments */
    button[aria-label="Open AI Chat"] {
      bottom: 15px !important;
      right: 15px !important;
      width: 50px !important;
      height: 50px !important;
      font-size: 20px !important;
    }
  }

  @media (max-width: 480px) {
    .ht-voice {
      padding: 8px;
    }

    .container {
      padding: 15px 12px 90px 12px;
      border-radius: 12px;
    }

    h1 {
      font-size: 20px;
    }

    .subtitle {
      font-size: 13px;
    }

    .question-box {
      padding: 15px 12px;
    }

    h2 {
      font-size: 16px;
    }

    .option {
      padding: 10px 12px;
      font-size: 13px;
      min-height: 44px;
    }

    button#nextBtn {
      padding: 12px 25px;
      font-size: 0.95rem;
    }

    .result-screen h2 {
      font-size: 1.3em;
    }

    .score {
      font-size: 2rem !important;
    }
  }
`;

export default EnglishQuiz;
