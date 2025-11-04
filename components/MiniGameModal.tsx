import React, { useState, useEffect } from 'react';
import { GameRewards } from '../types';

interface MiniGameModalProps {
  day: number;
  gameType: 'ottomanTrivia' | 'villagerDispute';
  onClose: (rewards: GameRewards) => void;
}

const triviaQuestions = [
    // Existing questions
    { question: "Osmanlı Devleti'nin kurucusu kimdir?", options: ["Orhan Gazi", "Osman Gazi", "I. Murad"], correctAnswer: "Osman Gazi", reward: { gold: 300 } },
    { question: "1453 yılında İstanbul'u fetheden padişah kimdir?", options: ["Yıldırım Bayezid", "II. Mehmed", "I. Selim"], correctAnswer: "II. Mehmed", reward: { gold: 300 } },
    { question: "Osmanlı ordusunun elit piyade birliklerine ne ad verilirdi?", options: ["Sipahi", "Akıncı", "Yeniçeri"], correctAnswer: "Yeniçeri", reward: { gold: 300 } },
    { question: "Hangi padişah 'Kanuni' unvanıyla bilinir?", options: ["Kanuni Sultan Süleyman", "Fatih Sultan Mehmed", "Yavuz Sultan Selim"], correctAnswer: "Kanuni Sultan Süleyman", reward: { gold: 300 } },
    
    // New questions
    { question: "Osmanlı'nın Avrupa'da kazandığı ilk büyük meydan savaşı hangisidir?", options: ["Mohaç", "Kosova", "Niğbolu"], correctAnswer: "Kosova", reward: { gold: 250 } },
    { question: "Osmanlı Devleti'nin ilk başkenti neresidir?", options: ["Bursa", "Edirne", "Söğüt"], correctAnswer: "Söğüt", reward: { gold: 200 } },
    { question: "Ünlü Osmanlı mimarı kimdir?", options: ["Mimar Sinan", "Evliya Çelebi", "Piri Reis"], correctAnswer: "Mimar Sinan", reward: { gold: 350 } },
    { question: "Osmanlı'da donanma komutanlarına verilen unvan nedir?", options: ["Vezir-i Azam", "Kazasker", "Kaptan-ı Derya"], correctAnswer: "Kaptan-ı Derya", reward: { gold: 300 } },
    { question: "Ankara Savaşı'nda Osmanlı ordusunu mağlup eden lider kimdir?", options: ["Cengiz Han", "Timur", "Atilla"], correctAnswer: "Timur", reward: { gold: 200 } },
    { question: "Lale Devri hangi padişah döneminde yaşanmıştır?", options: ["III. Ahmed", "IV. Murad", "II. Mahmud"], correctAnswer: "III. Ahmed", reward: { gold: 250 } },
    { question: "Osmanlı Devleti'nin ilk anayasası hangisidir?", options: ["Tanzimat Fermanı", "Islahat Fermanı", "Kanun-i Esasi"], correctAnswer: "Kanun-i Esasi", reward: { gold: 400 } },
    { question: "Barbaros Hayreddin Paşa hangi alanda ün yapmıştır?", options: ["Mimari", "Denizcilik", "Tıp"], correctAnswer: "Denizcilik", reward: { gold: 300 } },
    { question: "Osmanlı'da vergi toplayan görevliye ne denirdi?", options: ["Subaşı", "Mültezim", "Kadı"], correctAnswer: "Mültezim", reward: { gold: 200 } },
    { question: "Çaldıran Savaşı hangi iki devlet arasında yapılmıştır?", options: ["Osmanlı-Bizans", "Osmanlı-Safevi", "Osmanlı-Memlük"], correctAnswer: "Osmanlı-Safevi", reward: { gold: 250 } },
    { question: "Piri Reis'in ünlü eseri hangisidir?", options: ["Seyahatname", "Kitab-ı Bahriye", "Mukaddime"], correctAnswer: "Kitab-ı Bahriye", reward: { gold: 350 } },
    { question: "Viyana'yı ilk kez kuşatan Osmanlı padişahı kimdir?", options: ["II. Mehmed", "Kanuni Sultan Süleyman", "IV. Mehmed"], correctAnswer: "Kanuni Sultan Süleyman", reward: { gold: 300 } },
];

