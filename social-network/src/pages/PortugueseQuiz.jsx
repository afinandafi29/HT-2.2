import React from 'react';
import QuizPage from '../components/QuizPage';

const PortugueseQuiz = () => (
  <QuizPage
    language="pt"
    languageCode="pt-BR"
    pageTitle="HAPPYY TALK Portuguese ☀️"
    subtitle="Aprenda português com alegria! (Learn with joy!)"
    rawData={`iniciante|How do you say 'Happy' in Portuguese?|Feliz|Triste||Zangado||Cansado
iniciante|The most common way to say 'Hello':|Olá|Tchau||Obrigado||Por favor
iniciante|How do you say 'Thank you'?|Obrigado|De nada||Por favor||Com licença
iniciante|What is 'Friend' in Portuguese?|Amigo|Inimigo||Vizinho||Irmão
iniciante|How do you say 'Good morning'?|Bom dia|Boa noite||Boa tarde||Tchau
iniciante|What does 'Tudo bem?' mean?|Is everything good?|Where are you?||What is that?||How much?
iniciante|Which word means 'Smile'?|Sorriso|Choro||Sono||Comida
iniciante|How to say 'I love you'?|Eu te amo|Eu te vejo||Eu te ouço||Eu espero
iniciante|What is 'Success'?|Sucesso|Fracasso||Medo||Fim
iniciante|How to say 'Welcome'?|Bem-vindo|Tchau||Perdão||Sim
iniciante|Word for 'Sun':|Sol|Lua||Estrela||Nuvem
iniciante|How do you say 'Water'?|Água|Fogo||Terra||Ar
iniciante|What is 'Comida'?|Food / To eat|Bebida||Sono||Brincadeira
iniciante|Word for 'Big':|Grande|Pequeno||Alto||Baixo
iniciante|How do you say 'House'?|Casa|Escola||Escritório||Loja
iniciante|What is 'Amor'?|Love|Ódio||Esperança||Paz
iniciante|Translate 'Today':|Hoje|Amanhã||Ontem||Esta noite
iniciante|How to say '1'?|Um|Dois||Três||Quatro
iniciante|What is 'Escola'?|School|Hospital||Biblioteca||Parque
iniciante|Word for 'Dog':|Cachorro|Gato||Pássaro||Peixe
iniciante|How to say 'I'm sorry'?|Desculpe|Olá||Obrigado||Por favor
iniciante|What does 'Frio' mean?|Cold|Quente||Morno||Seco
iniciante|Word for 'Child':|Criança|Adulto||Tio||Tia
iniciante|How to say 'Yes' in Portuguese?|Sim|Não||Talvez||Nunca
iniciante|What is 'Noite'?|Night|Dia||Manhã||Tarde
iniciante|Word for 'Strong':|Forte|Fraco||Rápido||Lento
iniciante|How to say 'No'?|Não|Sim||Sempre||Muitas vezes
iniciante|What is 'Peixe'?|Fish|Pássaro||Gato||Cachorro
iniciante|Word for 'White':|Branco|Preto||Cinza||Marrom
iniciante|How to say 'Please'?|Por favor|Obrigado||Sim||Não
iniciante|What does 'Luz' mean?|Light|Escuro||Sombra||Noite
iniciante|Word for 'Life':|Vida|Morte||Sono||Sonho
iniciante|How do you say 'Book'?|Livro|Caneta||Papel||Mesa
iniciante|What is 'Lua'?|Moon|Sol||Estrela||Céu
iniciante|Word for 'Green':|Verde|Vermelho||Azul||Amarelo
iniciante|How to say 'Mother'?|Mãe|Pai||Irmão||Irmã
intermediário|How do you say 'Good luck'?|Boa sorte|Boa viagem||Bom trabalho||Boa noite
intermediário|Translate: 'I am feeling great!'|Estou me sentindo ótimo!|Estou com fome||Estou com sono||Estou cansado
intermediário|What is 'Success'?|Sucesso|Fracasso||Dúvida||Medo
intermediário|How to say 'I'm proud of you'?|Estou orgulhoso de você|Estou bravo com você||Estou longe||Eu te vejo
intermediário|What is 'Kindness'?|Gentileza|Grosseria||Preguiça||Raiva
intermediário|What is 'Surpresa' in English?|Surprise|Tédio||Tristeza||Raiva
intermediário|Translate 'Experience':|Experiência|Esperança||Sonho||Tarefa
intermediário|How do you say 'Opportunity'?|Oportunidade|Obstáculo||Problema||Erro
intermediário|What does 'Tenha cuidado' mean?|Be careful|Fique feliz||Seja rápido||Fique quieto
intermediário|Translate 'Important':|Importante|Fácil||Rápido||Barato
intermediário|How do you say 'Health'?|Saúde|Força||Riqueza||Beleza
intermediário|What is 'Autoconfiança'?|Self-confidence|Tímido||Medroso||Preguiçoso
intermediário|Translate 'Environment':|Meio ambiente|Quarto||Casa||Rua
intermediário|How do you say 'Challenge'?|Desafio|Presente||Ajuda||Apoio
intermediário|What is 'Trabalho duro'?|Hard work|Dia preguiçoso||Tarefa fácil||Tempo livre
intermediário|Translate 'Progress':|Progresso|Retrocesso||Morte||Nascimento
intermediário|How to say 'I agree'?|Eu concordo|Eu não quero||Estou confuso||Eu vou
intermediário|What does 'Diferente' mean?|Different|Igual||Mesmo||Semelhante
intermediário|Translate 'Respect':|Respeito|Ódio||Medo||Raiva
intermediário|How to say 'Believe'?|Acreditar|Duvidar||Perguntar||Calar
intermediário|What is 'Futuro'?|Future|Passado||Presente||Hoje
intermediário|Translate 'Create':|Criar|Destruir||Esperar||Procurar
intermediário|How do you say 'Freedom'?|Liberdade|Dependência||Dever||Fardo
intermediário|What is 'Colaboração'?|Collaboration|Competição||Conflito||Evitação
intermediário|Translate 'Change':|Mudança|Ordem||Silêncio||Fim
intermediário|How to say 'Happy' (formal)?|Feliz|Infeliz||Decepcionado||Zangado
intermediário|What is 'Sentimentos'?|Feelings|Pensamentos||Ações||Visão
intermediário|Translate 'Grateful':|Grato|Reclamão||Zangado||Triste
intermediário|How to say 'Celebrate'?|Celebrar|Chorar||Sair||Esquecer
intermediário|What is 'Inspiração'?|Inspiration|Tédio||Silêncio||Medo
intermediário|Translate 'Honest':|Honesto|Desonesto||Medroso||Duvidoso
intermediário|How to say 'Beautiful' (scenery)?|Lindo|Feio||Bom||Sujo
intermediário|What is 'Comunicação'?|Communication|Silêncio||Discussão||Luta
intermediário|Translate 'Kindness':|Bondade|Maldade||Ódio||Raiva
intermediário|How to say 'Patience'?|Paciência|Raiva||Ansiedade||Medo
mestre|What is 'Saudade'?|A nostalgic longing|Comida||Dança||Barulho
mestre|Translate: 'Hope'|Esperança|Esperteza||Espelho||Espanto
mestre|Expression for 'Cool/Awesome' in Brazil:|Legal|Chato||Ruim||Mais ou menos
mestre|Meaning of 'Coração de ouro'?|A heart of gold|Rico||Coração doente||Colar de ouro
mestre|Final one! How to say 'Stay happy'?|Fique feliz|Fique triste||Vá embora||Trabalhe muito
mestre|What is 'Diversidade'?|Diversity|Unidade||Igualdade||Mesmo
mestre|Translate 'Integridade':|Integridade|Negligência||Mentira||Fraude
mestre|Meaning of 'Bem-estar'?|Well-being / Welfare|Pobreza||Miséria||Dificuldade
mestre|What is 'Independência'?|Independence|Dependência||Fraqueza||Medo
mestre|Translate 'Solidariedade':|Solidarity|Divisão||Ódio||Inveja
mestre|What is 'Sabedoria'?|Wisdom|Tolice||Ignorância||Ganância
mestre|Translate 'Compaixão':|Compassion|Crueldade||Ódio||Raiva
mestre|Meaning of 'Sustentabilidade'?|Sustainability|Destruição||Poluição||Desperdício
mestre|What is 'Justiça'?|Justice|Injustiça||Caos||Corrupção
mestre|Translate 'Harmonia':|Harmony|Conflito||Barulho||Raiva
mestre|Meaning of 'Soberania'?|Sovereignty|Escravidão||Colonialismo||Governo
mestre|What is 'Elegância'?|Elegance|Desajeitado||Feiura||Rudeza
mestre|Translate 'Biblioteca':|Biblioteca|Livraria||Escola||Sala de aula
mestre|Meaning of 'Lealdade'?|Loyalty|Traição||Ódio||Raiva
mestre|What is 'Criatividade'?|Creativity|Imitação||Tédio||Preguiça
mestre|Translate 'Coragem':|Coragem|Medo||Covardia||Timidez
mestre|Meaning of 'Sinceridade'?|Sincerity|Hipocrisia||Mentira||Ganância
mestre|What is 'Glória'?|Glory / Honor|Vergonha||Derrota||Perda
mestre|Translate 'Saúde mental':|Saúde mental|Dor física||Corpo doente||Espírito fraco
mestre|Meaning of 'Hospitalidade'?|Hospitality|Rudeza||Frieza||Raiva
mestre|What is 'Milagre'?|Milagre|Catástrofe||Acidente||Comum
mestre|Translate 'Empoderamento':|Empoderamento|Restrição||Fraqueza||Medo
mestre|Meaning of 'Perseverança'?|Perseverance / Endurance|Fim||Parada||Desperdício
mestre|What is 'Generosidade'?|Generosidade|Ganância||Egoísmo||Maldade
mestre|Translate 'Inovação':|Inovação|Estagnação||Tradição||Velho`}
    speechLocale="pt-BR"
    primaryColor="#002776"
    primaryHover="#001A52"
    resultTitle="Maravilhoso!"
    resultMessage="Você é incrível no Português!"
    retryLabel="Recomeçar"
    levelLabels={{
      iniciante: 'Beginner',
      intermediário: 'Intermediate',
      mestre: 'Master',
    }}
  />
);

export default PortugueseQuiz;
