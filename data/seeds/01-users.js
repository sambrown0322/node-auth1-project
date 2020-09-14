exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        { username: "Sam", password: "Gamgee" },
        { username: "Frodo", password: "Baggins" },
        { username: "Mary", password: "Pippen" },
      ]);
    });
};
