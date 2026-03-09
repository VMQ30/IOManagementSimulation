import style from "../styles/AlgoList.module.css";

export function AlgoList({
  selectedAlgorithm,
  setSelectedAlgorithm,
  ALGORITHMS,
}) {
  return (
    <section className={style["algo-section"]}>
      <h3>Algorithm</h3>
      <div className={style["algo-list-choices"]}>
        {ALGORITHMS.map((algorithm) => (
          <button key={algorithm} className={style["algo-choice"]}>
            {algorithm}
          </button>
        ))}
      </div>
    </section>
  );
}
