// ======================================
// =========== ИНИЦИАЛИЗАЦИЯ ============
// ======================================
// ->> Run! <<-
setTimeout(() => {
   console.log("[VKGS]");
   console.log("[VKGS] " + document.querySelectorAll(".ui_rmenu_label-text"));

   const container = document.querySelector("#wall_tabs .ui_search");
   const wrapper = document.createElement("div");
   wrapper.setAttribute("id", "vkgs-wrapper");
   container.appendChild(wrapper);

   // (16) Инициализация фильтров и интерфейса
   initFilters();
   // Основная логика фильтрации постов (например, по годам, вложениям и исключаемым словам)
   // searchPostDate();
}, 5000);
// ->> Данные <<-
function initFilters() {
   // Инициализация фильтров при клике на разные элементы меню
   ["a#ui_rmenu_own", "a#ui_rmenu_all", "a#ui_rmenu_search"].forEach(
      initPageInteraction
   );

   // Поле ввода для фильтрации по годам
   initInputField(
      "vkgs_date",
      "Годы:",
      "Введите год: 2020, -2020 (до 2020), +2020 (после 2020)."
   );

   // Поле ввода для слов-исключений
   initInputField(
      "vkgs_exclude-terms",
      "Слова-исключения:",
      "Введите слова-исключения через запятую."
   );

   // Чекбоксы для фильтрации постов с вложениями (фото, видео, файлы)
   initCheckboxField(
      "Посты только с вложением:",
      ["Фото", "Видео", "Файлы"],
      ["vkgs_include-images", "vkgs_include-videos", "vkgs_include-files"],
      "vkgs_include-label"
   );

   // Чекбоксы для скрытия элементов постов (автор, описание, комменты)
   initCheckboxField(
      "Скрыть элементы поста:",
      ["Автор", "Описание", "Комменты"],
      ["vkgs_hide-author", "vkgs_hide-description", "vkgs_hide-likes"],
      "vkgs_hide-label"
   );

   // Создание кнопки для запуска фильтрации
   createSearchButton();
}
// ->> Кнопка фильтровать <<-
function createSearchButton() {
   // (9) Находим контейнер, где будет размещена кнопка
   const container = document.querySelector(
      "#wall_tabs .ui_search #vkgs-wrapper"
   );

   // (10) Создаем кнопку
   const searchButton = document.createElement("button");
   searchButton.classList.add("vkgs_btn-filter");
   searchButton.textContent = "Отфильтровать";

   // (11) Добавляем событие клика для запуска фильтрации по дате
   searchButton.addEventListener("click", searchPostDate);

   // (12) Добавляем кнопку в DOM
   container.appendChild(searchButton);
}
// ->> Инпуты <<-
function initInputField(id, labelText, placeholder) {
   const wrapper = document.querySelector(
      "#wall_tabs .ui_search #vkgs-wrapper"
   );
   const item = document.createElement("div");
   item.setAttribute("class", "vkgs-item");

   // (18) Создаем лейбл для текстового поля
   const label = document.createElement("label");
   label.setAttribute("for", id);
   label.textContent = labelText;

   // (19) Создаем само текстовое поле
   const input = document.createElement("input");
   input.setAttribute("type", "text");
   input.setAttribute("id", id);
   input.setAttribute("placeholder", placeholder);

   // (20) Добавляем элементы в DOM
   item.appendChild(label);
   item.appendChild(input);
   wrapper.appendChild(item);
}
// ->> Чекбоксы <<-
function initCheckboxField(title, labels, ids, titleFor) {
   const wrapper = document.querySelector(
      "#wall_tabs .ui_search #vkgs-wrapper"
   );
   const item = document.createElement("div");
   item.setAttribute("class", "vkgs-item");

   // (22) Создаем заголовок для секции с чекбоксами
   const sectionLabel = document.createElement("label");
   sectionLabel.setAttribute("for", titleFor);
   sectionLabel.textContent = title;
   item.appendChild(sectionLabel);

   // (23) Создаем чекбоксы и их подписи
   labels.forEach((labelText, index) => {
      const checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      checkbox.setAttribute("id", ids[index]);

      const label = document.createElement("label");
      label.setAttribute("for", ids[index]);
      label.textContent = labelText;

      // (24) Добавляем чекбоксы и их лейблы в контейнер
      item.appendChild(checkbox);
      item.appendChild(label);
   });

   // (25) Добавляем контейнер с чекбоксами в DOM
   wrapper.appendChild(item);
   return item;
}
// ->> Элементы запускающие фильтр <<-
const initPageInteraction = (selector) => {
   document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener("click", function () {
         // (14) Проверка на существование поля с фильтрами, если его нет — инициализируем
         if (!document.getElementById("vkgs_date")) {
            initFilters();
            searchPostDate();
         }
      });
   });
};

