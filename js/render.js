// ========== Render Posts no Carrossel ==========

function renderPosts() {
  const container = document.getElementById('postsContainer');
  if (!container) return;

  const posts = getPosts();
  container.innerHTML = '';

  posts.forEach(post => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
      <div class="card">
        <div class="top-section">
          <div class="border"></div>
          <div class="icons">
            <div class="logo">
              ${getIconSVG(post.icon)}
            </div>
          </div>
        </div>
        <div class="bottom-section">
          <span class="title">${post.title}</span>
          <div class="row row1">
            <div class="item">
              <span class="big-text">${post.stat1num}</span>
              <span class="regular-text">${post.stat1label}</span>
            </div>
            <div class="item">
              <span class="big-text">${post.stat2num}</span>
              <span class="regular-text">${post.stat2label}</span>
            </div>
            <div class="item">
              <span class="big-text">${post.stat3num}</span>
              <span class="regular-text">${post.stat3label}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(slide);
  });

  if (window.swiperInstance) {
    window.swiperInstance.destroy(true, true);
  }

  window.swiperInstance = new Swiper('.slider-wrapper', {
    loop: true,
    grabCursor: true,
    spaceBetween: 30,
    centeredSlides: true,
    slidesPerGroup: 1,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    }
  });
}

document.addEventListener('DOMContentLoaded', renderPosts);
