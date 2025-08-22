import React, { useState, useEffect, useRef } from 'react';

// --- Sample Data ---
// In a real application, this would come from an API and a database.
const sampleNewsData = [
    // సినిమా with Video
    {
        id: 11,
        category: 'సినిమా',
        headline: '‘కల్కి 2898 ఏడీ’.. యాక్షన్‌ ట్రైలర్‌ చూశారా?',
        body: 'ప్రభాస్‌ కథానాయకుడిగా నాగ్‌ అశ్విన్‌ దర్శకత్వంలో తెరకెక్కిన సైన్స్‌ ఫిక్షన్‌ యాక్షన్‌ థ్రిల్లర్‌ ‘కల్కి 2898 ఏడీ’. జూన్‌ 27న ప్రేక్షకుల ముందుకు రానుంది. ఈ నేపథ్యంలో చిత్ర బృందం యాక్షన్‌ ట్రైలర్‌ను విడుదల చేసింది.',
        imageUrl: 'https://img.youtube.com/vi/c2-aYV4u2pA/maxresdefault.jpg',
        videoId: 'y1-w1kUGuz8', // YouTube Video ID
        author: {
            name: 'ఈనాడు',
            imageUrl: 'https://placehold.co/100x100/fecdd3/881337?text=Eenadu',
        },
        date: '2025-08-22',
        sourceUrl: 'https://www.youtube.com/watch?v=c2-aYV4u2pA'
    },
    // జాతీయం
    {
        id: 1,
        category: 'జాతీయం',
        headline: 'దిల్లీ మద్యం కేసు.. కేజ్రీవాల్‌కు మరోసారి నిరాశ',
        body: 'దిల్లీ మద్యం విధానానికి సంబంధించిన మనీలాండరింగ్‌ కేసులో ముఖ్యమంత్రి అరవింద్‌ కేజ్రీవాల్‌కు మరోసారి నిరాశ ఎదురైంది. ఆయన దాఖలు చేసుకున్న మధ్యంతర బెయిల్‌ పిటిషన్‌ను రౌస్‌ అవెన్యూ ప్రత్యేక కోర్టు కొట్టివేసింది.',
        imageUrl: 'https://www.hindustantimes.com/ht-img/img/2024/06/01/550x309/ANI-20240531343-0_1717236444166_1717236460578.jpg',
        author: {
            name: 'ఈనాడు',
            imageUrl: 'https://placehold.co/100x100/bfdbfe/1e3a8a?text=Eenadu',
        },
        date: '2025-08-22',
        sourceUrl: 'https://www.eenadu.net/telugu-news/delhi/arvind-kejriwal-interim-bail-petition-dismissed/121012355'
    },
     
{
        id: 2,
        category: 'అంతర్జాతీయం',
        headline: 'ఉక్రెయిన్ యుద్ధం: రష్యా మరో పెద్ద నగరాన్ని స్వాధీనం చేసుకుంది',
        body: 'ఉక్రెయిన్ తూర్పు ప్రాంతంలోని వాగ్నెర్ బ్యాటలియన్లతో కూడిన రష్యన్ సైన్యం పోపాస్నా నగరాన్ని పూర్తిగా స్వాధీనం చేసుకుంది. ఈ విషయాన్ని రష్యన్ రక్షణ మంత్రిత్వ శాఖ అధికారికంగా ప్రకటించింది.',
        imageUrl: 'https://www.aljazeera.com/wp-content/uploads/2025/05/2025-05-09T160340Z_543039618_RC26EEAXUV6Z_RTRMADP_3_WW2-ANNIVERSARY-DONETSK-REGION-1746857540.jpg?resize=770%2C513&quality=80',
        author: {
            name: 'ఈనాడు',
            imageUrl: 'https://placehold.co/100x100/f5f3ff/7e22c7?text=Eenadu',
        },
        date: '2025-08-21',
        sourceUrl: 'https://www.eenadu.net/international/ukraine-war-russia-captures-popasna-eastern-donetsk/120988765'
    },

    // క్రీడలు
    {
        id: 3,
        category: 'క్రీడలు',
        headline: 'ఐపీఎల్ 2025: సన్రైజర్స్ హైదరాబాద్ ఫైనల్‌కు చేరుకుంది',
        body: 'ఐపీఎల్ 2025 సీజన్‌లో భాగంగా జరిగిన క్వాలిఫయర్ 2 మ్యాచ్‌లో సన్రైజర్స్ హైదరాబాద్, రాయల్ ఛాలెంజర్స్ బెంగళూరుపై 7 వికెట్ల తేడాతో ఘన విజయం సాధించి ఫైనల్‌కు చేరుకుంది.',
        imageUrl: 'https://media.crictracker.com/media/attachments/1683985707333_Sunrisers-Hyderabad-vs-Lucknow-Super-Giants.jpeg',
        author: {
            name: 'ఈనాడు',
            imageUrl: 'https://placehold.co/100x100/a7f3d0/047857?text=Eenadu',
        },
        date: '2025-08-20',
        sourceUrl: 'https://www.eenadu.net/sports/ipl-2025-hyderabad-reaches-final-after-beating-rcb/120977210'
    },

    // విద్య
    {
        id: 4,
        category: 'విద్య',
        headline: 'NEET-UG 2025: ఉజ్జాయిన్ ల్యాబ్ లీకేజీ కేసులో మరో 6 మంది అరెస్ట్',
        body: 'NEET-UG 2025 పేపర్ లీకేజీ కేసులో ఉజ్జాయిన్ ల్యాబ్ సంబంధిత మరో 6 మందిని సీబీఐ అరెస్ట్ చేసింది. దీంతో ఇప్పటివరకు అరెస్ట్ అయిన వారి సంఖ్య 14కి చేరింది.',
        imageUrl: 'https://medicaldialogues.in/h-upload/2024/12/02/263198-neet-ug-2025.jpg',
        author: {
            name: 'ఈనాడు',
            imageUrl: 'https://placehold.co/100x100/dbeafe/1e40af?text=Eenadu',
        },
        date: '2025-08-19',
        sourceUrl: 'https://www.eenadu.net/education/neet-ug-2025-paper-leak-updates-six-more-arrested-in-ujjain-lab-case/120965432'
    },

    // సినిమా
    {
        id: 5,
        category: 'సినిమా',
        headline: 'ఎన్టీఆర్ బయోపిక్: ప్రశాంత్ నీల్ దర్శకత్వంలో భారీ ప్రాజెక్ట్',
        body: 'మెగా పవర్ స్టార్ ఎన్టీఆర్ జీవితంపై ప్రశాంత్ నీల్ దర్శకత్వంలో భారీ బయోపిక్ తెరకెక్కనుంది. యష్ స్టైల్ లో ఈ చిత్రం తెరకెక్కనుండటంతో అంచనాలు భారీగా పెరిగాయి.',
        imageUrl: 'https://content.tupaki.com/en/feeds/2024/11/09/582975-neel.webp',
        author: {
            name: 'ఈనాడు',
            imageUrl: 'https://placehold.co/100x100/fca5a5/991b1b?text=Eenadu',
        },
        date: '2025-08-18',
        sourceUrl: 'https://www.eenadu.net/telugu-cinema/ntr-biopic-prashanth-neel-directs-yash-style-film/120954321'
    },

    // జాతీయం
    {
        id: 6,
        category: 'జాతీయం',
        headline: 'మోడీ ప్రభుత్వం కొత్త విద్యా విధానంపై సుప్రీంకోర్ట్ కీలక వ్యాఖ్యలు',
        body: 'కేంద్ర ప్రభుత్వం అమలు చేస్తున్న న్యూ ఎడ్యుకేషన్ పాలసీ (NEP 2020)పై సుప్రీంకోర్ట్ కీలక వ్యాఖ్యలు చేసింది. విద్యారంగంలో సమగ్ర మార్పులకు ఇది బలమైన మైలురాయి అని పేర్కొంది.',
        imageUrl: 'https://www.newsband.in/uploads/blog_main_img/7f3e0f318aa56630620c7f7dd1be6502_1.jpg',
        author: {
            name: 'ఈనాడు',
            imageUrl: 'https://placehold.co/100x100/fed7d7/cc0000?text=Eenadu',
        },
        date: '2025-08-17',
        sourceUrl: 'https://www.eenadu.net/national/supreme-court-on-new-education-policy-nep-2020/120943210'
    },

    // క్రీడలు with Video
    {
        id: 7,
        category: 'క్రీడలు',
        headline: 'సచిన్ రెకార్డు దిగ్విజయ్ సాధించాడు!',
        body: 'భారత యువ క్రికెటర్ దిగ్విజయ్ సాధ్ అంతర్జాతీయ టెస్టుల్లో సచిన్ టెండూల్కర్ రికార్డును అధిగమించి 200 వికెట్లు సాధించాడు. ఇంగ్లాండ్ తో జరిగిన రెండో టెస్ట్ లో చివరి వికెట్ ను పడగొట్టి చరిత్ర సృష్టించాడు.',
        imageUrl: 'https://img.etimg.com/thumb/width-420,height-315,imgsize-41032,resizemode-75,msid-120575285/news/sports/sachin-tendulkar-at-52-a-look-back-at-the-master-blasters-memorable-world-cup-knocks/sachin-tendulkar.jpg',
        videoId: 'XyX5R4XZz9U',
        author: {
            name: 'ఈనాడు',
            imageUrl: 'https://placehold.co/100x100/a78bfa/4c1d95?text=Eenadu',
        },
        date: '2025-08-16',
        sourceUrl: 'https://www.youtube.com/watch?v=XyX5R4XZz9U'
    },

    // అంతర్జాతీయం
    {
        id: 8,
        category: 'అంతర్జాతీయం',
        headline: 'అమెరికా అధ్యక్ష ఎన్నికలు: ట్రంప్, హరిస్ మధ్య పోటీ మరింత ఉద్రిక్తం',
        body: '2024 అమెరికా అధ్యక్ష ఎన్నికల సమయంలో డొనాల్డ్ ట్రంప్ మరియు కమలా హరిస్ మధ్య పోటీ మరింత ఉద్రిక్తంగా మారింది. ఇటీవలి డిబేట్ తర్వాత రెండు పార్టీల మద్దతుదారుల మధ్య వాగ్వాదాలు చెలరేగాయి.',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnulx0MJ7jVSesqehew7dn1WZy7WO_QEEZPg&s',
        author: {
            name: 'ఈనాడు',
            imageUrl: 'https://placehold.co/100x100/fed7aa/9a3412?text=Eenadu',
        },
        date: '2025-08-15',
        sourceUrl: 'https://www.eenadu.net/international/us-election-2024-trump-vs-harris-tensions-rise-after-debate/120932109'
    }



];

