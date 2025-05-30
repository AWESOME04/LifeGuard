import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import { Link } from 'react-router-dom';
import getBackgroundStyle, { CategoryType } from '../../utils/getBackgroundStyle';

interface FloatingAudioPlayerProps {
  isDarkMode: boolean;
  activeCategory?: CategoryType;
}

interface SoundObject {
  name: string;
  [key: string]: unknown;
}

const FloatingAudioPlayer = ({
  isDarkMode,
  activeCategory = 'nature',
}: FloatingAudioPlayerProps) => {
  const { currentSound, isPlaying, setIsPlaying, volume, setVolume, audioRef } = useAudioPlayer();

  if (!currentSound) return null;

  const soundObject: SoundObject =
    typeof currentSound === 'object' && currentSound !== null
      ? (currentSound as SoundObject)
      : { name: typeof currentSound === 'string' ? currentSound : 'Unknown' };

  const backgroundStyle = getBackgroundStyle(soundObject, activeCategory);

  const handlePlayPause = (): void => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={`fixed bottom-4 right-24 p-4 rounded-lg shadow-lg z-50 backdrop-blur-md 
          ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'} 
          border border-gray-200 dark:border-gray-700
          w-72 transform hover:scale-102 transition-all max-w-[calc(100vw-300px)]`}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Link
              to="/wellness-hub"
              className="block w-12 h-12 rounded-md overflow-hidden hover:opacity-80 transition-opacity"
            >
              <div className="w-full h-full bg-cover bg-center" style={backgroundStyle} />
            </Link>
          </div>

          <div className="flex-grow min-w-0">
            <Link
              to="/wellness-hub"
              className={`block text-sm font-medium truncate hover:text-blue-500 
                ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              {soundObject.name}
            </Link>
            <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Now Playing
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700
                ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              type="button"
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <div className="group relative">
              <button
                className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700
                  ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                type="button"
                aria-label={`Volume: ${Math.round(volume * 100)}%`}
              >
                {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    if (audioRef.current) {
                      audioRef.current.volume = newVolume;
                    }
                  }}
                  className="w-24 h-2 appearance-none bg-blue-200 rounded-full -rotate-90 -translate-x-12"
                  aria-label="Volume control"
                  title={`Volume: ${Math.round(volume * 100)}%`}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingAudioPlayer;
