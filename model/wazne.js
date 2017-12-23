db.collection.aggregate([
  {
    "$project": {
      "boardcards": {
        "$reduce": {
          "input": "$lists.cards",
          "initialValue": [],
          "in": {
            "$concatArrays": [
              "$$value",
              {
                "$filter": {
                  "input": "$$this",
                  "as": "result",
                  "cond": {
                    "$eq": [
                      "$$result.Author",
                      ObjectId("59df60fb6fad6224f4f9f22a")
                    ]
                  }
                }
              }
            ]
          }
        }
      }
    }
  },
  {
    "$unwind": "$boardcards"
  },
  {
    "$group": {
      "_id": null,
      "allboardcards": {
        "$push": "$boardcards"
      }
    }
  }
])

As asked in the comment to get just the names of cards you have to wrap the $filter in $map operator to only map card names.

So replace $filter with $map + $filter

{
  "$map": {
    "input": {
      "$filter": {
        "input": "$$this",
        "as": "result",
        "cond": {
          "$eq": [
            "$$result.Author",
           ObjectId("59df60fb6fad6224f4f9f22a")
          ]
        }
      }
    },
    "as": "result",
    "in": {
      "name": "$$result.name"
    }
  }
}




db.boards.aggregate(
  [
    {
      $project: {
        "boardcards": {
          $reduce: {
            input: "$lists.cards",
            initialValue: [ ],
            in: { $concatArrays: [ "$$value", {
            $filter: {
               input: "$$this",
               as: "result",
               cond: { "$eq": [
                      "$$result.Author",
                       ObjectId("59df60fb6fad6224f4f9f22d")                    
                   ] 
                   }
            }
         } 
         ] 
         }
          }
        }
      }
    }
  ]
)



db.boards.aggregate(
  [
    {
      $project: {
        "boardcards": {
          $reduce: {
            input: "$lists.cards",
            initialValue: [ ],
            in: { $concatArrays: [ "$$value", {
            $filter: {
               input: "$$this",
               as: "result",
               cond: { "$eq": [
                      "$$result.Author",
                       [ObjectId("59df60fb6fad6224f4f9f22d")]                    
                   ] 
                   }
            }
         } 
         ] 
         }
          }
        }
      }
    }
  ]
)



    <!--<script>
      var menu = document.querySelector('.side-menu');
      var menuLink = document.querySelector('.side-menu-trigger');
      var closeBtn = document.querySelector('.close-menu-btn');

      menuLink.addEventListener("click", function () {
        if (!(menu.classList.contains('side-menu--opened'))) {
          menu.classList.add('side-menu--opened');
        }
      });

      closeBtn.addEventListener("click", function () {
        if (menu.classList.contains('side-menu--opened')) {
          menu.classList.remove('side-menu--opened');
        }
      })
    </script>-->


    dnd-selected="item.selected = card" dnd-selected="board.selected = item"