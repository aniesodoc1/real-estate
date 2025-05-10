import React from "react";
import "./About.scss";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-banner">
        <h1>About Us</h1>
        <p>Providing Quality Real Estate Services for Your Future</p>
      </div>

      <div className="about-content">
        <h2>Who We Are</h2>
        <p>
          At <strong>Prime Asset</strong>, we are committed to helping you find your dream home, 
          sell your property at the best value, and make informed real estate decisions. With years 
          of experience in the industry, we offer top-tier services tailored to your needs.
        </p>

        <h2>What We Offer</h2>
        <ul>
          <li>🏡 <strong>Buy & Sell Properties:</strong> We help you buy, sell, or rent properties with ease.</li>
          <li>📊 <strong>Market Insights:</strong> Stay updated with the latest real estate trends and prices.</li>
          <li>📍 <strong>Prime Locations:</strong> We have properties in the best locations to match your lifestyle.</li>
          <li>🤝 <strong>Expert Guidance:</strong> Our agents provide personalized advice and professional support.</li>
          <li>🏗️ <strong>Property Management:</strong> We take care of all property management needs efficiently.</li>
        </ul>

        <h2>Why Choose Us?</h2>
        <p>
          ✅ Trusted by thousands of homeowners and investors  
          ✅ Transparent and competitive pricing  
          ✅ A dedicated team of professional real estate agents  
          ✅ Seamless property buying, selling, and renting process  
        </p>

        <h2>Contact Us</h2>
        <p>
          Have questions? Get in touch with us today!  
          📞 <strong>Phone:</strong> +1 (123) 456-7890  
          📧 <strong>Email:</strong> info@elitehomesrealty.com  
          📍 <strong>Address:</strong> 1234 Main Street, City, Country  
        </p>
      </div>
    </div>
  );
};

export default About;
