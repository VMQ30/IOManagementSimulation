import { Configuration } from "../components/Configuration";
import { AlgoList } from "../components/AlgoList";
import { Graph } from "../components/Graph";

import { useState, useEffect } from "react";
import style from "../styles/Simulation.module.css";

const ALGORITHMS = ["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"];

export function Simulation() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(ALGORITHMS[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [userInput, setUserInput] = useState({
    requests: "",
    initialHead: "",
    maxTrack: "",
  });

  const nextStep = () => {
    if (currentStep < graphData.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const resetSteps = () => setCurrentStep(0);
  const fastForward = () => setCurrentStep(graphData.length - 1);

  const handleRunSimulation = () => {
    const results = formatSimulationData(selectedAlgorithm, userInput);
    setGraphData(results);
    setCurrentStep(0);
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

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        if (currentStep < graphData.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, graphData.length]);

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
          simulationData={graphData.slice(0, currentStep + 1)}
          selectedAlgorithm={selectedAlgorithm}
          maxTrack={userInput["maxTrack"]}
        />
        {graphData.length !== 0 && (
          <div className={style["button-control"]}>
            <button onClick={resetSteps}>↺</button>
            <button onClick={prevStep}>‹</button>
            <button onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button onClick={nextStep}>›</button>
            <button onClick={fastForward}>»</button>
            <span>
              Step {currentStep} / {graphData.length - 1}
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
