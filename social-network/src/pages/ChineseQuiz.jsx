import React from 'react';
import QuizPage from '../components/QuizPage';

const ChineseQuiz = () => (
  <QuizPage
    language="zh"
    languageCode="zh-CN"
    pageTitle="HAPPYY TALK Chinese 🇨🇳"
    subtitle="快乐学中文！(Learn Chinese happily!)"
    rawData={`入门|How do you say 'Happy' in Chinese?|开心 (Kāixīn)|伤心 (Shāngxīn)||生气 (Shēngqì)||累 (Lèi)
入门|The standard friendly greeting:|你好 (Nǐ hǎo)|再见 (Zàijiàn)||谢谢 (Xièxiè)||不客气 (Bù kèqì)
入门|How do you say 'Thank you'?|谢谢 (Xièxiè)|对不起 (Duìbùqǐ)||没关系 (Méiguānxi)||好吧 (Hǎo ba)
入门|Which word means 'Delicious'?|好吃 (Hǎochī)|好看 (Hǎokàn)||好听 (Hǎotīng)||好玩 (Hǎowán)
入门|What is 'Friend' in Mandarin?|朋友 (Péngyǒu)|老师 (Lǎoshī)||医生 (Yīshēng)||同学 (Tóngxué)
入门|How to say 'I love you'?|我爱你 (Wǒ ài nǐ)|我恨你 (Wǒ hèn nǐ)||我想你 (Wǒ xiǎng nǐ)||我找你 (Wǒ zhǎo nǐ)
入门|Which word means 'Smile'?|微笑 (Wēixiào)|哭泣 (Kūqì)||跑步 (Pǎobù)||跳舞 (Tiàowǔ)
入门|Translate 'Beautiful' (scenery/person):|漂亮 (Piàoliang)|难看 (Nánkàn)||很大 (Hěn dà)||很远 (Hěn yuǎn)
入门|What is 'Good luck'?|好运 (Hǎoyùn)|坏事 (Huàishì)||走路 (Zǒulù)||买东西 (Mǎi dōngxi)
入门|How to say 'Cheer up/Go for it!'?|加油！ (Jiāyóu!)|慢点 (Màndiǎn)||别动 (Bié dòng)||休息 (Xiūxi)
入门|The number associated with 'Prosperity/Wealth':|八 (Bā - 8)|四 (Sì - 4)||一 (Yī - 1)||七 (Qī - 7)
入门|What is 'Great/Awesome'?|太棒了 (Tài bàng le)|太差了 (Tài chà le)||太贵了 (Tài guì le)||太远了 (Tài yuǎn le)
入门|How to say 'I'm very happy'?|我很愉快 (Wǒ hěn yúkuài)|我很害怕 (Wǒ hěn hàipà)||我很饿 (Wǒ hěn è)||我很渴 (Wǒ hěn kě)
入门|What is a 'Gift'?|礼物 (Lǐwù)|包 (Bāo)||书 (Shū)||车 (Chē)
入门|Which color represents 'Happiness' in China?|红色 (Hóngsè)|白色 (Báisè)||黑色 (Hēisè)||灰色 (Huīsè)
入门|How to say 'It's okay/No problem'?|没关系 (Méiguānxi)|没意思 (Méiyìsi)||没时间 (Méishíjiān)||没钱 (Méiqián)
入门|What is 'Dream'?|梦想 (Mèngxiǎng)|睡眠 (Shuìmián)||吃饭 (Chīfàn)||工作 (Gōngzuò)
入门|Translate 'Fun/Playful':|好玩 (Hǎowán)|好看 (Hǎokàn)||好笑 (Hǎoxiào)||好读 (Hǎodú)
入门|What is 'Peace'?|和平 (Hépíng)|战争 (Zhànzhēng)||吵架 (Chǎojià)||比赛 (Bǐsài)
入门|How to say 'Today is great'?|今天很好 (Jīntiān hěn hǎo)|今天很冷 (Jīntiān hěn lěng)||今天很累 (Jīntiān hěn lèi)||今天很忙 (Jīntiān hěn máng)
入门|What is 'Sunshine'?|阳光 (Yángguāng)|月光 (Yuèguāng)||下雨 (Xiàyǔ)||刮风 (Guāfēng)
入门|How to say 'Kind'?|善良 (Shànliáng)|自私 (Zìsī)||懒惰 (Lǎnduò)||笨 (Bèn)
入门|What is 'Music'?|音乐 (Yīnyuè)|电影 (Diànyǐng)||报纸 (Bàozhǐ)||电脑 (Diànnǎo)
入门|How to say 'Congratulations'?|恭喜 (Gōngxǐ)|安慰 (Ānwèi)||对不起 (Duìbùqǐ)||再见 (Zàijiàn)
入门|What is 'Spring' (season of joy)?|春天 (Chūntiān)|夏天 (Xiàtiān)||秋天 (Qiūtiān)||冬天 (Dōngtiān)
进阶|Which measure word is used for 'A happy event'?|一件喜事 (yī jiàn)|一个喜事||一本喜事||一条喜事
进阶|How to say 'I'm looking forward to it'?|我很期待 (Wǒ hěn qīdài)|我很后悔||我很无聊||我很担心
进阶|What does '祝你好运' mean?|Wish you good luck|Wish you a birthday||Wish you a trip||Wish you a dinner
进阶|How to say 'I'm proud of you'?|我为你感到骄傲 (Jiāo'ào)|我为你感到伤心||我为你感到尴尬||我为你感到害羞
进阶|What is 'Success'?|成功 (Chénggōng)|失败 (Shībài)||尝试 (Chángshì)||开始 (Kāishǐ)
进阶|How to say 'Healthy and Strong'?|健康强大 (Jiànkāng qiángdà)|生病虚弱||懒惰累||又小又慢
进阶|What is 'Hope'?|希望 (Xīwàng)|失望 (Shīwàng)||绝望 (Juéwàng)||难过 (Nánguò)
进阶|Translate: 'Heart-warming'|暖心 (Nuǎnxīn)|伤心||冷心||恶心
进阶|What is 'Confidence'?|自信 (Zìxìn)|自卑 (Zìbēi)||自大 (Zìdà)||自觉 (Zìjué)
进阶|How to say 'Lively/Bustling' (Happy atmosphere)?|热闹 (Rènao)|安静 (Ānjìng)||冷清 (Lěngqīng)||孤独 (Gūdú)
进阶|What does '赞' (Zàn) mean on social media?|Like / Thumbs up|Dislike||Delete||Share
进阶|How to say 'Comfortable'?|舒服 (Shūfu)|难受 (Nánshòu)||痛苦 (Tòngkǔ)||麻烦 (Máfan)
进阶|What is 'Satisfied'?|满意 (Mǎnyì)|生气||失落||糊涂
进阶|How to say 'To praise'?|表扬 (Biǎoyáng)|批评 (Pīpíng)||嘲笑 (Cháoxiào)||反对 (Fǎnduì)
进阶|What is 'Gratitude'?|感激 (Gǎnjī)|嫉妒 (Jídù)||愤怒 (Fènnù)||害怕 (Hàipà)
进阶|Translate: 'Everything is going well'|万事如意 (Wànshì rúyì)|一切都坏了||我不确定||慢慢来
进阶|What is 'Energetic'?|精力充沛 (Jīnglì chōngpèi)|精疲力竭||没精打采||不舒服
进阶|How to say 'Surprise'?|惊喜 (Jīngxǐ)|惊吓 (Jīngxià)||无聊||平静
进阶|What is 'Optimistic'?|乐观 (Lèguān)|悲观 (Bēiguān)||客观||主观
进阶|How to say 'I've moved/touched'?|我被感动了 (Gǎndòng)|我被骗了||我被吓到了||我被忘了
进阶|What is 'Encouragement'?|鼓励 (Gǔlì)|打击||阻碍||忽视
进阶|Translate: 'Pleasantly surprised'|喜出望外 (Xǐchūwàngwài)|大失所望||不出所料||垂头丧气
进阶|What is 'True Love'?|真爱 (Zhēn'ài)|谎言 (Huǎngyán)||友谊||亲戚
进阶|How to say 'Harmonious'?|和谐 (Héxié)|混乱||矛盾||争吵
进阶|What is 'Happiness' (Noun)?|幸福 (Xìngfú)|痛苦||贫穷||灾难
高级|Which idiom means 'Double Happiness'?|双喜临门 (Shuāngxǐ línmén)|一箭双雕||祸不单行||半途而废
高级|What does '笑逐颜开' mean?|Beaming with smiles|Crying loudly||Angry face||Sleepy eyes
高级|Idiom for 'Success at the start':|旗开得胜 (Qíkāidéshèng)|马到成功||失败告终||力不从心
高级|What is 'Inner Peace'?|内心的平静 (Nèixīn de píngjìng)|内心的波浪||内心的火||内心的石头
高级|Translate 'Cherish':|珍惜 (Zhēnxī)|浪费 (Làngfèi)||抛弃 (Pāoqì)||忘记
高级|What is 'Self-Realization'?|自我实现 (Zìwǒ shíxiàn)|自我怀疑||自我否定||自我放弃
高级|Idiom for 'Full of energy':|精神抖擞 (Jīngshén dǒusǒu)|垂头丧气||无精打采||老态龙钟
高级|What is 'Benevolence'?|仁爱 (Rén'ài)|残忍 (Cánrěn)||冷漠||仇恨
高级|Translate 'Dazzling/Brilliant':|灿烂 (Cànlàn)|昏暗 (Hūn'àn)||平淡||肮脏
高级|Idiom for 'A happy family':|阖家欢乐 (Héjiā huānlè)|分崩离析||孤家寡人||鸡飞狗跳
高级|What is 'Wisdom'?|智慧 (Zhìhuì)|愚蠢 (Yúchǔn)||鲁莽||知识
高级|Idiom for 'Unexpected joy':|意外之喜 (Yìwài zhī xǐ)|意料之中||飞来横祸||空喜一场
高级|What is 'Solidarity'?|团结 (Tuánjié)|分裂||争斗||背叛
高级|Translate 'Refreshment' (of spirit):|神清气爽 (Shénqīngqìshuǎng)|头昏脑胀||精疲力竭||心烦意乱
高级|What is 'Integrity'?|正直 (Zhèngzhí)|狡猾 (Jiǎohuá)||虚伪||自私
高级|Idiom for 'Great harvest/Success':|硕果累累 (Shuòguǒ lěilěi)|颗粒无收||一无所有||半途而废
高级|What is 'Magnanimity/Broad-mindedness'?|豁达 (Huòdá)|狭隘 (Xiá'ài)||固执||多疑
高级|Translate 'Eternal Bliss':|永恒的喜悦 (Yǒnghéng de xǐyuè)|暂时的快乐||终身的痛苦||未知的结局
高级|What is 'Altruism'?|无私 (Wúsī)|贪婪 (Tānlán)||吝啬||自大
高级|Idiom for 'Spring breeze on one's face' (Joy):|春风满面 (Chūnfēng mǎnmiàn)|愁眉苦脸||面如土色||怒发冲冠
高级|What is 'Tolerance'?|包容 (Bāoróng)|排斥 (Páichì)||挑剔||偏见
高级|Translate 'Brilliant future':|前程似锦 (Qiánchéng sì jǐn)|前途渺茫||穷途末路||走投无路
高级|What is 'Mindfulness'?|正念 (Zhèngniàn)|杂念||邪念||妄想
高级|Idiom for 'Joy beyond words':|难以言表的喜悦|无话可说||哑口无言||谈笑风生
高级|Last one! 'Peace to you' is...|愿你平安 (Yuàn nǐ píng'ān)|愿你发财||愿你工作||愿你走开
大师|Meaning of '知足常乐' (Zhīzú chánglè)?|Contentment brings constant happiness|Wealth brings happiness||Study brings pain||Travel brings fatigue
大师|What is '心旷神怡'?|Relaxed and happy in mind and spirit|Anxious and nervous||Sick and tired||Angry and loud
大师|Idiom '乐此不疲' means...|Enjoy something so much you never tire|Tired of playing||Lazy to work||Angry at the game
大师|What is '苦尽甘来'?|Bitterness ends and sweetness begins|Always bitter||Sweet turns into bitter||No taste at all
大师|Meaning of '助人为乐'?|Taking pleasure in helping others|Helping for money||Hurting others||Ignoring others
大师|What is '笑口常开'?|To always be smiling|To always be eating||To always be shouting||To always be sleeping
大师|Idiom '安居乐业' means...|Live in peace and work happily|Homeless||Unhappy at work||Moving constantly
大师|What is '欣欣向荣'?|Flourishing and prosperous|Withering and dying||Static and slow||Poor and cold
大师|Meaning of '天伦之乐'?|The joy of family life|The joy of winning money||The joy of solitude||The joy of nature
大师|What is '美梦成真'?|Dreams come true|Nightmares occur||Forget dreams||Daydreaming
大师|Idiom '喜上眉梢' refers to...|Beaming with joy in one's eyes/brows|Sadness in the eyes||Angry eyebrows||Heavy head
大师|Meaning of '欢天喜地'?|Wildly happy/Jubilant|World is ending||Quiet and calm||Slightly annoyed
大师|What is '一帆风顺'?|Smooth sailing/Everything easy|Rough waters||Sinking ship||Strong wind
大师|Meaning of '吉祥如意'?|Good fortune as you wish|Bad luck follows||No wishes||Forget luck
大师|What is '大吉大利'?|Great fortune and great profit|Big failure||Small loss||Normal day
大师|Idiom '万象更新' means...|Everything takes on a new look (Spring)|Everything stays same||Everything gets old||Everything disappears
大师|Meaning of '喜闻乐见'?|Love to see and hear (Popular)|Hate to hear||Ignored by all||Forbidden
大师|What is '富贵吉祥'?|Wealth, status, and luck|Poverty and death||Normal life||Travel far
大师|Idiom '笑逐颜开' means...|Face lighting up with a smile|Face turning red with anger||Face getting pale||Face hiding
大师|Meaning of '锦上添花'?|Making something good even better|Making bad worse||Cleaning a room||Buying a flower
大师|What is '鹏程万里'?|Have a bright future (Flight of 10,000 miles)|Short walk||No future||Stay at home
大师|Idiom '如鱼得水' means...|Like a fish in water (In one's element)|Fish out of water||Drowning||Fishing
大师|Meaning of '和气生财'?|Friendliness/Harmony brings wealth|Anger brings money||Hard work only||Luck only
大师|What is '岁月静好'?|The years are quiet and good|Life is chaotic||Time is running out||The past was better
大师|Final one! '福' (Fú) means...|Happiness / Blessing / Fortune|Power||Knowledge||Strength`}
    speechLocale="zh-CN"
    primaryColor="#d32f2f"
    primaryHover="#b71c1c"
    secondaryColor="#fbc02d"
    resultTitle="恭喜你！(Congratulations!)"
    resultMessage="做得好！继续加油学汉语。(Well done! Keep learning Chinese.)"
    retryLabel="再试一次 (Retry)"
    levelLabels={{
      入门: 'Beginner',
      进阶: 'Intermediate',
      高级: 'Advanced',
      大师: 'Expert'
    }}
  />
);

export default ChineseQuiz;
