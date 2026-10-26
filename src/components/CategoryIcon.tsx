import {
  Award,
  Briefcase,
  Building2,
  Car,
  ChefHat,
  Drama,
  HandHeart,
  HeartPulse,
  Landmark,
  Languages,
  Leaf,
  Monitor,
  Rocket,
  School,
  Shapes,
  Sparkles,
  Tractor,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "@/lib/types";

const ICONS: Record<CategoryId, LucideIcon> = {
  dzialalnosc: Rocket,
  praca: Briefcase,
  kompetencje: Award,
  firmy: Building2,
  jezyki: Languages,
  it: Monitor,
  transport: Car,
  technika: Wrench,
  uroda: Sparkles,
  zdrowie: HeartPulse,
  gastronomia: ChefHat,
  edukacja: School,
  spoleczne: HandHeart,
  ekologia: Leaf,
  kultura: Drama,
  samorzad: Landmark,
  rolnictwo: Tractor,
  inne: Shapes,
};

export default function CategoryIcon({ id, className }: { id: CategoryId; className?: string }) {
  const Icon = ICONS[id];
  return <Icon className={className} aria-hidden="true" />;
}
