import React from "react";
import styled from "styled-components";
import {
  DirectionsRun,
  DirectionsWalk,
  DirectionsBike,
  Straighten,
  AccessAlarm,
  Speed,
  LocalFireDepartment,
  FitnessCenter,
} from "@mui/icons-material";
import { MenuItem, Select } from "@mui/material";
import { monthFromNumber } from "../utils/dateUtils";

function Recap({ activities }) {
  const [month, setMonth] = React.useState(new Date().getMonth());

  const getActivitiesForDay = React.useCallback(
    (day) => {
      return activities.filter((act) => {
        const activityDate = act.date.toDate();
        return (
          activityDate.getDate() === day.getDate() &&
          activityDate.getMonth() === day.getMonth() &&
          activityDate.getFullYear() === day.getFullYear()
        );
      });
    },
    [activities]
  );

  const acties = React.useMemo(() => {
    if (month === -1) return activities;
    return activities.filter((act) => act.date.toDate().getMonth() === month);
  }, [activities, month]);

  const days = React.useMemo(() => {
    if (month === -1) return [];
    const mDays = [];
    let d = new Date(2022, month, 1);

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
  }, [getActivitiesForDay, month]);

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
    acties.forEach((activity) => {
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

    // Walk Averages
    sum.avgWalkDist = sum.walkDist / sum.walks / 1000 || 0;
    sum.avgWalkTime = sum.walkTime / sum.walks / 60 / 60 || 0;
    sum.avgWalkCalories = sum.walkCalories / sum.walks || 0;
    sum.avgWalkSpeed = sum.avgWalkDist / sum.avgWalkTime || 0;

    // Run Averages
    sum.avgRunDist = sum.runDist / sum.runs / 1000 || 0;
    sum.avgRunTime = sum.runTime / sum.runs / 60 / 60 || 0;
    sum.avgRunCalories = sum.runCalories / sum.runs || 0;
    sum.avgRunSpeed = sum.avgRunDist / sum.avgRunTime || 0;

    // Cycle Averages
    sum.avgCycleDist = sum.cycleDist / sum.cycles / 1000 || 0;
    sum.avgCycleTime = sum.cycleTime / sum.cycles / 60 / 60 || 0;
    sum.avgCycleCalories = sum.cycleCalories / sum.cycles || 0;
    sum.avgCycleSpeed = sum.avgCycleDist / sum.avgCycleTime || 0;

    return sum;
  }, [acties]);

  const getBorderColor = (a) => {
    const colors = [];
    a.some((a) => a.type === "Run") && colors.push("#f44336");
    a.some((a) => a.type === "Gym") && colors.push("#29b6f6");
    a.some((a) => a.type === "Cycle") && colors.push("#ffa726");
    a.some((a) => a.type === "Walk") && colors.push("#66bb6a");
    a.some((a) => a.type === "Other") && colors.push("#ce93d8");
    switch (colors.length) {
      case 5:
      case 4:
        return `${colors[1]} ${colors[2]} ${colors[3]} ${colors[0]}`;
      case 3:
        return `${colors[1]} ${colors[2]} ${colors[2]} ${colors[0]}`;
      case 2:
        return `${colors[0]} ${colors[1]} ${colors[1]} ${colors[0]}`;
      case 1:
        return colors[0];
      case 0:
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <Select
        size="small"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        autoWidth
      >
        <MenuItem value={-1}>Year</MenuItem>
        <MenuItem value={0}>{monthFromNumber(0)}</MenuItem>
        <MenuItem value={1}>{monthFromNumber(1)}</MenuItem>
        <MenuItem value={2}>{monthFromNumber(2)}</MenuItem>
        <MenuItem value={3}>{monthFromNumber(3)}</MenuItem>
        <MenuItem value={4}>{monthFromNumber(4)}</MenuItem>
        <MenuItem value={5}>{monthFromNumber(5)}</MenuItem>
        <MenuItem value={6}>{monthFromNumber(6)}</MenuItem>
        <MenuItem value={7}>{monthFromNumber(7)}</MenuItem>
        <MenuItem value={8}>{monthFromNumber(8)}</MenuItem>
        <MenuItem value={9}>{monthFromNumber(9)}</MenuItem>
        <MenuItem value={10}>{monthFromNumber(10)}</MenuItem>
        <MenuItem value={11}>{monthFromNumber(11)}</MenuItem>
      </Select>
      <Recaps>
        <RecapUnit bc="#66bb6a">
          <DirectionsWalk color="success" className="icon" />
          <SumText color="#66bb6a">{summary.walks}</SumText>
          <Title className="title">
            <DirectionsWalk /> Session Averages ({summary.walks})
            <Highlight color="#66bb6a" />
          </Title>
          <Row>
            <Average>
              <AccessAlarm /> {Math.floor(summary.avgWalkTime)}h{" "}
              {Math.floor((summary.avgWalkTime % 1) * 60)}m
            </Average>
            <Average>
              <Straighten /> {summary.avgWalkDist.toFixed(2)} km
            </Average>
          </Row>
          <Row>
            <Average>
              <Speed /> {summary.avgWalkSpeed.toFixed(2)} km/h
            </Average>
            <Average>
              <LocalFireDepartment /> {summary.avgWalkCalories.toFixed()} kcal
            </Average>
          </Row>
        </RecapUnit>
        <RecapUnit bc="#f44336">
          <DirectionsRun color="error" className="icon" />
          <SumText color="#f44336">{summary.runs}</SumText>
          <Title className="title">
            <DirectionsRun /> Session Averages ({summary.runs})
            <Highlight color="#f44336" />
          </Title>
          <Row>
            <Average>
              <AccessAlarm /> {Math.floor(summary.avgRunTime)}h{" "}
              {Math.floor((summary.avgRunTime % 1) * 60)}m
            </Average>
            <Average>
              <Straighten /> {summary.avgRunDist.toFixed(2)} km
            </Average>
          </Row>
          <Row>
            <Average>
              <Speed /> {summary.avgRunSpeed.toFixed(2)} km/h
            </Average>
            <Average>
              <LocalFireDepartment /> {summary.avgRunCalories.toFixed()} kcal
            </Average>
          </Row>
        </RecapUnit>
        <RecapUnit bc="#ffa726">
          <SumText color="#ffa726">{summary.cycles}</SumText>
          <DirectionsBike color="warning" className="icon" />
          <Title className="title">
            <DirectionsBike /> Session Averages ({summary.cycles})
            <Highlight color="#ffa726" />
          </Title>
          <Row>
            <Average>
              <AccessAlarm /> {Math.floor(summary.avgCycleTime)}h{" "}
              {Math.floor((summary.avgCycleTime % 1) * 60)}m
            </Average>
            <Average>
              <Straighten /> {summary.avgCycleDist.toFixed(2)} km
            </Average>
          </Row>
          <Row>
            <Average>
              <Speed /> {summary.avgCycleSpeed.toFixed(2)} km/h
            </Average>
            <Average>
              <LocalFireDepartment /> {summary.avgCycleCalories.toFixed()} kcal
            </Average>
          </Row>
        </RecapUnit>
      </Recaps>
      <DayGroup>
        {days.length > 0 && <>
          <DayDay>Mon</DayDay>
          <DayDay>Tue</DayDay>
          <DayDay>Wed</DayDay>
          <DayDay>Thu</DayDay>
          <DayDay>Fri</DayDay>
          <DayDay>Sat</DayDay>
          <DayDay>Sun</DayDay>
        </>}
        {days.map((day, i) => {
          if (day.date === null) return <NullDay key={"nullday" + i} />;
          return (
            <Day
              key={day.date.toISOString()}
              bc={getBorderColor(day.activities)}
            >
              {day.activities.some((a) => a.type === "Run") && (
                <DirectionsRun color="error" />
              )}
              {day.activities.some((a) => a.type === "Gym") && (
                <FitnessCenter color="info" />
              )}
              {day.activities.some((a) => a.type === "Cycle") && (
                <DirectionsBike color="warning" />
              )}
              {day.activities.some((a) => a.type === "Walk") && (
                <DirectionsWalk color="success" />
              )}
              {day.activities.some((a) => a.type === "Other") && (
                <FitnessCenter color="secondary" />
              )}
            </Day>
          );
        })}
      </DayGroup>
    </Wrapper>
  );
}

const SumText = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 12px;
  font-weight: 700;
  color: ${(props) => props.color};
  display: none;

  @media (max-width: 700px) {
    display: flex;
  }
`;

const Recaps = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 700px) {
    gap: 8px;
  }
`;

const DayGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 896px;
  width: 100%;
  gap: 8px;
`;

const Day = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #080808;
  position: relative;
  width: calc(14.2857% - 10.9px);
  height: 40px;
  & > * {
    position: absolute;
    inset: auto;
    width: 24px;
    height: 24px;
  }
  & > *:not(:first-child) {
    width: 12px;
    height: 12px;
  }
  & > *:nth-child(2) {
    top: 0;
    right: 0;
  }
  & > *:nth-child(3) {
    bottom: 0;
    right: 0;
  }
  & > *:nth-child(4) {
    bottom: 0;
    left: 0;
  }
  border-radius: 4px;
  border: 2px solid #1c1c1c;
  border-color: ${(props) => props.bc || "#1c1c1c"};
`;

const NullDay = styled(Day)`
  border: 2px solid transparent;
  background: transparent;
`;

const DayDay = styled(Day)`
  border: 2px solid #4a4a4a;
`;

const Title = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  gap: 8px;
  padding-bottom: 8px;
`;

const Row = styled.div`
  display: flex;
  gap: 32px;
  flex: 1;
  justify-content: space-between;
`;

const Highlight = styled.div`
  position: absolute;
  inset: auto 0 0 0;
  height: 4px;
  border-radius: 2px;
  background-color: ${(props) => props.color};
`;

const RecapUnit = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  flex-wrap: wrap;
  border-radius: 4px;
  background-color: #080808;
  padding: 16px;
  gap: 16px;
  border: 2px solid #1c1c1c;

  & .icon {
    position: absolute;
    height: 84px;
    width: 84px;
    opacity: 0.16;
    inset: 0px 0px auto auto;
    display: none;
  }

  @media (max-width: 700px) {
    border-color: ${(props) => props.bc};
    gap: 4px;
    padding: 8px;
    & .title {
      display: none;
    }

    & .icon {
      display: flex;
    }
  }
`;

const Average = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  height: 40px;
  width: 128px;

  @media (max-width: 700px) {
    height: 32px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 16px;
  flex: 1;
  overflow: auto;
  & .MuiInputBase-root {
    width: 256px;
  }

  @media (max-width: 700px) {
    padding: 8px;
    gap: 8px;
  }
`;

export default Recap;
