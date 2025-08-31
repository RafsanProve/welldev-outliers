import { useState } from "react";
import "./App.css";

function App() {
  const [Message, setMessage] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]); // <-- store previous messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Message) return;

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Message }),
      });

      const data = await response.json();
      const result = {
        Message,
        label: data.prediction,
        confidence: data.confidence,
      };

      // Add to history (latest first)
      setHistory([result, ...history]);
      setPrediction(result);
      setMessage(""); // clear input
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h1>Spam Predictor</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={Message}
          placeholder="Enter your message"
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "300px", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 12px", marginLeft: "8px" }}>
          Predict
        </button>
      </form>

      {/* Latest prediction */}
      {prediction && (
        <div
          style={{
            marginTop: "20px",
            fontSize: "18px",
            color: prediction.label === "Spam" ? "red" : "green",
          }}
        >
          Prediction: <strong>{prediction.label} ({prediction.confidence}% Confidence)</strong>
        </div>
      )}

      {/* History table */}
      {history.length > 0 && (
        <div style={{ marginTop: "30px", width: "400px", marginLeft: "auto", marginRight: "auto" }}>
          <h2>History</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Message</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Prediction</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "6px 4px" }}>{item.Message}</td>
                  <td style={{ padding: "6px 4px", color: item.label === "Spam" ? "red" : "green" }}>
                    {item.label}
                  </td>
                  <td style={{ padding: "6px 4px" }}>{item.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
