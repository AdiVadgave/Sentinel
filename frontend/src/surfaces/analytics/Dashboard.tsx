import { useNavigate } from "react-router-dom";
import { Card, SectionHeader } from "../../components/ui/ui";
import {
  StatCard,
  TrendLine,
  CategoryBar,
  Donut,
  StackedAgentArea,
  Heatmap,
} from "../../components/charts/Charts";
import { kpis, hazardTypes, patternMatrix, areas } from "../../mock/seed";
import { useStore } from "../../store/store";

export function Dashboard() {
  const navigate = useNavigate();
  const actions = useStore((s) => s.actions);
  const donut = [
    { name: "Submitted", value: actions.filter((a) => a.status === "Submitted").length },
    { name: "Under Review", value: actions.filter((a) => a.status === "Under Review").length },
    { name: "Approved", value: actions.filter((a) => a.status === "Approved").length },
    { name: "Closed", value: actions.filter((a) => a.status === "Closed").length },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <SectionHeader title="Safety Intelligence" subtitle="Turning your data into proactive insight · month to date" />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        <StatCard label="Incidents MTD" value={kpis.incidentsMTD.value} delta={kpis.incidentsMTD.delta} deltaGood />
        <StatCard label="Near-miss ratio" value={kpis.nearMissRatio.value} delta={kpis.nearMissRatio.delta} deltaGood />
        <StatCard label="Overdue actions" value={kpis.overdueActions.value} delta={kpis.overdueActions.delta} />
        <StatCard label="SOP currency" value={kpis.sopCurrency.value} suffix="%" delta={kpis.sopCurrency.delta} deltaGood />
        <StatCard label="Point-of-work queries" value={kpis.powQueriesToday.value} delta={kpis.powQueriesToday.delta} deltaGood />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-4">
          <h3 className="font-bold text-navy-900 mb-1">Recurring-pattern heatmap</h3>
          <p className="text-xs text-slate-500 mb-3">Area × hazard · click the hot cell to drill in</p>
          <Heatmap
            rows={areas}
            cols={hazardTypes}
            matrix={patternMatrix}
            onCell={(row, idx) => {
              if (row === "Gamsberg Concentrator" && idx === 0) navigate("/analytics/patterns");
            }}
          />
        </Card>

        <Card className="p-4">
          <h3 className="font-bold text-navy-900 mb-3">Incident & near-miss trend (12 mo)</h3>
          <TrendLine data={kpis.incidentTrend} />
        </Card>

        <Card className="p-4">
          <h3 className="font-bold text-navy-900 mb-3">Incidents by category</h3>
          <CategoryBar data={kpis.byCategory} />
        </Card>

        <Card className="p-4">
          <h3 className="font-bold text-navy-900 mb-3">Corrective-action status</h3>
          <Donut data={donut} />
        </Card>

        <Card className="p-4 lg:col-span-2">
          <h3 className="font-bold text-navy-900 mb-3">Agent activity (queries handled per agent)</h3>
          <StackedAgentArea data={kpis.agentActivity} />
        </Card>
      </div>
    </div>
  );
}
