exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        { username: "Sam", password: "Gamgee", department: "RingBearer" },
        { username: "Frodo", password: "Baggins", department: "RingBearer" },
        { username: "Mary", password: "Pippen", department: "RingBearer" },
      ]);
    });
};
