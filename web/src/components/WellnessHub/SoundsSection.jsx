import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaSpinner,
  FaStar,
  FaTree,
  FaYinYang,
  FaCloudRain,
  FaWater,
  FaLeaf,
  FaSpaceShuttle,
  FaBell,
  FaGuitar,
  FaKeyboard,
  FaExpand,
  FaCompress,
  FaHeart,
} from 'react-icons/fa';
import { LuBrainCircuit } from 'react-icons/lu';
import { searchSounds, getProxiedAudioUrl } from '../../services/freesoundService';
import SoundFilters from './SoundFilters';
import { debounce } from 'lodash';
import getBackgroundStyle from '../../utils/getBackgroundStyle';
import KeyboardShortcuts from './KeyboardShortcuts';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
} from '../../services/favoriteSoundsService';
import { toast } from 'react-toastify';
import NoMusicIcon from '../../assets/no-music.svg';
import AccessibleDropdown from '../AccessibleDropdown/AccessibleDropdown';

const SoundsSection = ({ isDarkMode }) => {
  const { currentSound, setCurrentSound, isPlaying, setIsPlaying, volume, setVolume, audioRef } =
    useAudioPlayer();
  const [sounds, setSounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('nature');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [, setHasMore] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [prevVolume, setPrevVolume] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const userId = localStorage.getItem('userId');

  // Wrap categories in useMemo to prevent it from being recreated on every render
  const categories = useMemo(
    () => ({
      nature: { label: 'Forest & Nature', icon: <FaTree /> },
      meditation: { label: 'Tibetan Bowls', icon: <FaYinYang /> },
      rain: { label: 'Gentle Rain', icon: <FaCloudRain /> },
      ocean: { label: 'Ocean Waves', icon: <FaWater /> },
      forest: { label: 'Forest Ambience', icon: <FaLeaf /> },
      space: { label: 'Space Ambience', icon: <FaSpaceShuttle /> },
      bowls: { label: 'Crystal Bowls', icon: <FaBell /> },
      binaural: { label: 'Binaural Beats', icon: <LuBrainCircuit /> },
      flute: { label: 'Native Flute', icon: <FaGuitar /> },
    }),
    []
  ); // Empty dependency array means this will only be created once

  const loadFavorites = useCallback(async () => {
    try {
      const userFavorites = await getFavorites(userId);
      setFavorites(userFavorites);
      if (showFavoritesOnly) {
        const favoriteIds = userFavorites.map((fav) => fav.sound_id);
        setSounds((prevSounds) =>
          prevSounds.filter((sound) => favoriteIds.includes(sound.id.toString()))
        );
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('Failed to load favorites');
    }
  }, [userId, showFavoritesOnly]);

  useEffect(() => {
    if (userId) {
      loadFavorites();
    }
  }, [userId, loadFavorites]);

  const fetchSounds = useCallback(
    async (resetPage = false) => {
      if (resetPage) setPage(1);
      setLoading(true);
      try {
        const data = await searchSounds(activeCategory, resetPage ? 1 : page, filters);
        setSounds((prev) => (resetPage ? data.results : [...prev, ...data.results]));
        setHasMore(data.next !== null);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    },
    [activeCategory, page, filters]
  );

  // Apply debounce to fetchSounds
  const debouncedFetchSounds = useCallback(
    debounce((resetPage) => {
      fetchSounds(resetPage);
    }, 500),
    [fetchSounds]
  );

  useEffect(() => {
    if (showFavoritesOnly) {
      const favoriteIds = favorites.map((fav) => fav.sound_id);
      setSounds((prev) => prev.filter((sound) => favoriteIds.includes(sound.id.toString())));
    } else {
      debouncedFetchSounds(true);
    }
  }, [showFavoritesOnly, favorites, debouncedFetchSounds]);

  useEffect(() => {
    debouncedFetchSounds(true);
  }, [activeCategory, filters, debouncedFetchSounds]);

  const handleToggleFavorite = async (sound) => {
    if (!userId) {
      toast.error('Please login to favorite sounds');
      return;
    }

    try {
      const isFavorite = favorites.some((fav) => fav.sound_id === sound.id.toString());

      if (isFavorite) {
        await removeFromFavorites(userId, sound.id);
        setFavorites((prev) => prev.filter((fav) => fav.sound_id !== sound.id.toString()));
        toast.success('Removed from favorites');
      } else {
        const result = await addToFavorites(userId, sound);
        if (result.error === 'Already favorited') {
          // If already favorited, just update the UI
          setFavorites((prev) => [...prev, result.favorite]);
          toast.info('Sound is already in favorites');
        } else {
          setFavorites((prev) => [...prev, result]);
          toast.success('Added to favorites');
        }
      }
    } catch (error) {
      toast.error('Error updating favorites');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case 'arrowleft': {
          const categoryKeys = Object.keys(categories);
          const currentIndex = categoryKeys.indexOf(activeCategory);
          if (currentIndex > 0) {
            setActiveCategory(categoryKeys[currentIndex - 1]);
          }
          break;
        }
        case 'arrowright': {
          const categoryKeys = Object.keys(categories);
          const nextIndex = categoryKeys.indexOf(activeCategory) + 1;
          if (nextIndex < categoryKeys.length) {
            setActiveCategory(categoryKeys[nextIndex]);
          }
          break;
        }
        case 'arrowup':
          setVolume((prev) => Math.min(1, prev + 0.1));
          break;
        case 'arrowdown':
          setVolume((prev) => Math.max(0, prev - 0.1));
          break;
        case 'm':
          if (volume > 0) {
            setPrevVolume(volume);
            setVolume(0);
          } else {
            setVolume(prevVolume || 0.5);
          }
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'k':
          setShowShortcuts((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeCategory, volume, isPlaying, setIsPlaying, setVolume, prevVolume, categories]);

  const handleSoundPlay = async (sound) => {
    if (audioRef.current) {
      if (currentSound === sound.name) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        try {
          const proxiedUrl = await getProxiedAudioUrl(sound.previews['preview-hq-mp3']);
          audioRef.current.src = proxiedUrl;
          audioRef.current.load();
          await audioRef.current.play();
          setCurrentSound(sound.name);
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading sounds...</p>
        </div>
      );
    }

    const filteredSounds = sounds.filter(
      (sound) => !showFavoritesOnly || favorites.some((fav) => fav.sound_id === sound.id.toString())
    );

    if (filteredSounds.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <img src={NoMusicIcon} alt="No Music Icon" className="w-64 h-64" />
          <h3
            className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
          >
            {showFavoritesOnly ? 'No favorite sounds yet' : 'No sounds found for this category'}
          </h3>
          <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {showFavoritesOnly
              ? 'Start adding some sounds to your favorites!'
              : 'Try adjusting your filters or try another category'}
          </p>
        </div>
      );
    }

    return (
      <div className="sounds-grid">
        <AnimatePresence>
          {filteredSounds.map((sound) => (
            <motion.div
              key={sound.id}
              className={`sound-card ${currentSound === sound.name ? 'playing' : ''}`}
              style={getBackgroundStyle(sound, activeCategory)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="sound-overlay" />
              <div className="sound-content">
                <div className="sound-rating">
                  <FaStar className="text-yellow-400" />
                  <span>{sound.avg_rating?.toFixed(1) || '4.0'}</span>
                </div>
                <h3 className="sound-title">{sound.name}</h3>
                <p className="sound-duration">{Math.floor(sound.duration)}s</p>
                <div className="sound-controls">
                  <AccessibleDropdown
                    isOpen={currentSound === sound.name && isPlaying}
                    onToggle={() => handleSoundPlay(sound)}
                    ariaLabel={
                      currentSound === sound.name && isPlaying ? 'Pause sound' : 'Play sound'
                    }
                    className="play-button"
                  >
                    {currentSound === sound.name && isPlaying ? <FaPause /> : <FaPlay />}
                  </AccessibleDropdown>

                  <AccessibleDropdown
                    isOpen={favorites.some((fav) => fav.sound_id === sound.id.toString())}
                    onToggle={() => handleToggleFavorite(sound)}
                    ariaLabel={
                      favorites.some((fav) => fav.sound_id === sound.id.toString())
                        ? 'Remove from favorites'
                        : 'Add to favorites'
                    }
                    className={`favorite-button ${
                      favorites.some((fav) => fav.sound_id === sound.id.toString())
                        ? 'active bg-red-500 border-red-500'
                        : ''
                    }`}
                  >
                    <FaHeart
                      className={
                        favorites.some((fav) => fav.sound_id === sound.id.toString())
                          ? 'text-white'
                          : 'text-gray-300'
                      }
                    />
                  </AccessibleDropdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      className={`sounds-section ${isDarkMode ? 'dark' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2>Mindful Soundscapes</h2>

      <div className="sound-categories">
        <AccessibleDropdown
          isOpen={showFavoritesOnly}
          onToggle={() => setShowFavoritesOnly((prev) => !prev)}
          ariaLabel={showFavoritesOnly ? 'Hide favorites' : 'Show favorites only'}
          className={`category-btn ${showFavoritesOnly ? 'active' : ''}`}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center whitespace-nowrap"
          >
            <span className="category-icon inline-flex mr-2">
              <FaHeart />
            </span>
            <span className="category-text">Favorites ({favorites.length})</span>
          </motion.div>
        </AccessibleDropdown>

        {Object.entries(categories).map(([key, { label, icon }]) => (
          <AccessibleDropdown
            key={key}
            isOpen={activeCategory === key}
            onToggle={() => {
              setActiveCategory(key);
              setPage(1);
            }}
            ariaLabel={`Select ${label} category`}
            className={`category-btn ${activeCategory === key ? 'active' : ''}`}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center whitespace-nowrap"
            >
              <span className="category-icon inline-flex mr-2">{icon}</span>
              <span className="category-text">{label}</span>
            </motion.div>
          </AccessibleDropdown>
        ))}
      </div>

      <SoundFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={() => debouncedFetchSounds(true)}
        isDarkMode={isDarkMode}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly((prev) => !prev)}
      />

      {renderContent()}

      {currentSound && (
        <motion.div
          className="volume-control"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="volume-slider">
            <FaVolumeUp />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (audioRef.current) {
                  audioRef.current.volume = e.target.value;
                }
              }}
              aria-label="Volume control"
            />
          </div>
        </motion.div>
      )}

      <div className="fixed bottom-4 right-4 space-x-2">
        <AccessibleDropdown
          isOpen={false}
          onToggle={() => setShowShortcuts(true)}
          ariaLabel="Show keyboard shortcuts"
          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <FaKeyboard />
        </AccessibleDropdown>

        <AccessibleDropdown
          isOpen={isFullscreen}
          onToggle={toggleFullscreen}
          ariaLabel={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          {isFullscreen ? <FaCompress /> : <FaExpand />}
        </AccessibleDropdown>
      </div>

      <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </motion.div>
  );
};

export default SoundsSection;
