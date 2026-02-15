import React from 'react';
import QuizPage from '../components/QuizPage';

const FrenchQuiz = () => (
  <QuizPage
    language="fr"
    languageCode="fr-FR"
    pageTitle="HAPPYY TALK French 🇫🇷"
    subtitle="Apprenez le français avec joie ! (Learn French with joy!)"
    rawData={`Débutant|Comment dit-on 'Happy' en français ?|Heureux|Triste||Fâché||Fatigué
Débutant|Un salut positif pour le matin :|Bonjour !|Au revoir||Bonne nuit||Tais-toi
Débutant|Le contraire de 'triste' :|Joyeux|Froid||Lourd||Petit
Débutant|Le chocolat est...|Délicieux|Méchant||Triste||Gris
Débutant|Qu'est-ce qu'on fait quand on est content ?|Sourire|Pleurer||Crier||Dormir
Débutant|Un ami est très ___.|Sympa|Moche||Sale||Vieux
Débutant|Le soleil est...|Brillant|Noir||Froid||Triste
Débutant|Merci ___ !|Beaucoup|Peu||Rien||Zéro
Débutant|J'aime les ___.|Fleurs|Douleurs||Guerres||Cris
Débutant|Aujourd'hui, c'est ___ !|Génial|Mauvais||Pire||Normal
Débutant|Un cadeau fait ___.|Plaisir|Peur||Mal||Bruit
Débutant|La vie est ___.|Belle|Grise||Cassée||Dure
Débutant|Tu es ___.|Fort|Nul||Petit||Gris
Débutant|Le gâteau est ___.|Bon|Mauvais||Triste||Vert
Débutant|Bonne ___ !|Chance|Malchance||Rien||Pluie
Débutant|Je t'___.|Aime|Mords||Regarde||Quitte
Débutant|C'est ___.|Parfait|Nul||Zéro||Mal
Débutant|Regarde cet ___ !|Oiseau|Trou||Mal||Noir
Débutant|Vive les ___ !|Vacances|Travaux||Devoirs||Pluies
Débutant|Tu es ___.|Gentil|Méchant||Fou||Gris
Débutant|Le ciel est ___.|Bleu|Cassé||Triste||Sale
Débutant|Miam ! C'est ___.|Sucré|Amer||Sale||Triste
Débutant|Une ___ journée !|Bonne|Mauvaise||Pire||Grise
Débutant|Bravo pour ton ___.|Succès|Échec||Rien||Mal
Intermédiaire|Je ___ très heureux aujourd'hui.|Suis|Ai||Fais||Vais
Intermédiaire|C'est le ___ jour de ma vie !|Plus beau|Pire||Moins beau||Petit
Intermédiaire|J'espère que tu ___ une bonne journée.|Passeras|Passes||Passais||Passe
Intermédiaire|Nous nous sommes bien ___.|Amusés|Aburris||Dormis||Partis
Intermédiaire|Quel ___ temps !|Merveilleux|Mauvais||Pluie||Sale
Intermédiaire|Tu ___ l'air joyeux !|As|Es||Fais||Vas
Intermédiaire|Je suis fier de ___.|Toi|Moi||Lui||Rien
Intermédiaire|Quelle ___ surprise !|Agréable|Mauvaise||Triste||Lourde
Intermédiaire|Tout ___ bien se passer.|Va|Est||Fait||A
Intermédiaire|C'est un plaisir de vous ___.|Voir|Quitter||Oublier||Gêner
Intermédiaire|Félicitations ___ votre promotion !|Pour|De||À||Par
Intermédiaire|Il fait un soleil ___.|Radiant|Noir||Triste||Caché
Intermédiaire|Je me sens ___ ici.|Bien|Mal||Loin||Seul
Intermédiaire|Tes paroles sont ___.|Encourageantes|Méchantes|Nulles||Tristes
Intermédiaire|On va ___ ensemble !|Célébrer|Pleurer||Dormir||Partir
Intermédiaire|C'est ___ gentil de ta part.|Tellement|Peu||Pas||Rien
Intermédiaire|Tu as fait du ___ travail.|Bon|Mauvais||Petit||Nul
Intermédiaire|___-toi bien !|Amuse|Dors||Tais||Va
Intermédiaire|Je suis ___ de ton aide.|Reconnaissant|Triste||Fatigué||Fâché
Intermédiaire|Le futur est ___.|Prometteur|Sombre||Fini||Gris
Intermédiaire|Quelle ___ ambiance !|Belle|Mauvaise||Triste||Lourde
Intermédiaire|J'aime ton ___ d'humour.|Sens|Froid||Rien||Jour
Intermédiaire|Un grand ___ à toi.|Merci|Non||Au revoir||Rien
Intermédiaire|On a ___ de la chance !|Beaucoup|Peu||Zéro||Pas
Intermédiaire|C'est ___ !|Magnifique|Moche||Sale||Triste
Avancé|Synonyme de 'très heureux' :|Épanoui|Morose||Apathique||Sévère
Avancé|Que signifie 'Euphorique' ?|Une joie intense|Une grande peur||Une fatigue||Une colère
Avancé|Une personne pleine d'énergie :|Pétillante|Léthargique||Sombre||Triste
Avancé|La 'félicité' est un état de ___.|Bonheur suprême|Doute total||Grande faim||Vide
Avancé|Un moment 'exquis' est ___.|Délicieux et raffiné|Affreux||Ennuyeux||Lourd
Avancé|L'___ est contagieux.|Enthousiasme|Ennui||Mépris||Doute
Avancé|Être 'comblé' signifie être ___.|Pleinement satisfait|Très vide||Perdu||Affamé
Avancé|La 'quiétude' est ___.|La tranquillité|Le bruit||La guerre||La peur
Avancé|Une réussite 'éclatante' :|Brillante et remarquable|Petite et nulle||Invisible||Triste
Avancé|Regarder avec 'admiration' :|Avec respect et plaisir|Avec dégoût||Avec peur||Sans rien
Avancé|Un accueil 'chaleureux' :|Très amical|Froid||Méchant||Rapide
Avancé|Vivre dans l'___.|Allégresse|Angoisse||Ombre||Pauvreté
Avancé|Un esprit 'optimiste' :|Positif|Négatif||Sombre||Fermé
Avancé|Être 'ravi' de quelque chose :|Très content|En colère||Fatigué||Triste
Avancé|Le 'ravissement' est ___.|Un enchantement|Un vol||Un cri||Une peur
Avancé|Une nouvelle 'réjouissante' :|Qui rend heureux|Triste||Ennuyeuse||Grise
Avancé|La 'sérénité' est importante.|Le calme|Le stress||La faim||La peur
Avancé|Une amitié 'indéfectible' :|Qui ne peut finir|Fragile|Méchante||Courte
Avancé|Se 'réjouir' de la réussite.|Être heureux pour|Être jaloux||Oublier||Partir
Avancé|Un geste 'magnanime' :|Généreux|Petit||Avare||Cruel
Avancé|Vivre en 'harmonie'.|En accord parfait|En guerre||Seul||Mal
Avancé|La 'gratitude' est une vertu.|La reconnaissance|L'orgueil||La faim||La peur
Avancé|Un avenir 'radieux' :|Très brillant|Noir||Incertain||Triste
Expert|Que signifie 'Être aux anges' ?|Être extrêmement heureux|Être mort||Être un oiseau||Avoir peur
Expert|'Avoir la pêche' signifie :|Avoir beaucoup d'énergie|Manger un fruit||Être fatigué||Aller à la pêche
Expert|'Voir la vie en rose' veut dire :|Être très optimiste|Porter des lunettes||Aimer les fleurs||Être triste
Expert|'Être sur son trente-et-un' :|Être très bien habillé|Avoir 31 ans||Être en retard||Être fatigué
Expert|Que signifie 'Avoir le cœur sur la main' ?|Être très généreux|Être malade||Être chirurgien||Avoir peur
Expert|'C'est du gâteau' veut dire :|C'est très facile|C'est l'heure du goûter||C'est sucré||C'est cher
Expert|'Se mettre sur son trente-et-un' pour une fête :|S'habiller élégamment|Arriver à 31h||Apporter 31 cadeaux||Partir tôt
Expert|'Être aux oiseaux' (Expression Québec) :|Être très joyeux|Vouloir voler||Avoir faim||Être perdu
Expert|'Une mine de rubis' signifie :|Un visage éclatant de santé|Une mine de pierres||Être riche||Être malade
Expert|'Sauter de joie' :|Être surexcité|Faire du sport||Tomber||Avoir peur
Expert|'Un rayon de soleil' :|Une personne qui apporte de la joie|Une lampe||Un coup de soleil||L'été
Expert|'Pleurer de joie' :|Être si heureux qu'on pleure|Être triste||Être blessé||Avoir mal
Expert|'Être dans son assiette' :|Se sentir bien|Manger beaucoup||Être un plat||Être perdu
Expert|'Avoir un moral d'acier' :|Avoir un moral très fort|Être un robot||Être dur||Être triste
Expert|'Nager dans le bonheur' :|Être totalement heureux|Aller à la piscine||Se noyer||Avoir de l'eau
Expert|'Mordre la vie à pleines dents' :|Profiter de la vie intensément|Aller chez le dentiste||Manger beaucoup||Être agressif
Expert|'Faire la fête' :|S'amuser beaucoup|Dormir||Travailler||Cuisiner
Expert|'Être sur un petit nuage' :|Être dans un rêve de bonheur|Avoir de la pluie||Être un pilote||Avoir froid
Expert|'C'est le pied !' signifie :|C'est super !|J'ai mal au pied||Je marche||C'est bas
Expert|'Un cœur d'or' :|Une grande bonté|Un cœur riche||Un bijou||Une maladie
Expert|'Il y a de la joie' :|L'ambiance est joyeuse|Il y a du bruit||Il y a du monde||Il pleut
Expert|'Boire du petit lait' :|Éprouver une grande satisfaction|Avoir faim||Aimer le lait||Être un bébé
Expert|'Être comme un poisson dans l'eau' :|Se sentir parfaitement à l'aise|Être mouillé|Aimer la mer||Avoir froid
Expert|'Prendre la vie du bon côté' :|Être optimiste|Tourner le dos||Dormir à droite||Être fâché
Expert|'Avoir un succès fou' :|Réussir énormément|Devenir fou||Avoir peur||Rien faire`}
    speechLocale="fr-FR"
    primaryColor="#3b82f6"
    primaryHover="#2563eb"
    resultTitle="Bravo !"
    resultMessage="Magnifique ! Vous parlez français comme un ange."
    retryLabel="Recommencer"
    levelLabels={{
      Débutant: 'Beginner',
      Intermédiaire: 'Intermediate',
      Avancé: 'Advanced',
      Expert: 'Expert'
    }}
  />
);

export default FrenchQuiz;
