import { Configuration } from "../components/Configuration";
import { AlgoList } from "../components/AlgoList";
import { Graph } from "../components/Graph";

import { useState } from "react";
import style from "../styles/Simulation.module.css";

const ALGORITHMS = ["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"];

export function Simulation() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(ALGORITHMS[0]);
  const [graphData, setGraphData] = useState([]);
  const [userInput, setUserInput] = useState({
    requests: "",
    initialHead: "",
    maxTrack: "",
  });

  const handleRunSimulation = () => {
    const results = formatSimulationData(selectedAlgorithm, userInput);
    setGraphData(results);
  };

  const getUserInput = (e) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({ ...prev, [name]: value }));
  };

  const formatSimulationData = (selectedAlgorithm, userInput) => {
    if (
      !selectedAlgorithm ||
      userInput["requests"].length === 0 ||
      userInput["initialHead"] === "" ||
      userInput["maxTrack"] === ""
    )
      return [];

    const cleanedRequests = userInput["requests"]
      .split(/[ ,]+/)
      .filter(Boolean)
      .map(Number);

    const head = Number(userInput["initialHead"]);
    let sequence = [];

    switch (selectedAlgorithm) {
      case "FCFS":
        sequence = [head, ...cleanedRequests];
    }
    return sequence.map((trackValue, index) => {
      const prevTrack = index > 0 ? sequence[index - 1] : trackValue;
      const diff = Math.abs(trackValue - prevTrack);
      return {
        step: index,
        track: trackValue,
        distance: diff,
      };
    });
  };

  return (
    <main className={style["main-simulation"]}>
      <div className={style["main-left"]}>
        <Configuration userInput={userInput} getUserInput={getUserInput} />
        <AlgoList
          ALGORITHMS={ALGORITHMS}
          selectedAlgorithm={selectedAlgorithm}
          setSelectedAlgorithm={setSelectedAlgorithm}
        />
        <button onClick={handleRunSimulation}>Run Simulation</button>
      </div>
      <div className={style["main-right"]}>
        <Graph
          simulationData={graphData}
          selectedAlgorithm={selectedAlgorithm}
          maxTrack={userInput["maxTrack"]}
        />
      </div>
    </main>
  );
}
