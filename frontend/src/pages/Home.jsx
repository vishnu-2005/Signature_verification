import React from "react";
import "../styles/Home.css";
import Card from "../components/Card";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="start">
        <Navbar />
        <section className="hero-section">
          <div className="hero-background">
            <video
              autoPlay
              loop
              muted
              playsInline
            >
              <source
                src="background.mp4"
                type="video/mp4"
              />
            </video>
            <div className="hero-text">
              <p>"Your Security, Our Priority: Ensuring Authentic Signatures with AI Precision."</p>
            </div>
          </div>
        </section>
      </div>

      {/* Information Cards */}
      <section className="info-cards">
        <Card
          title="Accuracy"
          description="Experience high precision in signature verification, driven by cutting-edge AI technology and deep learning models."
        />
        <Card
          title="Security"
          description="Ensuring the safety of your documents with top-notch security protocols, including encryption and secure cloud storage."
        />
        <Card
          title="Ease of Use"
          description="Simple and user-friendly interface for fast, reliable verification using our AI-powered signature system."
        />
      </section>

      {/* Upload Process */}
      <section className="upload-process">
        <h2>How to Upload and Verify Your Signature</h2>
        <div className="process-steps">
          <div className="step">
            <h3>Step 1: Sign In</h3>
            <p>Log in using secure authentication methods to access the signature verification feature.</p>
          </div>
          <div className="step">
            <h3>Step 2: Verify the Unique id</h3>
            <p>Once logged in check if an user with the unique id exists.</p>
          </div>
          <div className="step">
            <h3>Step 3: Change in the Upload Page</h3>
            <p>The upload page will change where you can submit the signature image of unique id for verification.</p>
          </div>
          <div className="step">
            <h3>Step 4: Upload Your Signature</h3>
            <p>Upload a clear image of your signature.</p>
          </div>
          <div className="step">
            <h3>Step 5: Verify and View Results</h3>
            <p>
              Click the “upload” button to begin the AI-powered verification process. You’ll receive a result indicating whether your signature is
              real or forged.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
