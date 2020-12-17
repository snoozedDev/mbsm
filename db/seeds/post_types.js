exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("post_types")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("post_types").insert([{ value: "text" }]);
    });
};
