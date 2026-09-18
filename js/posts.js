const API_URL = window.location.pathname.includes('/sci') ? '/sci/posts/api.php' : '/posts/api.php';
// ========== Posts CRUD para /posts ==========

const STORAGE_KEY = 'sci_posts';

const DEFAULT_POSTS = [
  {
    id: 1,
    title: 'UNIVERSE OF UI',
    stat1num: '2626',
    stat1label: 'UI elements',
    stat2num: '100%',
    stat2label: 'Free for use',
    stat3num: '38,631',
    stat3label: 'Contributers',
    icon: 'code'
  },
  {
    id: 2,
    title: 'DESIGN SYSTEM',
    stat1num: '150+',
    stat1label: 'Components',
    stat2num: '100%',
    stat2label: 'Open source',
    stat3num: '5,200',
    stat3label: 'Downloads',
    icon: 'star'
  },
  {
    id: 3,
    title: 'CREATIVE TOOLS',
    stat1num: '89',
    stat1label: 'Templates',
    stat2num: '24/7',
    stat2label: 'Available',
    stat3num: '12K',
    stat3label: 'Users',
    icon: 'heart'
  },
  {
    id: 4,
    title: 'FAST DEVELOPMENT',
    stat1num: '45',
    stat1label: 'Utilities',
    stat2num: '60fps',
    stat2label: 'Performance',
    stat3num: '99%',
    stat2label: 'Satisfaction',
    icon: 'bolt'
  }
];

const ICONS = {
  logo: `<div class="logoifto">
      <div class="quadrado"></div>
      <div class="quadrado"></div>
      <div class="quadrado"></div>
      <div class="quadrado"></div>
      <div class="quadrado"></div>
      <div class="quadrado"></div>
      <div class="quadrado"></div>
      <div class="quadrado"></div>
      <div class="quadrado"></div>
      <div class="quadrado"></div>
    </div>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg"><path fill="white" d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg"><path fill="white" d="M128 0c13.3 0 24 10.7 24 24V64H296V24c0-13.3 10.7-24 24-24s24 10.7 24 24V64h40c35.3 0 64 28.7 64 64v16 48V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192 144 128C0 92.7 28.7 64 64 64h40V24c0-13.3 10.7-24 24-24zM400 192H48V448c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V192zM329 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-95 95-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L329 305z"/></svg>`,
  secretary: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg"><path fill="white" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>`
};

async function getPosts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return []; // Return empty or handle gracefully
  }
}

async function createPost(postFormData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: postFormData
    });
    if (!response.ok) throw new Error('Failed to create post');
    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
}

async function updatePost(id, updates, isJson = false) {
  try {
    // Se for FormData, envia como POST e anexa o id
    // Se for JSON puro (como no incrementClick), envia como PUT
    let opts = {};
    if (isJson) {
      opts = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      };
    } else {
      updates.append('id', id);
      opts = {
        method: 'POST',
        body: updates
      };
    }

    const response = await fetch(`${API_URL}?id=${id}`, opts);
    if (!response.ok) throw new Error('Failed to update post');
    return await response.json();
  } catch (error) {
    console.error('Error updating post:', error);
    return null;
  }
}

async function deletePost(id) {
  try {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete post');
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

function getIconSVG(iconName) {
  return ICONS[iconName] || ICONS.logo;
}

async function incrementClick(id) {
  const posts = await getPosts();
  const post = posts.find(p => p.id === id);
  if (post) {
    post.clicks = (post.clicks || 0) + 1;
    await updatePost(id, { clicks: post.clicks }, true);
  }
}

async function getConfig() {
  try {
    const response = await fetch(`${API_URL}?config=1`);
    if (!response.ok) throw new Error('Failed to fetch config');
    return await response.json();
  } catch (error) {
    return { startDate: '', endDate: '' };
  }
}

async function saveConfig(config) {
  try {
    const response = await fetch(`${API_URL}?config=1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving config', error);
  }
}
