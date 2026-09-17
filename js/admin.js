// ========== Admin - Gerenciar Posts ==========

const postForm = document.getElementById('postForm');
const postsList = document.getElementById('postsList');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelEdit');
const editIdInput = document.getElementById('editId');
const postCount = document.getElementById('postCount');

function renderPostsList() {
  const posts = getPosts();
  postCount.textContent = posts.length;
  postsList.innerHTML = '';

  if (posts.length === 0) {
    postsList.innerHTML = '<p class="no-posts">Nenhum post criado ainda.</p>';
    return;
  }

  posts.forEach(post => {
    const item = document.createElement('div');
    item.className = 'post-item';
    item.innerHTML = `
      <div class="post-item-info">
        <span class="post-item-icon">${getIconSVG(post.icon)}</span>
        <div class="post-item-text">
          <strong>${post.title}</strong>
          <span>${post.stat1num} ${post.stat1label} | ${post.stat2num} ${post.stat2label} | ${post.stat3num} ${post.stat3label}</span>
        </div>
      </div>
      <div class="post-item-actions">
        <button class="btn-edit" onclick="editPost(${post.id})">Editar</button>
        <button class="btn-delete" onclick="removePost(${post.id})">Excluir</button>
      </div>
    `;
    postsList.appendChild(item);
  });
}

function editPost(id) {
  const posts = getPosts();
  const post = posts.find(p => p.id === id);
  if (!post) return;

  document.getElementById('postTitle').value = post.title;
  document.getElementById('stat1num').value = post.stat1num;
  document.getElementById('stat1label').value = post.stat1label;
  document.getElementById('stat2num').value = post.stat2num;
  document.getElementById('stat2label').value = post.stat2label;
  document.getElementById('stat3num').value = post.stat3num;
  document.getElementById('stat3label').value = post.stat3label;
  document.getElementById('postIcon').value = post.icon;
  editIdInput.value = id;

  formTitle.textContent = 'Editar Post';
  submitBtn.textContent = 'Salvar Alteracoes';
  cancelBtn.style.display = 'inline-block';
  window.scrollTo({ top: postForm.offsetTop - 20, behavior: 'smooth' });
}

function removePost(id) {
  if (!confirm('Tem certeza que deseja excluir este post?')) return;
  deletePost(id);
  renderPostsList();
  resetForm();
}

function resetForm() {
  postForm.reset();
  editIdInput.value = '';
  formTitle.textContent = 'Criar Novo Post';
  submitBtn.textContent = 'Criar Post';
  cancelBtn.style.display = 'none';
}

postForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const postData = {
    title: document.getElementById('postTitle').value,
    stat1num: document.getElementById('stat1num').value,
    stat1label: document.getElementById('stat1label').value,
    stat2num: document.getElementById('stat2num').value,
    stat2label: document.getElementById('stat2label').value,
    stat3num: document.getElementById('stat3num').value,
    stat3label: document.getElementById('stat3label').value,
    icon: document.getElementById('postIcon').value
  };

  const editId = editIdInput.value;
  if (editId) {
    updatePost(parseInt(editId), postData);
  } else {
    createPost(postData);
  }

  renderPostsList();
  resetForm();
});

cancelBtn.addEventListener('click', resetForm);

document.addEventListener('DOMContentLoaded', renderPostsList);
