import React, { useContext, useState } from 'react';
import { store } from '../../../App';
import AppWindow from '../../AppWindow/AppWindow';
import './VideoApp.scss';

const videos = [
    {
        id: 1,
        title: "Mehnat xavfsizligi asoslari",
        duration: "15:30",
        thumbnail: "🎬",
        category: "O'quv",
        views: 1250,
    },
    {
        id: 2,
        title: "Temir yo'lda xavfsizlik qoidalari",
        duration: "22:45",
        thumbnail: "🚂",
        category: "Xavfsizlik",
        views: 890,
    },
    {
        id: 3,
        title: "Birinchi yordam ko'rsatish",
        duration: "18:20",
        thumbnail: "🏥",
        category: "Tibbiy",
        views: 2100,
    },
    {
        id: 4,
        title: "Yong'in xavfsizligi",
        duration: "12:15",
        thumbnail: "🔥",
        category: "Xavfsizlik",
        views: 1560,
    },
    {
        id: 5,
        title: "Elektr xavfsizligi",
        duration: "20:00",
        thumbnail: "⚡",
        category: "Texnik",
        views: 980,
    },
    {
        id: 6,
        title: "Shaxsiy himoya vositalari",
        duration: "14:30",
        thumbnail: "🦺",
        category: "O'quv",
        views: 1340,
    },
];

const VideoApp: React.FC = () => {
    const [state] = useContext(store);
    const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

    if (state.videoWindow?.closed) return null;

    return (
        <AppWindow
            appId="video"
            title="Video Materiallar"
            defaultWidth={1000}
            defaultHeight={650}
            defaultX={100}
            defaultY={50}
        >
            <div className="video-app">
                <div className="video-sidebar">
                    <div className="sidebar-header">
                        <h3>Kategoriyalar</h3>
                    </div>
                    <nav className="sidebar-nav">
                        <button className="nav-item active">
                            <span className="icon">📁</span>
                            Barcha videolar
                        </button>
                        <button className="nav-item">
                            <span className="icon">📚</span>
                            O'quv
                        </button>
                        <button className="nav-item">
                            <span className="icon">🛡️</span>
                            Xavfsizlik
                        </button>
                        <button className="nav-item">
                            <span className="icon">🔧</span>
                            Texnik
                        </button>
                        <button className="nav-item">
                            <span className="icon">🏥</span>
                            Tibbiy
                        </button>
                    </nav>
                    <div className="sidebar-stats">
                        <div className="stat">
                            <span className="stat-value">{videos.length}</span>
                            <span className="stat-label">Video</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">4</span>
                            <span className="stat-label">Kategoriya</span>
                        </div>
                    </div>
                </div>

                <div className="video-main">
                    {selectedVideo ? (
                        <div className="video-player">
                            <div className="player-header">
                                <button className="back-btn" onClick={() => setSelectedVideo(null)}>
                                    ← Orqaga
                                </button>
                            </div>
                            <div className="player-container">
                                <div className="player-placeholder">
                                    <span className="play-icon">▶</span>
                                    <p>Video player</p>
                                </div>
                            </div>
                            <div className="player-info">
                                <h2>{videos.find(v => v.id === selectedVideo)?.title}</h2>
                                <p>{videos.find(v => v.id === selectedVideo)?.views} ko'rishlar</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="video-toolbar">
                                <div className="search-box">
                                    <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                    <input type="text" placeholder="Videolarni qidirish..." />
                                </div>
                            </div>

                            <div className="video-grid">
                                {videos.map((video) => (
                                    <div
                                        key={video.id}
                                        className="video-card"
                                        onClick={() => setSelectedVideo(video.id)}
                                    >
                                        <div className="video-thumbnail">
                                            <span className="thumbnail-icon">{video.thumbnail}</span>
                                            <div className="play-overlay">
                                                <span>▶</span>
                                            </div>
                                            <span className="duration">{video.duration}</span>
                                        </div>
                                        <div className="video-info">
                                            <h4>{video.title}</h4>
                                            <div className="video-meta">
                                                <span className="category">{video.category}</span>
                                                <span className="views">{video.views} ko'rishlar</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AppWindow>
    );
};

export default VideoApp;
