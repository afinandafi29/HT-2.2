import React from 'react';
import QuizPage from '../components/QuizPage';

const indonesianLevels = {
  'pemula': 'Beginner',
  'menengah': 'Intermediate',
  'ahli': 'Expert',
};

const IndonesianQuiz = () => (
  <QuizPage
    language="id"
    languageCode="id"
    pageTitle="HAPPYY TALK Indonesia 🇮🇩"
    subtitle="Belajar Bahasa Indonesia dengan gembira! (Learn with joy)"
    rawData={`pemula|How do you say 'Happy' in Indonesian?|Bahagia|Sedih||Marah||Lelah
pemula|Common greeting for 'Hello':|Halo|Dah||Terima kasih||Maaf
pemula|How do you say 'Thank you'?|Terima kasih|Sama-sama||Permisi||Apa kabar?
pemula|Word for 'Friend':|Teman|Musuh||Tetangga||Orang asing
pemula|How do you say 'Good morning'?|Selamat pagi|Selamat malam||Selamat siang||Selamat sore
pemula|What does 'Bagus' mean?|Good / Great|Bad||Small||Expensive
pemula|Which word means 'Smile'?|Senyum|Tangis||Tidur||Makan
pemula|How to say 'I love you'?|Aku cinta kamu|Aku lihat kamu||Aku dengar kamu||Aku tahu
pemula|What is 'Success'?|Sukses|Gagal||Takut||Selesai
pemula|Translate 'Beautiful' (for things/places):|Indah|Buruk||Kecil||Tua
pemula|How do you say 'Water' in Indonesian?|Air|Api||Tanah||Udara
pemula|What is 'Makan'?|To eat|To drink||To sleep||To run
pemula|Word for 'Big':|Besar|Kecil||Tinggi||Pendek
pemula|How do you say 'House'?|Rumah|Sekolah||Kantor||Pasar
pemula|What does 'Senang' mean?|Happy / Glad|Sad||Angry||Bored
pemula|Word for 'Sun':|Matahari|Bulan||Bintang||Awan
pemula|How to say 'Book'?|Buku|Pena||Kertas||Meja
pemula|Which word means 'Red'?|Merah|Biru||Hijau||Kuning
pemula|What is 'Keluarga'?|Family|Friends||Enemies||Neighbors
pemula|Translate 'Today':|Hari ini|Besok||Kemarin||Besok lusa
pemula|How do you say '1'?|Satu|Dua||Tiga||Empat
pemula|What is 'Sekolah'?|School|Hospital||Market||Library
pemula|Word for 'Dog':|Anjing|Kucing||Burung||Ikan
pemula|How to say 'I'm sorry'?|Maaf|Halo||Terima kasih||Silakan
pemula|What does 'Dingin' mean?|Cold|Hot||Warm||Dry
pemula|Word for 'Child':|Anak|Orang tua||Paman||Bibi
pemula|How to say 'Yes' in Indonesian?|Ya|Tidak||Mungkin||Bukan
pemula|What is 'Malam'?|Night|Morning||Afternoon||Evening
pemula|Word for 'Strong':|Kuat|Lemah||Cepat||Lambat
pemula|How to say 'No'?|Tidak|Ya||Tentu||Pasti
pemula|What is 'Ikan'?|Fish|Bird||Cat||Dog
pemula|Word for 'White':|Putih|Hitam||Abu-abu||Cokelat
pemula|How to say 'Please' (requesting)?|Tolong|Sama-sama||Ya||Tidak
pemula|What does 'Terang' mean?|Bright|Dark||Shadow||Night
pemula|Word for 'Life':|Hidup|Mati||Tidur||Mimpi
menengah|How do you say 'Good luck'?|Semoga beruntung|Selamat jalan||Selamat makan||Semoga cepat sembuh
menengah|What is 'Hope' in Indonesian?|Harapan|Kebahagiaan||Cinta||Damai
menengah|Translate: 'Everything is fine.'|Semua baik-baik saja|Semua hancur||Saya tidak tahu||Tunggu sebentar
menengah|What is 'Santai'?|Relaxed / Chill|Very angry||A big rush||Busy work
menengah|How to say 'I am proud of you'?|Aku bangga padamu|Aku marah padamu||Aku takut padamu||Aku tidak kenal kamu
menengah|What is 'Kejutan' in English?|Surprise|Boredom||Sorrow||Anger
menengah|Translate 'Experience':|Pengalaman|Harapan||Mimpi||Tugas
menengah|How do you say 'Opportunity'?|Kesempatan|Hambatan||Masalah||Kegagalan
menengah|What does 'Hati-hati' mean?|Be careful|Be happy||Be fast||Be loud
menengah|Translate 'Important':|Penting|Mudah||Cepat||Murah
menengah|How do you say 'Health'?|Kesehatan|Kekuatan||Kekayaan||Kecantikan
menengah|What is 'Percaya diri'?|Confident|Shy||Scared||Lazy
menengah|Translate 'Environment':|Lingkungan|Ruangan||Rumah||Jalanan
menengah|How do you say 'Challenge'?|Tantangan|Hadiah||Bantuan||Dukungan
menengah|What is 'Kerja keras'?|Hard work|Lazy day||Easy task||Free time
menengah|Translate 'Progress':|Kemajuan|Kemunduran||Kematian||Kelahiran
menengah|How to say 'I agree'?|Saya setuju|Saya tidak mau||Saya bingung||Saya pergi
menengah|What does 'Berbeda' mean?|Different|Same||Equal||Similar
menengah|Translate 'Respect':|Hormat|Benci||Takut||Marah
menengah|How to say 'Believe'?|Percaya|Ragu||Tanya||Diam
menengah|What is 'Masa depan'?|Future|Past||Present||Today
menengah|Translate 'Create':|Menciptakan|Menghancurkan||Menunggu||Mencari
menengah|How do you say 'Freedom'?|Kebebasan|Ikatan||Tugas||Beban
menengah|What is 'Kerjasama'?|Collaboration|Competition||Conflict||Avoidance
menengah|Translate 'Change':|Perubahan|Ketertiban||Diam||Selesai
menengah|How to say 'Happy' (formal)?|Bahagia|Sedih||Kecewa||Marah
menengah|What is 'Perasaan'?|Feeling|Thought||Action||Vision
menengah|Translate 'Grateful':|Bersyukur|Mengeluh||Marah||Sedih
menengah|How to say 'Celebrate'?|Merayakan|Menangis||Meninggalkan||Melupakan
menengah|What is 'Inspirasi'?|Inspiration|Boredom||Silence||Fear
menengah|Translate 'Honest':|Jujur|Bohong||Takut||Ragu
menengah|How to say 'Beautiful' (scenery)?|Indah|Buruk||Biasah||Kotor
menengah|What is 'Komunikasi'?|Communication|Silence||Argument||Fight
menengah|Translate 'Kindness':|Kebaikan|Kejahatan||Kebencian||Kemarahan
menengah|How to say 'Patience'?|Kesabaran|Kemarahan||Kegelisahan||Ketakutan
ahli|What is 'Gotong Royong'?|Mutual cooperation / Working together|Working alone||A type of spicy food||A dance
ahli|Translate 'Freedom':|Kebebasan|Penjara||Tugas||Uang
ahli|Meaning of 'Semangat'?|Spirit / Enthusiasm / Keep it up!|Sleepy||Lazy||Quiet
ahli|What is 'Damai'?|Peace|Perang||Ribut||Bising
ahli|Final one! How do you say 'Goodbye'?|Selamat tinggal|Apa kabar||Ya||Tidak
ahli|What is 'Bhinneka Tunggal Ika'?|Unity in Diversity|Unity in Language||One for all||All for one
ahli|Translate 'Integrity':|Integritas|Kelalaian||Kebohongan||Kecurangan
ahli|Meaning of 'Kesejahteraan'?|Prosperity / Welfare|Poverty||Misery||Difficulty
ahli|What is 'Kedaulatan'?|Sovereignty|Dependence||Weakness||Fear
ahli|Translate 'Solidarity':|Solidaritas|Perpecahan||Kebencian||Kecemburuan
ahli|What is 'Kebijaksanaan'?|Wisdom|Folly||Ignorance||Greed
ahli|Translate 'Compassion':|Welas asih|Kekejaman||Kebencian||Kemarahan
ahli|Meaning of 'Kelestarian'?|Sustainability|Destruction||Pollution||Waste
ahli|What is 'Keadilan'?|Justice|Injustice||Chaos||Corruption
ahli|Translate 'Harmony':|Keselarasan|Pertikaian||Kegaduhan||Kemarahan
ahli|Meaning of 'Kemerdekaan'?|Independence|Slavery||Colonialism||Rule
ahli|What is 'Keanggunan'?|Elegance|Clumsiness||Ugliness||Rude
ahli|Translate 'Perpustakaan':|Library|Bookstore||School||Classroom
ahli|Meaning of 'Kesetiaan'?|Loyalty|Betrayal||Hatred||Anger
ahli|What is 'Kreativitas'?|Creativity|Imitation||Boredom||Lazy
ahli|Translate 'Keberanian':|Courage|Fear||Cowardice||Shyness
ahli|Meaning of 'Ketulusan'?|Sincerity|Hypocrisy||Lies||Greed
ahli|What is 'Kemuliaan'?|Glory|Shame||Defeat||Loss
ahli|Translate 'Kesehatan Mental':|Mental Health|Physical Pain||Sick Body||Weak Spirit
ahli|Meaning of 'Keramahan'?|Hospitality|Rudeness||Coldness||Anger
ahli|What is 'Keajaiban'?|Miracle|Disaster||Accident||Common
ahli|Translate 'Pemberdayaan':|Empowerment|Restriction||Weakness||Fear
ahli|Meaning of 'Keberlanjutan'?|Sustainability|Ending||Stop||Waste
ahli|What is 'Kemurahan hati'?|Generosity|Greed||Selfishness||Mean
ahli|Translate 'Inovasi':|Innovation|Stagnation||Tradition||Old`}
    speechLocale="id-ID"
    primaryColor="#FF0000"
    primaryHover="#CC0000"
    resultTitle="Luar Biasa! (Amazing!)"
    resultMessage="Bahasa Indonesiamu luar biasa!"
    retryLabel="Main Lagi"
    levelLabels={indonesianLevels}
  />
);

export default IndonesianQuiz;
