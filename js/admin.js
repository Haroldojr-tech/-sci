// ========== Admin - Gerenciar Posts ==========

const postForm = document.getElementById('postForm');
const postsList = document.getElementById('postsList');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelEdit');
const editIdInput = document.getElementById('editId');
const postCount = document.getElementById('postCount');
const configForm = document.getElementById('configForm');

let postsData = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 10;

document.addEventListener('DOMContentLoaded', async () => {
  await loadConfig();
  await loadPosts();
});

async function loadConfig() {
  const config = await getConfig();
  document.getElementById('configStartDate').value = config.startDate || '';
  document.getElementById('configEndDate').value = config.endDate || '';
}

if(configForm) {
  configForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const config = {
      startDate: document.getElementById('configStartDate').value,
      endDate: document.getElementById('configEndDate').value
    };
    await saveConfig(config);
    alert('Período de exibição salvo com sucesso!');
  });
}

async function loadPosts() {
  postsData = await getPosts();
  if (postCount) postCount.textContent = postsData.length;
  renderPagination();
}

function renderPagination() {
  if (!postsList) return;
  postsList.innerHTML = '';

  const searchInput = document.getElementById('adminSearchInput');
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

  const filteredPosts = postsData.filter(post => {
    if (!searchTerm) return true;
    return post.title.toLowerCase().includes(searchTerm);
  });

  if (filteredPosts.length === 0) {
    postsList.innerHTML = '<p class="no-posts">Nenhum post encontrado.</p>';
    updatePaginationUI(1);
    return;
  }

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pagePosts = filteredPosts.slice(startIndex, endIndex);

  pagePosts.forEach(post => {
    const item = document.createElement('div');
    item.className = 'post-item';
    item.innerHTML = `
      <div class="post-item-info">
        <span class="post-item-icon">${getIconSVG(post.icon)}</span>
        <div class="post-item-text">
          <strong>${post.title}</strong>
          <span>Data: ${post.postDate} | Cliques: ${post.clicks}</span>
        </div>
      </div>
      <div class="post-item-actions">
        <button class="btn-edit" onclick="editPost(${post.id})">Editar</button>
        <button class="btn-delete" onclick="removePost(${post.id})">Excluir</button>
      </div>
    `;
    postsList.appendChild(item);
  });

  updatePaginationUI(totalPages);
}

function updatePaginationUI(totalPages) {
  const pageInfo = document.getElementById('pageInfo');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');
  
  if (pageInfo) pageInfo.innerText = `Página ${currentPage} de ${totalPages}`;
  if (prevBtn) prevBtn.disabled = currentPage === 1;
  if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

const prevPageBtn = document.getElementById('prevPageBtn');
if (prevPageBtn) {
  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderPagination();
    }
  });
}

const nextPageBtn = document.getElementById('nextPageBtn');
if (nextPageBtn) {
  nextPageBtn.addEventListener('click', () => {
    const searchInput = document.getElementById('adminSearchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const filteredPosts = postsData.filter(post => searchTerm === '' ? true : post.title.toLowerCase().includes(searchTerm));
    
    const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE) || 1;
    if (currentPage < totalPages) {
      currentPage++;
      renderPagination();
    }
  });
}

const adminSearchInput = document.getElementById('adminSearchInput');
if (adminSearchInput) {
  adminSearchInput.addEventListener('input', () => {
    currentPage = 1;
    renderPagination();
  });
}

async function editPost(id) {
  const post = postsData.find(p => p.id === id);
  if (!post) return;

  document.getElementById('postTitle').value = post.title;
  // O input type=file não pode receber value (motivos de segurança). Deixamos em branco.
  const imgInput = document.getElementById('postImage');
  if(imgInput) imgInput.value = ''; 
  
  document.getElementById('postDate').value = post.postDate;
  document.getElementById('postLink').value = post.postLink;
  document.getElementById('postIcon').value = post.icon;
  editIdInput.value = id;

  formTitle.textContent = 'Editar Post';
  submitBtn.textContent = 'Salvar Alteracoes';
  cancelBtn.style.display = 'inline-block';
  window.scrollTo({ top: postForm.offsetTop - 20, behavior: 'smooth' });
}

async function removePost(id) {
  if (!confirm('Tem certeza que deseja excluir este post e sua pasta?')) return;
  await deletePost(id);
  await loadPosts(); // Reload full list and re-render
  resetForm();
}

function resetForm() {
  postForm.reset();
  editIdInput.value = '';
  formTitle.textContent = 'Criar Novo Post';
  submitBtn.textContent = 'Criar Post';
  cancelBtn.style.display = 'none';
}

postForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', document.getElementById('postTitle').value);
  formData.append('postDate', document.getElementById('postDate').value);
  formData.append('postLink', document.getElementById('postLink').value);
  formData.append('icon', document.getElementById('postIcon').value);

  const imgInput = document.getElementById('postImage');
  if (imgInput && imgInput.files[0]) {
    formData.append('image', imgInput.files[0]);
  }

  const editId = editIdInput.value;
  if (editId) {
    await updatePost(parseInt(editId), formData);
  } else {
    await createPost(formData);
  }

  await loadPosts(); // Reload full list
  resetForm();
});

cancelBtn.addEventListener('click', resetForm);
