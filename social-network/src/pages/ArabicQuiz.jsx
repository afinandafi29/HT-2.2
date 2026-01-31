import React from 'react';
import QuizPage from '../components/QuizPage';

const ArabicQuiz = () => (
  <QuizPage
    language="ar"
    languageCode="ar"
    isRtl={true}
    pageTitle="الدردشة السعيدة 🇸🇦"
    subtitle="تعلم اللغة العربية بابتسامة (Learn Arabic with a smile)"
    rawData={`مبتدئ|How do you say 'Happy' in Arabic?|سعيد|حزين||غاضب||تعبان
مبتدئ|Universal greeting meaning 'Peace be upon you':|السلام عليكم|مع السلامة||شكراً||عفواً
مبتدئ|How do you say 'Thank you'?|شكراً|من فضلك||عفواً||أهلاً
مبتدئ|Word for 'Friend':|صديق|عدو||غريب||جار
مبتدئ|What does 'Jameel' mean?|Beautiful|قبيح||سريع||بارد
مبتدئ|How to say 'I love you'?|أنا أحبك|أنا أكرهك||أنا أراك||أنا أنتظر
مبتدئ|Which word means 'Smile'?|ابتسامة|بكاء||نوم||أكل
مبتدئ|How do you say 'Good'?|جيد|سيء||كبير||بعيد
مبتدئ|What is 'Light' in Arabic?|نور|ظلام||نار||ماء
مبتدئ|How to say 'Cheer up'?|لا تقلق|اذهب||توقف||اسكت
مبتدئ|Word for 'Sun':|شمس|قمر||نجم||سحاب
مبتدئ|How do you say 'Water'?|ماء|نار||تراب||هواء
مبتدئ|What is 'Akl'?|Food / To eat|شرب||نوم||لعب
مبتدئ|Word for 'Big':|كبير|صغير||عالٍ||منخفض
مبتدئ|How do you say 'House'?|بيت|مدرسة||مكتب||محل
مبتدئ|What is 'Hubb'?|Love|كراهية||أمل||سلام
مبتدئ|Translate 'Today':|اليوم|غداً||أمس||الليلة
مبتدئ|How to say '1'?|واحد|اثنان||ثلاثة||أربعة
مبتدئ|What is 'Madrasa'?|School|مستشفى||مكتبة||حديقة
مبتدئ|Word for 'Dog':|كلب|قطة||عصفور||سمكة
مبتدئ|How to say 'I'm sorry'?|أسف|مرحباً||شكراً||من فضلك
مبتدئ|What does 'Barid' mean?|Cold|حار||دافئ||جاف
مبتدئ|Word for 'Child':|طفل|بالغ||عم||خال
مبتدئ|How to say 'Yes' in Arabic?|نعم|لا||ربما||أبداً
مبتدئ|What is 'Layl'?|Night|نهار||صباح||مساء
مبتدئ|Word for 'Strong':|قوي|ضعيف||سريع||بطيء
مبتدئ|How to say 'No'?|لا|نعم||غالباً||دائماً
مبتدئ|What is 'Samaka'?|Fish|عصفور||قطة||كلب
مبتدئ|Word for 'White':|أبيض|أسود||رمادي||بني
مبتدئ|How to say 'Please'?|من فضلك|شكراً||نعم||لا
مبتدئ|What does 'Sadeeq' mean?|Friend|عدو||جار||غريب
مبتدئ|Word for 'Life':|حياة|موت||نوم||حلم
مبتدئ|How do you say 'Book'?|كتاب|قلم||ورقة||طاولة
مبتدئ|What is 'Qamar'?|Moon|شمس||نجم||سماء
مبتدئ|Word for 'Green':|أخضر|أحمر||أزرق||أصفر
مبتدئ|How to say 'Mother'?|أم|أب||أخ||أخت
متوسط|Translate: 'Everything will be fine.'|كل شيء سيكون بخير|كل شيء سيئ||لا أعرف||انتظر
متوسط|How to say 'I miss you'?|أنا أفتقدك|أنا نسيتك||أنا أراك||أنا لا أحبك
متوسط|Word for 'Kindness':|طيبة|قسوة||أنانية||غضب
متوسط|What is 'Patience'?|صبر|عجلة||خوف||حزن
متوسط|How to say 'Congratulations'?|مبروك|عذراً||شكراً||أهلاً
متوسط|What is 'Mufaja'a' in English?|Surprise|ملل||حزن||غضب
متوسط|Translate 'Experience':|خبرة|أمل||حلم||مهمة
متوسط|How do you say 'Opportunity'?|فرصة|عائق||مشكلة||خطأ
متوسط|What does 'Intabih' mean?|Be careful|كن سعيداً||كن سريعاً||كن صامتاً
متوسط|Translate 'Important':|مهم|سهل||سريع||رخيص
متوسط|How do you say 'Health'?|صحة|قوة||ثروة||جمال
متوسط|What is 'Thiqa bin-nafs'?|Self-confidence|خجل||خوف||كسل
متوسط|Translate 'Environment':|بيئة|غرفة||بيت||شارع
متوسط|How do you say 'Challenge'?|تحدي|هدية||مساعدة||دعم
متوسط|What is 'Amal shaq'?|Hard work|يوم كسول||مهمة سهلة||وقت فراغ
متوسط|Translate 'Progress':|تقدم|تراجع||موت||ولادة
متوسط|How to say 'I agree'?|أنا أوافق|لا أريد||أنا مرتبك||سأذهب
متوسط|What does 'Mukhtalif' mean?|Different|نفسه||متساوٍ||مشابه
متوسط|Translate 'Respect':|احترام|كراهية||خوف||غضب
متوسط|How to say 'Believe'?|يؤمن|يشك||يسأل||يصمت
متوسط|What is 'Mustaqbal'?|Future|ماضي||حاضر||اليوم
متوسط|Translate 'Create':|يخلق|يدمر||ينتظر||يبحث
متوسط|How do you say 'Freedom'?|حرية|تبعية||واجب||عبء
متوسط|What is 'Ta'awun'?|Collaboration|منافسة||صراع||تجنب
متوسط|Translate 'Change':|تغيير|نظام||صمت||نهاية
متوسط|How to say 'Happy' (formal)?|سعيد|شقي||خائب الأمل||غاضب
متوسط|What is 'Masha'ir'?|Feelings|أفكار||أفعال||رؤية
متوسط|Translate 'Grateful':|ممتν|شاكٍ||غاضب||حزين
متوسط|How to say 'Celebrate'?|يحتفل|يبكي||يغادر||ينسى
متوسط|What is 'Ilham'?|Inspiration|ملل||صمت||خوف
متوسط|Translate 'Honest':|صادق|كاذب||خائف||مشكك
متوسط|How to say 'Beautiful' (scenery)?|رائع|قبيح||عادي||متسخ
متوسط|What is 'Tawasul'?|Communication|صمت||جدال||قتال
متوسط|Translate 'Kindness' (alternate)?|لطف|شر||كراهية||غضب
متوسط|How to say 'Patience'?|صبر|غضب||قلق||خوف
خبير|What does 'Amal' mean?|Hope|يأس||خوف||يقين
خبير|Meaning of 'Nour'?|Light|ظلام||نار||ماء
خبير|Translate 'Freedom':|حرية|عبودية||سجن||خوف
خبير|What is 'Qalb'?|Heart / Soul|عقل||يد||قدم
خبير|How to say 'Stay strong'?|كن قوياً|كن ضعيفاً||استسلم||كن في سلام
خبير|What is 'Tanawu'?|Diversity|تشابه||تماثل||نفسه
خبير|Translate 'Nazaha':|Integrity / Honesty|إهمال||كذب||احتيال
خبير|Meaning of 'Rafahiyah'?|Prosperity / Welfare|فقر||بؤس||صعوبة
خبير|What is 'Istiqlal'?|Independence|تبعية||ضعف||خوف
خبير|Translate 'Tadamun':|Solidarity|انقسام||كراهية||حسد
خبير|What is 'Hikma'?|Wisdom|حماقة||جهل||طمع
خبير|Translate 'Ta'atuf':|Compassion|قسوة||كراهية||غضب
خبير|Meaning of 'Istidama'?|Sustainability|تدمير||تلوث||إسراف
خبير|What is 'Adala'?|Justice|ظلم||فوضى||فساد
خبير|Translate 'Insijam':|Harmony|صراع||ضجيج||غضب
خبير|Meaning of 'Siyada'?|Sovereignty|عبودية||استعمار||حكم
خبير|What is 'Anaqa'?|Elegance|خرق||قبح||وقاحة
خبير|Translate 'Maktaba':|Library|مكتبة||محل كتب||مدرسة||فصل
خبير|Meaning of 'Wala'?|Loyalty|خيانة||كراهية||غضب
خبير|What is 'Ibda'?|Creativity|تقليد||ملل||كسل
خبير|Translate 'Shuja'a':|Courage|خوف||جبن||خجل
خبير|Meaning of 'Ikhlas'?|Sincerity|نفاق||كذب||طمع
خبير|What is 'Majd'?|Glory / Honor|عار||هزيمة||خسارة
خبير|Translate 'Sihha Nafsiya':|Mental health|ألم جسدي||جسم مريض||روح ضعيفة
خبير|Meaning of 'Diyafa'?|Hospitality|وقاحة||برود||غضب
خبير|What is 'Chudo'?|Miracle|كارثة||حادث||عادي
خبير|Translate 'Tamkin':|Empowerment|تقييد||ضعف||خوف
خبير|Meaning of 'Muthabara'?|Perseverance / Endurance|نهاية||توقف||إسراف
خبير|What is 'Sakha'?|Generosity|بخل||أنانية||شر
خبير|Translate 'Ibtikar':|Innovation|ركود||تقليد||قديم`}
    speechLocale="ar-SA"
    primaryColor="#003366"
    secondaryColor="#C29B40"
    primaryHover="#001F3F"
    resultTitle="ممتاز! (Excellent!)"
    resultMessage="أنت رائع في اللغة العربية! You are amazing in Arabic!"
    retryLabel="حاول مرة أخرى (Try again)"
    levelLabels={{
      مبتدئ: 'Beginner',
      متوسط: 'Intermediate',
      خبير: 'Expert',
    }}
  />
);

export default ArabicQuiz;
