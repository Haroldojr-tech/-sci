// ========== Render Posts no Carrossel ==========

async function renderPosts(searchTerm = '') {
  const container = document.getElementById('postsContainer');
  if (!container) return;

  const allPosts = await getPosts();
  const config = await getConfig();

  // Filter posts based on display period AND search term
  const posts = allPosts.filter(post => {
    // 1. Date Filter
    let datePass = true;
    if (config && (config.startDate || config.endDate)) {
      const pDate = post.postDate ? new Date(post.postDate).getTime() : 0;
      const start = config.startDate ? new Date(config.startDate).getTime() : 0;
      const end = config.endDate ? new Date(config.endDate).getTime() : Infinity;
      if (pDate !== 0) {
        datePass = (pDate >= start && pDate <= end);
      }
    }

    // 2. Search Filter
    let searchPass = true;
    if (searchTerm.trim() !== '') {
      searchPass = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    }

    return datePass && searchPass;
  });

  container.innerHTML = '';

  posts.forEach(post => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
      <div class="card">
        <div class="top-section">
          ${post.postImage ? `<div style="position: absolute; top:0; left:0; width:100%; height:100%; background-image: url('${post.postImage}'); background-size: cover; background-position: center; opacity: 0.8; border-radius: 15px; z-index: 0;"></div>` : ''}
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
              <span class="big-text" id="clicks-${post.id}">${post.clicks || 0}</span>
              <span class="regular-text">Acessos</span>
            </div>
            <div class="item">
              <span class="big-text">${post.postDate || 'N/A'}</span>
              <span class="regular-text">Data</span>
            </div>
            <div class="item">
              <a id="link-${post.id}" href="${post.postLink || '#'}" target="_blank" onclick="handlePostClick(event, ${post.id})" class="open-btn" style="color: #049fbb; font-size: 24px; text-decoration: none; display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%; cursor: pointer;">
                <i class="fa-solid fa-arrow-up-right-from-square" style="color: #049fbb; font-size: 15px; margin-bottom: 5px;"></i>
                <span class="regular-text">Abrir</span>
              </a>
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

  // Garante slides suficientes para o loop infinito (Swiper precisa de pelo menos 2x o necessário)
  const slides = Array.from(container.children);
  if (slides.length > 0 && slides.length < 8) {
    const copies = Math.ceil(8 / slides.length);
    for (let i = 1; i < copies; i++) {
      slides.forEach(slide => {
        container.appendChild(slide.cloneNode(true));
      });
    }
  }

  window.swiperInstance = new Swiper('.swiper', {
    loop: true,
    grabCursor: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 15,
    slidesPerGroup: 1,
    watchSlidesProgress: true,
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
      768: {
        slidesPerView: 3,
        centeredSlides: false,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 4,
        centeredSlides: false,
        spaceBetween: 30,
      }
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
      stopOnLastSlide: false
    }
  });
}

async function handlePostClick(event, id) {
  // O link vai abrir em nova aba por causa do target="_blank"
  // Aqui apenas disparamos a contagem do clique e atualizamos o HTML na hora.
  const clicksSpan = document.getElementById(`clicks-${id}`);
  if (clicksSpan) {
    let current = parseInt(clicksSpan.textContent) || 0;
    clicksSpan.textContent = current + 1;
  }
  await incrementClick(id);
}

const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    renderPosts(e.target.value);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderPosts();
});
