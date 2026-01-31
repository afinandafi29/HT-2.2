export const createGalaxyEffects = () => {
    // Clean up existing effects
    document.querySelectorAll('.pulsing-star, .comet').forEach(el => el.remove());
    
    // Create stars
    for (let i = 0; i < 30; i++) {
      const star = document.createElement('div');
      star.className = 'pulsing-star';
      star.style.top = Math.random() * 100 + 'vh';
      star.style.left = Math.random() * 100 + 'vw';
      star.style.animationDelay = Math.random() * 5 + 's';
      document.body.appendChild(star);
    }
  
    // Create comets
    for (let i = 0; i < 5; i++) {
      const comet = document.createElement('div');
      comet.className = 'comet';
      comet.style.top = Math.random() * 50 + 'vh';
      comet.style.left = Math.random() * 50 + 'vw';
      comet.style.animationDelay = Math.random() * 10 + 's';
      document.body.appendChild(comet);
    }
  };