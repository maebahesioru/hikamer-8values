import type { Metadata } from "next";
import QuizFlow from "@/components/QuizFlow";

export const metadata: Metadata = {
  title: "診断中｜ヒカマーズ8values",
  description: "全70問の質問に答えて、あなたのヒカマニ思想を診断します。",
};

export default function QuizPage() {
  return <QuizFlow />;
}
