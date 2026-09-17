// ========== Posts CRUD via localStorage ==========

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
  code: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 94 94" class="svg"><path fill="white" d="M38.0481 4.82927C38.0481 2.16214 40.018 0 42.4481 0H51.2391C53.6692 0 55.6391 2.16214 55.6391 4.82927V40.1401C55.6391 48.8912 53.2343 55.6657 48.4248 60.4636C43.6153 65.2277 36.7304 67.6098 27.7701 67.6098C18.8099 67.6098 11.925 65.2953 7.11548 60.6663C2.37183 56.0036 3.8147e-06 49.2967 3.8147e-06 40.5456V4.82927C3.8147e-06 2.16213 1.96995 0 4.4 0H13.2405C15.6705 0 17.6405 2.16214 17.6405 4.82927V39.1265C17.6405 43.7892 18.4805 47.2018 20.1605 49.3642C21.8735 51.5267 24.4759 52.6079 27.9678 52.6079C31.4596 52.6079 34.0127 51.5436 35.6268 49.4149C37.241 47.2863 38.0481 43.8399 38.0481 39.0758V4.82927Z"></path><path fill="white" d="M86.9 61.8682C86.9 64.5353 84.9301 66.6975 82.5 66.6975H73.6595C71.2295 66.6975 69.2595 64.5353 69.2595 61.8682V4.82927C69.2595 2.16214 71.2295 0 73.6595 0H82.5C84.9301 0 86.9 2.16214 86.9 4.82927V61.8682Z"></path><path fill="white" d="M2.86102e-06 83.2195C2.86102e-06 80.5524 1.96995 78.3902 4.4 78.3902H83.6C86.0301 78.3902 88 80.5524 88 83.2195V89.1707C88 91.8379 86.0301 94 83.6 94H4.4C1.96995 94 0 91.8379 0 89.1707L2.86102e-06 83.2195Z"></path></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg"><path fill="white" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 177.5c-12 2.8-20.9 12.6-22.1 24.6L11 313.1c-1.5 14-10.1 25.5-23.6 28.7C0 344.8 7.8 352 17.6 352h126.1l-34.2 137c-2.1 8.4.5 17.8 6.8 22.5l64.5 48.6 64.5-48.6c6.3-4.7 8.9-14.1 6.8-22.5L230.4 352h126.1c9.8 0 17.6-7.2 17.6-16 0-1.2-.2-2.5-.5-3.7L376.9 337.1c13.4-3.2 22-14.7 20.6-28.7L386 150.3 316.9 18z"></path></svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg"><path fill="white" d="M47.6 302.5C30.5 285.5 19 263.8 19 240c0-36.4 29.5-65.8 65.8-65.8 21.5 0 41.1 10.2 53.4 26.1L256 200.4l97.8-99.9c12.3-15.8 31.9-26.1 53.4-26.1 36.3 0 65.8 29.4 65.8 65.8 0 23.8-11.5 45.5-28.6 62.5L256 422.8 47.6 302.5z"></path></svg>`,
  bolt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg"><path fill="white" d="M349.8 65.2C323.5 24.9 275.4 0 224 0C100.3 0 0 100.3 0 224c0 52.4 21.5 100.5 56.6 134.8L32 480l128-32 32 128-64-16c45.4 31.1 100.5 48 157.4 48C347.7 512 448 411.7 448 288c0-51.4-24.9-99.5-65.2-126.6L349.8 65.2z"></path></svg>`,
  gem: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg"><path fill="white" d="M192 32L32 176 256 480 480 176 192 32zm0 144l64-56 64 56-64 56-64-56z"></path></svg>`,
  fire: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg"><path fill="white" d="M159.3 504.3C163.4 509.5 170.3 512 177.6 512H270.4c7.3 0 14.2-2.5 18.3-7.7l76.5-95.8c5.5-6.9 4.2-16.7-2.8-22.2s-16.7-4.2-22.2 2.8L303 430.4l-35.4-44.6c-5.5-6.9-15.3-8.2-22.2-2.8s-11.7 15.3-6.2 22.2l54.6 68.8H188.2l33.2-41.8c5.5-6.9 4.2-16.7-2.8-22.2s-16.7-4.2-22.2 2.8l-33.2 41.8H115.2l32-40.4c5.5-6.9 4.2-16.7-2.8-22.2s-16.7-4.2-22.2 2.8L101.3 435l-33.5-42.1c-5.5-6.9-15.3-8.2-22.2-2.8s-11.7 15.3-6.2 22.2L124.8 480c5.2 6.5 13 10.3 21.3 10.3H270.4c48 0 93.2-21.5 124.1-58.7C436 371.5 448 322.2 448 272C448 150.8 349.2 52 228 52c-58.5 0-112.1 22.8-151.6 60.1C44.4 106.9 24 147.4 16 192c-8 44.6 8.2 91.1 40.3 125.9C87.4 351.2 135.2 376 188.2 376h-3.5c-8 0-16.1-2.3-22.2-8.3L114 318c-8.4-8.4-8.4-22.1 0-30.5s22.1-8.4 30.5 0l34.7 34.7c12.3 12.3 32.4 12.3 44.7 0l34.7-34.7c8.4-8.4 22.1-8.4 30.5 0s8.4 22.1 0 30.5l-34.7 34.7c-12.3 12.3-32.4 12.3-44.7 0l-34.7-34.7c-8.4-8.4-22.1-8.4-30.5 0s-8.4 22.1 0 30.5l15.8 15.8c31.4 31.4 73.3 48.7 117 48.7H270.4c81.7 0 155.1-44.8 191.4-114.1C473.8 256.5 480 233.4 480 210c0-4.4-.2-8.7-.5-13C475.4 99.6 395.8 20 296 20C219 20 150.4 60.6 121.5 118.3c-3.8 7.6-14.1 10.4-21.6 6.6s-10.4-14.1-6.6-21.6C118.8 38.5 202.2 0 296 0c120.7 0 222.8 79.3 257.3 189.3C559.8 213.6 564 226.5 564 240c0 80-31.2 154.4-87.6 210.3C420 506.1 346.2 544 270.4 544H177.6c-27.6 0-53.2-10.7-72.5-30.2L159.3 504.3z"></path></svg>`
};

function getPosts() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_POSTS));
    return DEFAULT_POSTS;
  }
  return JSON.parse(data);
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function createPost(post) {
  const posts = getPosts();
  const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
  post.id = newId;
  posts.push(post);
  savePosts(posts);
  return post;
}

function updatePost(id, updates) {
  const posts = getPosts();
  const index = posts.findIndex(p => p.id === id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updates };
    savePosts(posts);
    return posts[index];
  }
  return null;
}

function deletePost(id) {
  const posts = getPosts();
  const filtered = posts.filter(p => p.id !== id);
  savePosts(filtered);
}

function getIconSVG(iconName) {
  return ICONS[iconName] || ICONS.code;
}
