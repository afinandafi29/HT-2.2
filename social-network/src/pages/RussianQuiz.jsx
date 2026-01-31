import React from 'react';
import QuizPage from '../components/QuizPage';

const russianLevels = {
  'новичок': 'Beginner',
  'любитель': 'Intermediate',
  'эксперт': 'Expert',
};

const RussianQuiz = () => (
  <QuizPage
    language="ru"
    languageCode="ru"
    pageTitle="HAPPYY TALK Russian ❄️"
    subtitle="Учись с радостью! (Learn with joy!)"
    rawData={`новичок|How do you say 'Happy' in Russian?|Счастливый|Грустный||Злой||Усталый
новичок|Common greeting for 'Hello' (Formal):|Здравствуйте|Пока||Спасибо||Пожалуйста
новичок|How do you say 'Thank you'?|Спасибо|Извините||Привет||Где
новичок|Word for 'Friend':|Друг|Враг||Сосед||Брат
новичок|How to say 'I love you'?|Я тебя люблю|Я тебя знаю||Я тебя вижу||Я тебя жду
новичок|What does 'Khorosho' mean?|Good / Well|Плохо||Может быть||Никогда
новичок|Which word means 'Smile'?|Улыбка|Слёзы||Сон||Еда
новичок|How do you say 'Good morning'?|Доброе утро|Добрый вечер||Спокойной ночи||Добрый день
новичок|Translate 'Beautiful' (Female):|Красивая|Некрасивая||Старая||Плохая
новичок|What is 'Success'?|Успех|Ошибка||Скука||Провал
новичок|How do you say 'Water'?|Вода|Огонь||Земля||Воздух
новичок|What is 'Yest'?|To eat|Пить||Спать||Играть
новичок|Word for 'Big':|Большой|Маленький||Высокий||Низкий
новичок|How do you say 'House'?|Дом|Школа||Офис||Магазин
новичок|What is 'Lyubov'?|Love|Ненависть||Надежда||Мир
новичок|Translate 'Today':|Сегодня|Завтра||Вчера||Вечером
новичок|How to say '1'?|Один|Два||Три||Четыре
новичок|What is 'Shkola'?|School|Больница||Библиотека||Парк
новичок|Word for 'Dog':|Собака|Кошка||Птица||Рыба
новичок|How to say 'I'm sorry'?|Извините|Привет||Спасибо||Пожалуйста
новичок|What does 'Holodno' mean?|Cold|Жарко||Тепло||Сухо
новичок|Word for 'Child':|Ребёнок|Взрослый||Дядя||Тётя
новичок|How to say 'Yes' in Russian?|Да|Нет||Может быть||Никогда
новичок|What is 'Noch'?|Night|День||Утро||Вечер
новичок|Word for 'Strong':|Сильный|Слабый||Быстрый||Медленный
новичок|How to say 'No'?|Нет|Да||Часто||Всегда
новичок|What is 'Ryba'?|Fish|Птица||Кошка||Собака
новичок|Word for 'White':|Белый|Чёрный||Серый||Коричневый
новичок|How to say 'Please'?|Пожалуйста|Спасибо||Да||Нет
новичок|What does 'Svet' mean?|Light|Темнота||Тень||Ночь
новичок|Word for 'Life':|Жизнь|Смерть||Сон||Мечта
новичок|How do you say 'Book'?|Книга|Ручка||Бумага||Стол
новичок|What is 'Luna'?|Moon|Солнце||Звезда||Небо
новичок|Word for 'Green':|Зелёный|Красный||Синий||Жёлтый
новичок|How to say 'Mother'?|Мать|Отец||Брат||Сестра
любитель|Translate: 'Everything will be fine.'|Всё будет хорошо|Всё плохо||Ничего не будет||Я не знаю
любитель|How to say 'I'm proud of you'?|Я горжусь тобой|Я злюсь на тебя||Я боюсь тебя||Я вижу тебя
любитель|Word for 'Kindness':|Доброта|Злость||Скупость||Страх
любитель|What is 'Good luck'?|Удачи!|Хватит!||Вперёд!||Пожалуйста
любитель|How to say 'Pleasure to meet you'?|Приятно познакомиться|Как дела?||Где выход?||Кто это?
любитель|What is 'Surpriz' in English?|Surprise|Скука||Грусть||Злость
любитель|Translate 'Experience':|Опыт|Надежда||Мечта||Задание
любитель|How do you say 'Opportunity'?|Возможность|Препятствие||Проблема||Ошибка
любитель|What does 'Bud ostorozhen' mean?|Be careful|Будь счастлив||Будь быстр||Молчи
любитель|Translate 'Important':|Важно|Легко||Быстро||Дёшево
любитель|How do you say 'Health'?|Здоровье|Сила||Богатство||Красота
любитель|What is 'Uverennost'?|Confidence|Скромность||Страх||Лень
любитель|Translate 'Environment':|Окружающая среда|Комната||Дом||Улица
любитель|How do you say 'Challenge'?|Вызов|Подарок||Помощь||Поддержка
любитель|What is 'Upornaya rabota'?|Hard work|Ленивый день||Легкая задача||Свободное время
любитель|Translate 'Progress':|Прогресс|Регресс||Смерть||Рождение
любитель|How to say 'I agree'?|Я согласен|Я не хочу||Я в замешательстве||Я иду
любитель|What does 'Raznyy' mean?|Different|Такой же||Равный||Похожий
любитель|Translate 'Respect':|Уважение|Ненависть||Страх||Злость
любитель|How to say 'Believe'?|Верить|Сомневаться||Спрашивать||Молчать
любитель|What is 'Budushcheye'?|Future|Прошлое||Настоящее||Сегодня
любитель|Translate 'Create':|Создавать|Разрушать||Ждать||Искать
любитель|How do you say 'Freedom'?|Свобода|Зависимость||Долг||Бремя
любитель|What is 'Sotrudnichestvo'?|Collaboration|Конкуренция||Конфликт||Избегание
любитель|Translate 'Change':|Перемена|Порядок||Тишина||Конец
любитель|How to say 'Happy' (formal)?|Счастливый|Несчастный||Разочарованный||Злой
любитель|What is 'Chuvstva'?|Feelings|Мысли||Действия||Видение
любитель|Translate 'Grateful':|Благодарный|Жалующийся||Злой||Грустный
любитель|How to say 'Celebrate'?|Праздновать|Плакать||Уходить||Забывать
любитель|What is 'Inspiratsiya'?|Inspiration|Скука||Тишина||Страх
любитель|Translate 'Honest':|Честный|Лживый||Трусливый||Сомневающийся
любитель|How to say 'Beautiful' (scenery)?|Прекрасный|Ужасный||Обычный||Грязный
любитель|What is 'Kommunikatsiya'?|Communication|Тишина||Спор||Борьба
любитель|Translate 'Kindness' (alternate)?|Доброжелательность|Злоба||Ненависть||Ярость
любитель|How to say 'Patience'?|Терпение|Злость||Тревога||Страх
эксперт|What is 'Dusha'?|Soul|Разум||Тело||Тень
эксперт|Meaning of 'Mir'?|World or Peace|Солнце или Луна||Жизнь или Смерть||Война или Ссора
эксперт|Translate 'Hope':|Надежда|Вера||Любовь||Победа
эксперт|Meaning of 'Vostorg'?|Delight / Rapture|Гнев||Скука||Грусть
эксперт|What is 'Zdorovye'?|Health|Богатство||Красота||Сила
эксперт|What is 'Raznoobraziye'?|Diversity|Единообразие||Сходство||То же самое
эксперт|Translate 'Tselostnost'?|Integrity / Integrity|Халатность||Ложь||Мошенничество
эксперт|Meaning of 'Blagosostoyaniye'?|Prosperity / Welfare|Бедность||Нищета||Трудность
эксперт|What is 'Nezavisimost'?|Independence|Зависимость||Слабость||Страх
эксперт|Translate 'Solidarnost'?|Solidarity|Раскол||Ненависть||Зависть
эксперт|What is 'Mudrost'?|Wisdom|Глупость||Невежество||Жадность
эксперт|Translate 'Sostradaniye'?|Compassion|Жестокость||Ненависть||Злость
эксперт|Meaning of 'Uстойчивость'?|Sustainability|Разрушение||Загрязнение||Расточительство
эксперт|What is 'Spravedlivost'?|Justice|Несправедливость||Хаос||Коррупция
эксперт|Translate 'Garmoniya'?|Harmony|Конфликт||Шум||Злость
эксперт|Meaning of 'Suverenitet'?|Sovereignty|Рабство||Колониализм||Правление
эксперт|What is 'Elegantnost'?|Elegance|Неуклюжесть||Уродство||Грубость
эксперт|Translate 'Biblioteka':|Library|Книжный магазин||Школа||Класс
эксперт|Meaning of 'Loyalnost'?|Loyalty|Предательство||Ненависть||Злость
эксперт|What is 'Tvorchestvo'?|Creativity|Подражание||Скука||Лень
эксперт|Translate 'Muzhestvo'?|Courage|Страх||Трусость||Застенчивость
эксперт|Meaning of 'Iskrennost'?|Sincerity|Лицемерие||Ложь||Жадность
эксперт|What is 'Slava'?|Glory / Honor|Позор||Поражение||Потеря
эксперт|Translate 'Psikhicheskoye zdorovye':|Mental health|Физическая боль||Больное тело||Слабый дух
эксперт|Meaning of 'Gostepriimstvo'?|Hospitality|Грубость||Холодность||Злость
эксперт|What is 'Chudo'?|Miracle|Катастрофа||Авария||Обычное
эксперт|Translate 'Rasshireniye vozmozhnostey':|Empowerment|Ограничение||Слабость||Страх
эксперт|Meaning of 'Upornost'?|Perseverance / Endurance|Конец||Остановка||Расточительство
эксперт|What is 'Shchedrost'?|Generosity|Жадность||Эгоизм||Злоба
эксперт|Translate 'Innovatsiya':|Innovation|Застой||Традиция||Старое`}
    speechLocale="ru-RU"
    primaryColor="#C41E3A"
    primaryHover="#A01830"
    resultTitle="Превосходно! (Excellent!)"
    resultMessage="Ты отлично справился с русским языком!"
    retryLabel="Начать заново"
    levelLabels={russianLevels}
  />
);

export default RussianQuiz;
