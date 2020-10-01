import React from 'react';
import './App.css';
import About from './components/about/About';
import Education from './components/education/Education';
import Navigation from './components/navigation/Navigation';

function App() {
  const aboutRef = React.useRef(null);
  const educationRef = React.useRef(null);
  const navigationRefs = [
    aboutRef,
    educationRef,
  ];
  const [refInView, setRefInView] = React.useState(aboutRef);

  const handleScroll = () => {
    navigationRefs.forEach(ref => {
      if (ref && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (rect.top <= 50 && rect.bottom > 50) {
          setRefInView(ref);
        }
      }
    });
  }

  return (
    <div className="App" onScroll={handleScroll}>
        <Navigation refs={navigationRefs} refInView={refInView} />
        <About ref={aboutRef} />
        <Education ref={educationRef} />
    </div>
  );
}

export default App;
