import React, { useContext, useEffect, useMemo, useState } from 'react';
import { store } from '../../../App';
import AppWindow from '../../AppWindow/AppWindow';
import './VideoApp.scss';

const uzSafeChannelLink = 'https://www.youtube.com/@UzSafe_uz/videos';

const channelVideos = [
    { id: 'yUZwQfDjdwM', title: "Elektromexanik xonasi", duration: '6:52' },
    { id: 'qNpL3Ep6XqQ', title: 'Tarmoq liniyasi qismlari', duration: '3:20' },
    { id: 'lGoSpf8b9NU', title: 'Tarmoq liniyasi', duration: '6:41' },
    { id: 'gWVIWiihqjs', title: "Харакат хавфсизлиги бўйича умумий қоидалар", duration: '7:11' },
    { id: '7Fd8fJwtXfM', title: 'Хавфсиз харакатланиш', duration: '2:33' },
    { id: 'PuYR4cYdnPA', title: "Юк қабул килиб топширувчи", duration: '8:39' },
    { id: 'dmO8pAFvitI', title: 'Электромеханик тяговой', duration: '5:38' },
    { id: 'i5UmHOEVfhQ', title: 'Электровоз машиниси', duration: '8:40' },
    { id: 'AZWd62nptIw', title: 'СЦБ электромеханиги касби', duration: '5:58' },
    { id: 'M6b1QLQdKNQ', title: 'Станция навбатчиси', duration: '10:03' },
    { id: 'G6JNzsg6c5E', title: 'Сигналист', duration: '8:19' },
    { id: 'ZDXetvuOVu4', title: 'Саралаш тепалиги оператори', duration: '8:37' },
    { id: 'XgG-e-PQZ60', title: 'Поезд тузувчи', duration: '9:15' },
    { id: 'ze3Cpd3N4p4', title: 'Поездлар диспетчери', duration: '9:54' },
    { id: 'UVs9RDZFJs4', title: 'Поезд қабул қилувчи касби', duration: '8:49' },
    { id: '8hr7FHGLDA8', title: 'Кузнец касби', duration: '9:24' },
    { id: 't77cmIPZbgg', title: 'Kesishma navbatchisi', duration: '9:07' },
    { id: 'ZgntwybU7n8', title: "Katta yo'l ustasi", duration: '9:53' },
    { id: 'LyDbTQwwkxA', title: "Yo'l sozlovchi", duration: '9:08' },
    { id: 's4Xk-pMrQ1A', title: 'Диспетчер СЦБ', duration: '6:08' },
    { id: 'VbB3CnM6Fa4', title: 'Depo navbatchisi', duration: '9:06' },
    { id: 'oNk_ASmALtM', title: "Vagon ko'ruvchi", duration: '9:50' },
    { id: '9OgbbTNuxuk', title: 'Boshmoqchi', duration: '5:44' },
    { id: 'ZvwGx2rvdGQ', title: 'Бош кондуктор касби', duration: '9:01' },
    { id: 'QQlRuaKWagY', title: "Temir yo'l haqidagi faktlar", duration: '4:08' },
    { id: 'JlBl9niVPws', title: 'Xalqaro talablar', duration: '1:43' },
];

const VideoApp: React.FC = () => {
    const [state] = useContext(store);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(channelVideos[0]?.id ?? null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVideos = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return channelVideos;
        return channelVideos.filter((video) => video.title.toLowerCase().includes(query));
    }, [searchTerm]);

    useEffect(() => {
        if (!filteredVideos.length) {
            return;
        }

        const hasSelected = selectedVideoId && filteredVideos.some((video) => video.id === selectedVideoId);
        if (!hasSelected) {
            setSelectedVideoId(filteredVideos[0].id);
        }
    }, [filteredVideos, selectedVideoId]);

    const activeVideo = useMemo(() => {
        if (!selectedVideoId) {
            return channelVideos[0];
        }

        return channelVideos.find((video) => video.id === selectedVideoId) ?? channelVideos[0];
    }, [selectedVideoId]);

    if (state.videoWindow?.closed || !activeVideo) return null;

    return (
        <AppWindow
            appId="video"
            title="Video Materiallar"
            defaultWidth={1320}
            defaultHeight={780}
            defaultX={96}
            defaultY={48}
        >
            <div className="video-app">
                <aside className="video-sidebar">
                    <div className="channel-card">
                        <div className="channel-card__identity">
                            <div className="channel-card__avatar">UZ</div>
                            <div className="channel-card__meta">
                                <h3>UzSafe video kutubxonasi</h3>
                                <span>@UzSafe_uz · {channelVideos.length} ta video</span>
                            </div>
                        </div>
                        <div className="channel-card__actions">
                            <button
                                type="button"
                                className="channel-card__action"
                                onClick={() => window.open(uzSafeChannelLink, '_blank', 'noopener,noreferrer')}
                            >
                                Kanalga o'tish
                            </button>
                            <button
                                type="button"
                                className="channel-card__action channel-card__action--ghost"
                                onClick={() => window.open(`https://www.youtube.com/watch?v=${activeVideo.id}`, '_blank', 'noopener,noreferrer')}
                            >
                                Joriy videoni ochish
                            </button>
                        </div>
                    </div>

                    <div className="sidebar-search">
                        <input
                            type="text"
                            placeholder="Playlist ichidan qidirish..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>

                    <div className="sidebar-playlist">
                        {filteredVideos.length === 0 ? (
                            <div className="playlist-empty">
                                <span>Natija topilmadi. Boshqa so'z bilan urinib ko'ring.</span>
                            </div>
                        ) : (
                            filteredVideos.map((video) => {
                                const isActive = video.id === activeVideo.id;
                                const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;

                                return (
                                    <button
                                        type="button"
                                        key={video.id}
                                        className={`playlist-item ${isActive ? 'is-active' : ''}`}
                                        onClick={() => setSelectedVideoId(video.id)}
                                    >
                                        <div
                                            className="playlist-item__thumb"
                                            style={{ backgroundImage: `url(${thumbnailUrl})` }}
                                            aria-hidden
                                        >
                                            <span className="playlist-item__duration">{video.duration}</span>
                                        </div>
                                        <div className="playlist-item__details">
                                            <h4>{video.title}</h4>
                                            <span>UzSafe · YouTube</span>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </aside>

                <main className="video-main">
                    <div className="player-shell">
                        <iframe
                            key={activeVideo.id}
                            src={`https://www.youtube.com/embed/${activeVideo.id}?rel=0&modestbranding=1`}
                            title={activeVideo.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>

                    <div className="player-details">
                        <div className="player-header">
                            <div className="player-meta">
                                <h2>{activeVideo.title}</h2>
                                <span>UzSafe rasmiy kanali · {activeVideo.duration}</span>
                            </div>
                            <div className="player-actions">
                                <button
                                    type="button"
                                    className="player-action"
                                    onClick={() => window.open(`https://www.youtube.com/watch?v=${activeVideo.id}`, '_blank', 'noopener,noreferrer')}
                                >
                                    YouTube'da tomosha qilish
                                </button>
                                <button
                                    type="button"
                                    className="player-action player-action--ghost"
                                    onClick={() => navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${activeVideo.id}`)}
                                >
                                    Havolani nusxalash
                                </button>
                            </div>
                        </div>
                        <p>
                            UzSafe kanalidan to'g'ridan-to'g'ri olingan temir yo'l xavfsizligi va kasb malakasi bo'yicha video
                            materiallar. Playlistdan videoni tanlang va shu oynaning o'zida ko'ring.
                        </p>
                    </div>
                </main>
            </div>
        </AppWindow>
    );
};

export default VideoApp;
