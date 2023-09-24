import DiaryModel from "../models/todoModel.js";

// R
export const getDiaries = async (req, res) => {
  try {
    // Find all diaries
    const diaries = await DiaryModel.find({});

    // Return diaries
    return res.status(200).json(diaries);
  } catch (error) {
    // If there is an error, return 500 and the error message
    // You can read more about HTTP status codes here:
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // Or this meme:
    // https://external-preview.redd.it/VIIvCoTbkXb32niAD-rxG8Yt4UEi1Hx9RXhdHHIagYo.jpg?auto=webp&s=6dde056810f99fc3d8dab920379931cb96034f4b
    return res.status(500).json({ message: error.message });
  }
};
// C
export const createDiary = async (req, res) => {
  const { feeling, category, description, image } = req.body;

  // Check input fields 
  if ( !feeling || !category || !description) {
    return res
      .status(400)
      .json({ message: "Some of your fields are missing!" });
  }

  // Create a new todo
  try {
    if ( !image ) {
      const newDiary = await DiaryModel.create({
        feeling,
        category,
        description
      });
      return res.status(201).json(newDiary);
    } else {
      const newDiary = await DiaryModel.create({
        feeling,
        category,
        description,
        image
      });
      return res.status(201).json(newDiary);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// U
export const updateDiary = async (req, res) => {
  const { id } = req.params;
  const { feeling, category, description, image } = req.body;

  try {
    // Check if the id is valid
    const existedDiary = await DiaryModel.findById(id);
    if ( !existedDiary ) {
      return res.status(404).json({ message: "Diary card not found!" });
    }

    // Check input fields 
    if ( !feeling || !category || !description) {
      return res.status(400).json({ message: "Some of your fields are missing!" });
    }

    // Update the todo
    if ( feeling ) existedDiary.feeling = feeling;
    if ( category ) existedDiary.category = category;
    if ( description ) existedDiary.description = description;
    if ( image ) existedDiary.image = image;

    // Save the updated todo - db
    await existedDiary.save();

    // Rename _id to id
    existedDiary.id = existedDiary._id;
    delete existedDiary._id;

    // Show updated diary card - frontend
    return res.status(200).json(existedDiary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// D
export const deleteDiary = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if the id is valid
    const existedDiary = await DiaryModel.findById(id);
    if (!existedDiary) {
      return res.status(404).json({ message: "Diary card not found!" });
    }
    // Delete the diary
    await DiaryModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Diary card deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
