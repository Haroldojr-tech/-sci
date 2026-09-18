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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 20px; height: 20px; fill: #049fbb; margin-bottom: 5px;"><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg>
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

  window.swiperInstance = new Swiper('.swiper', {
    loop: true,
    grabCursor: true,
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
      0: { 
        slidesPerView: 'auto', 
        spaceBetween: 15,
        centeredSlides: true
      },
      768: { 
        slidesPerView: 3, 
        spaceBetween: 20,
        centeredSlides: false
      },
      1024: { 
        slidesPerView: 4, 
        spaceBetween: 30,
        centeredSlides: false
      }
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
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
