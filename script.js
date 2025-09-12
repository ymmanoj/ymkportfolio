let slideIndex = 0;
showSlides();

function showSlides() {
  let slides = document.getElementsByClassName("slides");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 3000); // Change every 3 sec
}
function createButterfly() {
  const butterfly = document.createElement('div');
  butterfly.classList.add('butterfly');

  // Random horizontal position
  butterfly.style.left = Math.random() * 90 + 'vw';
  butterfly.style.top = '60px'; // start near header

  // Random speed & path multiplier
  butterfly.style.setProperty('--x', Math.random());
  butterfly.style.setProperty('--y', Math.random());

  // Random size
  const size = 20 + Math.random() * 20;
  butterfly.style.width = size + 'px';
  butterfly.style.height = size + 'px';

  document.body.appendChild(butterfly);

  // Remove after animation
  setTimeout(() => butterfly.remove(), 8000); // matches CSS animation duration
}

// Generate butterflies every 500ms
setInterval(createButterfly, 500);
