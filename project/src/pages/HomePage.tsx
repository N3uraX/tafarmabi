import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TechStack from '../components/TechStack';
import Projects from '../components/Projects';
import About from '../components/About';
import Blog from '../components/Blog';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      <Hero />
      <TechStack />
      <Projects />
      <About />
      <Blog />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default HomePage;