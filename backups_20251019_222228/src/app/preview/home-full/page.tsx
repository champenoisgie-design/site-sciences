import { Suspense } from "react";
import Home from "../../page";
import PreviewWrapperClient from "./PreviewWrapperClient";
import PreviewHeader from "./PreviewHeader";

export default function HomeFullPreviewPage() {
  return (
    <PreviewWrapperClient>
      {/* Bandeau spécifique à la PREVIEW */}
      <PreviewHeader />
      <Suspense>
        <Home />
      </Suspense>
    </PreviewWrapperClient>
  );
}
