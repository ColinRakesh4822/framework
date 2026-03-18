import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { useTheme } from "@material-ui/core/styles";
import moment from "moment";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: "20px 10px 20px 20px",
  },
}));

export default ({ current, history }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [pHistory, setPHistory] = useState({});

  useEffect(() => {
    const now = moment().unix();
    let entries = history.map((h) => {
      return { ...h, name: moment.unix(h.time).format("HH:mm") };
    });

    entries.push({
      time: now,
      count: current,
      name: "Now",
    });

    setPHistory(entries);
  }, [history, current]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={pHistory}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.2} />
            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          tick={{ fill: theme.palette.text.alt, fontSize: 11, fontFamily: "'Outfit', sans-serif" }}
          axisLine={{ stroke: theme.palette.border.main }}
          tickLine={{ stroke: theme.palette.border.main }}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: theme.palette.text.alt, fontSize: 11, fontFamily: "'Outfit', sans-serif" }}
          axisLine={{ stroke: theme.palette.border.main }}
          tickLine={{ stroke: theme.palette.border.main }}
        />
        <Tooltip
          contentStyle={{
            background: theme.palette.secondary.main,
            border: `1px solid ${theme.palette.border.main}`,
            borderRadius: 8,
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
          }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          fill="url(#chartGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

