/* global axios */
const itemTemplate = document.querySelector("#diary-card-template");
const diaryBoard = document.querySelector("#diary-cards-display");
const detailTemplate = document.querySelector("#diary-detail-template");

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

async function main() {
  setupEventListeners();
  try {
    const diaries = await getDiaries();
    diaries.forEach((diary) => renderDiary(diary));
  } catch (error) {
    alert("Failed to load diary cards!");
  }
}

function setupEventListeners() {
  const addDiaryButton = document.querySelector("#diary-add");
  const submitDiaryButton = document.querySelector("#diary-submit");
  const feelingInput = document.querySelector("#feeling-input");
  const categoryInput = document.querySelector("#category-input");
  const descriptionInput = document.querySelector("#floatingTextarea2");
  // const preview = document.querySelector(".image-preview");
  const filter = document.querySelector("#filter-input");
  
  function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        resolve(reader.result);
      });

      reader.addEventListener("error", () => {
        reject(reader.error);
      });

      reader.readAsDataURL(file);
    });
  }

  submitDiaryButton.addEventListener("click", async () => {
    const feeling = feelingInput.value;
    const category = categoryInput.value;
    const description = descriptionInput.value;
    const imageInput = document.querySelector("input[type=file]").files[0];
    
    if ( isNaN(feeling) ) {
      alert("Please select a feeling!");
      return;
    }
    if ( isNaN(category) ) {
      alert("Please select a category!");
      return;
    }
    if ( !description ) {
      alert("Please give an English description!");
      return;
    }

    try {
      if (imageInput) {
        const base64String = await readAsDataURL(imageInput);
        // preview.src = base64String; 
        // console.log(preview.src);
        const diary = await createDiary({ feeling, category, description, image: base64String });
        renderDiary(diary);
      } else {
        const diary = await createDiary({ feeling, category, description });
        renderDiary(diary);
      }
    } catch (error) {
      // console.log(error);
      alert("Failed to create a new diary!");
      return;
    }

    feelingInput.value = "";
    categoryInput.value = "";
    descriptionInput.value = "";
    location.reload();
    addDiaryButton.blur();
  });

  filter.addEventListener("change", async () => {
    console.log(filter.value);
    const filterInput = parseInt(filter.value);
    try {
      for (const diaryCard of diaryBoard.children) {
        if ( filterInput === 1 ) {
          const feeling = diaryCard.getElementsByClassName("diary-feeling")[0].innerHTML;
          if ( feeling === "Happy" ) {
            diaryCard.style.display = "block";
          } else {
            diaryCard.style.display = "none";
          }
        } else if ( filterInput === 2 ) {
          const feeling = diaryCard.getElementsByClassName("diary-feeling")[0].innerHTML;
          if ( feeling === "Angry" ) {
            diaryCard.style.display = "block";
          } else {
            diaryCard.style.display = "none";
          }
        } else if ( filterInput === 3 ) {
          const feeling = diaryCard.getElementsByClassName("diary-feeling")[0].innerHTML;
          if ( feeling === "Sad" ) {
            diaryCard.style.display = "block";
          } else {
            diaryCard.style.display = "none";
          }
        } else if ( filterInput === 4 ) {
          const category = diaryCard.getElementsByClassName("diary-category")[0].innerHTML;
          if ( category === "Academic" ) {
            diaryCard.style.display = "block";
          } else {
            diaryCard.style.display = "none";
          }
        } else if ( filterInput === 5 ) {
          const category = diaryCard.getElementsByClassName("diary-category")[0].innerHTML;
          if ( category === "Social-life" ) {
            diaryCard.style.display = "block";
          } else {
            diaryCard.style.display = "none";
          }
        } else if ( filterInput === 6 ) {
          const category = diaryCard.getElementsByClassName("diary-category")[0].innerHTML;
          if ( category === "Student-Organization" ) {
            diaryCard.style.display = "block";
          } else {
            diaryCard.style.display = "none";
          }
        }
      }
    } catch (error) {
      alert("Failed to apply filter!");
    }
    filter.blur();
  })
}

function renderDiary(diary) {
  const item = createDiaryCard(diary);
  diaryBoard.appendChild(item);
}

function createDiaryCard(diary) {
  const item = itemTemplate.content.cloneNode(true);
  const container = item.querySelector(".diary-card");
  container.id = diary.id;
  // console.log(diary);
  const dayMap = {0:"Sun", 1:"Mon", 2:"Tue", 3:"Wed", 4:"Thu", 5:"Fri", 6: "Sat"};
  const updateTime = item.querySelector(".diary-update-time");
  const temp = new Date(diary.updatedAt);
  const date = temp.toISOString().slice(0, 10).replaceAll('-', '.');
  const day = dayMap[temp.getDay()];
  updateTime.innerText = date + ' (' + day + ')';
  const feeling = item.querySelector(".diary-feeling");
  // Create hidden feeling number to grab later
  const feelingNum = item.querySelector(".diary-feeling-number");
  feelingNum.innerText = diary.feeling;
  if (diary.feeling === 1) {
    feeling.innerText = "Happy";
  } else if (diary.feeling === 2) {
    feeling.innerText = "Angry";
  } else if (diary.feeling === 3) {
    feeling.innerText = "Sad";
  }
  const category = item.querySelector(".diary-category");
  // Create hidden category number to grab later
  const categoryNum = item.querySelector(".diary-category-number");
  categoryNum.innerText = diary.category;
  if (diary.category === 1) {
    category.innerText = "Academic";
  } else if (diary.category === 2) {
    category.innerText = "Social-life";
  } else if (diary.category === 3) {
    category.innerText = "Student-Organization";
  }
  // Create hidden description to grab later
  const description = item.querySelector(".diary-description");
  description.innerText = diary.description;
  // Create hidden image innerText to grab later
  const image = item.querySelector(".diary-image");
  if ( diary.image ) {
    image.innerText = diary.image;
  } else {
    image.innerText = "https://wallpapers.com/images/featured/harry-potter-gi5aixvd4d26cpij.jpg";
  }
  // console.log(image.innerText);
  const viewCard = item.getElementById(diary.id);
  viewCard.addEventListener("click", () => {
    viewDiaryCard(diary.id);
  });
  return item;
}

