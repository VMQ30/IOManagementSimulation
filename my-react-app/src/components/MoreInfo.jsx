import style from "../styles/MoreInfo.module.css";

export function MoreInfo({ graphData }) {
  if (!graphData) return null;
  return (
    <div className={style["more-info"]}>
      <div className={style["header"]}>
        <h3>Movement Breakdown</h3>

        <p>
          Average Seek Time:{" "}
          {graphData.reduce((acc, curr, idx, arr) => {
            if (idx === 0) return 0;
            return acc + Math.abs(curr.track - arr[idx - 1].track);
          }, 0) / graphData.length}
        </p>
      </div>
      <div className={style["breakdown"]}>
        {graphData.slice(0, -1).map((data, index) => (
          <div key={index} className={style["info-row"]}>
            <p>
              {data.track} → {graphData[index + 1].track}
            </p>
            <p>{data.distance} tracks</p>
          </div>
        ))}
      </div>
    </div>
  );
}
