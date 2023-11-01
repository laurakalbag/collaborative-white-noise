import "./styles.css";
import { machine } from "./machine";
import { createActor } from "xstate";

document.querySelector<HTMLDivElement>("#app").innerHTML = `
<div id="background">
  <div id="starscape"></div>
  <h1>Collaborative white noise</h1>
  <p>There are <span id="star-number">0</span> stars online.</p>
  <ul id="buttons">
    <li><button id="sound-toggle">Sound off</button></li>
    <li>
      <p class="colour0explainer">When 3 stars have voted the button below, the colour will change.</p>
      <button id="colour-toggle">Change colour to <span id="next-colour">Blue</span></button>
      <p class="votes">Votes: <span id="current-votes">0</span>/<span id="votes-required">3</span>.</p>
    </li>
  </ul>
</div>
`;
const actor = createActor(machine);
(window as any).actor = actor;
actor.subscribe((state) => {
  const stateValueString = state.configuration
    .filter((s) => s.type === "atomic" || s.type === "final")
    .map((s) => s.id)
    .join(", ")
    .split(".")
    .slice(1)
    .join(".");
  // Machine State value
  document.querySelector<HTMLPreElement>(
    "#state"
  ).outerHTML = `<code id="state">${stateValueString}</code>`;

  // Machine context
  document.querySelector("#context").innerHTML = JSON.stringify(
    state.context ?? {},
    null,
    2
  );

  console.log(
    `%cState value:%c ${state.value}`,
    "background-color: #056dff",
    "background-color: none"
  );
  console.log(
    `%cState:%c ${JSON.stringify(state, null, 2)}`,
    "background-color: #056dff",
    "background-color: none"
  );
  console.log(
    `%cNext events:%c ${state.nextEvents.map((eventType, i) =>
      i > 0 ? " " + eventType : eventType
    )}`,
    "background-color: #056dff",
    "background-color: none"
  );

  // create a button for each state event
  const eventsList = document.querySelector<HTMLUListElement>("#events");
  eventsList.innerHTML = "";
  state.nextEvents.forEach((eventType) => {
    if (eventType.startsWith("xstate.")) return;
    const button = document.createElement("button");
    if (!state.can({ type: eventType })) {
      button.disabled = true;
    }
    button.innerText = eventType;
    button.onclick = () => {
      actor.send({ type: eventType });
    };
    eventsList.appendChild(button);
    return button;
  });

  if (state.nextEvents.length === 0) {
    document.querySelector("#no-events-text").classList.add("show");
  }
});
actor.start();
