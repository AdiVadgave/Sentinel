import { Activity, Lightbulb, Share2, CheckCircle2 } from "lucide-react";
import { useStore } from "../../store/store";
import { Card, SectionHeader, Chip, Button } from "../../components/ui/ui";
import { patterns } from "../../mock/seed";

export function Patterns() {
  const lessons = useStore((s) => s.lessons);
  const publishLesson = useStore((s) => s.publishLesson);
  const pushToast = useStore((s) => s.pushToast);
  const p = patterns[0];
  const lesson = lessons[0];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <SectionHeader title="Recurring Patterns & Lessons Learned" subtitle="Systemic learning from incidents + near-misses" />

      <Card className="p-5 border-l-4 border-l-safety-red mb-5">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-safety-red"><Activity size={20} /></span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-navy-900">{p.title}</h3>
              <Chip tone="red">{p.count} events / {p.window}</Chip>
            </div>
            <p className="mt-1 text-sm text-navy-800">
              Common factor: <strong>{p.commonFactor}</strong>
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.related.map((r) => <Chip key={r} tone="slate">{r}</Chip>)}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="text-safety-amber" />
          <h3 className="font-bold text-navy-900">AI-generated lesson learned</h3>
          {lesson.published && <Chip tone="green"><CheckCircle2 size={12} /> Published to KB</Chip>}
        </div>
        <p className="font-semibold text-navy-900">{lesson.title}</p>
        <p className="mt-1 text-sm text-navy-800 leading-relaxed">{lesson.summary}</p>
        <div className="mt-3 rounded-lg bg-green-50 border border-green-100 p-3 text-sm text-green-800">
          <strong>Recommended control:</strong> {lesson.control}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {lesson.standards.map((s) => <Chip key={s} tone="blue">{s}</Chip>)}
        </div>
        <div className="mt-4">
          <Button
            variant={lesson.published ? "secondary" : "primary"}
            disabled={lesson.published}
            onClick={() => {
              publishLesson(lesson.id);
              pushToast({ title: "Lesson published to Knowledge Base", detail: "Shared to all HSE users", variant: "success" });
            }}
          >
            <Share2 size={15} /> {lesson.published ? "Published" : "Publish to Knowledge Base"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
