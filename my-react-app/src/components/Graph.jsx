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
  ReferenceLine,
  ReferenceDot,
} from "recharts";

export function Graph({ simulationData, selectedAlgorithm, maxTrack }) {
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
  if (!simulationData || simulationData.length === 0) return null;
  const latestTrack = simulationData[simulationData.length - 1].track;
  return (
    <div className={style["graph"]}>
      <ResponsiveContainer>
        <LineChart
          data={simulationData}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid
            stroke="#badfe7"
            strokeOpacity={0.5}
            strokeDasharray="5 5"
            vertical={false}
          />
          <XAxis
            dataKey="step"
            axisLine={{ stroke: "#badfe7", strokeWidth: 1 }}
            tickLine={false}
            label={{
              value: "Time (Steps)",
              position: "bottom",
              fill: "#6d9d9d",
            }}
            tick={{ fill: "#6d9d9d", fontSize: 12, fontWeight: 500 }}
          />
          <YAxis
            domain={[0, Number(maxTrack) || 200]}
            tickCount={10}
            axisLine={{ stroke: "#badfe7", strokeWidth: 1 }}
            tickLine={false}
            label={{
              fill: "#6d9d9d",
              value: "Track Number",
              angle: -90,
              position: "insideLeft",
            }}
            tick={{ fill: "#6d9d9d", fontSize: 12, fontWeight: 500 }}
          />
          <Tooltip
            labelFormatter={(value) => `Step ${value}`}
            formatter={(value, name) => {
              if (name === "distance") return [value, "Tracks Moved"];
              return [value, name];
            }}
          />
          <ReferenceLine
            y={latestTrack}
            stroke="#388087"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            strokeOpacity={0.6}
          />
          <Line
            type="linear"
            dataKey="track"
            stroke="#388087"
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