const OttomanTriviaGame: React.FC<{ day: number; onClose: (rewards: GameRewards) => void; }> = ({ day, onClose }) => {
    const [currentQuestion, setCurrentQuestion] = useState(triviaQuestions[0]);
    const [outcome, setOutcome] = useState<{ message: string; rewards: GameRewards } | null>(null);

    useEffect(() => {
        // Ensure a different question is chosen each day if possible
        const questionIndex = day % triviaQuestions.length;
        setCurrentQuestion(triviaQuestions[questionIndex]);
    }, [day]);

    const handleAnswer = (answer: string) => {
        if (answer === currentQuestion.correctAnswer) {
            setOutcome({ message: `Doğru cevap! Bilgeliğiniz hazineyi doldurdu. +${currentQuestion.reward.gold} Altın!`, rewards: currentQuestion.reward });
        } else {
            setOutcome({ message: "Yanlış cevap! Bu seferlik bonus yok.", rewards: { gold: 0 } });
        }
    };
    
    if (outcome) {
        return (
             <>
                <h2 className="text-3xl font-serif text-[#5a2d0c] mb-4">Sonuç</h2>
                <p className="text-lg text-[#5a2d0c] mb-4">{outcome.message}</p>
                <button onClick={() => onClose(outcome.rewards)} className="w-full mt-4 bg-[#8B4513] text-white py-2 px-4 rounded-lg hover:bg-[#A0522D] transition duration-200 font-bold">
                    Güne Başla
                </button>
            </>
        )
    }

    return (
        <>
            <h2 className="text-3xl font-serif text-[#5a2d0c] mb-4">Günün Sorusu</h2>
            <p className="text-lg text-[#5a2d0c] mb-4">{currentQuestion.question}</p>
             <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                    <button key={index} onClick={() => handleAnswer(option)} className="w-full text-left p-3 bg-[#D2B48C] rounded-lg hover:bg-[#C19A6B] transition duration-200">
                        {option}
                    </button>
                ))}
            </div>
        </>
    );
};


