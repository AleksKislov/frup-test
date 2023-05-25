import { faker } from "@faker-js/faker";
import { Customer, ICustomer } from "../tools/models";

const createRandomCustomer = (): ICustomer => {
  return new Customer({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    address: {
      line1: faker.location.streetAddress(),
      line2: faker.location.secondaryAddress(),
      postcode: faker.location.zipCode(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
    },
  });
};

export function createRndCustomers(): ICustomer[] {
  const count = Math.floor(Math.random() * 10) + 1; // 1-10 customers
  return faker.helpers.multiple(createRandomCustomer, { count });
}
