import { useEffect, useState } from 'react';
import { Howl } from 'howler';
import { io, Socket } from 'socket.io-client';
import siteLogo from '/untitled(3).svg';
import coverImg from '/cover.webp';
import { motion } from 'motion/react';
import { AnimatePresence } from 'motion/react';

const SOCKET_SERVER_URL = 'ws://20.211.81.79/';

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
      playShortSound(parseInt(message));
      console.log(message);
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
      0: '/effects/1.mp3',
      1: '/effects/1.mp3',
      2: '/effects/1.mp3',
      3: '/effects/1.mp3',
      4: '/effects/1.mp3',
      5: '/effects/1.mp3',
      6: '/effects/1.mp3',
      7: '/effects/1.mp3',
      8: '/effects/1.mp3',
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
      name: 'dog?',
    },
    {
      key: 2,
      name: 'car?',
    },
    {
      key: 3,
      name: 'huh?',
    },
    {
      key: 4,
      name: 'bark',
    },
    {
      key: 5,
      name: 'fwæ',
    },
    {
      key: 6,
      name: 'yah',
    },
    {
      key: 7,
      name: 'omg',
    },
    {
      key: 8,
      name: 'nah',
    },
    {
      key: 9,
      name: 'nah2',
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
