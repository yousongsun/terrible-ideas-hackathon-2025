import siteLogo from '/untitled(3).svg';
import coverImg from '/cover.webp';

function App() {
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
            {pads.map((pad) => (
              <button className="drumpad">{pad.name}</button>
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
