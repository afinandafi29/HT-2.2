import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AIChatBox from '../components/AIChatBox';

const HindiQuiz = () => {
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
      `प्रारंभिक|How do you say 'Happy' in Hindi?|खुश (Khush)|दुखी (Dukhi)||गुस्सा (Gussa)||थका (Thaka)
प्रारंभिक|Common greeting for 'Hello':|नमस्ते (Namaste)|अलविदा (Alvida)||माफ़ कीजिए (Maaf kijiye)||नहीं (Nahi)
प्रारंभिक|How to say 'Thank you'?|धन्यवाद (Dhanyavaad)|स्वागत है (Swagat hai)||कृपया (Kripya)||ठीक है (Theek hai)
प्रारंभिक|Word for 'Friend':|दोस्त (Dost)|दुश्मन (Dushman)||अनजान (Anjaan)||पड़ोसी (Padosi)
प्रारंभिक|What does 'Sunder' mean?|Beautiful|Ugly||Small||Tall
प्रारंभिक|How to say 'I love you'?|मैं आपसे प्यार करता हूँ|मैं आपसे नफरत करता हूँ||मैं जा रहा हूँ||मैं सो रहा हूँ
प्रारंभिक|Which word means 'Smile'?|मुस्कान (Muskaan)|रोना (Rona)||सोना (Sona)||खाना (Khana)
प्रारंभिक|How to say 'Good morning'?|सुप्रभात (Suprabhaat)|शुभ रात्रि||शुभ दोपहर||शुभ संध्या
प्रारंभिक|What is 'Delicious' in Hindi?|स्वादिष्ट (Swaadisht)|कड़वा (Kadwa)||खट्टा (Khatta)||फीका (Feeka)
प्रारंभिक|Translate 'Success':|सफलता (Safalta)|हार (Haar)||गलती (Galti)||डर (Dar)
प्रारंभिक|Word for 'Flower':|फूल (Phool)|पेड़ (Ped)||काँटा (Kaanta)||पत्थर (Patthar)
प्रारंभिक|How to say 'Everything is fine'?|सब ठीक है|सब बुरा है||सब खत्म है||सब बंद है
प्रारंभिक|What is 'Sweet'?|मीठा (Meetha)|तीखा (Teekha)||नमकीन (Namkeen)||कड़वा
प्रारंभिक|How to say 'Best wishes'?|शुभकामनाएं (Shubhkaamnayein)|बधाई हो||नमस्ते||अलविदा
प्रारंभिक|Word for 'Peace':|शांति (Shaanti)|शोर (Shor)||लड़ाई (Ladaai)||भीड़ (Bheed)
प्रारंभिक|Translate 'Gift':|उपहार (Uphaar)|काम (Kaam)||सज़ा (Saza)||किताब (Kitaab)
प्रारंभिक|How to say 'Very good'?|बहुत अच्छा (Bahut achha)|बहुत बुरा||बहुत कम||बहुत ज़्यादा
प्रारंभिक|Word for 'Heart':|दिल (Dil)|सिर (Sir)||हाथ (Haath)||पैर (Pair)
प्रारंभिक|What is 'Light' (Illumination)?|रोशनी (Roshni)|अँधेरा (Andhera)||धुआँ (Dhuaan)||बादल (Baadal)
प्रारंभिक|How to say 'Welcome'?|स्वागत है (Swagat hai)|नमस्ते||फिर मिलेंगे||धन्यवाद
प्रारंभिक|Translate 'Music':|संगीत (Sangeet)|शोर||कहानी||कविता
प्रारंभिक|Word for 'Sun':|सूरज (Suraj)|चाँद (Chaand)||तारा (Taara)||आकाश (Aakash)
प्रारंभिक|How to say 'Help' politely?|मदद (Madad)|काम||खेल||बात
प्रारंभिक|Translate 'Dream':|सपना (Sapna)|सच||नींद||जागना
प्रारंभिक|How to say 'Come together'?|साथ आओ|दूर जाओ||अकेले रहो||रुको मत
मध्यम|Translate: 'I am feeling happy today.'|आज मैं खुश महसूस कर रहा हूँ|आज मैं दुखी हूँ||आज मैं सो रहा हूँ||आज मैं व्यस्त हूँ
मध्यम|How to say 'I am proud of you'?|मुझे आप पर गर्व है|मुझे आप पर गुस्सा है||मुझे आप पर शक है||मैं आपको जानता हूँ
मध्यम|What is 'Trust'?|विश्वास (Vishwas)|धोखा (Dhokha)||डर (Dar)||झूठ (Jhooth)
मध्यम|Translate: 'Good luck for the future.'|भविष्य के लिए शुभकामनाएँ|कल मिलते हैं||अपना ध्यान रखना||आप कैसे हैं?
मध्यम|Word for 'Courage':|हौसला (Hausla)|कायरता||कमज़ोरी||थकावट
मध्यम|How to say 'It's a pleasure to meet you'?|आपसे मिलकर खुशी हुई|आपसे मिलकर बुरा लगा||आप कौन हैं?||नमस्ते
मध्यम|What is 'Self-confidence'?|आत्मविश्वास (Aatman-vishwas)|डर||लालच||घमंड
मध्यम|Translate: 'Life is beautiful.'|ज़िंदगी खूबसूरत है|ज़िंदगी कठिन है||ज़िंदगी छोटी है||ज़िंदगी लंबी है
मध्यम|What is 'Kindness'?|दयालुता (Dayaluta)|क्रूरता||गुस्सा||बेईमानी
मध्यम|How to say 'Forgive me'?|मुझे क्षमा करें|मुझे जाने दें||मुझे पैसे दें||मुझे खाना दें
मध्यम|Translate 'Victory':|जीत (Jeet)|हार||खेल||दौड़
मध्यम|How to say 'Keep smiling'?|मुस्कुराते रहो|रोते रहो||काम करते रहो||सोते रहो
मध्यम|What is 'Patience'?|धैर्य (Dhairya)|जल्दबाज़ी||गुस्सा||चिंता
मध्यम|Translate: 'Stay healthy.'|स्वस्थ रहें|व्यस्त रहें||मस्त रहें||सोते रहें
मध्यम|How to say 'I believe in you'?|मुझे आप पर भरोसा है|मुझे आप पर शक है||मैं आपको भूल गया||मैं डरा हुआ हूँ
मध्यम|What is 'Hope'?|आशा (Aasha)|निराशा||डर||दुख
मध्यम|Translate 'Festival':|त्योहार (Tyohaar)|बाज़ार||स्कूल||दफ्तर
मध्यम|How to say 'Wonderful'?|अद्भुत (Adbhut)|बेकार||साधारण||छोटा
मध्यम|Word for 'Progress':|उन्नति (Unnati)|गिरावट||विनाश||स्थिरता
मध्यम|Translate 'Compassion':|करुणा (Karuna)|ईर्ष्या||क्रोध||घमंड
मध्यम|How to say 'Be safe'?|सुरक्षित रहें|सावधान रहें||जल्दी करें||घर जाएँ
मध्यम|What is 'Knowledge'?|ज्ञान (Gyaan)|अज्ञानता||भ्रम||झूठ
मध्यम|Translate 'Unity':|एकता (Ekta)|बँटवारा||झगड़ा||अकेलापन
मध्यम|How to say 'I'm excited'?|मैं उत्साहित हूँ|मैं उदास हूँ||मैं डरा हूँ||मैं थक गया हूँ
मध्यम|What is 'Honesty'?|ईमानदारी (Imaandari)|बेईमानी||चोरी||आलस
उच्च|What is 'Inner Peace'?|आत्मिक शांति|बाहरी शोर||मानसिक तनाव||अशांति
उच्च|Translate 'Gratitude':|कृतज्ञता (Kritagyata)|अहसानफ़रामोशी||लालच||घृणा
उच्च|How to say 'Unforgettable memory'?|अविस्मरणीय याद|पुरानी याद||बुरी याद||छोटी याद
उच्च|What is 'Prosperity'?|समृद्धि (Samriddhi)|गरीबी||अभाव||विनाश
उच्च|Translate 'Inspiration':|प्रेरणा (Prerna)|बाधा||रुकावट||निराशा
उच्च|What is 'Satisfaction'?|संतोष (Santosh)|असंतोष||लालच||भूख
उच्च|How to say 'Dazzling light'?|जगमगाहट|अँधेरा||धुंध||छाया
उच्च|Translate 'Bliss':|परमानंद (Parmanand)|दुख||कष्ट||पीड़ा
उच्च|What is 'Harmony'?|सामंजस्य (Saamanjasya)|विवाद||मतभेद||लड़ाई
उच्च|How to say 'Brilliant future'?|उज्ज्वल भविष्य|अँधेरा भविष्य||कठिन समय||पुराना समय
उच्च|Translate 'Benevolence':|परोपकार (Paropkaar)|स्वार्थ||बुराई||लालच
उच्च|What is 'Tolerance'?|सहनशीलता|अधीरता||गुस्सा||जल्दबाज़ी
उच्च|How to say 'Soulful connection'?|रूहानी रिश्ता|कागज़ी रिश्ता||पुरानी दोस्ती||दुश्मनी
उच्च|What is 'Determination'?|दृढ़ निश्चय|कमज़ोर इरादा||भ्रम||आलस
उच्च|Translate 'Brightness':|चमक (Chamak)|गंदगी||कालापन||पुराना
उच्च|How to say 'Auspicious'?|शुभ (Shubh)|अशुभ||बुरा||खतरनाक
उच्च|What is 'Enthusiasm'?|उमंग (Umang)|उदासी||थकावट||आलस
उच्च|Translate 'Purity':|पवित्रता (Pavitrata)|मिलावट||गंदगी||झूठ
उच्च|What is 'Contentment'?|तृप्ति (Tripti)|भूख||अधूरी इच्छा||प्यास
उच्च|How to say 'Victory to all'?|सबकी जय हो|सबकी हार हो||सब भागो||सब रुको
उच्च|Translate 'Golden age':|स्वर्ण युग|बुरा वक्त||नया साल||कल का दिन
उच्च|What is 'Modesty'?|विनम्रता (Vinamrata)|घमंड||अहंकार||गुस्सा
उच्च|How to say 'Endless joy'?|अनंत खुशी|थोड़ी खुशी||आज की खुशी||कल का दुख
उच्च|Translate 'Spiritual':|आध्यात्मिक|भौतिक||दिखावा||बाज़ारी
उच्च|What is 'Radiance'?|आभा (Aabha)|अँधेरा||धुआँ||कीचड़
विशेषज्ञ|What does 'Sukoon' mean?|Profound peace/Calm|Chaos||Noise||Anger
विशेषज्ञ|Translate: 'Ant mein sab theek ho jata hai.'|In the end, everything gets fine.|Nothing changes.||End is near.||Start over.
विशेषज्ञ|Meaning of 'Ganga-Jamuni Tehzeeb'?|Syncretic/Harmonious culture|River pollution||Religious fight||Dry land
विशेषज्ञ|What is 'Muskurahat'?|A gentle smile|Loud laugh||Crying||Shouting
विशेषज्ञ|Meaning of 'Khidki khuli hai' (metaphorically)?|Opportunity is open|It's cold||Close the door||Watch the birds
विशेषज्ञ|What is 'Mehfil'?|A gathering of joy/art|Solitude||War||Market
विशेषज्ञ|Meaning of 'Chaar Chand Lagana'?|To enhance the beauty greatly|To count stars||To sleep early||To break something
विशेषज्ञ|What is 'Aashirwad'?|Blessing|Curse||Gift||Work
विशेषज्ञ|Meaning of 'Din Dooni Raat Chauguni'?|To progress very rapidly|To sleep a lot||To work slowly||To waste time
विशेषज्ञ|What is 'Jashn'?|Celebration|Mourning||Daily task||Study
विशेषज्ञ|Meaning of 'Ghee ke diye jalana'?|To celebrate with great joy|To cook food||To save money||To burn everything
विशेषज्ञ|What is 'Utsav'?|Festival/Event|Boredom||Silence||Darkness
विशेषज्ञ|Meaning of 'Fakhr'?|Pride (positive)|Shame||Guilt||Greed
विशेषज्ञ|What is 'Raunak'?|Brightness/Liveliness|Dullness||Sadness||Emptiness
विशेषज्ञ|Meaning of 'Milaap'?|Meeting/Union|Separation||Fight||Distance
विशेषज्ञ|What is 'Barkat'?|Abundance/Blessing|Loss||Poverty||End
विशेषज्ञ|Meaning of 'Dil jeetna'?|To win someone's heart|To break a heart||To be heartless||To buy a heart
विशेषज्ञ|What is 'Nazrana'?|A gift of respect|Tax||Fine||Debt
विशेषज्ञ|Meaning of 'Gulzar'?|Full of flowers/Flourishing|Deserted||Thorny||Ugly
विशेषज्ञ|What is 'Sneh'?|Affection/Love|Hate||Jealousy||Coldness
विशेषज्ञ|Meaning of 'Anand hi Anand'?|Pure bliss everywhere|A little fun||Life is hard||No joy
विशेषज्ञ|What is 'Ibaadat'?|Worship/Devotion|Ignorance||Play||Sleep
विशेषज्ञ|Meaning of 'Rang Jamana'?|To enliven the atmosphere|To paint a wall||To sit quietly||To leave early
विशेषज्ञ|What is 'Kayanat'?|Universe/Cosmos|House||City||Country
विशेषज्ञ|Final one! 'Kush raho' means...|Stay happy|Be sad||Go away||Work hard`,
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
      utterance.lang = 'hi-IN';
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
            <button
              type="button"
              className="theme-btn"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              onClick={() => setIsMuted((m) => !m)}
              style={{ minWidth: 44, justifyContent: 'center' }}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>
        <div className="container">
          <div className="result-screen">
            <h2 id="resultTitle">अद्भुत! (Wonderful!)</h2>
            <div
              className="score"
              style={{ fontSize: '4rem', fontWeight: '900', color: 'var(--primary-orange)', margin: '20px 0' }}
            >
              {score}/{questions.length}
            </div>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
              {score > 80
                ? 'शानदार! आपकी हिंदी बेहतरीन है। (Brilliant! Your Hindi is excellent.)'
                : 'बहुत अच्छा! अभ्यास करते रहें। (Well done! Keep practicing.)'}
            </p>
            <button type="button" onClick={restart} className="try-again">
              फिर से शुरू करें
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
            <AIChatBox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} language="hi" />
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];
  const levelClass = String(q?.l || '');
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
          <button
            type="button"
            className="theme-btn"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            onClick={() => setIsMuted((m) => !m)}
            style={{ minWidth: 44, justifyContent: 'center' }}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      <div className="container">
        <div className="question-box">
          <span className={`level-badge ${levelClass}`}>{q?.l}</span>
          <span className="qnum">प्रश्न {currentQuestion + 1} / 100</span>
          <h2 style={{ fontSize: '1.3rem', marginTop: '10px' }}>{q?.q}</h2>
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
          अगला प्रश्न (Next) →
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
        <AIChatBox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} language="hi" />
      </div>
    </div>
  );
};

