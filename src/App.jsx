import React, { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';
// import { useHistory } from 'react-router-dom';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState('Enter the prompt to generate image');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [isListening, setIsListening] = useState(false);
  const [spokenPrompt, setSpokenPrompt] = useState('');

  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_Open_AI_Key,
  });
  const openai = new OpenAIApi(configuration);
  // const history = useHistory();

  const generateImage = async () => {
    setPlaceholder(`Search ${prompt}..`);
    setLoading(true);
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: '512x512',
    });
    setLoading(false);
    console.log(response.data.data[0].url);
    setResult(response.data.data[0].url);
  };

  const handleBrightnessChange = (event) => {
    const value = parseInt(event.target.value);
    setBrightness(value);
  };

  const redirectToWebsite = () => {
    window.location.href = 'https://objdetector.netlify.app/';
  };
  const handleSpeechRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const capitalizedTranscript = transcript.charAt(0).toUpperCase() + transcript.slice(1);
      console.log(capitalizedTranscript);
      console.log("speech end");
      setSpokenPrompt(capitalizedTranscript);
      setPrompt(capitalizedTranscript);
    };

    recognition.start();
  };

  return (
    <div className="app-main">
      {loading ? (
        <>
          <h2>Generating..Please Wait..</h2>
        </>
      ) : (
        <>
          <h2>Generate an Image by entering a prompt</h2>

          <textarea
            className="app-input"
            placeholder={placeholder}
            onChange={(e) => setPrompt(e.target.value)}
            value={spokenPrompt || prompt}
            rows="10"
            cols="40"
          />
          <button className="my-btn" onClick={generateImage}>
            Generate an Image
          </button>
          {result.length > 0 ? (
            <>
              <img
                className="result-image"
                src={result}
                alt="result"
                style={{
                  transform: `rotate(${rotationAngle}deg)`,
                  filter: `brightness(${brightness}%)`,
                }}
              />
              <div className="rotate-buttons">
                <button
                  className="rotate-button"
                  onClick={() => setRotationAngle((rotationAngle + 90) % 360)}
                >
                  Rotate Clockwise
                </button>
                <button
                  className="rotate-button"
                  onClick={() => setRotationAngle((rotationAngle + 270) % 360)}
                >
                  Rotate Counterclockwise
                </button>
              </div>
              <div className="brightness-slider">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={handleBrightnessChange}
                  className="slider"
                />
              </div>
              <button className="my-btn" onClick={redirectToWebsite}>
                Object Detection
              </button>
            </>
          ) : (
            <></>
          )}
        </>
      )}
      <div className="speech-recognition-container">
        <button
          className={`speech-recognition-button ${isListening ? 'listening' : ''}`}
          onClick={handleSpeechRecognition}
        >
          {isListening ? 'Listening...' : 'Tap to talk'}
        </button>
      </div>
    </div>
  );
}

export default App;
