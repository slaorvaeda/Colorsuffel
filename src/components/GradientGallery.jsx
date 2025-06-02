import React, { useState, useEffect } from "react";

// Generates 100 gradient objects dynamically
const generateGradients = (count = 100) => {
  const adjectives = ["Sunny", "Ocean", "Mint", "Lavender", "Coral", "Golden", "Mystic", "Berry", "Peach", "Twilight"];
  const nouns = ["Glow", "Breeze", "Mist", "Sunrise", "Sky", "Lagoon", "Field", "Dream", "Wave", "Flame"];

  const randomHexColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  const randomName = () => `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
  
  const gradients = [];

  for (let i = 0; i < count; i++) {
    const type = Math.random() > 0.5 ? "linear" : "radial";
    const colors = [randomHexColor(), randomHexColor()];
    if (type === "linear") {
      const angle = `${Math.floor(Math.random() * 181)}deg`;
      gradients.push({ name: randomName(), type, angle, colors });
    } else {
      const shape = Math.random() > 0.5 ? "circle" : "ellipse";
      gradients.push({ name: randomName(), type, shape, colors });
    }
  }

  return gradients;
};

const GradientGallery = () => {
  const [gradients, setGradients] = useState([]);

  useEffect(() => {
    setGradients(generateGradients());
  }, []);

  const getCssGradient = (gradient) => {
    if (gradient.type === "linear") {
      return `linear-gradient(${gradient.angle}, ${gradient.colors.join(", ")})`;
    }
    return `radial-gradient(${gradient.shape}, ${gradient.colors.join(", ")})`;
  };

  return (
    <div style={{ padding: "1rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {gradients.map((g, i) => (
        <div
          key={i}
          style={{
            width: "200px",
            height: "150px",
            borderRadius: "10px",
            background: getCssGradient(g),
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0.5rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "1rem" }}>{g.name}</div>
          <div style={{ fontSize: "0.8rem" }}>{g.type} gradient</div>
        </div>
      ))}
    </div>
  );
};

export default GradientGallery;
