import { createMachine } from "xstate";

export const machine = createMachine(
  {
    context: {
      stars: 0,
    },
    id: "White noise",
    states: {
      Sound: {
        initial: "On",
        states: {
          On: {
            on: {
              "toggle sound": {
                target: "Off",
              },
            },
          },
          Off: {
            on: {
              "toggle sound": {
                target: "On",
              },
            },
          },
        },
      },
      Colour: {
        initial: "Blue",
        states: {
          Blue: {
            on: {
              "change colour": {
                target: "Purple",
                guard: "reachesVoteTotal",
              },
            },
          },
          Purple: {
            on: {
              "change colour": {
                target: "Pink",
                guard: "reachesVoteTotal",
              },
            },
          },
          Pink: {
            on: {
              "change colour": {
                target: "Blue",
                guard: "reachesVoteTotal",
              },
            },
          },
        },
      },
      Stars: {},
    },
    type: "parallel",
    types: {
      events: {} as { type: "change colour" } | { type: "toggle sound" },
      context: {} as { colourVotes: number; stars: number },
    },
  },
  {
    actions: {},
    actors: {},
    guards: { reachesVoteTotal: ({ context, event, guard }) => false },
    delays: {},
  },
);
