import { DirectionsRun, DirectionsWalk, DirectionsBike, FitnessCenter, ThumbUpAlt } from '@mui/icons-material';
import { CircularProgress, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { getDaysInYearTillToday } from './Stats';

function Dashboard({ activities, year }) {
  const summary = React.useMemo(() => {
    const sum = {
      walks: 0, walkDist: 0, walkTime: 0, walkCalories: 0,
      runs: 0, runDist: 0, runTime: 0, runCalories: 0,
      cycles: 0, cycleDist: 0, cycleTime: 0, cycleCalories: 0,
      gyms: 0, gymTime: 0, gymCalories: 0,
      others: 0, otherTime: 0, otherCalories: 0, otherDistance: 0,
      activities: 0, distance: 0, time: 0, calories: 0, activeDays: [],
    };
    activities.forEach(activity => {
      sum.activities++;
      sum.time += activity.duration || 0;
      sum.distance += activity.distance || 0;
      sum.calories += activity.calories || 0;
      const date = activity.date.toDate();
      const dateStr = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
      if (!sum.activeDays.includes(dateStr)) sum.activeDays.push(dateStr);
      switch (activity.type) {
        case 'Walk':
          sum.walks++;
          sum.walkTime += activity.duration || 0;
          sum.walkCalories += activity.calories || 0;
          sum.walkDist += activity.distance || 0;
          break;
        case 'Run':
          sum.runs++;
          sum.runTime += activity.duration || 0;
          sum.runCalories += activity.calories || 0;
          sum.runDist += activity.distance || 0;
          break;
        case 'Cycle':
          sum.cycles++;
          sum.cycleTime += activity.duration || 0;
          sum.cycleCalories += activity.calories || 0;
          sum.cycleDist += activity.distance || 0;
          break;
        case 'Gym':
          sum.gyms++;
          sum.gymTime += activity.duration || 0;
          sum.gymCalories += activity.calories || 0;
          break;
        default:
          sum.others++;
          sum.otherTime += activity.duration || 0;
          sum.otherCalories += activity.calories || 0;
          sum.otherDist += activity.distance || 0;
          break;
      }
    });
    return sum;
  }, [activities]);

  const daysTillNow = React.useMemo(() => {
    return getDaysInYearTillToday(year);
  }, [year])

  const renderCircles = () => {
    // Activity Distribution
    const walksProg = (summary.walks / summary.activities) * 100;
    const runsProg = (summary.runs / summary.activities) * 100 + walksProg;
    const cyclesProg = (summary.cycles / summary.activities) * 100 + runsProg;
    const gymsProg = (summary.gyms / summary.activities) * 100 + cyclesProg;
    const otherProg = (summary.others / summary.activities) * 100 + gymsProg;

    // Calorie Distribution
    const wCals = (summary.walkCalories / summary.calories) * 100;
    const rCals = (summary.runCalories / summary.calories) * 100 + wCals;
    const cCals = (summary.cycleCalories / summary.calories) * 100 + rCals;
    const gCals = (summary.gymCalories / summary.calories) * 100 + cCals;
    const oCals = (summary.otherCalories / summary.calories) * 100 + gCals;

    // Time Distribution
    const wTime = (summary.walkTime / summary.time) * 100;
    const rTime = (summary.runTime / summary.time) * 100 + wTime;
    const cTime = (summary.cycleTime / summary.time) * 100 + rTime;
    const gTime = (summary.gymTime / summary.time) * 100 + cTime;
    const oTime = (summary.otherTime / summary.time) * 100 + gTime;

    // Distance Distribution
    const wDist = (summary.walkDist / summary.distance) * 100;
    const rDist = (summary.runDist / summary.distance) * 100 + wDist;
    const cDist = (summary.cycleDist / summary.distance) * 100 + rDist;
    const oDist = (summary.otherDist / summary.distance) * 100 + cDist;

    const activeDayRatio = summary.activeDays.length / daysTillNow.length * 100;

    return <>
      <Pair>
        <CircularWrapper>
          <Circle>
            <CircleLabel>
              <Typography>{activeDayRatio.toFixed(1)}%</Typography>
              <Typography>Activity</Typography>
            </CircleLabel>
            <CircularProgress variant="determinate" size={160} thickness={8} value={activeDayRatio} />
          </Circle>
        </CircularWrapper>
        <CircularWrapper>
          <Circle>
            <CircleLabel>
              <Typography>{summary.activities}</Typography>
              <Typography>Activities</Typography>
            </CircleLabel>
            <CircularProgress variant="determinate" size={160} thickness={8} value={otherProg} color="secondary" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={gymsProg} color="info" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={cyclesProg} color="warning" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={runsProg} color="error" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={walksProg} color="success" />
          </Circle>
        </CircularWrapper>
      </Pair>
      <Pair>
        <CircularWrapper>
          <Circle>
            <CircleLabel>
              <Typography>{(summary.time / 3600).toFixed(0)}h {((summary.time % 3600) / 60).toFixed(0)}m</Typography>
              <Typography>Active Time</Typography>
            </CircleLabel>
            <CircularProgress variant="determinate" size={160} thickness={8} value={oTime} color="secondary" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={gTime} color="info" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={cTime} color="warning" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={rTime} color="error" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={wTime} color="success" />
          </Circle>
        </CircularWrapper>
        <CircularWrapper>
          <Circle>
            <CircleLabel>
              <Typography>{summary.calories}</Typography>
              <Typography>Calories</Typography>
            </CircleLabel>
            <CircularProgress variant="determinate" size={160} thickness={8} value={oCals} color="secondary" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={gCals} color="info" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={cCals} color="warning" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={rCals} color="error" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={wCals} color="success" />
          </Circle>

        </CircularWrapper>
      </Pair>
      <Pair>
        <CircularWrapper>
          <Circle>
            <CircleLabel>
              <Typography>{(summary.distance / 1000).toFixed(2)} km</Typography>
              <Typography>Distance</Typography>
            </CircleLabel>
            <CircularProgress variant="determinate" size={160} thickness={8} value={oDist} color="secondary" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={cDist} color="warning" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={rDist} color="error" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={wDist} color="success" />
          </Circle>
        </CircularWrapper>
        <CircularWrapper>
          <Circle>
            <CircleLabel>
              <Typography>Labels</Typography>
            </CircleLabel>
            <CircularProgress variant="determinate" size={160} thickness={8} value={100} color="secondary" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={80} color="info" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={60} color="warning" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={40} color="error" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={20} color="success" />
            <DirectionsRun className="icon run" />
            <DirectionsWalk className="icon walk" />
            <DirectionsBike className="icon bike" />
            <FitnessCenter className="icon gym" />
            <ThumbUpAlt className="icon other" />
          </Circle>
        </CircularWrapper>
      </Pair>
    </>;
  }

  return <Wrapper>{renderCircles()}</Wrapper>;
}

const CircularWrapper = styled.div`
	display: flex;
`;

const Circle = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	width: 160px;
	height: 160px;
	& > span {
		position: absolute;
		top: 0;
		left: 0;
	}
  & > .icon { position absolute; }
  & > .walk { top: 14px; left: 107px; }
  & > .run { top: 88px; left: 129px; }
  & > .bike { top: 133px; left: 66px; }
  & > .gym { top: 86px; left: 6px; }
  & > .other { top: 14px; left: 30px; }
`;

const CircleLabel = styled.div`
	display: flex;
  flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const Pair = styled.div`
  display: flex;
  gap: 16px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  gap: 16px;
  flex: 1;
`;

export default Dashboard;