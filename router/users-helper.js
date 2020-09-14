const db = require("../data/db-config");

function find() {
  return db("users"); //CHANGE321
}

function add(user) {
  //CHANGE321
  return db("users") //CHANGE321
    .insert(user); //CHANGE321
}

function findBy(filter) {
  return db("users").where(filter).orderBy("id"); //CHANGE321
}

// function update(changes, id) {
//   return db('[TABLE]') //CHANGE321
//     .update(changes)
//     .where({ id })
//     .then( () => {
//       return findById(id)
//     })
// }

// function remove(id) {
//   let removed
//     findById(id).then(rez => removed=rez)
//   return db('[TABLE]') //CHANGE321
//     .where({ id })
//     .del()
//     .then(() => {
//       return removed
//     })
// }

module.exports = {
  find,
  // findById,
  add,
  // update,
  // remove
  findBy,
};
