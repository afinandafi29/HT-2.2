import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const BasicLearning = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const languageParam = searchParams.get('lang') || '';
  const [muted, setMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState('');

  const bgColor = isDarkMode ? '#0f1419' : '#f8fafc';
  const textColor = isDarkMode ? '#f1f5f9' : '#1e293b';
  const cardBg = isDarkMode ? '#1e293b' : '#ffffff';
  const borderColor = isDarkMode ? '#334155' : '#e2e8f0';
  const primaryColor = '#3b82f6';

  const englishData = {
    guide_intro: "Welcome to the Complete English Language Learning Guide. This course covers everything from basic alphabets to advanced grammar and daily conversation skills.",
    sections: {
      1: {
        title: "1. Alphabet & Sounds (Foundation)",
        desc: "English has 26 letters. 5 Vowels (A,E,I,O,U) and 21 Consonants. Sounds are divided into Short and Long vowels.",
        data: {
          upper: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' '),
          lower: 'a b c d e f g h i j k l m n o p q r s t u v w x y z'.split(' '),
          phonics: [
            { cat: 'Short Vowels', items: ['cat /æ/', 'bed /ɛ/', 'sit /ɪ/', 'hot /ɒ/', 'cup /ʌ/'] },
            { cat: 'Long Vowels', items: ['cake /eɪ/', 'see /i:/', 'my /aɪ/', 'go /əʊ/', 'food /u:/'] },
            { cat: 'Silent Letters', items: ['Knife (K)', 'Write (W)', 'Hour (H)', 'Comb (B)', 'Island (S)'] }
          ]
        }
      },
      2: {
        title: "2. Numbers, Time & Dates",
        desc: "Learning how to count, tell time, and talk about dates is essential for daily life.",
        data: {
          cardinal: '1:one,2:two,3:three,4:four,5:five,10:ten,20:twenty,50:fifty,100:hundred,1000:thousand'.split(','),
          ordinal: '1st:first,2nd:second,3rd:third,4th:fourth,5th:fifth,10th:tenth,20th:twentieth'.split(','),
          time: ["3:00 - Three o'clock", "3:15 - Quarter past three", "3:30 - Half past three", "3:45 - Quarter to four", "AM - Morning", "PM - Afternoon/Night"],
          days: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday'.split(','),
          months: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(',')
        }
      },
      3: {
        title: "3. Basic Words (Everyday Vocabulary)",
        desc: "Common words used in daily life. Categorized by theme.",
        data: {
          home: ["House", "Room", "Door", "Window", "Table", "Chair", "Bed", "Kitchen"],
          family: ["Mother", "Father", "Brother", "Sister", "Son", "Daughter", "Baby"],
          body: ["Head", "Face", "Eye", "Ear", "Nose", "Mouth", "Hand", "Leg", "Foot"],
          food: ["Water", "Milk", "Bread", "Rice", "Fruit", "Apple", "Vegetable", "Meat"],
          clothes: ["Shirt", "Pants", "Shoes", "Sock", "Hat", "Coat", "Dress", "Suit"]
        }
      },
      4: {
        title: "4. Parts of Speech",
        desc: "The building blocks of English sentences.",
        data: [
          { type: 'Noun', desc: 'Person, Place, Thing', ex: 'Book, London, John' },
          { type: 'Pronoun', desc: 'Replaces Noun', ex: 'I, You, He, She, It' },
          { type: 'Verb', desc: 'Action or State', ex: 'Run, Eat, Be, Think' },
          { type: 'Adjective', desc: 'Describes Noun', ex: 'Big, Red, Happy' },
          { type: 'Adverb', desc: 'Describes Verb', ex: 'Quickly, Very, Well' }
        ]
      },
      5: {
        title: "5. Sentence Structure",
        desc: "How to arrange words to make logic. Basic formula: Subject + Verb + Object.",
        data: [
          { type: 'Affirmative', form: 'S + V + O', ex: 'I love English.' },
          { type: 'Negative', form: 'S + do/does not + V', ex: 'I do not like coffee.' },
          { type: 'Question', form: 'Do/Does + S + V?', ex: 'Do you speak English?' }
        ]
      },
      6: {
        title: "6. Tenses (Basic & Intermediate)",
        desc: "Understanding time in English. Past, Present, and Future.",
        data: [
          { name: 'Present Simple', usage: 'Routine', ex: 'I work every day.' },
          { name: 'Present Continuous', usage: 'Now', ex: 'I am reading now.' },
          { name: 'Past Simple', usage: 'Finished', ex: 'I went to school.' },
          { name: 'Future (Will)', usage: 'Prediction', ex: 'I will help you.' }
        ]
      },
      7: {
        title: "7. Verbs & Verb Forms",
        desc: "Main verbs, helping verbs, and regular/irregular forms.",
        data: {
          forms: [
            { v1: 'Go (Base)', v2: 'Went (Past)', v3: 'Gone (Participle)' },
            { v1: 'Eat', v2: 'Ate', v3: 'Eaten' },
            { v1: 'Take', v2: 'Took', v3: 'Taken' }
          ],
          modals: ["Can (Ability)", "Should (Advice)", "Must (Obligation)", "May (Permission)"]
        }
      },
      8: {
        title: "8. Questions & Question Words",
        desc: "Using Wh- words and Yes/No formats.",
        data: {
          wh: ["What (Object)", "Why (Reason)", "When (Time)", "Where (Place)", "Who (Person)", "How (Manner)"],
          tags: ["He is nice, isn't he?", "You like tea, don't you?"]
        }
      },
      9: {
        title: "9. Articles & Determiners",
        desc: "A, An, The and words like This, That, Some, Any.",
        data: {
          articles: ["A/An (Generic)", "The (Specific)"],
          determiners: ["This/That", "These/Those", "Some/Any", "Much/Many"]
        }
      },
      10: {
        title: "10. Prepositions",
        desc: "Words that show relationship in space and time.",
        data: {
          place: ["In (inside)", "On (surface)", "At (point)", "Under (below)"],
          time: ["In July", "On Monday", "At 5:00", "Since 2010"]
        }
      },
      11: {
        title: "11. Speaking Skills",
        desc: "Tips for fluency: Introduce yourself, use small talk, and be confident.",
        data: ["Self-introduction", "Daily greetings", "Asking for help", "Ordering food", "Polite expressions"]
      },
      12: {
        title: "12. Listening Skills",
        desc: "Improve understanding by listening to music, podcasts, and movies.",
        data: ["Keywords listening", "Accent practice", "Note taking", "Shadowing method"]
      },
      13: {
        title: "13. Reading Skills",
        desc: "Start with short stories and news. Learn to skim and scan.",
        data: ["Phonics to words", "Context clues", "Sentence meaning", "Reading habits"]
      },
      14: {
        title: "14. Writing Skills",
        desc: "Practice journaling, emails, and professional messages.",
        data: ["Sentence building", "Email etiquette", "Resume/CV basics", "Spelling rules"]
      },
      15: {
        title: "15. Pronunciation & Accent",
        desc: "Word stress and intonation change the meaning of sentences.",
        data: ["Word stress", "Sentence stress", "Linking sounds", "Intonation"]
      },
      16: {
        title: "16. Idioms & Expressions",
        desc: "Phrases where the meaning is different from literal words.",
        data: ["Break a leg (Good luck)", "Piece of cake (Easy)", "Under the weather (Sick)"]
      },
      17: {
        title: "17. Functional English (Travel/Work)",
        desc: "English for specific situations like the airport or office.",
        data: ["Airport check-in", "Hotel booking", "Interview skills", "Office meetings"]
      },
      18: {
        title: "18. Advanced Grammar",
        desc: "Complex structures like Conditionals and Passive Voice.",
        data: ["Passive Voice", "Conditionals (If...)", "Reported Speech", "Relative Clauses"]
      },
      19: {
        title: "19. Practice & Improvement",
        desc: "Daily habits to reach fluency faster.",
        data: ["Think in English", "Vocabulary notebook", "Record yourself", "Daily speaking"]
      },
      20: {
        title: "20. Culture & Confidence",
        desc: "Understanding social rules and building the courage to speak.",
        data: ["English etiquette", "Body language", "Overcoming fear", "Public speaking"]
      }
    },
    vocab_expansion: {
      life_environment: {
        house_rooms: ["Living room", "Kitchen", "Bedroom", "Bathroom", "Basement", "Attic", "Garage", "Hallway"],
        furniture: ["Sofa", "Table", "Chair", "Bed", "Wardrobe", "Bookshelf", "Mirror", "Lamp"],
        school: ["Student", "Teacher", "Classroom", "Library", "Book", "Pen", "Desk", "Exam"],
        office: ["Manager", "Computer", "Printer", "Meeting", "Project", "Salary", "Email", "Phone"],
        jobs: ["Doctor", "Engineer", "Nurse", "Chef", "Artist", "Pilot", "Lawyer", "Scientist"],
        transport: ["Car", "Bus", "Train", "Plane", "Ship", "Bicycle", "Taxi", "Subway"],
        places: ["Hospital", "Bank", "Park", "Cinema", "Restaurant", "Mall", "Museum", "Station"],
        weather: ["Sunny", "Rainy", "Windy", "Snowy", "Stormy", "Cloudy", "Hot", "Cold"],
        nature: ["River", "Mountain", "Ocean", "Forest", "Island", "Desert", "Tree", "Flower"]
      },
      daily_vocabulary: {
        greetings: ["Hello", "Good morning", "How are you?", "Nice to meet you", "Thank you", "Sorry", "Goodbye"],
        family: ["Mother", "Father", "Brother", "Sister", "Son", "Daughter", "Grandparent", "Cousin"],
        body_parts: ["Head", "Face", "Eye", "Ear", "Nose", "Mouth", "Hand", "Arm", "Leg", "Foot"],
        clothes: ["Shirt", "Pants", "Dress", "Coat", "Shoes", "Socks", "Hat", "Gloves"],
        food_drinks: ["Bread", "Milk", "Water", "Rice", "Meat", "Egg", "Coffee", "Tea", "Juice", "Pizza"],
        fruits_veg: ["Apple", "Banana", "Orange", "Tomato", "Potato", "Carrot", "Onion", "Grape"],
        animals_birds: ["Dog", "Cat", "Lion", "Elephant", "Eagle", "Owl", "Fish", "Snake"],
        colors_shapes: ["Red", "Blue", "Green", "Yellow", "Circle", "Square", "Triangle", "Star"],
        emotions: ["Happy", "Sad", "Angry", "Excited", "Tired", "Hungry", "Scared", "Surprised"]
      },
      action_words: {
        daily: ["Wake up", "Brush", "Eat", "Sleep", "Wash", "Clean", "Cook", "Dress"],
        movement: ["Walk", "Run", "Jump", "Climb", "Swim", "Fly", "Drive", "Ride"],
        speaking: ["Say", "Talk", "Tell", "Ask", "Whisper", "Shout", "Laugh", "Sing"],
        thinking: ["Think", "Know", "Learn", "Remember", "Believe", "Doubt", "Decide", "Hope"],
        feeling: ["Love", "Like", "Hate", "Feel", "Want", "Need", "Fear", "Trust"],
        cooking: ["Cut", "Boil", "Fry", "Bake", "Mix", "Stir", "Peel", "Roast"],
        work_study: ["Read", "Write", "Type", "Draw", "Wait", "Plan", "Fix", "Buy"]
      }
    }
  };

  const languages = {
    english: englishData,
    spanish: {
      alphabet: 'A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z'.split(' '),
      numbers: ['1: uno', '2: dos', '3: tres', '4: cuatro', '5: cinco', '6: seis', '7: siete', '8: ocho', '9: nueve', '10: diez'],
      phrases: ['Hello: Hola', 'Thank you: Gracias', 'Please: Por favor', 'Yes: Sí', 'No: No', 'Goodbye: Adiós']
    },
    french: {
      alphabet: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' '),
      numbers: ['1: un', '2: deux', '3: trois', '4: quatre', '5: cinq', '6: six', '7: sept', '8: huit', '9: neuf', '10: dix'],
      phrases: ['Hello: Bonjour', 'Thank you: Merci', 'Please: S\'il vous plaît', 'Yes: Oui', 'No: Non', 'Goodbye: Au revoir']
    },
    german: {
      alphabet: 'A Ä B C D E F G H I J K L M N O Ö P Q R S ß T U Ü V W X Y Z'.split(' '),
      numbers: ['1: eins', '2: zwei', '3: drei', '4: vier', '5: fünf', '6: sechs', '7: sieben', '8: acht', '9: neun', '10: zehn'],
      phrases: ['Hello: Hallo', 'Thank you: Danke', 'Please: Bitte', 'Yes: Ja', 'No: Nein', 'Goodbye: Auf Wiedersehen']
    },
    italian: {
      alphabet: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' '),
      numbers: ['1: uno', '2: due', '3: tre', '4: quattro', '5: cinco', '6: seis', '7: sette', '8: otto', '9: nove', '10: dieci'],
      phrases: ['Hello: Ciao', 'Thank you: Grazie', 'Please: Per favore', 'Yes: Sì', 'No: No', 'Goodbye: Arrivederci']
    },
    portuguese: {
      alphabet: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' '),
      numbers: ['1: um', '2: dois', '3: três', '4: quatro', '5: cinco', '6: seis', '7: sete', '8: oito', '9: nove', '10: dez'],
      phrases: ['Hello: Olá', 'Thank you: Obrigado', 'Please: Por favor', 'Yes: Sim', 'No: Não', 'Goodbye: Adeus']
    },
    dutch: {
      alphabet: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' '),
      numbers: ['1: één', '2: twee', '3: drie', '4: vier', '5: vijf', '6: zes', '7: zeven', '8: acht', '9: negen', '10: tien'],
      phrases: ['Hello: Hallo', 'Thank you: Dank je', 'Please: Alsjeblieft', 'Yes: Ja', 'No: Nee', 'Goodbye: Dag']
    },
    hindi: {
      alphabet: 'अ आ इ ई उ ऊ ऋ ए ऐ ओ औ क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह'.split(' '),
      numbers: ['1: एक (ek)', '2: दो (do)', '3: तीन (tīn)', '4: चार (cār)', '5: पाँच (pā̃c)', '6: छह (chah)', '7: सात (sāt)', '8: आठ (āṭh)', '9: नौ (nau)', '10: दस (das)'],
      phrases: ['Hello: नमस्ते (namaste)', 'Thank you: धन्यवाद (dhanyavād)', 'Please: कृपया (kṛpayā)', 'Yes: हाँ (hā̃)', 'No: नहीं (nahī̃)', 'Goodbye: अलविदा (alvidā)']
    },
    mandarin: {
      alphabet: 'No alphabetic script; uses characters (e.g., 一, 人)'.split(', '),
      numbers: ['1: 一 (yī)', '2: 二 (èr)', '3: 三 (sān)', '4: 四 (sì)', '5: 五 (wǔ)', '6: 六 (liù)', '7: 七 (qī)', '8: 八 (bā)', '9: 九 (jiǔ)', '10: 十 (shí)'],
      phrases: ['Hello: 你好 (nǐ hǎo)', 'Thank you: 谢谢 (xièxie)', 'Please: 请 (qǐng)', 'Yes: 是 (shì)', 'No: 不 (bù)', 'Goodbye: 再见 (zàijiàn)']
    },
    japanese: {
      alphabet: 'Hiragana: あ い う え お か き く け こ さ し す せ そ た ち つ て と な に ぬ ね の は ひ ふ へ ほ ま み む め も や ゆ よ ら り る れ ろ わ を ん'.split(' '),
      numbers: ['1: 一 (ichi)', '2: 二 (ni)', '3: 三 (san)', '4: 四 (shi)', '5: 五 (go)', '6: 六 (roku)', '7: 七 (shichi)', '8: 八 (hachi)', '9: 九 (ku)', '10: 十 (jū)'],
      phrases: ['Hello: こんにちは (konnichiwa)', 'Thank you: ありがとう (arigatō)', 'Please: お願いします (onegaishimasu)', 'Yes: はい (hai)', 'No: いいえ (iie)', 'Goodbye: さようなら (sayonara)']
    },
    korean: {
      alphabet: 'ㄱ ㄲ ㄴ ㄷ ㄸ ㄹ ㅁ ㅂ ㅃ ㅅ ㅆ ㅇ ㅈ ㅉ ㅊ ㅋ ㅌ ㅍ ㅎ ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ'.split(' '),
      numbers: ['1: 하나 (hana)', '2: 둘 (dul)', '3: 셋 (set)', '4: 넷 (net)', '5: 다섯 (daseot)', '6: 여섯 (yeoseot)', '7: 일곱 (ilgop)', '8: 여덟 (yeodeol)', '9: 아홉 (ahop)', '10: 열 (yeol)'],
      phrases: ['Hello: 안녕하세요 (annyeonghaseyo)', 'Thank you: 감사합니다 (gamsahamnida)', 'Please: 부탁합니다 (butakamnida)', 'Yes: 네 (ne)', 'No: 아니요 (aniyo)', 'Goodbye: 안녕 (annyeong)']
    },
    russian: {
      alphabet: 'А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ы Ь Э Ю Я'.split(' '),
      numbers: ['1: один (odín)', '2: два (dva)', '3: три (tri)', '4: четыре (chetyre)', '5: пять (pyat)', '6: шесть (shest)', '7: семь (sem)', '8: восемь (vosem)', '9: девять (devyat)', '10: десять (desyat)'],
      phrases: ['Hello: Привет (privet)', 'Thank you: Спасибо (spasibo)', 'Please: Пожалуйста (pozhaluysta)', 'Yes: Да (da)', 'No: Нет (net)', 'Goodbye: До свидания (do svidaniya)']
    },
    arabic: {
      alphabet: 'ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي'.split(' '),
      numbers: ['1: واحد (wāḥid)', '2: اثنان (iṯnān)', '3: ثلاثة (ṯalāṯa)', '4: أربعة (ʔarbaʕa)', '5: خمسة (ḵamsa)', '6: ستة (sitta)', '7: سبعة (sabʕa)', '8: ثمانية (ṯamāniya)', '9: تسعة (tisʕa)', '10: عشرة (ʕašara)'],
      phrases: ['Hello: مرحبا (marḥaban)', 'Thank you: شكرا (shukran)', 'Please: من فضلك (min faḍlik)', 'Yes: نعم (naʕam)', 'No: لا (lā)', 'Goodbye: مع السلامة (maʕa as-salāma)']
    }
  };

  const languageMap = {
    'English': 'english',
    'Spanish': 'spanish',
    'French': 'french',
    'Japanese': 'japanese',
    'German': 'german',
    'Korean': 'korean',
    'Italian': 'italian',
    'Chinese': 'mandarin',
    'Hindi': 'hindi',
    'Russian': 'russian',
    'Portuguese': 'portuguese',
    'Turkish': 'turkish',
    'Dutch': 'dutch',
    'Greek': 'greek',
    'Vietnamese': 'vietnamese',
    'Polish': 'polish',
    'Swedish': 'swedish',
    'Latin': 'latin',
    'Indonesian': 'indonesian',
    'Arabic': 'arabic'
  };

  const currentLang = languageMap[languageParam] || (languageParam ? languageParam.toLowerCase() : 'english');
  const data = languages[currentLang] || languages.english;

  const startQuiz = () => {
    setIsQuizMode(true);
    generateQuestion();
  };

  const generateQuestion = () => {
    setQuizFeedback('');
    let question = "";
    let options = [];
    let correct = "";

    if (currentLang === 'english') {
      const type = Math.random() > 0.5 ? 'vocab' : 'numbers';
      if (type === 'numbers' && data.sections && data.sections[2]) {
        const nums = data.sections[2].data.cardinal;
        const pair = nums[Math.floor(Math.random() * nums.length)].split(':');
        question = `What is the word for the number ${pair[0]}?`;
        correct = pair[1].trim();
        options = [correct];
        while (options.length < 4) {
          const rand = nums[Math.floor(Math.random() * nums.length)].split(':')[1].trim();
          if (!options.includes(rand)) options.push(rand);
        }
      } else if (data.vocab_expansion) {
        const categories = Object.keys(data.vocab_expansion.daily_vocabulary);
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const items = data.vocab_expansion.daily_vocabulary[cat];
        correct = items[Math.floor(Math.random() * items.length)];
        question = `Select the word for: ${cat.replace(/_/g, ' ').toUpperCase()}`;
        options = [correct];
        while (options.length < 4) {
          const rand = items[Math.floor(Math.random() * items.length)];
          if (!options.includes(rand)) options.push(rand);
        }
      }
    } else {
      const source = Math.random() > 0.5 && data.phrases ? 'phrases' : 'numbers';
      if (source === 'phrases' && data.phrases) {
        const pair = data.phrases[Math.floor(Math.random() * data.phrases.length)].split(': ');
        question = `How do you say "${pair[0]}" in ${languageParam}?`;
        correct = pair[1];
        options = [correct];
        while (options.length < 4) {
          const rand = data.phrases[Math.floor(Math.random() * data.phrases.length)].split(': ')[1];
          if (!options.includes(rand)) options.push(rand);
        }
      } else if (data.numbers) {
        const pair = data.numbers[Math.floor(Math.random() * data.numbers.length)].split(': ');
        question = `What is "${pair[0]}" in ${languageParam}?`;
        correct = pair[1];
        options = [correct];
        while (options.length < 4) {
          const rand = data.numbers[Math.floor(Math.random() * data.numbers.length)].split(': ')[1];
          if (!options.includes(rand)) options.push(rand);
        }
      }
    }

    if (question) {
      setQuizQuestion({
        question,
        options: options.sort(() => Math.random() - 0.5),
        correct
      });
    }
  };

  const handleAnswer = useCallback((option) => {
    if (option === quizQuestion.correct) {
      setQuizScore(s => s + 1);
      setQuizFeedback('Correct! 🌟');
      setTimeout(generateQuestion, 1500);
    } else {
      setQuizFeedback(`Oops! The correct answer was ${quizQuestion.correct}`);
      setTimeout(generateQuestion, 2000);
    }
  }, [quizQuestion]);

  useEffect(() => {
    if (data) {
      const contentDiv = document.getElementById('basic-content');
      if (contentDiv) {
        if (isQuizMode) {
          contentDiv.innerHTML = `<div class="quiz-overlay">
            <div class="quiz-card" style="background:${cardBg}; padding:40px; border-radius:30px; border:2px solid ${primaryColor}; text-align:center; max-width:600px; margin:0 auto; box-shadow:0 10px 40px rgba(0,0,0,0.1);">
              <h3 style="color:${primaryColor}; margin-bottom:10px;">Language Challenge</h3>
              <p style="font-size:14px; color:${isDarkMode ? '#94a3b8' : '#64748b'};">Score: ${quizScore}</p>
              <div id="quiz-body" style="margin-top:30px;">
                <h2 style="margin-bottom:30px; font-size:24px;">${quizQuestion?.question || 'Preparing...'}</h2>
                <div class="options-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                  ${(quizQuestion?.options || []).map(opt => `<button class="opt-btn" onclick="window.handleQuizAnswer('${opt.replace(/'/g, "\\'")}')" style="padding:15px; border-radius:15px; border:1px solid ${borderColor}; background:${isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc'}; color:${textColor}; cursor:pointer; font-weight:600; font-size:16px;">${opt}</button>`).join('')}
                </div>
                <div id="quiz-feedback" style="margin-top:20px; font-weight:bold; color:${quizFeedback.startsWith('Correct') ? '#22c55e' : '#ef4444'}">${quizFeedback}</div>
              </div>
              <button onclick="window.exitQuiz()" style="margin-top:30px; background:transparent; border:none; color:${isDarkMode ? '#94a3b8' : '#64748b'}; text-decoration:underline; cursor:pointer;">Exit Quiz</button>
            </div>
          </div>`;
          return;
        }

        let html = '';

        if (currentLang === 'english' && data.sections) {
          // Intro
          html += `<div class="guide-intro-card" style="background:${cardBg}; padding:30px; border-radius:20px; border:1px solid ${borderColor}; margin-bottom:40px; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
            <p style="font-size:18px; line-height:1.6; color:${textColor}; margin:0;">${data.guide_intro || ''}</p>
          </div>`;

          // Iterate 20 Sections
          Object.keys(data.sections || {}).forEach(key => {
            const section = data.sections[key];
            if (!section) return;
            html += `<div class="section"><h2 class="section-title">${section.title}</h2>`;
            html += `<p class="section-desc" style="font-size:18px; line-height:1.6; color:${isDarkMode ? '#cbd5e1' : '#475569'}; margin-bottom:30px;">${section.desc || ''}</p>`;

            // Render data based on structure
            if (Array.isArray(section.data) && section.data.length > 0) {
              if (section.data[0].type) {
                html += `<div class="table-container"><table><thead><tr><th>Type</th><th>Description/Form</th><th>Example</th></tr></thead><tbody>`;
                section.data.forEach(item => {
                  html += `<tr><td><strong>${item.type}</strong></td><td>${item.desc || item.form || item.usage || ''}</td><td onclick="window.speakBasic('${(item.ex || '').replace(/'/g, "\\'")}')">${item.ex}</td></tr>`;
                });
                html += `</tbody></table></div>`;
              } else if (section.data[0].name) {
                html += `<div class="table-container"><table><thead><tr><th>Topic</th><th>Usage</th><th>Example</th></tr></thead><tbody>`;
                section.data.forEach(item => {
                  html += `<tr><td><strong>${item.name}</strong></td><td>${item.usage}</td><td onclick="window.speakBasic('${(item.ex || '').replace(/'/g, "\\'")}')">${item.ex}</td></tr>`;
                });
                html += `</tbody></table></div>`;
              } else {
                html += `<div class="items-grid">`;
                section.data.forEach(item => {
                  html += `<div class="item-card" onclick="window.speakBasic('${(item || '').replace(/'/g, "\\'")}')">${item}</div>`;
                });
                html += `</div>`;
              }
            } else if (typeof section.data === 'object' && section.data !== null) {
              Object.keys(section.data).forEach(subKey => {
                html += `<h4 class="mini-title">${subKey.toUpperCase()}</h4>`;
                const subData = section.data[subKey];
                if (subKey === 'forms' && Array.isArray(subData)) {
                  html += `<div class="table-container"><table><thead><tr><th>V1</th><th>V2</th><th>V3</th></tr></thead><tbody>`;
                  subData.forEach(row => {
                    html += `<tr><td onclick="window.speakBasic('${(row.v1 || '').replace(/'/g, "\\'")}')">${row.v1 || ''}</td><td onclick="window.speakBasic('${(row.v2 || '').replace(/'/g, "\\'")}')">${row.v2 || ''}</td><td onclick="window.speakBasic('${(row.v3 || '').replace(/'/g, "\\'")}')">${row.v3 || ''}</td></tr>`;
                  });
                  html += `</tbody></table></div>`;
                } else if (subKey === 'phonics' && Array.isArray(subData)) {
                  html += `<div class="items-grid">`;
                  subData.forEach(p => {
                    if (p.items && Array.isArray(p.items)) {
                      p.items.forEach(item => {
                        html += `<div class="item-card phonetics-card" onclick="window.speakBasic('${item.split(' /')[0].split(' (')[0].replace(/'/g, "\\'")}')"><strong>${p.cat || ''}</strong><br>${item}</div>`;
                      });
                    }
                  });
                  html += `</div>`;
                } else if (Array.isArray(subData)) {
                  html += `<div class="items-grid">`;
                  subData.forEach(item => {
                    html += `<div class="item-card" onclick="window.speakBasic('${(item || '').replace(/'/g, "\\'")}')">${item}</div>`;
                  });
                  html += `</div>`;
                }
              });
            }
            html += `</div>`;
          });

          // Vocabulary Expansion
          if (data.vocab_expansion) {
            html += `<div class="section"><h2 class="section-title">🌟 Vocabulary Expansion</h2>`;
            Object.keys(data.vocab_expansion || {}).forEach(groupKey => {
              const group = data.vocab_expansion[groupKey];
              Object.keys(group || {}).forEach(subKey => {
                html += `<h4 class="mini-title">${subKey.replace(/_/g, ' ').toUpperCase()}</h4><div class="items-grid">`;
                (group[subKey] || []).forEach(item => {
                  html += `<div class="item-card" onclick="window.speakBasic('${(item || '').replace(/'/g, "\\'")}')">${item}</div>`;
                });
                html += `</div>`;
              });
            });
            html += `</div>`;
          }

        } else if (data) {
          if (data.alphabet) {
            html += '<div class="section"><h2 class="section-title">📚 Alphabet</h2><div class="items-grid">';
            data.alphabet.forEach(letter => {
              html += `<div class="item-card" onclick="window.speakBasic('${letter.replace(/'/g, "\\'")}')">${letter}</div>`;
            });
            html += '</div></div>';
          }
          if (data.numbers) {
            html += '<div class="section"><h2 class="section-title">🔢 Numbers 1-10</h2><div class="items-grid">';
            data.numbers.forEach(num => {
              html += `<div class="item-card" onclick="window.speakBasic('${num.split(': ')[1]?.replace(/'/g, "\\'") || ''}')">${num}</div>`;
            });
            html += '</div></div>';
          }
          if (data.phrases) {
            html += '<div class="section"><h2 class="section-title">💬 Basic Phrases</h2><div class="items-grid">';
            data.phrases.forEach(phrase => {
              const [eng, native] = (phrase || '').split(': ');
              if (native) {
                html += `<div class="item-card phrase-card" onclick="window.speakBasic('${native.replace(/'/g, "\\'")}')"><div class="phrase-eng">${eng}</div><div class="phrase-native">${native}</div></div>`;
              }
            });
            html += '</div></div>';
          }
        }

        contentDiv.innerHTML = html;
      }
    }
  }, [languageParam, data, currentLang, isDarkMode, cardBg, borderColor, textColor, isQuizMode, quizQuestion, quizFeedback, quizScore]);

  useEffect(() => {
    window.speakBasic = (text) => {
      if (muted || !('speechSynthesis' in window)) return;
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    };
    window.handleQuizAnswer = (opt) => handleAnswer(opt);
    window.exitQuiz = () => setIsQuizMode(false);
    return () => {
      delete window.speakBasic;
      delete window.handleQuizAnswer;
      delete window.exitQuiz;
    };
  }, [muted, quizQuestion, handleAnswer]);

  const bgColor_unused = isDarkMode ? '#0f1419' : '#f8fafc';

  return (
    <div className="basic-learning-wrapper" style={{
      fontFamily: "'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif",
      backgroundColor: bgColor,
      color: textColor,
      width: '100%',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style>{`
        * { box-sizing: border-box; }
        .basic-learning-wrapper {
          min-height: calc(100vh - 200px);
        }
        .learning-container {
          width: 100%;
          padding: 40px 60px;
          max-width: 100%;
          flex-grow: 1;
        }
        .section {
          margin-bottom: 50px;
          padding: 40px;
          background: ${cardBg};
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          border: 1px solid ${borderColor};
          max-width: 1400px;
          width: 100%;
          margin-left: auto;
          margin-right: auto;
        }
        .section-title {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 40px 0;
          color: ${textColor};
          padding-bottom: 20px;
          border-bottom: 4px solid ${primaryColor};
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .subsection-title {
          font-size: 24px;
          font-weight: 700;
          margin: 40px 0 20px 0;
          color: ${primaryColor};
          padding-left: 15px;
          border-left: 5px solid ${primaryColor};
        }
        .mini-title {
          font-size: 16px;
          font-weight: 600;
          margin: 25px 0 12px 0;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 20px;
        }
        .item-card {
          background: ${isDarkMode ? 'rgba(255,255,255,0.03)' : '#fefefe'};
          border: 1px solid ${borderColor};
          border-radius: 16px;
          padding: 25px 15px;
          text-align: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          font-size: 22px;
          font-weight: 700;
          color: ${textColor};
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 90px;
        }
        .item-card:hover {
          transform: translateY(-8px);
          border-color: ${primaryColor};
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.2);
          background: ${isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#fff'};
        }
        .opt-btn:hover { background: ${primaryColor} !important; color: white !important; }
        
        .table-container { 
          overflow-x: auto; 
          border-radius: 16px; 
          border: 1px solid ${borderColor};
          margin: 20px 0;
        }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th, td { padding: 20px; border-bottom: 1px solid ${borderColor}; }
        th { background: ${isDarkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}; font-weight: 700; }

        .toolbar-inline {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid ${borderColor};
          position: sticky;
          top: 0;
          background: ${bgColor};
          z-index: 100;
          padding-top: 10px;
        }
        .toolbar-btn {
          width: 45px;
          height: 45px;
          border-radius: 12px;
          border: 1px solid ${borderColor};
          background: ${cardBg};
          color: ${textColor};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 22px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }
        .toolbar-btn:hover {
          transform: translateY(-2px);
          border-color: ${primaryColor};
          color: ${primaryColor};
          box-shadow: 0 6px 15px rgba(59, 130, 246, 0.15);
        }
        .quiz-btn { width: auto; padding: 0 20px; font-size: 16px; font-weight: 700; gap: 8px; }
        .back-btn { margin-right: auto; }

        @media (max-width: 768px) {
          .learning-container { padding: 20px; }
          .section { padding: 25px; }
          .toolbar-btn { width: 40px; height: 40px; font-size: 18px; }
          .quiz-btn { padding: 0 15px; font-size: 14px; }
        }
      `}</style>

      <div className="learning-container">
        <div className="toolbar-inline">
          <button className="toolbar-btn back-btn" onClick={() => navigate(-1)} title="Back">
            <i className='bx bx-left-arrow-alt'></i>
          </button>
          {!isQuizMode && (
            <button className="toolbar-btn quiz-btn" onClick={startQuiz} title="Start Practice Quiz">
              <i className='bx bx-brain'></i> Quiz
            </button>
          )}
          <button className="toolbar-btn mode-btn" onClick={() => setIsDarkMode(!isDarkMode)} title="Toggle Dark/Light Mode">
            <i className={`bx ${isDarkMode ? 'bx-sun' : 'bx-moon'}`}></i>
          </button>
          <button className="toolbar-btn mute-btn" onClick={() => setMuted(!muted)} title="Mute/Unmute">
            <i className={`bx ${muted ? 'bx-volume-mute' : 'bx-volume-full'}`}></i>
          </button>
        </div>

        <div id="basic-content"></div>
      </div>
    </div>
  );
};

export default BasicLearning;
