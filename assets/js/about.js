document.addEventListener("DOMContentLoaded", function () {
  const title = localStorage.getItem("aboutTitle");
  const imgUrl = localStorage.getItem("aboutImgUrl");
  const description = localStorage.getItem("aboutDescription");

  if (title && imgUrl && description) {
    const aboutDiv = document.querySelector(".about");

    const aboutContent = `
            <div class="about_content">
                <h1>${title}</h1>
                <p>${description}</p>
            </div>
            <div class="book_images">
                <img src="${imgUrl}" alt="Book Image" />
            </div>
        `;

    aboutDiv.innerHTML = aboutContent;
  }
});
