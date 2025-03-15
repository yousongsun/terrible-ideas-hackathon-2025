import siteLogo from '/untitled(3).svg';
import coverImg from '/cover.webp';

function App() {
  return (
    <>
      <header>
        <img src={siteLogo} alt="Website Logo" />
      </header>
      <section>
        <img src={coverImg} alt="Picture of well-to-do man walking his dog." />
        <p className="cover-subtitle">fig.1: man walking his dog</p>
      </section>
      <section>
        <button className="drumpad">hello</button>
      </section>
      <footer>terrible ideas/akl 2025</footer>
    </>
  );
}

export default App;
