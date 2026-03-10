import { Configuration } from "../components/Configuration";
import { AlgoList } from "../components/AlgoList";
import { Graph } from "../components/Graph";
import { ErrorModal } from "../components/ErrorModal";

import { useState, useEffect } from "react";
import style from "../styles/Simulation.module.css";

const ALGORITHMS = ["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"];

export function Simulation() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(ALGORITHMS[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
    try {
      const results = formatSimulationData(selectedAlgorithm, userInput);
      setGraphData(results);
      setCurrentStep(0);
    } catch (error) {
      setIsModalOpen(true);
      setErrorMessage(error.message);
    }
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
    ) {
      throw new Error("Missing Input");
    }

    const head = Number(userInput["initialHead"]);
    const max = Number(userInput["maxTrack"]);

    const cleanedRequests = userInput["requests"]
      .split(/[ ,]+/)
      .filter(Boolean)
      .map((num) => {
        const n = Number(num);
        if (isNaN(n)) throw new Error(`"${num}" is not a valid number.`);
        return n;
      });

    if (isNaN(head) || isNaN(max)) {
      throw new Error("Initial Head and Max Track must be valid numbers.");
    }

    if (Math.max(...cleanedRequests) > max || head > max) {
      throw new Error(
        `Out of Bounds: The head (${head}) and all requests must be between 0 and the Max Track (${max}).`,
      );
    }

    const allInts = [head, max, ...cleanedRequests].every(Number.isInteger);
    if (!allInts) {
      throw new Error("Please use whole numbers only (no decimals).");
    }

    let sequence = [];

    switch (selectedAlgorithm) {
      case "FCFS":
        sequence = [head, ...cleanedRequests];
        break;
      case "SSTF":
        sequence = [head, ...cleanedRequests];
        for (let i = 1; i < sequence.length; i++) {
          let dif = i;
          for (let j = i + 1; j < sequence.length; j++) {
            if (
              Math.abs(sequence[dif] - sequence[i - 1]) >
              Math.abs(sequence[j] - sequence[i - 1])
            ) {
              dif = j;
            }
          }
          [sequence[i], sequence[dif]] = [sequence[dif], sequence[i]];
        }
        break;
      case "SCAN":
        sequence = [head, ...cleanedRequests, Number(userInput["maxTrack"])];
        sequence.sort((a, b) => a - b);

        const seqScan1 = sequence.slice(sequence.indexOf(head));
        const seqScan2 = sequence
          .slice(0, sequence.indexOf(head))
          .sort((a, b) => b - a);

        sequence = [...seqScan1, ...seqScan2];
        break;

      case "C-SCAN":
        sequence = [head, ...cleanedRequests, 0, Number(userInput["maxTrack"])];
        sequence.sort((a, b) => a - b);

        const seqCScan1 = sequence.slice(sequence.indexOf(head));
        const seqCScan2 = sequence.slice(0, sequence.indexOf(head));

        sequence = [...seqCScan1, ...seqCScan2];
        break;

      case "LOOK":
        sequence = [head, ...cleanedRequests];
        sequence.sort((a, b) => a - b);

        const seqLook1 = sequence.slice(sequence.indexOf(head));
        const seqLook2 = sequence
          .slice(0, sequence.indexOf(head))
          .sort((a, b) => b - a);

        sequence = [...seqLook1, ...seqLook2];
        break;
      case "C-LOOK":
        sequence = [head, ...cleanedRequests];
        sequence.sort((a, b) => a - b);

        const seqCLook1 = sequence.slice(sequence.indexOf(head));
        const seqCLook2 = sequence.slice(0, sequence.indexOf(head));

        sequence = [...seqCLook1, ...seqCLook2];
        break;
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
      {isModalOpen && (
        <ErrorModal
          errorMessage={errorMessage}
          setIsModalOpen={setIsModalOpen}
        />
      )}
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