// --- SVG Icons ---
const HomeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> );
const ShareIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg> );
const BookmarkIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg> );
const PlusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> );


// --- Components ---

const Header = ({ categories, selectedCategory, onSelectCategory, onShowForm }) => {
    return (
        <header className="bg-white text-gray-800 shadow-md absolute top-0 left-0 right-0 z-30 h-14 flex items-center">
            <nav className="container mx-auto flex items-center justify-between px-2 overflow-x-auto">
                <div className="flex items-center">
                    <button onClick={() => onSelectCategory('All')} className="p-2 text-blue-600 hover:bg-gray-100 rounded-md transition-colors" aria-label="Home"><HomeIcon /></button>
                    <div className="flex items-center space-x-1 ml-1">
                        {categories.map(category => (
                            <button key={category} onClick={() => onSelectCategory(category)} className={`px-3 py-1.5 text-sm font-bold whitespace-nowrap rounded-full transition-colors ${selectedCategory === category ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>{category}</button>
                        ))}
                    </div>
                </div>
                <button onClick={onShowForm} className="p-2 text-blue-600 hover:bg-gray-100 rounded-full transition-colors" aria-label="Create News"><PlusIcon /></button>
            </nav>
        </header>
    );
};

const YouTubePlayer = ({ videoId }) => (
    <div className="w-full h-full bg-black"><iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&loop=1&playlist=${videoId}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Embedded youtube" className="w-full h-full"/></div>
);

const NewsShort = ({ article, isActive }) => {
    if (!article) return null;
    return (
        <div className={`absolute inset-0 w-full h-full bg-white transition-transform duration-500 ease-in-out flex flex-col ${isActive ? 'translate-y-0 z-10' : 'translate-y-full z-0'}`}>
            <div className="relative h-2/5 w-full">
                {article.videoId ? <YouTubePlayer videoId={article.videoId} /> : <img src={article.imageUrl} alt={article.headline} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/800x600/ccc/ffffff?text=Image+Error'; }}/>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>
            <div className="flex-grow p-4 flex flex-col">
                <div className="flex justify-between items-center mb-3"><div className="flex items-center"><img src="https://www.eenadu.net/images/logo.png" alt="Eenadu" className="h-6 mr-2"/></div><div className="flex items-center space-x-4 text-gray-500"><BookmarkIcon /><ShareIcon /></div></div>
                <h2 className="text-xl font-bold mb-2 leading-tight text-gray-900" style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>{article.headline}</h2>
                <p className="text-base leading-relaxed text-gray-700 flex-grow" style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>{article.body}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(article.date).toLocaleDateString('te-IN', { month: 'long', day: 'numeric' })} / {article.author.name}</p>
            </div>
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="bg-gray-100 text-center p-4 text-sm font-bold text-blue-600 hover:bg-gray-200 transition-colors">పూర్తి వార్త కోసం ఇక్కడ నొక్కండి</a>
        </div>
    );
};

const NewsForm = ({ onAddNews, onCancel }) => {
    const [formData, setFormData] = useState({
        category: 'సినిమా',
        headline: '',
        body: '',
        imageUrl: '',
        videoId: '',
        authorName: 'ఈనాడు',
        sourceUrl: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newArticle = {
            id: Date.now(),
            category: formData.category,
            headline: formData.headline,
            body: formData.body,
            imageUrl: formData.imageUrl || `https://placehold.co/800x600/eee/333?text=${formData.headline}`,
            videoId: formData.videoId,
            author: {
                name: formData.authorName,
                imageUrl: 'https://placehold.co/100x100/ccc/ffffff?text=Author',
            },
            date: new Date().toISOString().split('T')[0],
            sourceUrl: formData.sourceUrl,
        };
        onAddNews(newArticle);
    };

    const categories = ['ఆంధ్రప్రదేశ్', 'తెలంగాణ', 'జాతీయం', 'సినిమా', 'క్రీడలు'];

    return (
        <div className="absolute inset-0 bg-gray-100 z-40 p-4 pt-16 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-center" style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>కొత్త వార్తను సృష్టించండి</h2>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
                <div><label htmlFor="category" className="block text-gray-700 font-bold mb-1">వర్గం</label><select name="category" id="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-md">{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                <div><label htmlFor="headline" className="block text-gray-700 font-bold mb-1">శీర్షిక</label><input type="text" name="headline" id="headline" value={formData.headline} onChange={handleChange} className="w-full p-2 border rounded-md" required /></div>
                <div><label htmlFor="body" className="block text-gray-700 font-bold mb-1">వార్త</label><textarea name="body" id="body" value={formData.body} onChange={handleChange} rows="4" className="w-full p-2 border rounded-md" required></textarea></div>
                <div><label htmlFor="imageUrl" className="block text-gray-700 font-bold mb-1">చిత్రం URL</label><input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full p-2 border rounded-md" /></div>
                <div><label htmlFor="videoId" className="block text-gray-700 font-bold mb-1">YouTube వీడియో ID (ఐచ్ఛికం)</label><input type="text" name="videoId" id="videoId" value={formData.videoId} onChange={handleChange} className="w-full p-2 border rounded-md" /></div>
                <div><label htmlFor="sourceUrl" className="block text-gray-700 font-bold mb-1">మూలం URL</label><input type="url" name="sourceUrl" id="sourceUrl" value={formData.sourceUrl} onChange={handleChange} className="w-full p-2 border rounded-md" required /></div>
                <div><label htmlFor="authorName" className="block text-gray-700 font-bold mb-1">రచయిత పేరు</label><input type="text" name="authorName" id="authorName" value={formData.authorName} onChange={handleChange} className="w-full p-2 border rounded-md" required /></div>
                <div className="flex justify-end space-x-4 pt-2"><button type="button" onClick={onCancel} className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600">రద్దు చేయండి</button><button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">జోడించండి</button></div>
            </form>
        </div>
    );
};


const NewsFeed = ({ newsItems, selectedCategory }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const mainRef = useRef(null);
    const touchStartY = useRef(0);
    const touchEndY = useRef(0);

    const filteredNews = selectedCategory === 'All' 
        ? newsItems 
        : newsItems.filter(item => item.category === selectedCategory);
    
    useEffect(() => {
        const firstVideoIndex = filteredNews.findIndex(item => item.videoId);
        setCurrentIndex(firstVideoIndex >= 0 ? firstVideoIndex : 0);
    }, [selectedCategory, newsItems]);

    useEffect(() => {
        const mainEl = mainRef.current;
        if (!mainEl) return;
        const handleTouchStart = (e) => { if (e.target.tagName === 'IFRAME') return; touchStartY.current = e.targetTouches[0].clientY; };
        const handleTouchMove = (e) => { e.preventDefault(); touchEndY.current = e.targetTouches[0].clientY; };
        const handleTouchEnd = () => {
            if (touchStartY.current === 0) return;
            const deltaY = touchStartY.current - touchEndY.current;
            if (deltaY > 75) { setCurrentIndex(prev => (prev + 1) % filteredNews.length); } 
            else if (deltaY < -75) { setCurrentIndex(prev => (prev - 1 + filteredNews.length) % filteredNews.length); }
            touchStartY.current = 0; touchEndY.current = 0;
        };
        mainEl.addEventListener('touchstart', handleTouchStart, { passive: true });
        mainEl.addEventListener('touchmove', handleTouchMove, { passive: false });
        mainEl.addEventListener('touchend', handleTouchEnd, { passive: true });
        return () => {
            mainEl.removeEventListener('touchstart', handleTouchStart);
            mainEl.removeEventListener('touchmove', handleTouchMove);
            mainEl.removeEventListener('touchend', handleTouchEnd);
        };
    }, [filteredNews]);

    return (
        <main ref={mainRef} className="h-full w-full relative pt-14">
            {filteredNews.length > 0 ? (
                filteredNews.map((article, index) => <NewsShort key={article.id} article={article} isActive={index === currentIndex} />)
            ) : (
                <div className="text-gray-800 text-center p-10 bg-white m-auto flex flex-col items-center justify-center h-full">
                    <h2 className="text-2xl font-bold" style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>ఈ వర్గంలో కథనాలు లేవు.</h2>
                    <p className="mt-2" style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>దయచేసి మరొక వర్గాన్ని ఎంచుకోండి.</p>
                </div>
            )}
        </main>
    );
};

export default function NewsPage() {
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }, []);

    const categories = ['ఆంధ్రప్రదేశ్', 'తెలంగాణ', 'జాతీయం', 'సినిమా', 'క్రీడలు'];
    const [view, setView] = useState('feed'); // 'feed' or 'form'
    const [newsItems, setNewsItems] = useState(sampleNewsData);
    const [selectedCategory, setSelectedCategory] = useState('సినిమా');

    const handleAddNews = (newArticle) => {
        setNewsItems(prevItems => [newArticle, ...prevItems]);
        setSelectedCategory(newArticle.category);
        setView('feed');
    };

    return (
        <div className="bg-gray-200 h-screen w-screen overflow-hidden relative">
            <Header 
                categories={categories} 
                selectedCategory={selectedCategory}
                onSelectCategory={(category) => { setSelectedCategory(category); setView('feed'); }}
                onShowForm={() => setView('form')}
            />
            {view === 'form' ? (
                <NewsForm onAddNews={handleAddNews} onCancel={() => setView('feed')} />
            ) : (
                <NewsFeed newsItems={newsItems} selectedCategory={selectedCategory} />
            )}
        </div>
    );
}


