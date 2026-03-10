import style from "../styles/Graph.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";

export function Graph({ simulationData, selectedAlgorithm, maxTrack }) {
  console.log(selectedAlgorithm);
  if (!simulationData || !selectedAlgorithm || simulationData.length === 0) {
    return (
      <section className={style["graph-container"]}>
        <div className={style["placeholder"]}>
          <h4>Configure and Run a Simulation</h4>
        </div>
      </section>
    );
  }
  return (
    <section className={style["graph-container"]}>
      <GraphHeader
        selectedAlgorithm={selectedAlgorithm}
        simulationData={simulationData}
      />
      <RenderGraph simulationData={simulationData} maxTrack={maxTrack} />
    </section>
  );
}

function GraphHeader({ selectedAlgorithm, simulationData }) {
  const totalMovement = simulationData.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return 0;
    return acc + Math.abs(curr.track - arr[idx - 1].track);
  }, 0);

  return (
    <>
      <div className={style["graph-header"]}>
        <div>
          <h3>{selectedAlgorithm}</h3>
          <p>Disk Scheduling</p>
        </div>
        <div>
          <h4>Total: {totalMovement} Tracks</h4>
        </div>
      </div>

      <div className={style["graph-wrapper"]}></div>
    </>
  );
}

function RenderGraph({ simulationData, maxTrack }) {
  console.log(simulationData);
  if (!simulationData || simulationData.length === 0) return null;
  return (
    <div className={style["graph"]}>
      <ResponsiveContainer>
        <LineChart data={simulationData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="step"
            label={{ value: "Time (Steps)", position: "bottom" }}
          />
          <YAxis
            domain={[0, Number(maxTrack) || 200]}
            tickCount={10}
            label={{
              value: "Track Number",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            labelFormatter={(value) => `Step ${value}`}
            formatter={(value, name) => {
              if (name === "distance") return [value, "Tracks Moved"];
              return [value, name];
            }}
          />
          <Line
            type="linear"
            dataKey="track"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
            animationDuration={1000}
          />
          <Line
            dataKey="distance"
            stroke="none"
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
