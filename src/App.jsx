import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Landing from './components/Landing';
import Projects from './components/ProjectList';
import EditProjects from './components/ProjectEdit';
import Locations from './components/LocationList';
import EditLocation from './components/EditLocation';
import Preview from './components/Preview';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="project" element={<Projects />} />
        {/* <Route path="project/:id" element={<Projects />} /> */}

        <Route path="edit" element={<EditProjects />} />
        <Route path="edit/:id" element={<EditProjects />} />

        <Route path="locations" element={<Locations />} />
        <Route path="editlocations" element={<EditLocation />} />
        <Route path="edit-location/:id" element={<EditLocation />} />
        <Route path="/project/:projectId/locations" element={<Locations />} />

        <Route path="preview" element={<Preview />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
