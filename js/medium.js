const apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fapi.medium.com%2Ffeed%2F%40rivaldynaiborhu';

function truncateDescription(description, maxLength) {
  return description.length > maxLength ? description.slice(381, maxLength) + '...' : description;
}

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const articles = data.items;
    const articleContainer = document.getElementById('article-container');

    articles.forEach((article, index) => {
      const articleElement = document.createElement('div');
      articleElement.classList.add('article');
      articleElement.classList.add('row');
      articleElement.classList.add('col-md-4');

      const animateBox = document.createElement('div');
      animateBox.classList.add('fh5co-blog');
      animateBox.classList.add('animate-box');

      const thumbnailElement = document.createElement('a');
      thumbnailElement.href = article.link;
      thumbnailElement.classList.add('blog-bg');
      thumbnailElement.style.backgroundImage = `url(${article.thumbnail})`;

      const infoContainer = document.createElement('div');
      infoContainer.classList.add('blog-text');

      const pubDateElement = document.createElement('span');
      pubDateElement.classList.add('posted_on');
      pubDateElement.textContent = article.pubDate;

      const titleElement = document.createElement('h3');
      const titleLink = document.createElement('a');
      titleLink.href = article.guid;
      titleLink.textContent = article.title;
      titleElement.appendChild(titleLink);

      // const deskripsiElement = document.createElement('p');
      // deskripsiElement.textContent = '...' + truncateDescription( article.description, 563);

      infoContainer.appendChild(pubDateElement);
      infoContainer.appendChild(titleElement);
      // infoContainer.appendChild(deskripsiElement);

      articleElement.appendChild(thumbnailElement);
      articleElement.appendChild(infoContainer);

      articleContainer.appendChild(articleElement);
    });
  })
  .catch(error => console.error('Error:', error));


//   const apiUrll = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fapi.medium.com%2Ffeed%2F%40rivaldynaiborhu';

// fetch(apiUrll)
//   .then(response => response.json())
//   .then(data => {
//     // Lakukan sesuatu dengan data yang diterima
//     console.log(data);
//     // Contoh: menampilkan judul dari item pertama
//     document.getElementById('judul').innerHTML = data.items[0].title;
//   })
//   .catch(error => console.error('Error:', error));