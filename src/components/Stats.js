import React from "react";
import styled from "styled-components";
import { collection, getDocs } from "firebase/firestore";
import Options from "./Options";
import DayDialog from "./DayDialog";
import DayGroups from "./Days/DayGroups";

export const getDaysInYear = (year) => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);
  const days = [];
  while (startDate < endDate) {
    days.push(new Date(startDate));
    startDate.setDate(startDate.getDate() + 1);
  }
  return days;
};

export const getDaysInYearTillToday = (year) => {
  return getDaysInYear(year).filter((day) => day < new Date());
};

function Stats({ db, user, year }) {
  const [range, setRange] = React.useState("year");
  const [size, setSize] = React.useState("m");
  const [selectedDate, setSelectedDate] = React.useState();
  const [activities, setActivities] = React.useState([]);
  const [userCollection] = React.useState("user-" + user);
  const [heatmap, setHeatmap] = React.useState("");
  const dbRef = collection(db, userCollection);

  React.useEffect(() => {
    getDocs(dbRef).then((res) => {
      const data = {};
      res.docs.forEach((doc) => (data[doc.id] = doc.data()));
      setActivities(data.activities.list);
    });
  }, []);

  const daysInYear = React.useMemo(() => getDaysInYear(year), [year]);

  const handleRangeChange = (e, value) => {
    setRange(value);
  };

  const handleSizeChange = (e, value) => {
    setSize(value);
  };

  return (
    <Wrapper>
      <Options
        range={range}
        heatmap={heatmap}
        size={size}
        handleRangeChange={handleRangeChange}
        handleSizeChange={handleSizeChange}
        setHeatmap={setHeatmap}
      />
      <Scrollable>
        <DayGroups
          days={daysInYear}
          year={year}
          activities={activities}
          range={range}
          size={size}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          heatmap={heatmap}
        />
      </Scrollable>
      <DayDialog
        db={db}
        dbRef={dbRef}
        activities={activities}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setActivities={setActivities}
        userCollection={userCollection}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  gap: 16px;
  flex-direction: column;
  width: calc(min(80%, 800px));
`;

const Scrollable = styled.div`
  padding: 16px;
  padding-top: 0px;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: auto;
`;

export default Stats;
