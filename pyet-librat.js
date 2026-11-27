(() => {
  'use strict';

  const form = document.getElementById('pyet-librat');
  if (!form) return;
  const input = document.getElementById('question-input');
  const status = document.getElementById('question-status');
  const results = document.getElementById('question-results');
  const books = [...document.querySelectorAll('#librat .card')].map(card => {
    const url = new URL(card.querySelector('.cover a').href);
    return { name: card.querySelector('h3').textContent.trim(), file: url.pathname.split('/').pop(), url };
  });

  function fold(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\b(?:s['’]?(?:kom|kam)|skam)\b/g, 'nuk kam').replace(/\bs['’](?=[a-z])/g, 'nuk ').replace(/mes['’]h/g, 'mesh')
      .replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function cleanQuestion(text) {
    return fold(text)
      .replace(/^(?:(?:selam(?:un)? alejkum|pershendetje|tung(?:jatjeta)?|ju lutem|te lutem|a ka mundesi|a mund(?:eni)? (?:te|me) m(?:e|a) (?:tregoni|tregu|tregosh|sqaroni)|(?:deshta|desha|dua|du|kisha dashur) (?:me dit(?:e)?|te di)|kam (?:edhe )?(?:nje |ni )?pyetje|kisha nje pyetje|pyetja (?:ime|jem) (?:eshte|osht))\b\s*)+/, '')
      .replace(/\b(?:nuk me kujtohet|s ?me kujtohet|nuk po me kujtohet|nuk (?:po )?(?:e )?mbaj mend|nuk po me bjen (?:ne |nder )?mend)\b/g,'harrim')
      .replace(/\b(?:me jane mbyllur syte|m(?:u|e) (?:mbyllen|mshelen) syte|me mori gjumi|m(?:e|ka) (?:ka )?(?:marre|marr|zene|zun) gjumi)\b/g,'gjumi')
      .replace(/\b(?:edhe )?(?:nje|ni) here (?:tjeter|t jeter)\b/g,'perseri')
      .replace(/\b(?:ma detajisht|ma hollesisht|ne kete rast|n kete rast|ne kete situate|ne rastin tim|per kete pune|desha te pyes|faleminderit(?: shume)?|ju faleminderit)\b/g,' ')
      .replace(/\b(?:jam ne rruge|kur jam ne rruge|ne udhetim e siper)\b/g,'ne udhetim')
      .replace(/\s+/g,' ').trim();
  }

  // Each line groups Albanian word forms, regional spellings or equivalent
  // terms. Separate religious concepts (e.g. farz and sunet) remain separate.
  const wordGroups = `
abdes abdesi abdesin abdesit abdest abdesti abdestin avdes avdesi avdesin avdest avdesti avdestin wudu
prish prishin prishen prishet prishetë prishur prishje prishja prishjes prishjen prishës prishësit prishësve prishka prishe zhvleresim zhvleresojne zhvlefteson zhvlereson rrezon rrezohet rrzon anuloj anulon anulojnë anulohet anulimi pavlefshme pavlefshme zhvlerëson zhvlerësohet pavlefshëm
namaz namazi namazin namazit namaze namazet namazeve
fal fale falem falesh falet falen falur falje falja faljen faljes falna
agjerim agjërimi agjërimin agjërimit agjëroj agjëron agjëruar agjëruese agjërueshëm agjinoj agjerova agjino agjinim agjineshem agjinushem agjerueshem agjerues agjerushem agjëruari
ramazan ramazani ramazanin ramazanit ramadan ramazánit
zekat zekati zekatin zekatit zeqat zeqati zeqatin
haxh haxhi haxhin haxhit haxhillëk haxhillëkun
umre umren umres umra
gjumë dremis dremita kotur kotje sygjume flejta fjeta gjumi gjumin gjumit fle flej flejt fjetë fjetur fjet fjeta dremitje dremitja dremitjen dremitjeje kotem
harrim harrosha harrue harrojsha ngaterrova ngaterrohem harresë harresa harresën harresës harroj harron harrova harruar harru harrohet harrosh sehvi sehvu
dyshim dyshimi dyshimin dyshon dyshoj dyshova pasigurt
rekat reqatet rekate rekatet rekateve rekatesh rekatë rekata reqate reqat
tejemum tejemumi tejemumin tejemumit tejemmumi tejmem
gusël gusl gusli guslin guslit gusull gusul
ujë uji ujin ujit ujërat ujëra ujërave ujna uj uje
marr mor mora mar mer merret marrje merr marrja marrjen marrjes marrë marrur marrësh
bëj bëhet bësh bëjmë bëjnë bëri bërë bo boj ban ba baj bon bëni veproj
udhëtim udhëtimi udhëtimin udhëtoj udhëton udhëtar udhëtari udhëtaren udhëtarin udhëtarit udhëtarët udhetim udhëtuar udhtu udhëtu udhtar udhtim udhtoj udhtim musafir musafirit sefer
shkurtoj shkurtohet shkurton shkurtimi shkurtimit shkurtohen shkurtojë shkurtu shkurto shkurtim
bashkoj bashkohen bashkimin bashkimi bashkohet bashkojë bashku bashkim
ha hamë haja hëngra hëngër hongra honger hangra hangër ngrënë ngrënie ngrënia ngrënien
pi piva pirë pije pirja pij
obligim obligohet obligueshëm detyrim detyruar detyrë farz farzet farze
shtyllë shtyllat shtyllave shtyllën shtyllës rukn ruknet
kusht kushte kushtet kushteve kushti
kohë koha kohën kohës kohët vakti vaktin vakt
ditë ditësh ditët ditëve dita ditën
zgjat kohëzgjatje kohëzgjatja kohëzgjatjen zgjasin zgjati
menstruacione cikle ciklet cikleve menstruacionet menstruacioneve menstruacionesh menstruacioni cikli ciklin ciklit perioda periodat hajz hajzi
lehoni lehonia lehonisë lehonë nifas nifasi
lindje lindjes lindja lindjen
gjak gjaku gjakut gjakun
pastrim pastroj pastrohem pastrohet pastrosh pastrojnë pastrimi pastrimin pastrimit
sexhde sexhdja sexhden sexhdes
filloj fillimi fillu nis nisem nisja nisjet fillon fillohet fillimi fillojnë nisën niset fillu
nisab nisabi nisabin nisabit prag pragu
ar ari arin arit floriri flori floririt floriun
argjend argjendi argjendin argjendit
gram gramash gr gramë gramësh grame
para paratë parave pare paret pareve kartëmonedha kartëmonedhave kursime kursimet
mish mishi mishin mishit
deve deveja devenë devesë deveve
fitër fitr fitri fitrit fitrin fitra sadakatulfitri sadekatulfitri vitra vitrat
sai saji sajin saje sajin sajinë sajt sajit
safa safaja safas safa
merve merveja merves marva
tavaf tavafi tavafin tavafit tawaf
ecje ecja ecjen ecjes ec eci ecur ecim hec hecje
xhiro sjellem sill sillem sillemi xhirot rrathë rrethe rrotullime rrotullim
ihram ihrami ihramin ihramit
mesh meshi meshin meshit fshirje fshirja
çorape çorapet çorapave qorapa qorape çorapa corapet qorapet
meste mestet mesteve mestin mest
sunet sunnet suneti sunetet sunete
lejohet lejoka lejohen lejuar lejuara lejueshme lejojnë bën ben lejohem
grua gruaja gruas gratë femra femrat
shumë shum madhe shumtë
kompensoj kompensohet kompenson kompensimi kompensimin kompensohen kaza
sëmurë sëmuri sëmurit semut sëmundje sëmundja
përfitues përfitoj përfiton përfitu përfituar përfituesit përfituesve
sabah sabahu sabahun sabahut
drekë dreka drekën drekës
ikindi ikindia ikindinë ikindisë
jac iaci jaci jacia jacinë jacisë
xhami xhamia xhaminë xhamisë xhamive
xhuma xhumaja xhumanë xhumasë xhumas
kible kibla kiblen kibles kiblet
drejtim drejtimi drejtimin drejtimit kahja kahjen
aksham akshami akshamit akshamin magrib
mjaltë mjaltin mjalti mjaltit mjalt mjaltin
enë ena enën enët enëve
qen qeni qenit qenin
lëpij lëpijë lëpiu lëpirë lëpin lëpirja lepi lepijti
nijet nijeti nijetin nijetit nijeteve
natë nata natën natës netëve
largësi largësia largësinë largësisë distancë distanca distancën
ndërpres ndërpret ndërpresë ndërprerja ndërprerjen ndërpritet ndërprej ndërprehet
qabe qaben qabja qabes qabën
fëmijë fëmija fëmijët fëmijës fëmi fmija fmi
këmbë këmbët këmbëve kamt
dorë duar duart duarve dorën
larje laj lahen lan lahet larë larja larjen
rroba rrobë rrobat rrobën rrobave
bukë buka bukën buk
shtatzënë shtatzëni shtatzënia shtatzënisë shtatzën shtatzanë
humb humbet humbas humbja humbjen humbur humbura humbë humbësha ikën ikur
imam imami imamin imamit imamët
këpucë këpuca këpucët këpucëve këpucën këpucësh
hundë hunda hundës hundën
mesbuk mesbuku mesbukun
lutje lutja lutjen dua lutjet duatë
bajram bajrami bajramit bajramin
sigurt siguri sigurte
mirë mir mira
ripërsërit perseritur perseriti serish perserite ribeje përsëris përsëritet përsërit përsëri prapë prap
zë zënë zuri zënie
dal del dalja delte
jep paguhet paguaj paguan jepen jepet jap dhënë dhane dhanë dhuroj
ndryshim ndryshimi dallim dallimi
ruku rukuja rukunë rukusë
varezë varrezë varreza varrezat varrezave varrezën
shtatë 7
gjashtë 6
pesë 5
katër 4 kater
tri tre 3
dy 2
zekatdhënës zekatdhënësi
`.trim().split('\n');
  const lexicon = new Map();
  for (const line of wordGroups) {
    const forms = fold(line).split(' ');
    for (const word of forms) lexicon.set(word, forms[0]);
  }
  const stop = new Set(fold('a ai ajo janë është osht asht jom jam jemi jeni je si qysh çka çfarë çfare cka ç cilat cilët cila cili cilen cilin ku kur kush kujt përsa pra dhe e i o u të t te t’ në n me më mi ma mu unë na ne ti ty ju ia ta t’i një njëri ndonjë ndonjëri prej për per ni nji nga tek edhe vet këtë këto kjo këta ato ata im tim tij saj sajë vetë mbasi pasi masi mas mbas kam kom ka kemi kenë kanë keni ke isha ishte qenë sime atij mund mundem mundet muj mundet mun a duhet duhetna jam duke që se nëse nqs nese ose apo përmes rreth lidhur rasti çështja dijetarët person personi dikush njeriu ndaj gjatë gjatë siç çfar çka ather ate atë herë vallë lutem dua du tregom tregoma tregoni intereson deshta desha do di dini dihet thotë thoni shpjegom shpjego libër libri librin flet shkruan ta tem time qka qfar qfare gje gjera gjerat gjerash send sendet sen senet mundësi mundesia hala ende akoma gjithnje zakonisht situate situat rastet gjerat sene tash tani doni kom ni her veq vec vetem naj bajne po bre more vall pyetje tregoni').split(' '));
  const generic = new Set(['bej','lejohet','obligim','kohe','dite','shume','kam','nuk','pa','sa','pas','para','kur','duhet','eshte','dy','tri','tre','kater']);
  function rawWords(text) { return fold(text).split(' ').filter(w => w && !stop.has(w)); }
  function stem(word) {
    if (lexicon.has(word)) return lexicon.get(word);
    if (word.length < 6) return word;
    // Keep a minimum root so short words such as “ar” and “ari” are never guessed.
    return word.replace(/^(.{4,}?)(?:imeve|eve|ave|imin|imit|imi|jen|jes|uar|ise|ine|esh|et|ve|it|in)$/, '$1');
  }

  // These are ways of asking, not answers. Every destination is checked
  // against the current book before navigation, including a textual fingerprint.
  const routes = [
    ['pastertia','p-3331','tetë gjëra që e prishin abdesin', ['Çka ma prish abdesin','Kur prishet abdesi','Kur e humb abdesin','Çfarë e bën abdesin të pavlefshëm','Cilët janë prishësit e abdesit','Çfarë e anulon abdesin','Kur duhet ta përsëris abdesin','Kur më duhet të marr abdes përsëri','Çka ma rrëzon abdesin']],
    ['pastertia','_Toc240188684','për të marrë abdes', ['Si të marr abdes','Qysh me bo avdest','Si merret abdesi hap pas hapi','Cila është mënyra e marrjes së abdesit']],
    ['pastertia','_Toc240188699','dremitjeje të lehtë', ['A e prish gjumi abdesin','A më prishet abdesi nëse më zë gjumi','A kam abdes pasi kam fjetur','A duhet me marr abdes pasi fle','A prishet avdesi kur flej pak','Më zuri gjumi a kam ende abdes','A më prishet abdesi nëse dremis ulur','Më ka zënë gjumi a më duhet ta përsëris abdesin','Kur fle a duhet me marr avdes prap','A ndikon gjumi tek abdesi']],
    ['pastertia','p-3479','nga hunda del gjak', ['A ma prish abdesin gjaku nga hunda','Nëse më del gjak nga hunda a prishet abdesi','A më duhet të marr abdes përsëri pas gjakderdhjes nga hunda']],
    ['pastertia','p-3723','ngrënia e mishit të devesë', ['A prishet abdesi nga mishi i devesë','A ma prish avdesin nëse ha mish deveje']],
    ['pastertia','_Toc240188719','nuk gjen ujë', ['Si falem kur nuk kam ujë për abdes','Çka bëj nëse nuk kam ujë për abdes','Çka me bo kur s’kom ujë për avdes','Si pastrohem pa ujë','Qysh me u fal kur skom uj','Si të falem pa ujë','Çfarë të bëj kur nuk gjej ujë për t’u falur','Nuk gjej ujë për abdes','Kur lejohet tejemumi pa ujë','Si të marr abdes kur nuk kam ujë','Qysh me marr avdes kur skom ujë','Nuk kam ujë si të marr abdes','Si të marr abdes pa ujë','Me çka pastrohem në mungesë të ujit','Si falem në udhëtim kur nuk gjej ujë për abdes']],
    ['pastertia','_Toc240188731','mënyra e marrjes së tejemumit', ['Si merret tejemum','Qysh me bo tejemum','Si bëhet tejemumi','Si marr tejemum hap pas hapi']],
    ['pastertia','_Toc240188689','për vendasin', ['Sa ditë lejohet meshi mbi meste','Sa zgjat meshi për udhëtarin','Sa kohë mund t’u jap mes’h mesteve','Sa kohë lejohet meshi me çorape kur udhëtoj','Sa zgjat meshi mbi çorape për udhëtarin','Sa ditë lejohet meshi mbi çorape kur jam musafir','Sa zgjat afati i meshit në udhëtim']],
    ['pastertia','_Toc240188749','kompenson agjërimin', ['A falet gruaja kur ka menstruacione','A muj mu fal kur jam me perioda','A i kompensoj namazet e ciklit','A kompensohet agjërimi gjatë menstruacioneve','A kompensohet namazi pas menstruacioneve']],
    ['pastertia','_Toc240188760','kohëzgjatja maksimale e lehonisë', ['Sa zgjat lehonia','Sa ditë zgjat nifasi','Sa zgjat lehonia pas lindjes','Sa ditë është maksimumi i lehonisë']],
    ['namazi','_Toc244540714','shtyllat e namazit', ['Cilat janë shtyllat e namazit','Sa shtylla ka namazi']],
    ['namazi','_Toc244540719','sexhdes së harresës', ['Çfarë është sexhdja e harresës','Kur bëhet sexhdja e harresës','Sehvi sexhde']],
    ['namazi','_Toc244540735','dyshon në numrin e rekateve', ['Kam harruar sa rekate i kam falur','Nuk e di sa rekate kam falur','Dyshoj në numrin e rekateve','Nuk jam i sigurt a i kam falur tri apo katër rekate','A kam falur 3 apo 4 rekate','U ngatërrova në numrin e rekateve']],
    ['namazi','namazi-p-722a67a6','koha e namazit të eklipsit fillon', ['Kur falet namazi i eklipsit','Kur hyn koha e namazit të eklipsit']],
    ['namazi','_Toc244540820','ta shkurtojë në dy rekate', ['A mund ta shkurtoj namazin në udhëtim','Sa rekate fal udhëtari','Shkurtimi i namazit të udhëtarit','Qysh shkurtohet namazi kur jam musafir']],
    ['zekati','_Toc245147963','një e katërta e së dhjetës', ['Sa zekat jepet për ar','Si llogaritet zekati i arit','Sa për qind është zekati i arit','Sa zekat ka argjendi']],
    ['zekati','zekati-p-6d061afc','85 gramë ar', ['Sa gram ar duhet të kem për zekat','Sa është nisabi i arit','Me sa gram flori bëhet obligim zekati']],
    ['zekati','zekati-p-0acd4f24','nisabi i kartëmonedhave', ['Si llogaritet nisabi i parave','Sa para duhet të kem për zekat','Kur bëhet detyrim zekati i kursimeve']],
    ['zekati','zekati-p-4a720e20','për të varfrit, nevojtarët', ['Kujt i jepet zekati','Kush ka të drejtë ta marrë zekatin','Kush mund ta marrë zekatin','Kush e meriton zekatin','Cilët janë përfituesit e zekatit','Kujt mund t’ia jap zekatin','Kush përfiton nga zekati']],
    ['zekati','zekati-p-74a00f23','para namazit të bajramit', ['Kur jepet zekati i fitrit','Kur duhet me i dhanë vitrat','Kur jepen fitrat për Bajram']],
    ['agjerimi','_Toc245497599','kush ha', ['Çka e prish agjërimin','Kur prishet agjërimi','Çfarë e bën agjërimin të pavlefshëm']],
    ['agjerimi','agjerimi-p-1156','nëse vepron nga harresa', ['A prishet agjërimi nëse ha nga harresa','Kam ngrënë pa dashje se kam harruar që agjëroj','A më prishet Ramazani nëse ha ose pi nga harresa','Hëngra nga harresa gjatë Ramazanit','Piva ujë pa dashje duke harruar se po agjëroja','Kam harru që jam agjërueshëm dhe kam hëngër bukë','Kam pi ujë prej harresës gjatë agjërimit','Harrova që po agjëroja dhe hëngra','Kam harru se jam agjinushem dhe kom pi ujë','Kam hanger buk se kom harru qe jom agjinushem']],
    ['agjerimi','_Toc245497576','shikimin e hënës', ['Si përcaktohet fillimi i Ramazanit','Kur fillon Ramazani sipas hënës','Si vërtetohet hyrja e Ramazanit']],
    ['agjerimi','agjerimi-p-0763','për udhëtarin', ['A agjëron udhëtari','A lejohet ndërprerja e agjërimit në udhëtim','A mund të mos agjëroj kur jam në udhëtim']],
    ['haxhi','haxhi-p-3586','fillohet saji', ['Ku fillon saji','A fillon saji nga Safa apo Merveja','Ku nis saji në umre','Prej nga duhet ta nis sajin','Ku fillon ecja mes Safas dhe Merves']],
    ['haxhi','haxhi-p-3915','vijën e gurit të zi', ['Ku fillon tavafi','Nga cili vend fillon tavafi rreth Qabes']],
    ['haxhi','haxhi-p-0241','kushtet e haxhit', ['Cilat janë kushtet e haxhit','Si ndahen kushtet e haxhit']],
    ['haxhi','haxhi-p-3320','shtatë rrathë tavaf', ['Sa rrathë ka tavafi','Sa herë sillem rreth Qabes','Sa xhiro duhen bërë në tavaf']],
    ['namazi','namazi-p-1b2c7dd1','akshamit fillon me perëndimin', ['Kur fillon koha e akshamit','Kur nis namazi i akshamit','Kur hyn koha e namazit të akshamit']],
    ['namazi','namazi-p-2e96fb88','falja e namazit të drekës në fillim', ['Kur është më mirë të falet dreka','Kur është koha më e mirë për namazin e drekës']],
    ['namazi','_Toc244540646','një person i besueshëm', ['Si ta gjej drejtimin e kibles','Kah duhet të kthehem kur nuk e di drejtimin e kibles']],
    ['zekati','zekati-p-643bf764','zekati t’u jepet të afërmve', ['A mund t’i jap zekat një të afërmi','A lejohet t’i jepet zekati vëllait','A lejohet të jepet zekati për vëllanë','A mund t’ia jap zekatin motrës']],
    ['pastertia','p-5538','nëse qeni lëpin një enë', ['Si pastrohet ena që ka lëpirë qeni','Sa herë lahet ena nëse e lëpin qeni','A duhet dhe për enën që ka lëpirë qeni']],
    ['pastertia','_Toc240188748','ndërmjet dy menstruacioneve', ['Sa zgjat pastërtia midis dy cikleve','Sa ditë zgjat pastërtia ndërmjet dy menstruacioneve']],
    ['agjerimi','_Toc245497593','që nga nata për çdo ditë', ['A duhet nijeti çdo natë të Ramazanit','Kur bëhet nijeti për agjërimin farz','A duhet ta bëj nijet çdo ditë të Ramazanit']],
    ['agjerimi','_Toc245497588','niset për udhëtim gjatë asaj dite', ['Kur e ndërpret agjërimin udhëtari','A mund ta ndërpres agjërimin nëse nisem për udhëtim gjatë ditës']],
    ['namazi','namazi-p-515167ba','lejohet shkurtimi duhet të arrijë largësinë', ['Sa është distanca e udhëtimit për shkurtimin e namazit','Sa kilometra duhen për të shkurtuar namazin']],
    ['zekati','zekati-p-77105546','mbi të kalon një vit', ['Kur bëhet obligim zekati i pasurisë','Kur jepet zekati i pasurisë']],
    ['zekati','zekati-p-525460b2','në kohën e korrjes ose të vjeljes', ['Kur jepet zekati i të mbjellave','Kur duhet të paguhet zekati i prodhimeve bujqësore']],
    ['xhihadi','xhihadi-p-0723','marrëveshjen për mbrojtjen e jomyslimanëve', ['Çfarë është marrëveshja për mbrojtjen e jomyslimanëve','Ku shpjegohet marrëveshja për mbrojtjen e jomyslimanëve','Marrëveshja për mbrojtjen e jomyslimanëve']]
  ];

  function oneEdit(a,b) {
    if (a===b) return true;
    if (Math.abs(a.length-b.length)>1) return false;
    if (a.length>b.length) return oneEdit(b,a);
    let i=0;
    while (i<a.length && a[i]===b[i]) i++;
    if (a.length<b.length) return a.slice(i)===b.slice(i+1);
    if (a.slice(i+1)===b.slice(i+1)) return true;
    return a[i]===b[i+1] && a[i+1]===b[i] && a.slice(i+2)===b.slice(i+2);
  }
  function key(words) { return [...new Set(words)].sort().join(' '); }
  function questionType(text) {
    const q=fold(text);
    if (/^(?:prej nga|nga cili vend|ne cilin vend|ku)\b/.test(q)) return 'place';
    if (/^(?:kur|ne cilen kohe|ne cilen dite)\b/.test(q)) return 'time';
    if (/^(?:perse|pse|per cfare arsye)\b/.test(q)) return 'reason';
    if (/^(?:kujt|kush|per ke|cili person)\b/.test(q)) return 'person';
    if (/^(?:sa|per sa)\b/.test(q)) return 'amount';
    if (/^(?:si|qysh)\b/.test(q)) return 'method';
    return '';
  }
  const byQuestion=new Map(), familiar=new Set(lexicon.keys());
  const examples = [];
  for(const route of routes) {
    for(const phrasing of route[3]) {
      const words=rawWords(cleanQuestion(phrasing));
      for(const w of words) familiar.add(w);
      const terms = new Set(words.map(stem));
      examples.push({route, terms, type: questionType(phrasing)});
      const signature=key(terms);
      if(!byQuestion.has(signature)) byQuestion.set(signature,[]);
      byQuestion.get(signature).push({route,type:questionType(phrasing)});
    }
  }
  function correct(word, vocabulary) {
    if(word.length<4 || vocabulary.has(word) || vocabulary.has(stem(word))) return word;
    let match='';
    for(const v of vocabulary) {
      if(v.length<4 || !oneEdit(word,v)) continue;
      if(match && stem(match)!==stem(v)) return word;
      match=v;
    }
    return match||word;
  }

  // Preserve unusual qualifiers (for example, a particular illness or a number)
  // instead of treating every similar question as the same legal situation.
  const topicTerms = new Map();
  const topicCounts = new Map();
  for (const {route, terms} of examples) {
    if (!topicTerms.has(route)) topicTerms.set(route, new Set());
    for (const term of terms) topicTerms.get(route).add(term);
  }
  for (const terms of topicTerms.values()) {
    for (const term of terms) topicCounts.set(term, (topicCounts.get(term) || 0) + 1);
  }
  const conversational = new Set(rawWords(
    'çështje lidhje dispozitë shpjegim mënyrë bëj veproj vepru vazhdoj vlen vlefshëm ende pak rëndësi nevojë nevojitet detyrohem pastaj përsëri zakonisht duke qenë derisa tamam konkretisht thjesht sot dje mbrëmë rast meqenëse situatë lidhje gjë përherë dikë'
  ).map(stem));
  function topicWeight(word) {
    if (generic.has(word) || conversational.has(word)) return 0.35;
    return 1 + Math.log((routes.length + 1) / ((topicCounts.get(word) || 0) + 1));
  }
  function matchTopic(question, tokens) {
    const type = questionType(question);
    const terms = new Set(tokens.map(w => stem(correct(w, familiar))));
    const exact = byQuestion.get(key(tokens.map(stem))) || byQuestion.get(key(terms)) || [];
    const choices = new Set(exact.filter(m => !type || m.type === type).map(m => m.route));
    if (choices.size === 1) return choices.values().next().value;
    if (terms.size < 2) return null;

    const ranked = new Map();
    for (const example of examples) {
      if (type && type !== example.type) continue;
      const known = topicTerms.get(example.route);
      const unaccounted = [...terms].some(t => !known.has(t) && !conversational.has(t) && !generic.has(t));
      if (unaccounted) continue;
      let shared = 0, salient = 0, queryWeight = 0, exampleWeight = 0;
      for (const t of terms) {
        const weight = topicWeight(t);
        queryWeight += weight;
        if (example.terms.has(t)) {
          shared += weight;
          if (weight > 1) salient++;
        }
      }
      if (salient < 2) continue;
      for (const t of example.terms) exampleWeight += topicWeight(t);
      if (shared / exampleWeight < 0.65 || shared / queryWeight < 0.68) continue;
      const score = 2 * shared / (queryWeight + exampleWeight);
      ranked.set(example.route, Math.max(ranked.get(example.route) || 0, score));
    }
    const [best, runnerUp] = [...ranked.entries()].sort((a, b) => b[1] - a[1]);
    return best && best[1] >= 0.78 && (!runnerUp || best[1] - runnerUp[1] >= 0.08) ? best[0] : null;
  }

  // The pairs were derived from term co-occurrence in this edition of the six
  // books. They rank passages only; a related term alone never selects a page.
  let associations;
  function loadAssociations() {
    if (!associations) {
      associations = fetch('pyet-kuptimet.json')
        .then(response => response.ok ? response.json() : null)
        .catch(() => null);
    }
    return associations;
  }
  function getAssociations(pairs, term) {
    return pairs && Object.hasOwn(pairs, term) && Array.isArray(pairs[term]) ? pairs[term] : [];
  }

  const loads=new Map();
  async function loadBook(book) {
    if(loads.has(book.file)) return loads.get(book.file);
    const task=(async()=>{
      const response=await fetch(book.url.pathname);
      if(!response.ok) throw Error('book');
      const doc=new DOMParser().parseFromString(await response.text(),'text/html');
      const view=doc.getElementById('textView');
      if(!view) throw Error('reader');
      const rows=[], byId=new Map(), postings=new Map();
      let headingTerms=new Set();
      for(const e of view.querySelectorAll('[data-search][data-page][id]')) {
        if(e.lang==='ar') continue;
        const source=e.querySelector('.source-albanian,.source-text')||e;
        const text=source.textContent.replace(/\s+/g,' ').trim();
        if(!/[a-zëç]{2}/i.test(text)) continue;
        const isHeading=e.matches('h1,h2,h3,.source-title-pair');
        if(isHeading && text.length>16) {
          headingTerms=new Set(rawWords(text).map(stem));
        }
        const docId=rows.length;
        const row={id:e.id,page:e.dataset.page,text,headingTerms,isHeading};
        rows.push(row);
        byId.set(row.id,row);
        for(const term of new Set(rawWords(text).map(stem))) {
          if(!postings.has(term)) postings.set(term,[]);
          postings.get(term).push(docId);
        }
      }
      if(!rows.length) throw Error('empty');
      return {book,rows,byId,postings};
    })();
    loads.set(book.file,task);
    try {return await task} catch(e) {loads.delete(book.file);throw e}
  }
  function linkFor(book,row) {
    const url=new URL(book.url);
    url.hash=row.id;
    return url.href;
  }
  const bookSubjects={pastertia:'pasterti',namazi:'namaz',zekati:'zekat',agjerimi:'agjerim',haxhi:'haxh',xhihadi:'xhihad'};
  const ritualTerms=new Set(['namaz','abdes','agjerim','zekat','haxh','gusël','tejemum','umre','tavaf'].map(fold));
  // Posting lists follow document order.
  function containsId(ids,target) {
    if(!ids) return false;
    let low=0, high=ids.length;
    while(low<high) {
      const mid=(low+high)>>>1;
      if(ids[mid]<target) low=mid+1; else high=mid;
    }
    return ids[low]===target;
  }
  function searchBooks(loaded, words, query, pairs) {
    const vocabulary=new Set(), total=loaded.reduce((n,d)=>n+d.rows.length,0);
    for(const d of loaded) for(const term of d.postings.keys()) vocabulary.add(term);
    const terms=[...new Set(words.map(w=>correct(w,vocabulary)))];
    if (terms.some(t => !vocabulary.has(t) && !generic.has(t) && !conversational.has(t) && !/^\d+$/.test(t))) return [];
    if(!terms.length || terms.every(t=>generic.has(t)||/^\d+$/.test(t))) return [];
    const weights=terms.map(t=>{
      const count=loaded.reduce((n,d)=>n+(d.postings.get(t)?.length||0),0);
      return Math.min(7,Math.log(1+(total-count+.5)/(count+.5)))*(generic.has(t) ? 0.35 : 1);
    });
    const weightSum=weights.reduce((a,b)=>a+b,0), hits=[];
    const queryText=fold(query);
    for(const data of loaded) {
      const scores=new Map(), substantiveMatches=new Map();
      const relatedScores = new Map();
      for (const [i, term] of terms.entries()) {
        if (generic.has(term)) continue;
        const relatedRows = new Set();
        for (const neighbor of getAssociations(pairs, term)) {
          for (const id of data.postings.get(neighbor) || []) relatedRows.add(id);
        }
        for (const id of relatedRows) {
          relatedScores.set(id, (relatedScores.get(id) || 0) + weights[i]);
        }
      }
      const subject=bookSubjects[(data.book.file || data.book.name).replace(/\.html$/,'')];
      const requiredTopics=terms.filter(t=>ritualTerms.has(t) && t!==subject);
      const substantive=terms.filter(t=>!generic.has(t));
      terms.forEach((term,i)=>{
        for(const id of data.postings.get(term)||[]) {
          scores.set(id,(scores.get(id)||0)+weights[i]);
          if(!generic.has(term)) substantiveMatches.set(id,(substantiveMatches.get(id)||0)+1);
        }
      });
      const queryType = questionType(query);
      for(const [id,score] of scores) {
        const coverage=score/weightSum;
        const related = (relatedScores.get(id) || 0) / weightSum;
        const supported = substantiveMatches.get(id) || 0;
        const contextual = supported >= 2 && related > 0.42 && terms.length >= 3;
        if (coverage < (contextual ? 0.55 : terms.length < 4 ? 0.69 : 0.60)) continue;
        if((substantiveMatches.get(id)||0)<Math.ceil(substantive.length*0.65)) continue;
        const row=data.rows[id];
        if(row.text.length<20) continue;
        if(requiredTopics.some(t=>!row.headingTerms.has(t) && !containsId(data.postings.get(t),id))) continue;
        const text=fold(row.text);
        const support=terms.reduce((n,t,i)=>n+(row.headingTerms.has(t)?weights[i]:0),0)/weightSum;
        const exact=queryText.length>=12 && text.includes(queryText);
        const tokenized = rawWords(text).map(stem);
        const positions = tokenized.flatMap((t, index) => terms.includes(t) && !generic.has(t) ? [[t,index]] : []);
        let close = 0;
        for (let i=0; i<positions.length; i++) {
          const near = new Set();
          for (let j=i; j<positions.length && positions[j][1]-positions[i][1]<=12; j++) near.add(positions[j][0]);
          close = Math.max(close, near.size);
        }
        const passageHasAnswer = /[?？]\s*[”"]?$/.test(row.text) ? 0 : 1;
        const intentBonus = queryType === 'amount' && /\b(?:[0-9]+|nje|dy|tri|tre|kater|pese|gjashte|shtate|dhjete|dyzet|gjysme)\b/.test(text) ? 0.45 : 0;
        const subjectBonus = terms.includes(subject) ? 0.7 : 0;
        const rank=subjectBonus+coverage*10+support*1.25+Math.max(0,close-1)*0.55+related*1.15+intentBonus+passageHasAnswer*0.45+(row.isHeading ? 0.8 : 0)+(exact?2.5:0)
          +Math.min(.45,65/row.text.length);
        hits.push({book:data.book,row,rank,coverage,exact,close,passageHasAnswer});
      }
    }
    hits.sort((a,b)=>b.rank-a.rank);
    const selected=[];
    for(const h of hits) {
      if(selected.some(x=>x.book===h.book && (x.row.page===h.row.page || x.row.text===h.row.text))) continue;
      selected.push(h);
      if(selected.length===4) break;
    }
    return selected;
  }

  function clearPassage(hits, words) {
    const [best, next] = hits;
    if (!best || !best.passageHasAnswer) return false;
    const gap = next ? best.rank - next.rank : Infinity;
    const informative = new Set(words.filter(w => !generic.has(w) && !conversational.has(w))).size;
    if (best.exact && informative >= 2 && gap > 0.65) return true;
    if (best.coverage < 0.88 || informative < 2 || best.close < 2) return false;
    // When nearby passages all explain the same rule, a small difference in
    // ranking should not prevent navigation to the best one.
    const sameSection = next && best.book === next.book && best.row.headingTerms.size &&
      next.row.headingTerms === best.row.headingTerms;
    if (sameSection && best.coverage >= 0.98 && best.close >= 3) return true;
    return informative >= 3 ? gap >= 0.60 : gap >= 1.6;
  }

  let sequence=0;
  function jump(book,row) {location.assign(linkFor(book,row))}
  function showPassages(hits) {
    for(const {book,row} of hits) {
      const li=document.createElement('li'), a=document.createElement('a');
      const ref=document.createElement('strong'), excerpt=document.createElement('span');
      a.href=linkFor(book,row);
      ref.textContent=book.name+' · f. '+row.page;
      excerpt.textContent=row.text.length>255 ? row.text.slice(0,252).replace(/\s+\S*$/,'')+'…' : row.text;
      a.append(ref,excerpt); li.append(a); results.append(li);
    }
  }
  function askForDetail(words, type) {
    const content = words.filter(w => !generic.has(w) && !conversational.has(w));
    let options;
    if (content.length === 1 && ['prish','humb'].includes(content[0])) {
      options = ['Çka ma prish abdesin?', 'Çka e prish agjërimin?'];
    } else if (content.includes('zekat') && content.every(t => ['zekat','jep'].includes(t))) {
      options = type === 'time'
        ? ['Kur jepet zekati i pasurisë?', 'Kur jepet zekati i fitrit?', 'Kur jepet zekati i të mbjellave?']
        : ['Kujt i jepet zekati?', 'Sa gram ar duhet të kem për zekat?', 'Kur jepet zekati i fitrit?'];
    } else if (content.length === 1 && content[0] === 'abdes') {
      options = ['Si të marr abdes?', 'Çka ma prish abdesin?'];
    }
    if (!options) return false;
    status.textContent = 'Për cilën çështje po pyet?';
    for (const option of options) {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = option;
      button.addEventListener('click', () => {
        input.value = option;
        form.requestSubmit();
      });
      item.append(button);
      results.append(item);
    }
    return true;
  }

  async function search(allowJump) {
    const run=++sequence, raw=input.value.trim();
    results.replaceChildren(); status.textContent='';
    if(!raw) return;
    // The query stays in this tab's history entry, so Back can restore it
    // without immediately navigating the reader forward again.
    history.replaceState({...history.state,bookQuestion:raw},'');
    const question=cleanQuestion(raw);
    const tokens=rawWords(question);
    const words=tokens.map(stem);
    if(!words.length || words.every(w=>generic.has(w))) {
      status.textContent='Për cilën temë po pyet? Përmend, për shembull, abdesin ose namazin.';return;
    }
    const type = questionType(question);
    if (type === 'time' && words.includes('zekat') && words.every(w => w === 'zekat' || w === 'jep' || generic.has(w))) {
      if (askForDetail(words, type)) return;
    }
    const route = matchTopic(question, tokens);
    if (route) {
      const book=books.find(b=>b.file===route[0]+'.html');
      if(book) {
        status.textContent='Po kërkoj te '+book.name+'…';
        try {
          const data=await loadBook(book), row=data.byId.get(route[1]);
          if(run!==sequence)return;
          if(row && fold(row.text).includes(fold(route[2]))) {
            if(allowJump) {jump(book,row);return}
            status.textContent='Pjesa për këtë pyetje';showPassages([{book,row}]);return;
          }
        } catch (_) { /* Search other sources and allow a retry. */ }
      }
    }
    if (askForDetail(words, type)) return;
    const pendingPairs = loadAssociations();
    const loaded=[], missing=[];
    for(const book of books) {
      if(run!==sequence)return;
      status.textContent='Po kërkoj në libra… '+(loaded.length+missing.length)+' / '+books.length;
      try {loaded.push(await loadBook(book))} catch (_) {missing.push(book.name)}
    }
    if(run!==sequence)return;
    if(!loaded.length){status.textContent='Librat nuk u hapën. Kontrollo lidhjen dhe provo përsëri.';return}
    const pairs = await pendingPairs;
    if (run !== sequence) return;
    const hits=searchBooks(loaded,words,question,pairs);
    const partial=missing.length?' Nuk u hapën këto vëllime: '+missing.join(', ')+'.':'';
    if(!hits.length){status.textContent='Nuk gjeta një pjesë mjaft të afërt. Provoje pyetjen me një hollësi tjetër.'+partial;return}
    const best = hits[0];
    if (allowJump && !missing.length && clearPassage(hits, words)) {
      jump(best.book, best.row);
      return;
    }
    status.textContent = 'Cilën pjesë ke parasysh?' + partial;
    showPassages(hits);
  }
  form.addEventListener('submit',event=>{event.preventDefault();search(true).catch(()=>{
    status.textContent='Kërkimi nuk përfundoi. Provo përsëri.';
  })});
  input.addEventListener('input',()=>{
    sequence++;results.replaceChildren();status.textContent='';
    if(history.state?.bookQuestion)history.replaceState({...history.state,bookQuestion:null},'');
  });
  form.hidden=false;
  window.addEventListener('pageshow',()=>{
    const prior=history.state?.bookQuestion;
    if(typeof prior==='string' && prior){input.value=prior;search(false).catch(()=>{})}
  });
})();
