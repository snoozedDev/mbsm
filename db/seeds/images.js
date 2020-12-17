exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("images")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("images").insert([
        { url: "https://cdn.mbsm.io/avatar/1857233179125778.png" },
      ]);
    });
};
