import style from "../styles/Configuration.module.css";

export function Configuration({ userInput, getUserInput }) {
  return (
    <section className={style["config-section"]}>
      <h3>Configuration</h3>
      <div className={style["config-req"]}>
        <h4>Track Requests</h4>
        <input
          name="requests"
          type="text"
          value={userInput.requests}
          onChange={getUserInput}
          placeholder="e.g. 118 59 110 25 105"
        />
        <p>Space or Comma Separated</p>
      </div>
      <div className={style["config-info"]}>
        <div>
          <h4>Initial Head</h4>
          <input
            name="initialHead"
            type="number"
            placeholder="70"
            value={userInput.initialHead}
            onChange={getUserInput}
          />
        </div>
        <div>
          <h4>Max Track</h4>
          <input
            name="maxTrack"
            type="number"
            placeholder="199"
            value={userInput.maxTrack}
            onChange={getUserInput}
          />
        </div>
      </div>
    </section>
  );
}
