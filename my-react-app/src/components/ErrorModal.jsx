import style from "../styles/ErrorModal.module.css";

export function ErrorModal({ errorMessage, setIsModalOpen }) {
  return (
    <div className={style["modal-container"]}>
      <div className={style["modal"]}>
        <div className={style["modal-header"]}>
          <button onClick={() => setIsModalOpen(false)}>🗙</button>
        </div>
        <div className={style["modal-message"]}>
          <h3>Error!</h3>
          <p>{errorMessage}</p>
        </div>
      </div>
    </div>
  );
}