const disputes = [
    // Existing disputes
    { scenario: "Padişahım, iki köylü huzurunuza geldi. Biri fırıncı, diğeri çiftçi. Fırıncı, çiftçinin ona bayat buğday sattığını iddia ediyor. Çiftçi ise bunu reddediyor. Ne karar vereceksiniz?", options: [ { text: "Fırıncı haklı. Çiftçi, fırıncının 150 altınlık zararını karşılasın.", message: "Adil bir karar verdiniz. Fırıncının zararı karşılandı. Halkın size olan güveni arttı. (+150 Altın)", rewards: { gold: 150 } }, { text: "Birer şahit getirin, sonra karar vereceğim.", message: "Bilgece bir hamle! Halk, adalet arayışınızı takdir etti ve beyliğinize yeni bir aile katıldı. (+1 Nüfus)", rewards: { population: 1 } }, { text: "Çiftçi haklı. Fırıncı, iftira için 50 altın ceza ödesin.", message: "Halk bu kararı sorguluyor. Hazine'den 50 altın eksildi.", rewards: { gold: -50 } }, ] },
    { scenario: "Hünkarım, bir tüccar pazar yerinde sahte altın sikkeler bulduğunu iddia ediyor. Kuyumcu ise altınlarının hepsinin gerçek olduğunu söylüyor. Kime inanalım?", options: [ { text: "Bağımsız bir uzman getirip sikkeleri kontrol ettirin.", message: "Uzman, sikkelerin bir kısmının sahte olduğunu doğruladı. Adaletli kararınız halk arasında dilden dile dolaşıyor. (+250 Altın)", rewards: { gold: 250 } }, { text: "Tüccarın mallarına el koyun. Devleti aldatmaya çalışıyor.", message: "Tüccar haksız yere cezalandırıldı. Diğer tüccarlar beyliğinize gelmekten çekiniyor. (-100 Altın)", rewards: { gold: -100 } }, { text: "Kuyumcuyu sorgulayın. Gerekirse işkence yapılsın.", message: "İşkence acımasızca bulundu ve halkın bir kısmı beyliği terk etti. (-1 Nüfus)", rewards: { population: -1 } }, ] },
    { scenario: "Bir demirci, komşusu olan marangozun aletlerini çaldığını iddia ediyor. Marangozun atölyesinde benzer aletler bulundu. Marangoz ise bunların kendine ait olduğunu söylüyor.", options: [ { text: "Marangoz suçludur. Demirciye 200 altın tazminat ödesin.", message: "Adalet yerini buldu. Zanaatkarlar arasındaki güven arttı. (+200 Altın)", rewards: { gold: 200 } }, { text: "Aletlerin kime ait olduğunu kanıtlamak zor. Davayı reddedin.", message: "Kararsızlığınız halk arasında huzursuzluğa yol açtı. (-50 Altın)", rewards: { gold: -50 } }, { text: "İkisini de 1 gün zindana atın. Anlaşmaya varsınlar.", message: "Bu tuhaf karar halkı eğlendirdi ve beyliğe yeni bir aile katıldı. (+1 Nüfus)", rewards: { population: 1 } }, ] },
    { scenario: "İki çiftçi, tarlalarının arasındaki su kanalının kullanımı konusunda anlaşamıyor. Biri diğerinin tüm suyu kullandığını söylüyor.", options: [ { text: "Suyu gün aşırı kullanmalarına karar verin.", message: "Mantıklı bir çözüm! Tarımsal üretim arttı. (+150 Altın)", rewards: { gold: 150 } }, { text: "Kanalın kontrolünü devlete verin ve kullanım için vergi alın.", message: "Hazineye ek gelir sağlandı ama çiftçiler homurdanıyor. (+300 Altın, -1 Nüfus)", rewards: { gold: 300, population: -1 } }, { text: "Güçlü olan suyu alır. Anlaşmazlığı kendileri çözsün.", message: "Bu karar zayıf olanın ezilmesine yol açtı. Beyliğinizde adalet sorgulanıyor. (-100 Altın)", rewards: { gold: -100 } }, ] },
    { scenario: "Gezgin bir hekim, her derde deva olduğunu iddia ettiği bir iksir satıyor. Bazı köylüler şifa bulduğunu söylerken, bazıları dolandırıldığını iddia ediyor.", options: [ { text: "Hekimi beylikten kovun. Şarlatanlara yer yok.", message: "Halk, sağlığını düşündüğünüz için minnettar. (+1 Nüfus)", rewards: { population: 1 } }, { text: "İksiri saray alimlerine inceletin.", message: "Alimler, iksirin bazı bitkisel özler içerdiğini ama mucizevi olmadığını tespit etti. Bilimsel yaklaşımınız takdir topladı. (+200 Altın)", rewards: { gold: 200 } }, { text: "Satışlardan %20 vergi alın.", message: "Hazine doldu, ancak bazı köylüler bu şarlatanlıktan pay aldığınızı düşünüyor. (+400 Altın, -1 Nüfus)", rewards: { gold: 400, population: -1 } }, ] },
    { scenario: "Bir çömlekçi, rakibinin kendi özgün vazo tasarımını çaldığını iddia ediyor. Diğeri ise tasarımın geleneksel bir motif olduğunu söylüyor.", options: [ { text: "Bir zanaatkarlar heyeti kurup konuyu onlara danışın.", message: "Heyet, tasarımın özgün olduğuna karar verdi. Adil yaklaşımınız zanaatkarlar loncasını memnun etti. (+2 Nüfus)", rewards: { population: 2 } }, { text: "İki vazoyu da kırdırın. Anlaşmazlığın kaynağı yok olsun.", message: "Bu sert karar kimseyi memnun etmedi ve beylikteki sanat ortamına zarar verdi. (-150 Altın)", rewards: { gold: -150 } }, { text: "Tasarımın patentini ilk iddia edene verin.", message: "Hızlı kararınız takdir topladı ancak bazıları aceleci davrandığınızı düşünüyor. (+100 Altın)", rewards: { gold: 100 } }, ] },
    { scenario: "Bir köylü, komşusunun gürültücü horozunun her sabah kendisini çok erken uyandırdığından şikayetçi.", options: [ { text: "Horozun gün doğumundan önce ötmesini yasaklayın.", message: "Bu uygulanamaz karar halk arasında alay konusu oldu. (-50 Altın)", rewards: { gold: -50 } }, { text: "Şikayetçi köylüye bir çift kulak tıkacı hediye edin.", message: "Pragmatik çözümünüz herkesi güldürdü. Sorun çözüldü! (+1 Nüfus)", rewards: { population: 1 } }, { text: "Horoz sahibine para cezası verin.", message: "Horoz sahibi cezayı ödedi ama komşuluk ilişkileri bozuldu. (+100 Altın, -1 Nüfus)", rewards: { gold: 100, population: -1 } }, ] },
    { scenario: "Yaşlı bir kadın, pazar yerindeki bir halıcının kendisine 'uçan halı' vaadiyle normal bir halıyı fahiş fiyata sattığını iddia ediyor.", options: [ { text: "Halıcıyı dolandırıcılıktan cezalandırın, kadının parasını iade ettirin.", message: "Adaletiniz pazar yerinde güveni tazeledi. Halk sizi konuşuyor. (+200 Altın)", rewards: { gold: 200 } }, { text: "Kadının saf olduğunu ve ticaretin böyle olduğunu söyleyin.", message: "Halk, zayıfı korumadığınızı düşünerek hayal kırıklığına uğradı. (-1 Nüfus)", rewards: { population: -1 } }, { text: "Halıcıdan halıyı bir de size uçurmasını isteyin.", message: "Halıcı başarısız olunca alay konusu oldu. Dolandırıcı olduğu anlaşıldı. Zekice hamleniz takdir topladı. (+250 Altın)", rewards: { gold: 250 } }, ] },
    { scenario: "Bir grup genç, gece geç saatlerde sokaklarda gürültü yaparak halkı rahatsız ediyor. Aileleri ise 'gençlik işte' diyerek durumu geçiştiriyor.", options: [ { text: "Gençlere bir gece zindanda kalma cezası verin.", message: "Bu sert ders, beylikteki asayişi sağladı. (+1 Nüfus)", rewards: { population: 1 } }, { text: "Ailelerine para cezası kesin.", message: "Aileler çocuklarına daha fazla dikkat etmeye başladı. Hazineye ek gelir sağlandı. (+300 Altın)", rewards: { gold: 300 } }, { text: "Gençleri bir hafta boyunca şehrin temizliğinde çalıştırın.", message: "Gençler hem dersini aldı hem de beyliğe faydalı oldu. Bu bilgece karar çok beğenildi. (+2 Nüfus)", rewards: { population: 2 } }, ] },
    { scenario: "Bir çiftçi, tarlasında eski bir hazine (birkaç küp altın) buldu. Yasalar gereği bunun devlete ait olduğunu biliyor ama bir kısmını kendine saklamak istiyor.", options: [ { text: "Hazineye tamamen el koyun. Yasa ne diyorsa o.", message: "Yasaları uyguladınız ve hazine doldu, ancak bu durum gelecekte hazine bulanları bildirmekten caydırabilir. (+1000 Altın)", rewards: { gold: 1000 } }, { text: "Dürüstlüğü için çiftçiye altının %10'unu verin.", message: "Cömertliğiniz halkı dürüstlüğe teşvik etti. Hem hazine kazandı hem de halkın sadakati arttı. (+900 Altın, +1 Nüfus)", rewards: { gold: 900, population: 1 } }, { text: "Çiftçinin hazineyi bulduğunu görmezden gelin, ama vergisini iki katına çıkarın.", message: "Bu kurnazca hamle hazineye yavaş ama istikrarlı bir gelir sağladı, ancak çiftçi aldatıldığını hissediyor. (-1 Nüfus)", rewards: { population: -1 } }, ] },
    { scenario: "Bir seyyah, beyliğinizdeki handa eşyalarının çalındığını iddia ediyor. Hancı ise handa hırsızlık olmadığını savunuyor.", options: [ { text: "Hancıyı sorumlu tutun ve seyyahın zararını karşılatın.", message: "Bu karar, beyliğinize gelen tüccar ve seyyahlar için bir güvence oldu. Ticaret canlandı. (+250 Altın)", rewards: { gold: 250 } }, { text: "Seyyahın kanıtı olmadığını söyleyip davayı düşün.", message: "Adalet sisteminizin zayıf olduğu söylentileri yayıldı. (-100 Altın)", rewards: { gold: -100 } }, { text: "O gece handa kalan herkesi sorgulayın.", message: "Detaylı soruşturmanız sonuç vermese de adalet arayışınız halk tarafından takdir edildi. (+1 Nüfus)", rewards: { population: 1 } }, ] },
    { scenario: "Bir terzi, loncanın belirlediği fiyattan daha ucuza elbise dikerek haksız rekabet yaratmakla suçlanıyor.", options: [ { text: "Terziyi lonca kurallarına uyması için uyarın.", message: "Lonca düzeni korundu. Zanaatkarlar karardan memnun. (+150 Altın)", rewards: { gold: 150 } }, { text: "Ucuz diken terziyi destekleyin. Halk daha ucuza giyinsin.", message: "Halk bu kararı sevdi, ancak lonca ile aranız bozuldu. (-100 Altın, +2 Nüfus)", rewards: { gold: -100, population: 2 } }, { text: "Tüm terzilerin fiyatlarını düşürmesini emredin.", message: "Bu ani karar terzileri zor durumda bıraktı ve kumaş kalitesi düştü. (-200 Altın)", rewards: { gold: -200 } }, ] },
    { scenario: "İki aile, çocuklarının evliliği için anlaştıktan sonra 'başlık parası' konusunda anlaşmazlığa düştü.", options: [ { text: "Anlaşmazlığı çözmeleri için onlara bir gün süre verin.", message: "Aileler kendi aralarında anlaştı. Müdahale etmemeniz takdir topladı. (+1 Nüfus)", rewards: { population: 1 } }, { text: "Adil bir miktar belirleyip iki tarafı da buna uymaya zorlayın.", message: "Adil bir orta yol buldunuz. İki aile de size minnettar. (+150 Altın)", rewards: { gold: 150 } }, { text: "Başlık parası geleneğini tamamen yasaklayın.", message: "Bu radikal karar bazılarını memnun etse de, geleneklere bağlı olanlar tarafından tepkiyle karşılandı. (-1 Nüfus)", rewards: { population: -1 } }, ] },
    { scenario: "Şifalı otlar satan bir aktar, bir müşterisinin zehirlenmesiyle suçlanıyor. Aktar, yanlış bitkiyi kendisinin topladığını iddia ediyor.", options: [ { text: "Aktarın dükkanını kapatın. Halk sağlığı her şeyden önemlidir.", message: "Halkın sağlığını korudunuz. Güveniniz arttı. (+2 Nüfus)", rewards: { population: 2 } }, { text: "Zehirlenen kişinin tedavi masraflarını aktara ödetin.", message: "Adil bir ceza. Aktar dersini aldı. (+100 Altın)", rewards: { gold: 100 } }, { text: "Bunun bir kaza olduğuna karar verip olayı kapatın.", message: "Bazıları bu kararı ihmalkarlık olarak gördü. (-50 Altın)", rewards: { gold: -50 } }, ] },
    { scenario: "Bir grup köylü, yakındaki ormanda odun toplama haklarının kendilerine ait olduğunu, ancak beyliğin muhafızlarının buna izin vermediğini söylüyor.", options: [ { text: "Ormanın belirli bir bölümünü halkın kullanımına açın.", message: "Dengeli bir çözüm. Halk ısınma ihtiyacını karşıladı. (+1 Nüfus)", rewards: { population: 1 } }, { text: "Ormanlar devlete aittir. İzinsiz odun toplayan cezalandırılır deyin.", message: "Hazine için ormanları korudunuz ama halk soğuk bir kış geçirecek. (-1 Nüfus)", rewards: { population: -1 } }, { text: "Odun toplama hakkını vergiye bağlayın.", message: "Hem halkın ihtiyacı görüldü hem de hazineye yeni bir gelir kapısı açıldı. (+250 Altın)", rewards: { gold: 250 } }, ] },
    { scenario: "Padişahım, bir değirmenci, nehrin yukarısındaki çiftçinin tarlaları için çok fazla su kullandığını ve değirmeninin çalışmadığını şikayet ediyor. Çiftçi ise ekinlerinin suya ihtiyacı olduğunu söylüyor.", options: [ { text: "Çiftçiye suyu daha az kullanmasını emredin.", message: "Değirmenci memnun oldu ve un üretimi arttı. Ticaret canlandı. (+200 Altın)", rewards: { gold: 200 } }, { text: "Değirmenin yerini değiştirin. Tarlalar daha önemlidir.", message: "Çiftçiler size minnettar. Gıda üretimi güvende. (+1 Nüfus)", rewards: { population: 1 } }, { text: "Beylik bütçesinden yeni bir su kanalı inşa ettirin.", message: "Masraflı ama kalıcı bir çözüm. Herkes memnun ve beyliğe olan bağlılık arttı. (-150 Altın, +2 Nüfus)", rewards: { gold: -150, population: 2 } }, ] },
    { scenario: "Hünkarım, muhafızlar garip şiveli bir yabancıyı yakaladı. Yabancı, kalenin resmini çizerken görülmüş. Kendisi sanatçı olduğunu iddia etse de, muhafızlar casus olmasından şüpheleniyor.", options: [ { text: "Casus olabilir. Derhal zindana atın!", message: "Güvenliği her şeyden üstün tuttunuz, ancak halk bu sert kararı sorguluyor. (-1 Nüfus)", rewards: { population: -1 } }, { text: "Sanatçıya bir şans verin ama gizlice takip ettirin.", message: "Yabancının gerçekten de masum bir sanatçı olduğu anlaşıldı. Hoşgörünüz beyliğinizin itibarını artırdı. (+2 Nüfus)", rewards: { population: 2 } }, { text: "Beylikten sürgün edin. Riske girmeye gerek yok.", message: "Sorun hızlıca çözüldü, ancak ne bir şey kazandınız ne de kaybettiniz.", rewards: {} }, ] },
    { scenario: "Genç ve yetenekli bir demirci, demirciler loncasına kabul edilmediğinden şikayetçi. Lonca, onun 'geleneklere aykırı' çalıştığını söylüyor. Genç demirci ise loncanın rekabetten korktuğunu iddia ediyor.", options: [ { text: "Loncanın kararına saygı duyun. Gelenekler önemlidir.", message: "Lonca size minnettar ve zanaatkarlar arasındaki düzen korundu. (+150 Altın)", rewards: { gold: 150 } }, { text: "Genci destekleyin. Yenilik beyliği ileri taşır.", message: "Genç demirci yeni teknikleriyle üretimi artırdı, ancak lonca bu durumdan hoşnutsuz. (+300 Altın, -1 Nüfus)", rewards: { gold: 300, population: -1 } }, { text: "Demirciden en iyi eserini yapmasını ve lonca ustasıyla yarışmasını isteyin.", message: "Yarışma halkın büyük ilgisini çekti. Kim kazanırsa kazansın, zanaata olan ilgi arttı. (+1 Nüfus)", rewards: { population: 1 } }, ] },
    { scenario: "Bir mimar, yeni bir köprü inşa etmek için asırlık, ulu bir çınar ağacını kesmek istiyor. Ancak köy halkı ağacın kutsal olduğuna ve ruhları barındırdığına inanarak karşı çıkıyor.", options: [ { text: "Köprü halk için daha önemlidir. Ağacı kesin.", message: "Köprü inşa edildi ve ticaret yolları gelişti, ancak halkın bir kısmı manevi değerlerini kaybettiğini düşünüyor. (+400 Altın, -1 Nüfus)", rewards: { gold: 400, population: -1 } }, { text: "Halkın inancına saygı gösterin. Ağaç kalsın.", message: "Halk size minnettar. Beyliğe olan bağlılıkları arttı. (+2 Nüfus)", rewards: { population: 2 } }, { text: "Mimarın ağaca dokunmadan etrafından dolaşacak bir köprü tasarlamasını emredin.", message: "Bu dahiyane çözüm hem geleneği korudu hem de ihtiyacı giderdi. Bilgeliğiniz dilden dile dolaşıyor. (+200 Altın, +1 Nüfus)", rewards: { gold: 200, population: 1 } }, ] },
    // New, more complex disputes start here
    { scenario: "Padişahım, bir derici atölyesinden çıkan atıklarla nehri kirletiyor. Çiftçiler tarlalarını sulayamıyor. Derici ise zanaatının bu olduğunu ve beyliğe değerli ürünler sağladığını söylüyor.", options: [ { text: "Derici atölyesini şehir dışına taşımalı. Çiftçilerin geçimi daha önemli.", message: "Çiftçiler size minnettar. Tarım canlandı, halkın sağlığı korundu. (+2 Nüfus)", rewards: { population: 2 } }, { text: "Dericiye atıklarını temizlemesi için bir filtre sistemi kurmasını emredin.", message: "Adil bir çözüm. Derici maliyetten şikayetçi olsa da nehir temizlendi. Hazineden yardım istendi. (-200 Altın, +1 Nüfus)", rewards: { gold: -200, population: 1 } }, { text: "Dericinin işi değerli. Çiftçilere başka bir su kaynağı bulmalarını söyleyin.", message: "Sanayiyi desteklediniz ama çiftçiler ezildi. Bazı aileler toprağını terk etti. (+300 Altın, -2 Nüfus)", rewards: { gold: 300, population: -2 } }, ] },
    { scenario: "Hünkarım, saygın bir beyin oğlu, bir esnafın dükkanında kavga çıkarıp büyük hasara yol açmış. Esnaf adalet istiyor. Bey ise oğlunun hatası için para teklif ediyor.", options: [ { text: "Kanun herkes için eşittir. Beyin oğlu yargılanacak ve zararı karşılayacak.", message: "Halk, soylulara karşı bile adaleti sağladığınızı gördü. Size olan güvenleri arttı. (+3 Nüfus)", rewards: { population: 3 } }, { text: "Beyin teklifini kabul edin. Esnafın zararının iki katını ödesin, konu kapansın.", message: "Hazine doldu. Ancak halk, adaletin parayla satın alınabildiğini fısıldıyor. (+800 Altın, -1 Nüfus)", rewards: { gold: 800, population: -1 } }, { text: "Oğlanı babasına teslim edin, cezasını o versin. Devlet soyluların işine karışmamalı.", message: "Soylu ailelerle aranızı iyi tuttunuz. Ancak halk, adaletten yüz çevirdiğinizi düşünüyor. (-2 Nüfus)", rewards: { population: -2 } }, ] },
    { scenario: "Padişahım, komşu beylikte kıtlık baş göstermiş. Elçileri, dolu olan ambarlarımızdan tahıl satın almak istiyor. Bu tahıl bizim kış güvencemiz.", options: [ { text: "Tahılı yüksek bir fiyattan satın. Zor zamanlar, ticari fırsatlardır.", message: "Hazine rekor bir gelir elde etti. Ancak komşu beylik bu fırsatçılığı unutmayacak. (+1500 Altın)", rewards: { gold: 1500 } }, { text: "Tahılın bir kısmını hediye edin. İyi komşuluk ilişkileri değerlidir.", message: "Cömertliğiniz komşu beylikle kalıcı bir dostluk kurmanızı sağladı. Minnettarlıkla size hediyeler gönderdiler. (+250 Altın)", rewards: { gold: 250 } }, { text: "Reddedin. Önce kendi halkımızın güvenliğini düşünmeliyiz.", message: "Halkınız, ihtiyatlı davrandığınız için güvende hissediyor. Ancak komşu beylik size kin beslemeye başladı.", rewards: {} }, ] },
    { scenario: "Bir mucit, bir işçinin beş katı hızla kumaş dokuyan yeni bir tezgah icat etti. Dokumacılar loncası, bu 'şeytan icadının' zanaatlarını yok edeceğini söyleyerek yasaklanmasını istiyor.", options: [ { text: "Yeniliği destekleyin! Beylik bu tezgahlar sayesinde zenginleşecek.", message: "Üretim patladı ve ticaret gelirleri arttı. Ancak işsiz kalan dokumacılar arasında huzursuzluk var. (+500 Altın, -1 Nüfus)", rewards: { gold: 500, population: -1 } }, { text: "Loncanın talebini kabul edin. Geleneksel zanaatları korumalıyız.", message: "Dokumacılar rahat bir nefes aldı. Ancak beylik önemli bir teknolojik fırsatı kaçırdı. (+1 Nüfus)", rewards: { population: 1 } }, { text: "Bir geçiş süreci planlayın. Mucit, lonca üyelerine yeni tezgahları öğretmeli.", message: "Bu bilgece çözüm hem yeniliği getirdi hem de zanaatkarları korudu. Herkes memnun. (+200 Altın, +2 Nüfus)", rewards: { gold: 200, population: 2 } }, ] },
    { scenario: "Varlıklı bir çiftçi vefat etti ve iki oğlu mirası paylaşamıyor. Büyüğü, geleneklere göre her şeyin kendisine ait olduğunu söylüyor. Küçüğü ise babalarının 'eşit pay' dediğini iddia ediyor.", options: [ { text: "Geleneklere uyun. Miras büyük oğlundur.", message: "Geleneklere bağlı kaldınız. Aile büyükleri kararı destekledi ama küçük kardeş topraksız kaldı. (-1 Nüfus)", rewards: { population: -1 } }, { text: "Toprağı ikiye bölün. Adalet bunu gerektirir.", message: "Adil bir karar verdiniz. Ancak bölünen tarlaların verimi düştü. (-100 Altın, +1 Nüfus)", rewards: { gold: -100, population: 1 } }, { text: "Toprağı satıp parayı eşit paylaştırın.", message: "Pratik bir çözüm buldunuz. Hazine bu satıştan vergi aldı. (+250 Altın)", rewards: { gold: 250 } }, ] },
    { scenario: "Savaşta bacağını kaybetmiş yaşlı bir asker, ömür boyu maaş talep ediyor. Başkomutan ise 'herkese maaş bağlarsak hazinede para kalmaz' diyor.", options: [ { text: "Askerin fedakarlığı paha biçilmez. Ona cömert bir maaş bağlayın.", message: "Gazinin ve ailesinin hayır dualarını aldınız. Ordunun morali yükseldi. (+1 Nüfus)", rewards: { population: 1 } }, { text: "Ona bir defaya mahsus yüklü bir altın verin.", message: "Gaziye minnettarlığınızı gösterdiniz ama bu, uzun vadeli bir çözüm değil. (-300 Altın)", rewards: { gold: -300 } }, { text: "Başkomutan haklı. Devletin kaynakları sınırlı.", message: "Hazineyi korudunuz ama askerler, gazi olduklarında devletin onlara sahip çıkmayacağını gördü. Ordu morali bozuldu. (-1 Nüfus)", rewards: { population: -1 } }, ] },
    { scenario: "Farklı inançtan bir grup, kendi ibadethanelerini inşa etmek için izin istiyor. Halkın bir kısmı buna 'geleneklerimize aykırı' diyerek karşı çıkıyor.", options: [ { text: "İzin verin. Hoşgörü beyliğimizi güçlendirir.", message: "Bu karar beyliğinizin itibarını artırdı. Farklı yerlerden zanaatkarlar ve tüccarlar beyliğinize yerleşmeye başladı. (+2 Nüfus)", rewards: { population: 2 } }, { text: "Reddedin. Beyliğin birliğini ve düzenini korumalıyız.", message: "Halkın çoğunluğu karardan memnun oldu, birlik hissi arttı. Ancak azınlık grup küstürüldü. (-1 Nüfus)", rewards: { population: -1 } }, { text: "İzin verin, ama masrafları kendileri karşılamalı ve gözden uzak bir yerde inşa etmeliler.", message: "Orta yolu buldunuz. Kimseyi tam memnun etmese de büyük bir krizin önüne geçtiniz.", rewards: { gold: 50 } }, ] },
    { scenario: "Kıtlık söylentileri yüzünden zengin bir tüccarın deposunda buğday stokladığı ortaya çıktı. Halk, depolara el konulmasını istiyor. Tüccar ise 'serbest ticaret hakkım' diyor.", options: [ { text: "Depolara el koyun ve buğdayı halka dağıtın. Fırsatçılığa izin yok.", message: "Halk sizi bir kahraman gibi görüyor. Kıtlık paniği sona erdi. (+2 Nüfus)", rewards: { population: 2 } }, { text: "Tüccarı buğdayı sabit bir fiyattan satmaya zorlayın.", message: "Adil bir çözüm. Hem halkın ihtiyacı görüldü hem de ticaretin kuralları çiğnenmedi. (+1 Nüfus)", rewards: { population: 1 } }, { text: "Tüccarın mülkiyet hakkına dokunmayın. Piyasaya müdahale etmek tehlikelidir.", message: "Tüccarlar mülkiyet haklarını koruduğunuz için minnettar. Ancak halk açlık korkusuyla yaşıyor ve size öfkeli. (+300 Altın, -2 Nüfus)", rewards: { gold: 300, population: -2 } }, ] },
];


