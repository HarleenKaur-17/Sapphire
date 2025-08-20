  // ----- Carousel Logic -----
  const carousel = document.querySelector('#hero .carousel');
  const slides = Array.from(document.querySelectorAll('#hero .slide'));
  const slideCount = slides.length;
  let currentIndex = 0;

  function goToSlide(index) {
    if(index < 0) index = slideCount - 1;
    if(index >= slideCount) index = 0;
    currentIndex = index;
    carousel.style.transform = `translateX(-${100 * index}%)`;
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  let autoplay = setInterval(nextSlide, 4000);

  slides.forEach(slide => {
    slide.addEventListener('click', () => {
      nextSlide();
      clearInterval(autoplay);
      autoplay = setInterval(nextSlide, 4000);
    });
    slide.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
        clearInterval(autoplay);
        autoplay = setInterval(nextSlide, 4000);
      }
    });
  });

  // ----- FAQ Accordion -----
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      question.classList.toggle('active');
      const answer = question.nextElementSibling;
      if(answer.classList.contains('open')) {
        answer.classList.remove('open');
      } else {
        answer.classList.add('open');
      }
    });
    question.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });

  // ----- Subscription Form -----
  const subscribeForm = document.getElementById('subscribe-form');
  const emailInput = document.getElementById('email-input');
  const subscribeMessage = document.getElementById('subscribe-message');

  subscribeForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if(!email) {
      subscribeMessage.textContent = 'Please enter a valid email address.';
      return;
    }
    // Simulate async POST request
    subscribeMessage.textContent = 'Subscribing...';
    setTimeout(() => {
      subscribeMessage.textContent = `Thanks for subscribing, ${email}!`;
      subscribeForm.reset();
    }, 1200);
  });

  // ----- Movie Fetch & Search -----
  const movieGrid = document.getElementById('movie-grid');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');

  let allMovies = []; // Store fetched movies

  // Render movies to DOM
  function renderMovies(movies) {
    movieGrid.innerHTML = '';
    if(movies.length === 0) {
      movieGrid.innerHTML = `<p id="no-results">No movies found matching your search.</p>`;
      return;
    }
    movies.forEach(movie => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <img class="movie-poster" src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${movie.Title} poster" />
        <div class="movie-info">
          <h3 class="movie-title">${movie.Title}</h3>
          <p class="movie-year">${movie.Year}</p>
        </div>
      `;
      movieGrid.appendChild(card);
    });
  }

  // Fetch movies 
  async function fetchMovies(searchTerm = 'Avengers') {
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=60093df&s=${encodeURIComponent(searchTerm)}&type=movie`);
      const data = await response.json();
      if(data.Response === "True") {
        allMovies = data.Search;
        renderMovies(allMovies);
      } else {
        allMovies = [];
        renderMovies([]);
      }
    } catch(err) {
      movieGrid.innerHTML = `<p id="no-results">Failed to fetch movies. Try again later.</p>`;
    }
  }

  // Search handler
  function searchMovies() {
    const query = searchInput.value.trim();
    if(query === '') {
      renderMovies(allMovies);
      return;
    }
    // Filter local if you want, or fetch fresh results
    fetchMovies(query);
  }

  searchButton.addEventListener('click', searchMovies);
  searchInput.addEventListener('keydown', e => {
    if(e.key === 'Enter') {
      searchMovies();
    }
  });

 
  fetchMovies();

