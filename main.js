const appWrapper = document.querySelector(".search");
const input = document.querySelector(".search__input");
const dropdown = document.querySelector(".search__dropdown");

const repoList = createElement("ul", "repositories");
appWrapper.append(repoList);

input.addEventListener("keyup", debounce(searchRepositories, 500));
dropdown.addEventListener("click", addRepositories);
repoList.addEventListener("click", deleteRepositories);

function createElement(elementTag, elementClass) {
  const element = document.createElement(elementTag);
  if (elementClass) {
    element.classList.add(elementClass);
  }
  return element;
}

function deleteRepositories(event) {
  const btnDelete = event.target;
  if (btnDelete.classList.contains("repositories__item-btnclose")) {
    btnDelete.parentElement.remove();
  }
}

function addRepositories(event) {
  const repository = event.target;

  if (repository.tagName === "LI") {
    const nameRepository = repository.textContent;
    const userName = repository.dataset.name;
    const stars = repository.dataset.stars;

    repoList.insertAdjacentHTML(
      "afterBegin",
      `<li class="repositories__item">
        <div class="repositories__item-info">
          <p class="repositories__item-text">Name: ${nameRepository}</p>
          <p class="repositories__item-text">Owner: ${userName}</p>
          <p class="repositories__item-text">Stars: ${stars}</p>
        </div>
        <button class="repositories__item-btnclose"></button>
      </li>`
    );

    clearDropdown();
    input.value = "";
  }
}

async function searchRepositories() {
  const searchValue = input.value;
  if (searchValue) {
    try {
      clearDropdown();
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${searchValue}&per_page=5`
      );
      const dataRepositories = await response.json();
      console.log(dataRepositories);
      dataRepositories.items.forEach((repository) =>
        createDropdownRepo(repository)
      );
    } catch (err) {
      console.log("Ошибка при запросе на сервер =>", err);
    }
  } else {
    clearDropdown();
  }
}

function createDropdownRepo({
  name: repositoryName,
  owner: { login: userName },
  stargazers_count: stars,
}) {
  const repositoryItem = createElement("li", "search__dropdown-item");
  repositoryItem.textContent = repositoryName;
  repositoryItem.dataset.name = userName;
  repositoryItem.dataset.stars = stars;
  dropdown.appendChild(repositoryItem);
}

function clearDropdown() {
  dropdown.innerHTML = "";
}

function debounce(fn, debounceTime) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
}
