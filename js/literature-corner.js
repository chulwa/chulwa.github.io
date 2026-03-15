document.addEventListener('DOMContentLoaded', () => {
  const pathname = window.location.pathname.replace(/index\.html$/, '');
  const isPoetryPage = pathname === '/poetry/' || pathname === '/poetry';
  const categoryLinks = [...document.querySelectorAll('.post-meta__cats a, .article-meta__categories a, #article-container .post-meta a, .meta-secondline a')];
  const isLiteraturePost = categoryLinks.some((link) => link.textContent.includes('文学角落') || link.getAttribute('href')?.includes(encodeURI('文学角落')));

  document.body.classList.add('home-abbey');

  if (isPoetryPage) {
    document.body.classList.add('poetry-page');
  }

  if (isLiteraturePost) {
    document.body.classList.add('literature-corner-post');
  }

  fetch('/search.xml')
    .then((response) => response.text())
    .then((xmlText) => {
      const xml = new DOMParser().parseFromString(xmlText, 'text/xml');
      const entries = [...xml.querySelectorAll('entry')].map((entry) => {
        const title = entry.querySelector('title')?.textContent?.trim() || '';
        const url = entry.querySelector('url')?.textContent?.trim() || '';
        const content = entry.querySelector('content')?.textContent?.trim() || '';
        return { title, url, content };
      }).filter((entry) => {
        const haystack = `${entry.title} ${entry.content}`;
        return /文学角落|碎碎念|书影音|村上|挪威的森林|奇鸟行状录|麦田里的守望者|百年孤独|四叠半/.test(haystack);
      });

      const aside = document.querySelector('#aside-content');
      if (!aside || document.querySelector('#literature-random-card') || !entries.length) return;

      const picked = entries[Math.floor(Math.random() * entries.length)];
      const card = document.createElement('div');
      card.className = 'card-widget';
      card.id = 'literature-random-card';
      card.innerHTML = `
        <div class="item-headline"><i class="fas fa-dice"></i><span>文学角落随机文章</span></div>
        <div class="literature-random-inner">
          <a class="literature-random-link" href="${picked.url}">${picked.title}</a>
          <p class="literature-random-text">翻开一页风声、房间和迟来的春天。</p>
        </div>
      `;
      aside.insertBefore(card, aside.children[1] || null);
    })
    .catch(() => {});
});
