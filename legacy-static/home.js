const words = ["Communication Skills", "Job Success", "Technical Knowledge", "Interview Skills", "Hiring Potential"];
let part = 0;
let partIndex = 0;
let interval;
let direction = "forward";
const element = document.querySelector(".changing-text");

function typeWriterEffect() {
  if (direction === "forward") {
    partIndex++;
    element.textContent = words[part].substring(0, partIndex);

    if (partIndex === words[part].length) {
      direction = "backward";
      clearInterval(interval);
      setTimeout(() => {
        interval = setInterval(typeWriterEffect, 80);
      }, 1000); 
    }
  } else {
    partIndex--;
    element.textContent = words[part].substring(0, partIndex);

    if (partIndex === 0) {
      direction = "forward";
      part = (part + 1) % words.length;
    }
  }
}

interval = setInterval(typeWriterEffect, 80);