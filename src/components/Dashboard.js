import { DirectionsRun, DirectionsWalk, DirectionsBike, FitnessCenter, ThumbUpAlt } from '@mui/icons-material';
import { CircularProgress, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { getDaysInYearTillToday } from './Stats';

function Dashboard({ activities, year }) {
  const [activeType, setActiveType] = React.useState();

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

    const getClassByColorType = type => {
      if (activeType && activeType !== type) return 'grayed';
      return '';
    }

    const getLabel = () => {
      switch (activeType) {
        case 'Walk': return 'Walking';
        case 'Cycle': return 'Cycling';
        case 'Run': return 'Running';
        case 'Gym': return 'Gym';
        case 'Other': return 'Others';
        default: return 'Labels';
      }
    }

    const getCalories = () => {
      switch (activeType) {
        case 'Walk': return summary.walkCalories;
        case 'Cycle': return summary.cycleCalories;
        case 'Run': return summary.runCalories;
        case 'Gym': return summary.gymCalories;
        case 'Other': return summary.otherCalories;
        default: return summary.calories;
      }
    }

    const getActivities = () => {
      switch (activeType) {
        case 'Walk': return summary.walks;
        case 'Cycle': return summary.cycles;
        case 'Run': return summary.runs;
        case 'Gym': return summary.gyms;
        case 'Other': return summary.others;
        default: return summary.activities;
      }
    }

    const getTime = () => {
      switch (activeType) {
        case 'Walk': return `${Math.floor(summary.walkTime / 3600)}h ${Math.floor((summary.walkTime % 3600) / 60)}m`;
        case 'Cycle': return `${Math.floor(summary.cycleTime / 3600)}h ${Math.floor((summary.cycleTime % 3600) / 60)}m`;
        case 'Run': return `${Math.floor(summary.runTime / 3600)}h ${Math.floor((summary.runTime % 3600) / 60)}m`;
        case 'Gym': return `${Math.floor(summary.gymTime / 3600)}h ${Math.floor((summary.gymTime % 3600) / 60)}m`;
        case 'Other': return `${Math.floor(summary.otherTime / 3600)}h ${Math.floor((summary.otherTime % 3600) / 60)}m`;
        default: return `${Math.floor(summary.time / 3600)}h ${Math.floor((summary.time % 3600) / 60)}m`;
      }
    }

    const getDistance = () => {
      switch (activeType) {
        case 'Walk': return `${(summary.walkDist / 1000).toFixed(2)} km`;
        case 'Cycle': return `${(summary.cycleDist / 1000).toFixed(2)} km`;
        case 'Run': return `${(summary.runDist / 1000).toFixed(2)} km`;
        case 'Gym': return `Fuaark`;
        case 'Other': return `${(summary.otherDistance / 1000).toFixed(2)} km`;
        default: return `${(summary.distance / 1000).toFixed(2)} km`;
      }
    }

    const onTouchType = (type) => {
      setActiveType(activeType === type ? undefined : type);
    }

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
              <Typography>{getActivities()}</Typography>
              <Typography>Activities</Typography>
            </CircleLabel>
            <CircularProgress variant="determinate" size={160} thickness={8} value={otherProg} className={getClassByColorType('Other')} color="secondary" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={gymsProg} className={getClassByColorType('Gym')} color="info" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={cyclesProg} className={getClassByColorType('Cycle')} color="warning" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={runsProg} className={getClassByColorType('Run')} color="error" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={walksProg} className={getClassByColorType('Walk')} color="success" />
          </Circle>
        </CircularWrapper>
      </Pair>
      <Pair>
        <CircularWrapper>
          <Circle>
            <CircleLabel>
              <Typography>{getTime()}</Typography>
              <Typography>Active Time</Typography>
            </CircleLabel>
            <CircularProgress variant="determinate" size={160} thickness={8} value={oTime} className={getClassByColorType('Other')} color="secondary" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={gTime} className={getClassByColorType('Gym')} color="info" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={cTime} className={getClassByColorType('Cycle')} color="warning" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={rTime} className={getClassByColorType('Run')} color="error" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={wTime} className={getClassByColorType('Walk')} color="success" />
          </Circle>
        </CircularWrapper>
        <CircularWrapper>
          <Circle>
            <CircleLabel>
              <Typography>{getCalories()}</Typography>
              <Typography>Calories</Typography>
            </CircleLabel>
            <CircularProgress variant="determinate" size={160} thickness={8} value={oCals} className={getClassByColorType('Other')} color="secondary" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={gCals} className={getClassByColorType('Gym')} color="info" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={cCals} className={getClassByColorType('Cycle')} color="warning" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={rCals} className={getClassByColorType('Run')} color="error" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={wCals} className={getClassByColorType('Walk')} color="success" />
          </Circle>

        </CircularWrapper>
      </Pair>
      <Pair>
        <CircularWrapper>
          <Circle>
            <CircleLabel>
              <Typography>{getDistance()}</Typography>
              <Typography>Distance</Typography>
            </CircleLabel>
            <CircularProgress variant="determinate" size={160} thickness={8} value={oDist} className={getClassByColorType('Other')} color="secondary" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={cDist} className={getClassByColorType('Cycle')} color="warning" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={rDist} className={getClassByColorType('Run')} color="error" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={wDist} className={getClassByColorType('Walk')} color="success" />
          </Circle>
        </CircularWrapper>
        <CircularWrapper>
          <Circle className="no-animation">
            <CircleLabel>
              <Typography>{getLabel()}</Typography>
            </CircleLabel>
            <CircularProgress variant="determinate" size={160} thickness={8} value={100} className={getClassByColorType('Other')} color="secondary" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={80} className={getClassByColorType('Gym')} color="info" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={60} className={getClassByColorType('Cycle')} color="warning" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={40} className={getClassByColorType('Run')} color="error" />
            <CircularProgress variant="determinate" size={160} thickness={8} value={20} className={getClassByColorType('Walk')} color="success" />
            <DirectionsRun className="icon run" />
            <DirectionsWalk className="icon walk" />
            <DirectionsBike className="icon bike" />
            <FitnessCenter className="icon gym" />
            <ThumbUpAlt className="icon other" />
            <LabelAction index={0}>
              <LabelActionBlock
                onTouchStart={() => onTouchType('Walk')}
                onMouseEnter={() => setActiveType('Walk')}
                onMouseLeave={() => setActiveType(undefined)} />
            </LabelAction>
            <LabelAction index={1}>
              <LabelActionBlock
                onTouchStart={() => onTouchType('Run')}
                onMouseEnter={() => setActiveType('Run')}
                onMouseLeave={() => setActiveType(undefined)} />
            </LabelAction>
            <LabelAction index={2}>
              <LabelActionBlock
                onTouchStart={() => onTouchType('Cycle')}
                onMouseEnter={() => setActiveType('Cycle')}
                onMouseLeave={() => setActiveType(undefined)} />
            </LabelAction>
            <LabelAction index={3}>
              <LabelActionBlock
                onTouchStart={() => onTouchType('Gym')}
                onMouseEnter={() => setActiveType('Gym')}
                onMouseLeave={() => setActiveType(undefined)} />
            </LabelAction>
            <LabelAction index={4}>
              <LabelActionBlock
                onTouchStart={() => onTouchType('Other')}
                onMouseEnter={() => setActiveType('Other')}
                onMouseLeave={() => setActiveType(undefined)} />
            </LabelAction>
          </Circle>
        </CircularWrapper>
      </Pair>
    </>;
  }

  return <Wrapper>{renderCircles()}</Wrapper>;
}

const LabelAction = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  width: 100%;
  height: 100%;
  transform: rotate(${props => props.index * 72 + 36}deg);
  pointer-events: none;
  user-select: none;
`;

const LabelActionBlock = styled.div`
  pointer-events: auto;
  cursor: pointer;
  border-radius: 100%;
  height: 35px;
  width: 85px;
  user-select: none;
`;

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
    &.grayed > svg {
      color: #1a1a1a;
    }
	}
  &:not(.no-animation) > span > svg {
    transition: color 250ms;
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