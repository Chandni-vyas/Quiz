import React from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import './Question.css';
import Chip from '@mui/material/Chip';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
const Question = () => {
  const [appData, setAppData] = useState([]);
  const [count, setCount] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(false);
  const fetchData = async () => {
      try {
        const response = await axios.get('https://opentdb.com/api.php?amount=50');
        setAppData(response.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
     if (buttonClicked) {
      setButtonClicked(false);
      setTimeout(() => {
         alert(`Correct Answer is: ${count}`);
         setCount(0);
         fetchData();         
      }, 0);
     }
  }, [buttonClicked]);
  
  const handleRadioButtonClick = () => {
    setCount(count + 1);
  };

  const handleButtonClick = () => {
    setButtonClicked(true);
  };
 
  return (
    <div className='container'>   
      <form>
        {appData.map((question, index) => (        
          <div key={index}>
            <div className='chipContainer'>
              <Chip label={"Difficulty: "+question.difficulty} size="small" color="primary" variant="outlined" />
              <Chip label={"Category: "+question.category} size="small" color="success" variant="outlined" />
            </div>
            <Divider />
            <h2><span>{index + 1}.</span>{question.question}</h2>
            <RadioGroup aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group" >
              <FormControlLabel value={question.correct_answer} control={<Radio />} label={question.correct_answer} onClick={handleRadioButtonClick} />
              {question.incorrect_answers.map((answer, i) =>
              (
                <FormControlLabel key={i} value={answer} control={<Radio />} label={answer} />
              ))}
            </RadioGroup>
          </div>
        ))}
        <Button color="success" variant="contained" type="button" onClick={handleButtonClick}>Submit</Button>
      </form>
    </div>
  )
}

export default Question