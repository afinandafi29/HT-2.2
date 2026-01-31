
import https from 'https';
import fs from 'fs';

const text = `
https://in.pinterest.com/pin/753578950191197201/  https://in.pinterest.com/pin/753578950191197201/  https://in.pinterest.com/pin/40391727904860538/  https://in.pinterest.com/pin/220394975509763034/  https://in.pinterest.com/pin/220394975509763034/  https://in.pinterest.com/pin/92394229852587010/  https://www.behance.net/gallery/223847735/Instagram-Highlight-Covers/?q-1337  https://in.pinterest.com/pin/92394229852587010/  https://in.pinterest.com/pin/21251429487246943/  https://in.pinterest.com/pin/21251429487246943/  https://in.pinterest.com/pin/19281104652328902/  https://in.pinterest.com/pin/19281104652328902/  https://in.pinterest.com/pin/162129655329958693/  https://in.pinterest.com/pin/373095150404590268/  https://in.pinterest.com/pin/373095150404590268/  https://in.pinterest.com/pin/1548181186305389/  https://in.pinterest.com/pin/1548181186305389/  https://in.pinterest.com/pin/771945192417248115/  https://in.pinterest.com/pin/19281104652327982/  https://in.pinterest.com/pin/9218374232082848/  https://in.pinterest.com/pin/9218374232082848/  https://in.pinterest.com/pin/4081455907369598/  https://in.pinterest.com/pin/4081455907369598/  https://in.pinterest.com/pin/221239400439675052/  https://in.pinterest.com/pin/110619734593275585/  ,https://in.pinterest.com/pin/110619734593275585/#  https://in.pinterest.com/iamhappyy338/  https://in.pinterest.com/  https://in.pinterest.com/  https://in.pinterest.com/ideas  https://in.pinterest.com/iamhappyy338/  https://in.pinterest.com/starryfeline/  https://in.pinterest.com/starryfeline/  https://in.pinterest.com/pin/65302263343477825/  https://in.pinterest.com/pin/26529085300365870/  https://in.pinterest.com/pin/16184879907977389/  https://in.pinterest.com/pin/16184879907977389/  https://in.pinterest.com/pin/11892386513722722/  https://in.pinterest.com/pin/445082375696662241/  https://in.pinterest.com/pin/1266706141317512/  https://in.pinterest.com/pin/7740630605751057/  https://in.pinterest.com/pin/81557443248253076/  https://in.pinterest.com/pin/7107311906100726/  https://in.pinterest.com/pin/351912466758370/  https://in.pinterest.com/search/pins/?q=dp%20profile%20boy&rs=ac&len=10&source_id=ac_23oObZiF&eq=dp%20profile&etslf=6815#  https://in.pinterest.com/iamhappyy338/  https://in.pinterest.com/  https://in.pinterest.com/  https://in.pinterest.com/ideas  https://in.pinterest.com/iamhappyy338/  https://in.pinterest.com/pin/629800329183739246/  https://in.pinterest.com/pin/629800329183739246/  https://in.pinterest.com/pin/290130401018117966/  https://in.pinterest.com/pin/557601997638986181/  https://in.pinterest.com/pin/44613852554567521/  https://in.pinterest.com/pin/105764291244654967/  https://in.pinterest.com/pin/11118330333220001/  https://in.pinterest.com/pin/11118330333220001/  https://in.pinterest.com/pin/358810295335732405/  https://in.pinterest.com/pin/11470174047095370/  https://in.pinterest.com/pin/381680137191662680/  https://in.pinterest.com/pin/381680137191662680/  https://in.pinterest.com/pin/763360205633373327/  https://in.pinterest.com/pin/18577417208546817/  https://in.pinterest.com/pin/462533824252283636/  https://in.pinterest.com/pin/69172544271804609/  https://in.pinterest.com/pin/115475177942200689/  https://in.pinterest.com/pin/43628690136805857/  https://in.pinterest.com/search/pins/?q=discord%20profile%20gif%20boys%20dp&rs=guide&journey_depth=1&source_module_id=OB_discord%2520profile%2520gif%2520boys%2520dp_76836b8f-c09e-4a04-ae0e-a4df8b58f362&add_refine=Discord%7Cguide%7Cword%7C5#  https://in.pinterest.com/iamhappyy338/  https://in.pinterest.com/  https://in.pinterest.com/  https://in.pinterest.com/ideas  https://in.pinterest.com/iamhappyy338/  https://in.pinterest.com/pin/624663410852254186/  https://in.pinterest.com/pin/624663410852254186/  https://in.pinterest.com/pin/285697170102319671/  https://in.pinterest.com/pin/104216178872698027/  https://in.pinterest.com/pin/508132770465346389/  https://in.pinterest.com/pin/508132770465346389/  https://in.pinterest.com/pin/287174913744777298/  https://in.pinterest.com/pin/493777546654978394/  https://in.pinterest.com/pin/562809284704302258/  https://in.pinterest.com/pin/562809284704302258/  https://in.pinterest.com/pin/580331102024120275/  https://in.pinterest.com/pin/580331102024120275/  https://in.pinterest.com/pin/28780885113712342/  https://in.pinterest.com/pin/100627372918505434/  https://in.pinterest.com/pin/100627372918505434/  https://in.pinterest.com/pin/582442164324037751/  https://in.pinterest.com/pin/443182419604780619/  https://in.pinterest.com/pin/294000681948998192/  https://in.pinterest.com/pin/350577152262554999/  https://in.pinterest.com/pin/1108941108226984755/  https://in.pinterest.com/pin/470063279864085114/  https://in.pinterest.com/pin/328129522872873990/#  https://in.pinterest.com/iamhappyy338/  https://in.pinterest.com/  https://in.pinterest.com/  https://in.pinterest.com/ideas  https://in.pinterest.com/iamhappyy338/  https://in.pinterest.com/search/pins/?q=cat  https://in.pinterest.com/search/pins/?q=kitten  https://in.pinterest.com/search/pins/?q=pfp  https://in.pinterest.com/search/pins/?q=sticker  https://in.pinterest.com/search/pins/?q=meme  https://in.pinterest.com/wallpaper_clubs/  https://in.pinterest.com/wallpaper_clubs/  https://in.pinterest.com/pin/140948663332602580/  https://in.pinterest.com/pin/98727416831127877/  https://in.pinterest.com/pin/68891069300460917/  https://in.pinterest.com/pin/44402746323562939/  https://in.pinterest.com/pin/44402746323562939/  https://in.pinterest.com/pin/859343172688818459/  https://in.pinterest.com/pin/579768152073296731/  https://in.pinterest.com/pin/579768152073296731/  https://in.pinterest.com/pin/771874823679753433/  https://in.pinterest.com/pin/326862885478034407/  https://in.pinterest.com/pin/326862885478034407/  https://in.pinterest.com/pin/235664993000415637/  https://in.pinterest.com/pin/235664993000415637/  https://in.pinterest.com/pin/1126462925560047058/#  https://in.pinterest.com/iamhappyy338/  https://in.pinterest.com/  https://in.pinterest.com/  https://in.pinterest.com/ideas  https://in.pinterest.com/iamhappyy338/  https://in.pinterest.com/llaiba569/  https://in.pinterest.com/llaiba569/  https://in.pinterest.com/pin/644225921740080322/  https://in.pinterest.com/pin/1020909809295438581/  https://in.pinterest.com/pin/12244230231414879/  https://in.pinterest.com/pin/1126462925560047058/  https://in.pinterest.com/pin/1020417228086486030/  https://in.pinterest.com/pin/1020417228086486030/  https://in.pinterest.com/pin/938508009860312185/  https://in.pinterest.com/pin/11962755256964117/  https://in.pinterest.com/pin/189080884352412296/  https://in.pinterest.com/pin/13088655163498802/  https://in.pinterest.com/search/pins/?q=boy&rs=typed#  https://in.pinterest.com/iamhappyy338/  https://in.pinterest.com/  https://in.pinterest.com/  https://in.pinterest.com/ideas  https://in.pinterest.com/iamhappyy338/  https://in.pinterest.com/pin/346355027610208885/  https://in.pinterest.com/pin/583145851796809411/  https://in.pinterest.com/pin/798051996509644358/  https://in.pinterest.com/pin/51509989482307953/  https://in.pinterest.com/pin/763500943123268425/  https://in.pinterest.com/pin/8303580559127277/  https://in.pinterest.com/pin/447826756776517747/  https://in.pinterest.com/pin/6966574420476839/  https://in.pinterest.com/pin/6966574420476839/  https://in.pinterest.com/pin/406309197650322287/  https://in.pinterest.com/pin/406309197650322287/  https://in.pinterest.com/pin/66217057007414585/  https://in.pinterest.com/pin/698620960988152993/  https://in.pinterest.com/pin/469641067412812665/  https://in.pinterest.com/pin/469641067412812665/  https://in.pinterest.com/pin/527695281366705464/  https://in.pinterest.com/pin/2603712281927876/  https://in.pinterest.com/pin/393290979982888516/
`;