// ======================================
// ============== ДАННЫЕ ================
// ======================================
// ->> Чекбоксы <<-
function getCheckboxValues() {
   includeImages = document.getElementById("vkgs_include-images").value;
   includeVideos = document.getElementById("vkgs_include-videos").value;
   includeFiles = document.getElementById("vkgs_include-files").value;
   hideAuthor = document.getElementById("vkgs_hide-author").value;
   hideDescription = document.getElementById("vkgs_hide-description").value;
   hideLikes = document.getElementById("vkgs_hide-likes").value;

   return (
      includeImages,
      includeVideos,
      includeFiles,
      hideAuthor,
      hideDescription,
      hideLikes
   );
}
// ->> Получаем дату из фильтра <<-
function getYearFilters(date) {
   dateCurrent = "";
   dateAfter = "";
   dateBefore = "";
   date.split(",").map((item) => {
      item.trim();
      if (item[0] === "+") {
         dateAfter = item;
         dateAfter[0] = " ";
         dateAfter = dateAfter.trim();
      } else if (item[0] === "-") {
         dateBefore = item;
         dateBefore[0] = " ";
         dateBefore = dateBefore.trim();
      } else if (item[0] !== "") {
         dateCurrent = item;
      }
   });
   // console.log("===================== data ");
   // console.log(date);
   // console.log("===================== dataCurrent ");
   // console.log(dateCurrent);
   // console.log("===================== dateAfter ");
   // console.log(dateAfter);
   // console.log("===================== dateBefore ");
   // console.log(dateBefore);

   return [dateCurrent, dateAfter, dateBefore];
}
// ->> Получаем дату из поста <<-
function getPostYear(post) {
   console.log("================================================");
   console.log(post.classList);
   console.log("================================================");
   return "2024";
}
// ->> Сброс видимости <<-
function resetPostVisibility() {
   const posts = document.querySelectorAll("#page_wall_posts ._post");
   posts.forEach((post) => {
      if (post.classList.contains("vkgs_hide-post")) {
         post.classList.remove("vkgs_hide-post");
      }
   });
}

// ======================================
// =============== ПОИСК ================
// ======================================
function searchPostDate() {
   const dateSearchValue = document.getElementById("vkgs_date").value.trim(); // (27) Получаем значение фильтра по дате
   // const excludeTerms = getExcludeTerms(); // (28) Получаем список слов-исключений
   const excludeTerms = document
      .getElementById("vkgs_exclude-terms")
      .value.split(",")
      .map((item) => item.trim()); // (28) Получаем список слов-исключений
   const {
      includeImages,
      includeVideos,
      includeFiles,
      hideAuthor,
      hideDescription,
      hideLikes,
   } = getCheckboxValues(); // (29) Получаем значения чекбоксов
   const posts = document.querySelectorAll("#page_wall_posts ._post"); // (30) Находим все посты на странице

   resetPostVisibility(posts); // (31) Сбрасываем видимость постов перед применением фильтров

   const [exactYear, yearAfter, yearBefore] = getYearFilters(dateSearchValue); // (32) Определяем параметры фильтрации по году

   console.log(
      "[VKGS] " +
         `Фильтр \n— Год: ${exactYear || "(пусто)"} \n— До: ${
            yearBefore || "(пусто)"
         } \n— После: ${yearAfter || "(пусто)"} \n\nСлова-исключения: ${
            excludeTerms.join(", ") || "(пусто)"
         } \n\nЧекбоксы: \n— Фото: ${includeImages} \n— Видео: ${includeVideos} \n— Файлы: ${includeFiles} \n\nСкрыть: \n— Автор: ${hideAuthor}\n— Описание: ${hideDescription}\n— Лайки: ${hideLikes}`
   );

   const filteredPosts = [];

   // (33) Перебираем все посты и применяем фильтрацию
   posts.forEach((post) => {
      const postYear = getPostYear(post); // (34) Получаем год поста

      // (35) Применяем фильтрацию по году, вложениям и словам-исключениям
      if (
         !checkYear(postYear, exactYear, yearAfter, yearBefore) ||
         !checkAttachments(post, {
            includeImages,
            includeVideos,
            includeFiles,
         }) ||
         containsExcludedTerms(post, excludeTerms)
      ) {
         post.classList.add("vkgs_hide-post"); // (36) Скрываем пост, если он не соответствует фильтрам
         return;
      }

      // (37) Применение скрытия отдельных элементов поста
      hidePostElements(post, { hideAuthor, hideDescription, hideLikes });

      // (38) Добавляем пост в список отфильтрованных
      filteredPosts.push(post);
   });

   console.log(`[VKGS] \nРезультат: ${filteredPosts.length}`);
}

// ======================================
// =============== СКРЫТЬ ===============
// ======================================
function hidePostElements(post, { hideAuthor, hideDescription, hideLikes }) {
   wall = document.getElementById("page_wall_posts");

   if (hideAuthor && post.querySelector(".PostHeader")) {
      wall.classList.add("vkgs_post_hide-author");
   } else if (wrapper.classList.contains("vkgs_post_hide-author")) {
      wall.classList.remove("vkgs_post_hide-author");
   }

   if (
      hideDescription &&
      (post.querySelector(".wall_post_text") ||
         post.querySelector(".vkitPostText__root"))
   ) {
      wall.classList.add("vkgs_hide-description");
   } else if (wrapper.classList.contains("vkgs_hide-description")) {
      wall.classList.remove("vkgs_hide-description");
   }

   if (
      hideLikes &&
      (post.querySelector(".PostBottomActionLikeBtns") ||
         post.querySelector(".like_wrap") ||
         post.querySelector(".post_replies_header") ||
         post.querySelector(".replies"))
   ) {
      wall.classList.add("vkgs_hide-likes");
   } else if (wrapper.classList.contains("vkgs_hide-likes")) {
      wall.classList.remove("vkgs_hide-likes");
   }
}

// ======================================
// ============== ПРОВЕРКА ==============
// ======================================
// ->> Проверка слов-исключений <<-
function containsExcludedTerms(post) {
   console.log("1================================================");
   console.log(post.classList);
   console.log("2================================================");
   return "2024";
}
// ->> Проверка даты <<-
function checkYear(postYear, exactYear, yearAfter, yearBefore) {
   console.log("3================================================");
   // console.log(post.classList);
   console.log("4================================================");
   return "2024";
}
// ->> Проверка вложений <<-
function checkAttachments(post, attachments) {
   console.log("5================================================");
   console.log(post.classList);
   console.log("6================================================");
   return "2024";
}
