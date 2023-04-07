import {
  DirectionsRun,
  DirectionsWalk,
  DirectionsBike,
  FitnessCenter,
  ThumbUpAlt,
} from "@mui/icons-material";
import { Chip, CircularProgress, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { getDaysInYearTillToday } from "./Stats";
import { monthFromNumber } from "../utils/dateUtils";

function Dashboard({ activities, year, streak }) {
  const [activeType, setActiveType] = React.useState();

  const summary = React.useMemo(() => {
    const sum = {
      walks: 0,
      walkDist: 0,
      walkTime: 0,
      walkCalories: 0,
      runs: 0,
      runDist: 0,
      runTime: 0,
      runCalories: 0,
      cycles: 0,
      cycleDist: 0,
      cycleTime: 0,
      cycleCalories: 0,
      gyms: 0,
      gymTime: 0,
      gymCalories: 0,
      others: 0,
      otherTime: 0,
      otherCalories: 0,
      otherDistance: 0,
      activities: 0,
      distance: 0,
      time: 0,
      calories: 0,
      activeDays: [],
    };
    activities.forEach((activity) => {
      sum.activities++;
      sum.time += activity.duration || 0;
      sum.distance += activity.distance || 0;
      sum.calories += activity.calories || 0;
      const date = activity.date.toDate();
      const dateStr = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
      if (!sum.activeDays.includes(dateStr)) sum.activeDays.push(dateStr);
      switch (activity.type) {
        case "Walk":
          sum.walks++;
          sum.walkTime += activity.duration || 0;
          sum.walkCalories += activity.calories || 0;
          sum.walkDist += activity.distance || 0;
          break;
        case "Run":
          sum.runs++;
          sum.runTime += activity.duration || 0;
          sum.runCalories += activity.calories || 0;
          sum.runDist += activity.distance || 0;
          break;
        case "Cycle":
          sum.cycles++;
          sum.cycleTime += activity.duration || 0;
          sum.cycleCalories += activity.calories || 0;
          sum.cycleDist += activity.distance || 0;
          break;
        case "Gym":
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
  }, [year]);

  const days = React.useMemo(() => {
    const mDays = [];
    const today = new Date();
    const month = today.getMonth() - 1;
    let d = new Date(today.getFullYear(), month, 1);

    const getActivitiesForDay = (day) => {
      return activities.filter((act) => {
        const activityDate = act.date.toDate();
        return (
          activityDate.getDate() === day.getDate() &&
          activityDate.getMonth() === day.getMonth() &&
          activityDate.getFullYear() === day.getFullYear()
        );
      });
    };

    const offset = (d.getDay() || 7) - 1;
    mDays.push(...new Array(offset).fill({ date: null, activities: null }));

    while (d.getMonth() === month) {
      const newDate = new Date(d);
      mDays.push({
        date: new Date(d),
        activities: getActivitiesForDay(newDate),
      });
      d.setDate(d.getDate() + 1);
    }

    return mDays;
  }, [activities]);

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

    const activeDayRatio =
      (summary.activeDays.length / daysTillNow.length) * 100;

    const getClassByColorType = (type) => {
      if (activeType && activeType !== type) return "grayed";
      return "";
    };

    const getLabel = () => {
      switch (activeType) {
        case "Walk":
          return "Walking";
        case "Cycle":
          return "Cycling";
        case "Run":
          return "Running";
        case "Gym":
          return "Gym";
        case "Other":
          return "Others";
        default:
          return "Labels";
      }
    };

    const getActivityIcon = () => {
      switch (activeType) {
        case "Walk":
          return <DirectionsWalk className="icon walk" />;
        case "Cycle":
          return <DirectionsBike className="icon bike" />;
        case "Run":
          return <DirectionsRun className="icon run" />;
        case "Gym":
          return <FitnessCenter className="icon gym" />;
        case "Other":
        default:
          return <ThumbUpAlt className="icon other" />;
      }
    };

    const getCalories = () => {
      let cals = summary.calories;
      if (activeType === "Walk") cals = summary.walkCalories;
      else if (activeType === "Cycle") cals = summary.cycleCalories;
      else if (activeType === "Run") cals = summary.runCalories;
      else if (activeType === "Gym") cals = summary.gymCalories;
      else if (activeType === "Other") cals = summary.otherCalories;
      const calsByDay = (cals / daysTillNow.length).toFixed(0);
      return [cals, calsByDay];
    };

    const getActivities = () => {
      switch (activeType) {
        case "Walk":
          return summary.walks;
        case "Cycle":
          return summary.cycles;
        case "Run":
          return summary.runs;
        case "Gym":
          return summary.gyms;
        case "Other":
          return summary.others;
        default:
          return summary.activities;
      }
    };

    const getTime = () => {
      let time = summary.time;
      if (activeType === "Walk") time = summary.walkTime;
      else if (activeType === "Cycle") time = summary.cycleTime;
      else if (activeType === "Run") time = summary.runTime;
      else if (activeType === "Gym") time = summary.gymTime;
      else if (activeType === "Other") time = summary.otherTime;

      const total = `${Math.floor(time / 3600)}h ${Math.floor(
        (time % 3600) / 60
      )}m`;

      const dayTime = time / daysTillNow.length;

      const perDay = `${Math.floor(dayTime / 3600)}h ${Math.floor(
        (dayTime % 3600) / 60
      )}m`;

      return [total, perDay];
    };

    const getDistance = () => {
      let dist = summary.distance;
      if (activeType === "Walk") dist = summary.walkDist;
      else if (activeType === "Cycle") dist = summary.cycleDist;
      else if (activeType === "Run") dist = summary.runDist;
      else if (activeType === "Other") dist = summary.otherDistance;
      const distance = `${(dist / 1000).toFixed(2)} km`;
      const distByDay = (dist / daysTillNow.length).toFixed(0);
      const distancePerDay = `${(distByDay / 1000).toFixed(2)} km`;
      return [distance, distancePerDay];
    };

    const onTouchType = (type) => {
      setActiveType(activeType === type ? undefined : type);
    };

    const getDayColor = (day) => {
      if (!day.date) return "transparent";
      else if (!day.activities || day.activities.length < 1) return "gray";
      else if (day.activities.some((a) => a.type === "Gym")) return "#29b6f6";
      else if (day.activities.some((a) => a.type === "Run")) return "#f44336";
      else if (day.activities.some((a) => a.type === "Cycle")) return "#ffa726";
      else if (day.activities.some((a) => a.type === "Other")) return "#ce93d8";
      else if (day.activities.some((a) => a.type === "Walk")) return "#66bb6a";
      return "gray";
    };

    return (
      <>
        <Totals>
          <Streak>
            <Chip label={streak} color="primary" />
            <Typography>Day streak</Typography>
          </Streak>
          <CircularWrapper>
            <Circle>
              <CircleLabel>
                {!activeType && (
                  <Typography>Day {daysTillNow.length}</Typography>
                )}
                {!activeType && (
                  <Typography>{activeDayRatio.toFixed(1)}%</Typography>
                )}
                {activeType && <Typography>{getLabel()}</Typography>}
                {activeType && getActivityIcon()}
              </CircleLabel>
              <CircularProgress
                variant="determinate"
                size={160}
                thickness={8}
                value={activeDayRatio}
              />
            </Circle>
          </CircularWrapper>

          <Streak>
            <Chip label={getActivities()} color="primary" />
            <Typography>Activities</Typography>
          </Streak>
        </Totals>

        <Bar>
          <Chunk
            width={otherProg || 0}
            className={getClassByColorType("Other")}
            color="#ce93d8"
            onTouchStart={() => onTouchType("Other")}
            onMouseEnter={() => setActiveType("Other")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Chunk
            width={gymsProg || 0}
            className={getClassByColorType("Gym")}
            color="#29b6f6"
            onTouchStart={() => onTouchType("Gym")}
            onMouseEnter={() => setActiveType("Gym")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Chunk
            width={cyclesProg || 0}
            className={getClassByColorType("Cycle")}
            color="#664815"
            onTouchStart={() => onTouchType("Cycle")}
            onMouseEnter={() => setActiveType("Cycle")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Chunk
            width={runsProg || 0}
            className={getClassByColorType("Run")}
            color="#f44336"
            onTouchStart={() => onTouchType("Run")}
            onMouseEnter={() => setActiveType("Run")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Chunk
            width={walksProg || 0}
            className={getClassByColorType("Walk")}
            color="#66bb6a"
            onTouchStart={() => onTouchType("Walk")}
            onMouseEnter={() => setActiveType("Walk")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Typography>{getActivities()} activities</Typography>
          <Typography>
            {(getActivities() / daysTillNow.length).toFixed(1)} / day
          </Typography>
        </Bar>

        <Bar>
          <Chunk
            width={oTime || 0}
            className={getClassByColorType("Other")}
            color="#ce93d8"
            onTouchStart={() => onTouchType("Other")}
            onMouseEnter={() => setActiveType("Other")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Chunk
            width={gTime || 0}
            className={getClassByColorType("Gym")}
            color="#29b6f6"
            onTouchStart={() => onTouchType("Gym")}
            onMouseEnter={() => setActiveType("Gym")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Chunk
            width={cTime || 0}
            className={getClassByColorType("Cycle")}
            color="#664815"
            onTouchStart={() => onTouchType("Cycle")}
            onMouseEnter={() => setActiveType("Cycle")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Chunk
            width={rTime || 0}
            className={getClassByColorType("Run")}
            color="#f44336"
            onTouchStart={() => onTouchType("Run")}
            onMouseEnter={() => setActiveType("Run")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Chunk
            width={wTime || 0}
            className={getClassByColorType("Walk")}
            color="#66bb6a"
            onTouchStart={() => onTouchType("Walk")}
            onMouseEnter={() => setActiveType("Walk")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Typography>{getTime()[0]}</Typography>
          <Typography>{getTime()[1]}</Typography>
        </Bar>

        <Bar>
          <Chunk
            width={oCals || 0}
            className={getClassByColorType("Other")}
            color="#ce93d8"
            onTouchStart={() => onTouchType("Other")}
            onMouseEnter={() => setActiveType("Other")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Chunk
            width={gCals || 0}
            className={getClassByColorType("Gym")}
            color="#29b6f6"
            onTouchStart={() => onTouchType("Gym")}
            onMouseEnter={() => setActiveType("Gym")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Chunk
            width={cCals || 0}
            className={getClassByColorType("Cycle")}
            color="#664815"
            onTouchStart={() => onTouchType("Cycle")}
            onMouseEnter={() => setActiveType("Cycle")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Chunk
            width={rCals || 0}
            className={getClassByColorType("Run")}
            color="#f44336"
            onTouchStart={() => onTouchType("Run")}
            onMouseEnter={() => setActiveType("Run")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Chunk
            width={wCals || 0}
            className={getClassByColorType("Walk")}
            color="#66bb6a"
            onTouchStart={() => onTouchType("Walk")}
            onMouseEnter={() => setActiveType("Walk")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Typography>{getCalories()[0] + " kcal"}</Typography>
          <Typography>{getCalories()[1] + " kcal"}</Typography>
        </Bar>

        <Bar>
          <Chunk
            width={oDist || 0}
            className={getClassByColorType("Other")}
            color="#ce93d8"
            onTouchStart={() => onTouchType("Other")}
            onMouseEnter={() => setActiveType("Other")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Chunk
            width={cDist || 0}
            className={getClassByColorType("Cycle")}
            color="#664815"
            onTouchStart={() => onTouchType("Cycle")}
            onMouseEnter={() => setActiveType("Cycle")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Chunk
            width={rDist || 0}
            className={getClassByColorType("Run")}
            color="#f44336"
            onTouchStart={() => onTouchType("Run")}
            onMouseEnter={() => setActiveType("Run")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Chunk
            width={wDist || 0}
            className={getClassByColorType("Walk")}
            color="#66bb6a"
            onTouchStart={() => onTouchType("Walk")}
            onMouseEnter={() => setActiveType("Walk")}
            onMouseLeave={() => setActiveType(undefined)}
          />
          <Typography>{getDistance()[0]}</Typography>
          <Typography>{getDistance()[1]}</Typography>
        </Bar>

        <Legends>
          <Legend>
            <DirectionsWalk className="icon walk" color="success" />
            <Typography>Walk</Typography>
          </Legend>
          <Legend>
            <FitnessCenter className="icon gym" color="info" />
            <Typography>Gym</Typography>
          </Legend>
          <Legend>
            <DirectionsBike className="icon bike" color="warning" />
            <Typography>Cycle</Typography>
          </Legend>
          <Legend>
            <DirectionsRun className="icon run" color="error" />
            <Typography>Run</Typography>
          </Legend>
          <Legend>
            <ThumbUpAlt className="icon other" color="secondary" />
            <Typography>Other</Typography>
          </Legend>
        </Legends>

        <Typography>
          Previous month: {monthFromNumber(new Date().getMonth() - 1)}
        </Typography>
        <PreviousMonth>
          {days.map((day, i) => {
            return <Day key={i} bg={getDayColor(day)} />;
          })}
        </PreviousMonth>
      </>
    );
  };

  return <Wrapper>{renderCircles()}</Wrapper>;
}

const Legends = styled.div`
  display: flex;
  gap: 10px;
`;

const Legend = styled.div`
  align-items: center;
  display: flex;
`;

const Bar = styled.div`
  display: flex;
  height: 40px;
  width: 344px;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  & > p {
    z-index: 1;
    color: black;
    font-weight: 500;
    pointer-events: none;
  }

  & > p:first-of-type {
    margin-left: 16px;
  }

  & > p:last-of-type {
    margin-right: 16px;
  }
`;

const Chunk = styled.div`
  height: 40px;
  position: absolute;
  left: 0px;
  top: 0px;
  transition: width 200ms;
  transition: background-color 200ms;
  width: ${(props) => props.width || 0}%;
  background-color: ${(props) => props.color};

  &.grayed {
    background-color: #1c1c1c;
  }
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

const Totals = styled.div`
  display: flex;
`;

const Streak = styled.div`
  display: flex;
  width: 92px;
  gap: 8px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 16px;
  flex: 1;
`;

const PreviousMonth = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 208px;
  gap: 16px;
`;

const Day = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 16px;
  background-color: ${(props) => props.bg || "red"};
`;

export default Dashboard;