// Regex for direct images
const directImageRegex = /https:\/\/i\.pinimg\.com\/[^\s,"]+/g;
// Regex for Pin URLs
const pinUrlRegex = /https:\/\/(?:in\.)?pinterest\.com\/pin\/\d+\/?/g;

const directImages = text.match(directImageRegex) || [];
const pinUrls = Array.from(new Set(text.match(pinUrlRegex) || [])); // Dedupe

console.log('Found direct images:', directImages.length);
console.log('Found pin URLs:', pinUrls.length);

async function fetchOEmbedImage(pinUrl) {
    // oEmbed URL format: https://www.pinterest.com/oembed.json?url=PIN_URL
    const oembedUrl = 'https://www.pinterest.com/oembed.json?url=' + encodeURIComponent(pinUrl);

    try {
        const res = await fetch(oembedUrl);
        if (!res.ok) return null;
        const data = await res.json();
        return data.thumbnail_url; // Use thumbnail_url from the JSON response
    } catch (e) {
        return null;
    }
}

async function processPins() {
    console.log('Fetching images from pins via OEmbed...');
    const images = [...directImages];
    const validResults = [];

    // Process in chunks to avoid spamming the endpoint
    const chunkSize = 10;
    for (let i = 0; i < pinUrls.length; i += chunkSize) {
        const chunk = pinUrls.slice(i, i + chunkSize);
        const results = await Promise.all(chunk.map(url => fetchOEmbedImage(url)));

        for (const img of results) {
            if (img) validResults.push(img);
        }

        console.log('Processed ' + Math.min(i + chunkSize, pinUrls.length) + '/' + pinUrls.length + ' pins. Found ' + validResults.length + ' images so far.');
        // Small delay
        await new Promise(r => setTimeout(r, 500));
    }

    images.push(...validResults);
    const uniqueImages = [...new Set(images)];

    console.log('Total extracted images:', uniqueImages.length);
    fs.writeFileSync('extracted_images.json', JSON.stringify(uniqueImages, null, 2));
    console.log('Written to extracted_images.json');
}

processPins();
