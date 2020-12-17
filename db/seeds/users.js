exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          username: "asd",
          password:
            "$2b$10$JJtxUAQ0/KnOvMhrOLPai.vQzaB0v0USbPyfS4CpZLymKOhd.Hhbe",
          avatar_id: 1,
        }
      ]);
    });
};
