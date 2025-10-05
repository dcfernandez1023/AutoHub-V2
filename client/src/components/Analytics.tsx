import { Col, Row, Spinner } from 'react-bootstrap';
import useAnalytics from '../hooks/useAnalytics';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useCallback, useMemo } from 'react';
import { safeNum } from '../utils/num';
import { data } from 'react-router-dom';

type AnalyticsProps = {
  vehicleId: string;
};

type CostData = {
  name: string;
  value: number;
  color: string;
};

type ScheduledUsageData = {
  serviceName: string;
  count: number;
};

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  value,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`$${value.toLocaleString('en-US')}`}
    </text>
  );
};

const Analytics: React.FC<AnalyticsProps> = (props: AnalyticsProps) => {
  const {
    loadingCost,
    loadingScheduledLogUsage,
    vehicleCosts,
    scheduledLogUsage,
  } = useAnalytics(props);

  const costsData = useMemo<CostData[]>(() => {
    return [
      {
        name: 'Scheduled Service Cost',
        value:
          safeNum(vehicleCosts?.scheduledLogCosts?.laborCost) +
          safeNum(vehicleCosts?.scheduledLogCosts?.partsCost) +
          safeNum(vehicleCosts?.scheduledLogCosts?.totalCost),
        color: '#FFBB28',
      },
      {
        name: 'Repair Service Cost',
        value:
          safeNum(vehicleCosts?.repairLogCosts?.laborCost) +
          safeNum(vehicleCosts?.repairLogCosts?.partsCost) +
          safeNum(vehicleCosts?.repairLogCosts?.totalCost),
        color: '#0088FE',
      },
    ];
  }, [vehicleCosts]);

  const scheduledUsageData = useMemo<ScheduledUsageData[]>(() => {
    return scheduledLogUsage.map((d) => {
      return {
        serviceName: d.name,
        count: d.count,
      };
    });
  }, [scheduledLogUsage]);

  return (
    <Row className="gy-5">
      <Col md={6}>
        {loadingCost ? (
          <Spinner animation="border" />
        ) : (
          <div style={{ width: '100%', height: 300 }}>
            <h5>Scheduled Service Cost vs. Repair Service Cost</h5>
            <ResponsiveContainer>
              <PieChart width={650} height={500}>
                <Pie
                  data={costsData}
                  dataKey="value"
                  nameKey="name"
                  isAnimationActive={false}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {costsData.map((d) => {
                    return <Cell key={`cell-${d.name}`} fill={d.color} />;
                  })}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </Col>
      <Col md={6}>
        {loadingScheduledLogUsage ? (
          <Spinner animation="border" />
        ) : (
          <div style={{ width: '100%', height: 400 }}>
            <h5>Scheduled Service Usage</h5>
            <ResponsiveContainer>
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={scheduledUsageData}
                width={650}
                height={500}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="serviceName" />
                <PolarRadiusAxis />
                <Radar
                  name="Count"
                  dataKey="count"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default Analytics;
