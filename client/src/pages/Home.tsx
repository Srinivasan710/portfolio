import MainLayout from '../layouts/MainLayout';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Education from './Education';
import Experiences from './Experiences';
import Projects from './Projects';
import Services from './Services';
import Contact from './Contact';

const Home = () => (
  <MainLayout>
    <Hero />
    <About />
    <Skills />
    <Education />
    <Experiences />
    <Projects />
    <Services />
    <Contact />
  </MainLayout>
);

export default Home;
