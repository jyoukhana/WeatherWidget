import React, { useState, useEffect } from 'react';
import './App.css';
import { Avatar, IconButton, Typography, Card, CardActionArea, CardActions, CardContent, CardHeader } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { ToggleButton, ToggleButtonGroup, Skeleton } from '@material-ui/lab';
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  }
});

const api = {
  key: "##", //Get your own key!
  base: "https://api.openweathermap.org/data/2.5/",
  zip: "60654",
  country: "us",
  unit: "imperial",
}

const createDate = (x) => {
  let months = ["January", "February", "March", "April", "May", "June",
    "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday"];

  let date = x.getDate();
  let year = x.getFullYear();
  let month = months[x.getMonth()];
  let day = days[x.getDay()];

  return `${day}, ${month} ${date} ${year}`
}

var isDone = false;

function getTime(timestamp) {
  var d = new Date(timestamp * 1000),
    hh = d.getHours(),
    h = hh,
    min = ('0' + d.getMinutes()).slice(-2),
    sec = ('0' + d.getSeconds()).slice(-2),
    ampm = 'AM',
    time;

  if (hh > 12) {
    h = hh - 12;
    ampm = 'PM';
  } else if (hh === 12) {
    h = 12;
    ampm = 'PM';
  } else if (hh == 0) {
    h = 12;
  }

  time = h + ':' + min + ':' + sec + ' ' + ampm;
  return time;
}

function App() {
  const classes = useStyles();
  const [temp, setTemp] = React.useState(0);
  const [unit, setUnit] = React.useState("imperial");
  const [iconID, setIconID] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [time, setTime] = React.useState(0);

  const fetchWeatherData = async () => {
    const weatherAPI = await fetch(`${api.base}weather?zip=${api.zip},${api.country}&appid=${api.key}&units=${unit}`);
    const weatherData = await weatherAPI.json();
    console.log(weatherData);
    setTemp(weatherData.main.temp);
    setIconID(weatherData.weather[0].icon);
    setDesc(weatherData.weather[0].main);
    setTime(weatherData.dt);
  }

  React.useEffect(() =>{
    if(!isDone){ //conditional to prevent infinitely fetching API
      isDone = true;
      fetchWeatherData();
    }
  })

  function refresh() {
    fetchWeatherData();
    window.location.reload(false);
  }

  const switchUnit = (e, newUnit) => {
    if (newUnit === "f") {
      setUnit("imperial");
      fetchWeatherData();
      refresh();
    } else if (newUnit === "c") {
      setUnit("metric");
      fetchWeatherData();
      refresh();
    }
  };

  var weatherIconUrl = `http://openweathermap.org/img/wn/${iconID}@2x.png`;

  return (
    <Card className={classes.root}>
      <CardHeader
        title="Weather"
        align="left"
        aria-label="weather and date"
        subheader={createDate(new Date()) + " " + getTime(time)}
        avatar={
          <Avatar 
          aria-label={desc} 
          className={classes.avatar}
          >
            <img aria-label="weather icon" src={weatherIconUrl} alt={desc} />
          </Avatar>
        }
        action={
          <IconButton
            color="primary"
            aria-label="refresh"
            onClick={
              refresh
            }
          >
            <RefreshIcon />
          </IconButton>
        }
      />

      <CardContent>
        <Typography 
        variant="h2" 
        align="center" 
        aria-label="current temperature"
        >
          {
          temp || <Skeleton
          animation = "pulse"/>
          }°
        </Typography>

        <CardActionArea>
          <CardActions>

            <ToggleButtonGroup
              value={unit}
              size="small"
              exclusive
              onChange = {
                switchUnit
              }
              aria-label="toggle temperature units"
            >
              <ToggleButton
                value="f"
                aria-label="fahrenheit"
              >
                F°
              </ToggleButton>
              <ToggleButton
                value="c"
                aria-label="celsius"
              >
                C°
              </ToggleButton>
            </ToggleButtonGroup>

          </CardActions>
        </CardActionArea>

      </CardContent>
    </Card>
  )
}

export default App;