const voiceCss = `
  :root {
    --primary-orange: #FF8C00;
    --dark-purple: #4B0082;
    --light-yellow: #FFF9E6;
    --accent-pink: #FF1493;
    --white: #ffffff;
    --text-dark: #2D3436;
  }

  .dark-mode {
    --primary-orange: #FF8C00;
    --dark-purple: #B39DDB;
    --light-yellow: #1a1a1a;
    --accent-pink: #FF1493;
    --white: #0d0d0d;
    --text-dark: #ffffff;
    --bg-green: #000000;
  }

  .light-mode {
    --primary-orange: #FF8C00;
    --dark-purple: #4B0082;
    --light-yellow: #FFF9E6;
    --accent-pink: #FF1493;
    --white: #ffffff;
    --text-dark: #2D3436;
    --bg-green: #fafafa;
  }

  .ht-voice {
    font-family: 'Poppins', 'Noto Sans Devanagari', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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
    background: var(--dark-purple);
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
    filter: brightness(0.95);
    transform: translateY(-2px);
  }

  .theme-buttons {
    display: flex;
    gap: 8px;
    background: var(--light-yellow);
    padding: 4px;
    border-radius: 25px;
    border: 2px solid var(--primary-orange);
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
    background: rgba(255, 140, 0, 0.12);
  }

  .theme-btn.active {
    background: var(--dark-purple);
    color: white;
  }

  .container {
    max-width: 650px;
    margin: 0 auto;
    background: var(--white);
    border-radius: 30px;
    padding: 30px;
    box-shadow: 0 15px 40px rgba(75, 0, 130, 0.15);
    position: relative;
    border-top: 10px solid var(--primary-orange);
    border-bottom: 10px solid var(--dark-purple);
    min-height: 600px;
    transition: all 0.3s ease;
  }

  .question-box {
    background: var(--light-yellow);
    border-radius: 20px;
    padding: 25px;
    margin-bottom: 20px;
    border: 1px dashed var(--primary-orange);
  }

  .qnum {
    color: var(--accent-pink);
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }

  .options {
    display: grid;
    gap: 12px;
  }

  .option {
    background: var(--white);
    border: 2px solid #dfe6e9;
    border-radius: 15px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 1.15rem;
  }

  .option.correct {
    background: #55efc4 !important;
    color: #006266 !important;
    border-color: #00b894 !important;
  }
  .option.wrong {
    background: #ff7675 !important;
    color: white !important;
    border-color: #d63031 !important;
  }

  button#nextBtn {
    background: var(--dark-purple);
    color: var(--white);
    border: none;
    padding: 18px;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 15px;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
  }
  button#nextBtn:disabled {
    background: #b2bec3;
    cursor: not-allowed;
  }

  .result-screen {
    text-align: center;
    padding: 40px 10px;
  }

  .try-again {
    background: var(--dark-purple);
    color: white;
    border: none;
    padding: 15px 40px;
    border-radius: 50px;
    cursor: pointer;
    font-weight: bold;
  }

  .level-badge {
    display: inline-block;
    padding: 5px 15px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: 12px;
  }
  .प्रारंभिक { background: #ffeaa7; color: #d35400; }
  .मध्यम { background: #fab1a0; color: #c0392b; }
  .उच्च { background: #a29bfe; color: #4834d4; }
  .विशेषज्ञ { background: #2d3436; color: #fdcb6e; }
`;

export default HindiQuiz;
