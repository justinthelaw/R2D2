const express = require("express");
const router = express.Router();
const knex = require("knex")(
  require("../knexfile.js")[process.env.NODE_ENV || "development"]
);
const cookieParser = require("cookie-parser");

express().use(cookieParser());

/** ROUTE REQUEST-ONLY ROUTES**/
router.get("/", async (req, res) => {
  await knex("requests")
    .select("*")
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
    .then((data) => {
      res.status(200).json(data).end();
    });
});

router.post("/post", async (req, res) => {
  await knex("requests")
    .insert({
      subject: req.body.subject,
      initiator_id: req.body.initiator_id,
      route_template_id: req.body.route_id,
      comments: req.body.comments,
      current_stage: 1,
      status: "En route",
      change_log: `Name: ${req.body.rank} ${
        req.body.lname
      }, Date: ${Date.now()}\n
      Comments: ${req.body.comments}`,
    })
    .then(() => {
      let request_stages = req.body.route_template[0].stages;
      request_stages
        .forEach(async (stage) => {
          let request_substages = stage.substages;
          await knex("request_stages")
            .insert({
              route_id: req.body.route_id,
              name: stage.name,
              suspense_hours: stage.suspense_hours,
              instructions: stage.instructions,
            })
            .then(() => {
              request_substages.forEach(async (substage) => {
                await knex("request_substages").insert({
                  route_id: stage.id,
                  name: substage.name,
                  group_id: substage.group_id,
                });
              });
            });
        })
        .then((data) =>
          res.status(200).json({ message: `Success`, data: data }).end()
        )
        .catch(() =>
          res
            .status(404)
            .json({
              message: `Error, you must use the force.`,
            })
            .end()
        );
    });
});

router.patch("/patch", async (req, res) => {
  await knex("requests")
    .where({
      id: req.body.request_id,
    })
    .update({
      name: req.body.name,
      group_id: req.body.group_id,
      instructions: req.body.instructions,
      updated_at: new Date(),
      change_log: `Name: ${req.body.rank} ${
        req.body.lname
      }, Date: ${Date.now()}\n
      Comments: ${req.body.comments}`,
    })
    .returning("id")
    .then((data) =>
      res.status(200).json({ message: `Success`, data: data }).end()
    )
    .catch(() =>
      res
        .status(404)
        .json({
          message: `Provided route name has already been used and created. Please use a different name or modify the existing route.`,
        })
        .end()
    );
});

router.delete("/delete", async (req, res) => {
  await knex("requests")
    .del()
    .where({
      id: req.body.request_id,
    })
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
    .then(res.status(200).json({ message: `Success` }).end());
});

// /** ROUTE_STAGE_SUBSTAGE TEMPLATES JOIN TABLES **/
// router.get("/:route_id", async (req, res) => {
//   await knex("stage_templates")
//     .join(
//       "route_templates",
//       "route_templates.id",
//       "stage_templates.route_template_id"
//     )
//     .where({ route_template_id: req.params.route_id })
//     .select(
//       "route_templates.id AS route_id",
//       "stage_templates.id AS stage_id",
//       "stage_templates.name AS stage_name",
//       "stage_templates.instructions AS stage_instructions",
//       "stage_templates.suspense_hours"
//     )
//     .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
//     .then((data) => {
//       res.status(200).json(data).end();
//     });
// });

// router.get("/:route_id/:stage_id", async (req, res) => {
//   await knex("substage_templates")
//     .join(
//       "stage_templates",
//       "stage_templates.id",
//       "substage_templates.stage_template_id"
//     )
//     .where({ stage_template_id: req.params.stage_id })
//     .join(
//       "route_templates",
//       "route_templates.id",
//       "stage_templates.route_template_id"
//     )
//     .where({ route_template_id: req.params.route_id })
//     .select(
//       "stage_templates.route_template_id AS route_id",
//       "substage_templates.stage_template_id AS stage_id",
//       "substage_templates.id AS substage_id",
//       "substage_templates.group_id"
//     )
//     .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
//     .then((data) => {
//       res.status(200).json(data).end();
//     });
// });

// router.get("/get/all/details", async (req, res) => {
//   let results = [];
//   await knex("route_templates")
//     .select("*")
//     .then(async (rows) => {
//       for (let i = 0; i < rows.length; i++) {
//         results.push({
//           route_name: rows[i].name,
//           route_id: rows[i].id,
//           route_instructions: rows[i].instructions,
//           stages: [],
//         });

//         await knex("stage_templates")
//           .select("*")
//           .where({ route_template_id: rows[i].id })
//           .then(async (rows) => {
//             for (let j = 0; j < rows.length; j++) {
//               results[i].stages.push({
//                 stage_id: rows[j].id,
//                 stage_name: rows[j].name,
//                 stage_instructions: rows[j].instructions,
//                 suspense_hours: rows[j].suspense_hours,
//                 substages: [],
//               });

//               await knex("substage_templates")
//                 .select("*")
//                 .where({ stage_template_id: rows[j].id })
//                 .then((rows) => {
//                   for (let k = 0; k < rows.length; k++) {
//                     results[i].stages[j].substages.push({
//                       substage_id: rows[k].id,
//                       group_id: rows[k].group_id,
//                     });
//                   }
//                 });
//             }
//           });
//       }
//       return results;
//     })
//     .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
//     .then((data) => {
//       res.status(200).json(data).end();
//     });
// });

module.exports = router;