const VillagerDisputeGame: React.FC<{ day: number; onClose: (rewards: GameRewards) => void; }> = ({ day, onClose }) => {
    const [currentDispute, setCurrentDispute] = useState(disputes[0]);
    const [outcome, setOutcome] = useState<{ message: string; rewards: GameRewards } | null>(null);
    
    useEffect(() => {
        // Ensure a different dispute is chosen each day if possible. This logic prevents immediate repeats.
        // A more robust system for larger dispute pools might track used indices.
        const disputeIndex = day % disputes.length;
        setCurrentDispute(disputes[disputeIndex]);
    }, [day]);

    const handleDecision = (option: typeof currentDispute.options[0]) => {
        setOutcome({ message: option.message, rewards: option.rewards });
    };

    if (outcome) {
        return (
             <>
                <h2 className="text-3xl font-serif text-[#5a2d0c] mb-4">Kararınızın Sonucu</h2>
                <p className="text-lg text-[#5a2d0c] mb-4">{outcome.message}</p>
                <button onClick={() => onClose(outcome.rewards)} className="w-full mt-4 bg-[#8B4513] text-white py-2 px-4 rounded-lg hover:bg-[#A0522D] transition duration-200 font-bold">
                    Güne Başla
                </button>
            </>
        )
    }

    return (
        <>
            <h2 className="text-3xl font-serif text-[#5a2d0c] mb-4">Halkın Meseleleri</h2>
            <p className="text-lg text-[#5a2d0c] mb-4">{currentDispute.scenario}</p>
             <div className="space-y-3">
                {currentDispute.options.map((option, index) => (
                    <button key={index} onClick={() => handleDecision(option)} className="w-full text-left p-3 bg-[#D2B48C] rounded-lg hover:bg-[#C19A6B] transition duration-200">
                        {option.text}
                    </button>
                ))}
            </div>
        </>
    );
};


export const MiniGameModal: React.FC<MiniGameModalProps> = ({ day, gameType, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#F3EADF] p-8 rounded-lg shadow-2xl border-4 border-[#C19A6B] w-full max-w-2xl">
        {gameType === 'ottomanTrivia' && <OttomanTriviaGame day={day} onClose={onClose} />}
        {gameType === 'villagerDispute' && <VillagerDisputeGame day={day} onClose={onClose} />}
      </div>
    </div>
  );
};