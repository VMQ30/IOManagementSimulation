import { Configuration } from "../components/Configuration";
import { AlgoList } from "../components/AlgoList";

import { useState } from "react";
import style from "../styles/Simulation.module.css";

const ALGORITHMS = ["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"];

export function Simulation() {
  const { selectedAlgorithm, setSelectedAlgorithm } = useState(ALGORITHMS[0]);
  return (
    <main className={style["main-simulation"]}>
      <div className={style["main-left"]}>
        <Configuration />
        <AlgoList ALGORITHMS={ALGORITHMS} />
        <button>Run Simulation</button>
      </div>
    </main>
  );
}
