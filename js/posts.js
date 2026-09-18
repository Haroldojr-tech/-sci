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
  clock: `<i class="fa-solid fa-clock" style="color: white; font-size: 20px;"></i>`,
  calendar: `<i class="fa-solid fa-calendar-days" style="color: white; font-size:20px;"></i>`,
  secretary: `<i class="fa-solid fa-user-tie" style="color: white; font-size: 20px;"></i>`
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
