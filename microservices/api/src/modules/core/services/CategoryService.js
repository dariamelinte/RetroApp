export default class CategoryService {
  constructor(injection) {
    Object.assign(this, injection);
  }

  createCategory(categoryName) {
    const { db } = this;
    return db.categories.insert({ name: categoryName });
  }

  editCategory({ categoryId, categoryName }) {
    const { db } = this;
    return db.categories.update(categoryId, {
      $set: {
        name: categoryName,
      },
    });
  }
}
