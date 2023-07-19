import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { ArcElement } from "chart.js";
import Header from "./component/Header";
Chart.register(ArcElement);

const CommentAnalyzer = () => {
 
  const [videoLink, setVideoLink] = useState("");
  const [comments, setComments] = useState(false);
  const [positiveScore, setPositiveScore] = useState(0);
  const [negativeScore, setNegativeScore] = useState(0);
  const [neutralScore, setNeutralScore] = useState(0);

  // Dictionary of words with values
  const wordDictionary = {
    awesome: 1,
    great: 1,
    love:1,
    nice:1,
    bad: -1,
    useless: -1,
    boring: -1
    // Add more words and values as needed
  };

  function getVideoIdFromShortLink(shortLink) {
    const regex = /youtu\.be\/([^?]+)/;
    const match = shortLink.match(regex);
    
    if (match && match[1]) {
      return match[1];
    } else {
      return null;
    }
  }
  
  
  const videoId = getVideoIdFromShortLink(videoLink);
  

  // Function to fetch comments and analyze
  const analyzeComments = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/commentThreads`,{
          params: {
            part: 'snippet',
            videoId: videoId,
            key: 'YOUR_API_CODE', 
            maxResults: 100, 
          },
        }
      );

      const commentsData = response.data.items.map(
        (item) => item.snippet.topLevelComment.snippet.textDisplay
      );

      // Perform comment analysis
      let positiveCount = 0;
      let negativeCount = 0;
      let neutralCount = 0;

      commentsData.forEach((comment) => {
        const words = comment.toLowerCase().split(" ");

        let commentScore = 0;
        words.forEach((word) => {
          if (wordDictionary[word]) {
            commentScore += wordDictionary[word];
          }
        });

        if (commentScore > 0) {
          positiveCount++;
        } else if (commentScore < 0) {
          negativeCount++;
        } else {
          neutralCount++;
        }
      });

      setComments(commentsData);
      setPositiveScore(positiveCount);
      setNegativeScore(negativeCount);
      setNeutralScore(neutralCount);
      setComments(true)
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  return (
    <div>
      <Header/>
      <Box sx={{ height:'400px',display:"flex",justifyContent:'center',alignItems:'center', flexDirection:'column' }}>
          <Box>
            <Typography variant="h4" align="center" mt={2}>
              Youtube Video Comment Analyzer
            </Typography>
            <Typography variant="subtitle1" align="center" mt={1} mb={5} sx={{ wordBreak: "break-word",width:'700px'}} >
            An input a link to a YouTube video, a pie chart to display total likes and dislikes amounts, and a histogram to plot the results for different sentiment groups of comments.
            </Typography>
            
          </Box>
          <Box style={{display:'flex',justifyContent:'center',alignItems:'center',width:'900px'}}>
              {/* Input field to enter YouTube video link */}
              <TextField
                id="outlined-basic"
                label="Paste Youtube Video Link"
                variant="outlined"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                fullWidth />
              
              <Button style={{marginLeft:'10px',padding:'4px'}} variant="contained" onClick={analyzeComments}>Analyze Comments</Button>
              
            </Box>
      </Box>
      {comments && 
      <div style={{display:'flex',justifyContent:'space-evenly',alignItems:'center',}}>


        {/* Pie chart to display sentiment breakdown */}
        <div >

        <Pie
          data={{
            labels: ["Positive", "Negative", "Neutral"],
            datasets: [
              {
                data: [positiveScore, negativeScore, neutralScore],
                backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"]
              }
            ]
          }}
        />
        </div>

        {/* Histogram to plot sentiment groups */}
        <div >

        <Bar height={300} width={300}
          data={{
            labels: ["Positive", "Negative", "Neutral"],
            datasets: [
              {
                label: "Sentiment Groups",
                data: [positiveScore, negativeScore, neutralScore],
                backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
                borderWidth: 1
              }
            ]
          }}
          options={{
            indexAxis: "y"
          }}
        />
        </div>
      </div>
      }


      
    </div>
  );
};

export default CommentAnalyzer;
