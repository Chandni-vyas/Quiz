import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import "./Question.css";
import Chip from "@mui/material/Chip";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { Hourglass } from "react-loader-spinner";
import arrayShuffle from "array-shuffle";
const Question = () => {
  const [appData, setAppData] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswerList, setSelectedAnswerList] = useState(
    Array(50).fill("")
  );
  const [answerList, setAnswerList] = useState<string[][]>([]);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://opentdb.com/api.php?amount=50");
      const mergedData = response.data.results.map((question) => ({
        answers: [question.correct_answer, ...question.incorrect_answers],
      }));
      let shufflede: string[][] = [];
      for (let i = 0; i < 50; i++) {
        shufflede[i] = arrayShuffle(mergedData[i].answers);
      }
      setAnswerList(shufflede);
      console.log("response.data.results", response.data.results);
      setAppData(response.data.results);
      setSelectedAnswerList("");
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (buttonClicked) {
      setButtonClicked(false);
      let correctCount = 0;
      appData.forEach((question, index) => {
        if (question.correct_answer === selectedAnswerList[index]) {
          correctCount++;
        }
      });

      Promise.resolve().then(() => {
        alert(`Correct Answer is: ${correctCount}`);
        fetchData();
      });
    }
  }, [buttonClicked]);

  useEffect(() => {}, [answerList]);
  const handleRadioButtonClick = (index) => (event) => {
    const newSelectedAnswers = [...selectedAnswerList];
    newSelectedAnswers[index] = event.target.value;
    setSelectedAnswerList(newSelectedAnswers);
  };

  const handleButtonClick = () => {
    setButtonClicked(true);
  };

  return (
    <div>
      {isLoading ? (
        <Hourglass
          visible={true}
          height="100"
          width="100"
          ariaLabel="hourglass-loading"
          wrapperStyle={{
            margin: "100px auto",
          }}
          wrapperClass=""
          colors={["#FFFFFF", "#000000"]}
        />
      ) : (
        <div className="container">
          <form>
            {appData.map((question, index) => (
              <div key={index}>
                <div className="chipContainer">
                  <Chip
                    label={"Difficulty: " + question.difficulty}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={"Category: " + question.category}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                </div>
                <Divider />
                <h2>
                  <span>{index + 1}.</span>
                  {question.question}
                </h2>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                >
                  {answerList[index].map((answer, i) => (
                    <FormControlLabel
                      key={i}
                      value={answer}
                      control={<Radio />}
                      label={answer}
                      onClick={handleRadioButtonClick(index)}
                    />
                  ))}
                </RadioGroup>
              </div>
            ))}
            <Button
              className="btnCenter"
              color="success"
              variant="contained"
              type="button"
              onClick={handleButtonClick}
            >
              Submit
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Question;
