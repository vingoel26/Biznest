import React from 'react';
import './App.css';

// Images would need to be imported or placed in the public folder
// For example:
// import logo from './assets/logo.jpg';
// import bgImage from './assets/bg6.jpg';
// etc.
import bestServices from './assets/best_services.jpg';
import team from './assets/team.jpg';
import work1 from './assets/work1.jpg';
import b from './assets/b.jpg';
import graph from './assets/graph.jpg';
import arrow1 from './assets/arrow1.jpg';
import tick1 from './assets/tick1.avif';
import logo from './assets/logo.jpg'
function App() {
  return (
    <div className="app-container">
      <nav>
        <ul>
          <img src={logo} alt="BizNest" className="logo" />
          <li><a href="#"></a></li>
          <li><a href="/home">Home</a></li>
          <li><a href="/about">About Us</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a id="q" href="#">Account Name</a></li>
        </ul>
      </nav>

      <div className="main">
        <p id="p1">Where Ideas </p>
        <p id="p1">Come to Life and </p>
        <p id="p2">Creativity Knows </p>
        <p id="p2">No Bounds <span>&rarr;</span></p>
        <br /><br />
        <p id="text">
          "Discover Your Community: Your One-Stop Shop for Local Gems! 🌟 From <br />
          quaint cafes to unique boutiques, support your neighbors and find everything<br /> 
          you need right around the corner. Explore, connect, and thrive locally!"
        </p>
      </div>

      <TileArticle 
        className="bs" 
        imageSrc={bestServices} 
        imageAlt="Best Services" 
        imageId="t1"
        description="We offer the best services to our clients" 
      />

      <TileArticle 
        className="team" 
        imageSrc={team}
        imageAlt="Professional Team" 
        imageId="t2"
        description="Our team is very professional" 
      />

      <TileArticle 
        className="work" 
        imageSrc={work1} 
        imageAlt="Best Services" 
        imageId="t3"
        description="We work hard to provide best experience" 
      />

      <TileArticle 
        className="create" 
        imageSrc={b} 
        imageAlt="creative" 
        imageId="t4"
        hideDescription={true}
      />

      <TileArticle 
        className="graph" 
        imageSrc={graph}
        imageAlt="creative" 
        imageId="t5"
        description="We provide exposure and opportunities" 
      />

      <TileArticle 
        className="arrow" 
        imageSrc={arrow1} 
        imageAlt="creative" 
        imageId="t6"
        hideDescription={true}
      />

      <TileArticle 
        className="tick" 
        imageSrc={tick1}
        imageAlt="creative" 
        imageId="t6"
        description="Satisfaction Assured" 
      />
    </div>
  );
}

// Component for the tile articles with hover effects
function TileArticle({ className, imageSrc, imageAlt, imageId, description, hideDescription }) {
  return (
    <article className="tile_article">
      <div className={className} style={{ borderRadius: "30px" }}>
        <img src={imageSrc} alt={imageAlt} className="overlay-image" id={imageId} />
        {!hideDescription && (
          <div className="tile_data">
            <span className="tile_description">{description}</span>
          </div>
        )}
      </div>
    </article>
  );
}

export default App;