async function viewDiaryCard(id) {
  const filter = document.querySelector("#filter-input");
  filter.style.display = "none";
  const diary = document.getElementById(id);
  // console.log(diary);
  const item = detailTemplate.content.cloneNode(true);
  const container = item.querySelector(".detail-card");
  container.id = id;
  const updateTime = item.querySelector(".detail-update-time");
  updateTime.innerText = diary.getElementsByClassName("diary-update-time")[0].innerHTML;
  const feeling = item.querySelector(".detail-feeling");
  feeling.innerText = diary.getElementsByClassName("diary-feeling")[0].innerHTML;
  const category = item.querySelector(".detail-category");
  category.innerText = diary.getElementsByClassName("diary-category")[0].innerHTML;
  const description = item.querySelector(".detail-description");
  description.innerText = diary.getElementsByClassName("diary-description")[0].innerHTML;
  const image = item.querySelector("img.detail-image");
  image.src = diary.getElementsByClassName("diary-image")[0].innerHTML;
  
  // Insert place holders
  const feelingField = item.querySelector("#feeling-place-holder");
  feelingField.innerText = feeling.innerHTML;
  const categoryField = item.querySelector("#category-place-holder");
  categoryField.innerText = category.innerHTML;
  const descriptionField = item.querySelector(".form-control");
  descriptionField.value = description.innerHTML;
  
  // Update Submit Button
  const updateSubmitButton = item.querySelector("button.detail-update-submit");
  const feelingUpdateInput = item.querySelector("#feeling-update");
  const categoryUpdateInput = item.querySelector("#category-update");
  const descriptionUpdateInput = item.querySelector(".form-control");
  const updateWindowCloseButton = item.querySelector("#update-window-close-button");
  const updateButton = item.querySelector("#diary-update");
  
  updateSubmitButton.addEventListener("click", async () => {

    // User cannot update image

    const feelingNum = diary.getElementsByClassName("diary-feeling-number")[0].innerHTML;
    const categoryNum = diary.getElementsByClassName("diary-category-number")[0].innerHTML;
    let feelingUpdate = feelingUpdateInput.value;
    let categoryUpdate = categoryUpdateInput.value;
    const descriptionUpdate = descriptionUpdateInput.value;
    
    if ( isNaN( feelingUpdate ) ) {
      feelingUpdate = feelingNum;
    }
    if ( isNaN( categoryUpdate ) ) {
      categoryUpdate = categoryNum; 
    }
    if ( !descriptionUpdate ) {
      alert("Please give an English description!");
      return;
    }
    
    try {
      if ( image.src === "https://wallpapers.com/images/featured/harry-potter-gi5aixvd4d26cpij.jpg" ) {
        await updateDiaryStatus( id, { feeling: feelingUpdate, category: categoryUpdate, description: descriptionUpdate } );
      } else {
        await updateDiaryStatus( id, { feeling: feelingUpdate, category: categoryUpdate, description: descriptionUpdate, image: image.src });
      }
    } catch (error) {
      alert("Failed to update a new diary!");
      return;
    }

    feelingUpdateInput.value = "";
    categoryUpdateInput.value = "";
    descriptionUpdateInput.value = "";
    updateWindowCloseButton.click();

    if (feelingUpdate === 1) {
      feeling.innerText = "Happy";
    } else if (feelingUpdate === 2) {
      feeling.innerText = "Angry";
    } else if (feelingUpdate === 3) {
      feeling.innerText = "Sad";
    }

    if (categoryUpdate === 1) {
      category.innerText = "Academic";
    } else if (categoryUpdate === 2) {
      category.innerText = "Social-life";
    } else if (categoryUpdate === 3) {
      category.innerText = "Student-Organization";
    }

    description.innerText = descriptionUpdate
    
    deleteButton.style.display = 'none';
    updateButton.style.display = 'none';
  });

  // Delete Button
  const deleteButton = item.querySelector("button.delete-diary-card");
  deleteButton.dataset.id = id;
  deleteButton.addEventListener("click", () => {
    deleteDiaryCard(id);
  });

  // Back Button
  const backButton = item.getElementById("diary-back-to-cards");
  backButton.addEventListener("click", () => {
    location.reload();
  });

  // remove all diary cards from diaryBoard
  for (const diaryCard of diaryBoard.children) {
    diaryCard.style.display = 'none';
  }
  // while (diaryBoard.firstChild) {
  //     diaryBoard.removeChild(diaryBoard.firstChild);
  // }
  // add 1 detail page to diaryBoard
  diaryBoard.appendChild(item);
}

async function deleteDiaryCard(id) {
  try {
    await deleteDiaryById(id);
  } catch (error) {
    alert("Failed to delete diary card!");
  } finally {
    location.reload();
  }
}

// R
async function getDiaries() {
  const response = await instance.get("/diaries");
  return response.data;
}

// C
async function createDiary(diary) {
  const response = await instance.post("/diaries", diary);
  return response.data;
}

// U eslint-disable-next-line no-unused-vars
async function updateDiaryStatus(id, diary) {
  const response = await instance.put(`/diaries/${id}`, diary);
  return response.data;
}

// D
async function deleteDiaryById(id) {
  const response = await instance.delete(`/diaries/${id}`);
  return response.data;
}

main();
