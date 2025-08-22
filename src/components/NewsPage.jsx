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
        imageUrl: 'https://media.assettype.com/eenadu%2F2024-06%2F05d4369a-a044-49f9-a1f2-70231a49f7c0%2FArvind_Kejriwal__2_.jpg?w=1600&auto=format%2Ccompress&fit=max',
        author: {
            name: 'ఈనాడు',
            imageUrl: 'https://placehold.co/100x100/bfdbfe/1e3a8a?text=Eenadu',
        },
        date: '2025-08-22',
        sourceUrl: 'https://www.eenadu.net/telugu-news/delhi/arvind-kejriwal-interim-bail-petition-dismissed/121012355'
    },
     // ... other news items from previous steps
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

