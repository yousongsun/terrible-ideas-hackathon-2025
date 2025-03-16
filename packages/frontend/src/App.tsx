import { useEffect, useState } from 'react';
import { Howl } from 'howler';
import { io, Socket } from 'socket.io-client';
import siteLogo from '/untitled(3).svg';
import coverImg from '/cover.webp';
import { motion } from 'motion/react';
import { AnimatePresence } from 'motion/react';

const SOCKET_SERVER_URL = 'ws://music.sweetpea.one/';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  // const [messages, setMessages] = useState<string[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);

  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);
  const handleWelcome = () => {
    setIsWelcomeOpen(false);
  };

  useEffect(() => {
    const socketConnection = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
    });

    socketConnection.on('connect', () => {
      console.log('Connected to Socket.IO server.');
    });

    socketConnection.on('response', (message: string) => {
      // setMessages((prevMessages) => [...prevMessages, message]);
      // console.log(messages);
      console.log(message);
      playShortSound(parseInt(message));
    });

    socketConnection.on('autoMessage', (message: string) => {
      jumpToTime(parseInt(message));
    });

    socketConnection.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socket) {
      socket.emit('message', message);
    } else {
      console.error('Socket not connected');
    }
  };

  const sound = new Howl({
    src: ['/UntitledSong.mp3?t=202503161214'],
    format: ['mp3'],
    onload: () => {
      console.log('Audio loaded');
    },
    onend: () => {
      setIsPlaying(false);
      console.log(isPlaying);
    },
  });

  const shortSound = (number: number) => {
    const soundFiles: { [key: number]: string } = {
      0: 'https://cdn.pixabay.com/download/audio/2024/12/20/audio_d3efed8c6c.mp3',
      1: 'https://cdn.pixabay.com/download/audio/2024/12/20/audio_d3efed8c6c.mp3',
      2: 'https://cdn.pixabay.com/download/audio/2024/12/20/audio_d3efed8c6c.mp3',
      3: 'https://cdn.pixabay.com/download/audio/2024/12/20/audio_d3efed8c6c.mp3',
      4: 'https://cdn.pixabay.com/download/audio/2024/12/20/audio_d3efed8c6c.mp3',
      5: 'https://cdn.pixabay.com/download/audio/2024/12/20/audio_d3efed8c6c.mp3',
      6: 'https://cdn.pixabay.com/download/audio/2024/12/20/audio_d3efed8c6c.mp3',
      7: 'https://cdn.pixabay.com/download/audio/2024/12/20/audio_d3efed8c6c.mp3',
      8: 'https://cdn.pixabay.com/download/audio/2024/12/20/audio_d3efed8c6c.mp3',
    };

    const src = soundFiles[number];

    if (!src) {
      console.error('Sound not found for number:', number);
      return;
    }

    return new Howl({
      src: [src],
      format: ['mp3'],
      onload: () => {
        console.log(`Sound ${number} loaded`);
      },
    });
  };

  const jumpToTime = (timeInSeconds: number) => {
    if (!sound.playing()) {
      sound.play();
      setIsPlaying(true);
    }
    sound.seek(timeInSeconds);
  };

  const playShortSound = (number: number) => {
    const soundInstance = shortSound(number);
    if (soundInstance) {
      soundInstance.play();
    } else {
      console.error('Failed to play sound. Invalid number or sound not found.');
    }
  };

  const pads = [
    {
      key: 1,
      name: 'hello',
    },
    {
      key: 2,
      name: 'hello',
    },
    {
      key: 3,
      name: 'hello',
    },
    {
      key: 4,
      name: 'hello',
    },
    {
      key: 5,
      name: 'hello',
    },
    {
      key: 6,
      name: 'hello',
    },
    {
      key: 7,
      name: 'hello',
    },
    {
      key: 8,
      name: 'hello',
    },
    {
      key: 9,
      name: 'hello',
    },
  ];
  return (
    <>
      <AnimatePresence>
        {isWelcomeOpen && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="welcome"
            onClick={handleWelcome}
          >
            <div className="welcome-mid">
              <img
                src={coverImg}
                alt="Picture of well-to-do man walking his dog."
                className="welcome-cover"
              />
              <motion.p
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: 0.2,
                }}
                className="welcome-text"
              >
                press anywhere to start
              </motion.p>
            </div>
            <p className="welcome-cred">
              by watshisname-stuutzer / feat. yousong
              <br />
              prod. by nick
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <header>
        <div className="inner-header">
          <a href="/">
            <img src={siteLogo} alt="Website Logo" className="logo" />
          </a>
        </div>
      </header>
      <main>
        <div className="main-inner">
          <section className="main-l">
            <img
              src={coverImg}
              alt="Picture of well-to-do man walking his dog."
              className="cover"
            />
            <p className="cover-subtitle">fig.1: man walking his dog</p>
          </section>
          <section className="main-r">
            {pads.map((pad, index) => (
              <button
                className="drumpad"
                key={index}
                onClick={() => {
                  playShortSound(index);
                  sendMessage(String(index));
                }}
              >
                {pad.name}
              </button>
            ))}
          </section>
        </div>
      </main>
      <footer>
        <a
          href="https://terriblehack.com/events/akl/"
          className="footer-link"
          target="_blank"
        >
          terrible ideas/akl 2025
        </a>
      </footer>
    </>
  );
}

export default App;
