import { faker } from "@faker-js/faker";

export function generateProducts() {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.string.alphanumeric({ length: { min: 4, max: 7 } }),
    price: parseFloat(faker.commerce.price()),
    status: faker.datatype.boolean(),
    stock: faker.number.int({ min: 10, max: 100 }),
    category: faker.commerce.department(),
    thumbnails: [faker.image.url(), faker.image.url()],
  };
}
