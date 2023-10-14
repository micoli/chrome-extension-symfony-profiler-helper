import { RequestLog } from "@pages/shared";
import * as htmlparser2 from "htmlparser2";
import type { AnyNode, Document } from "domhandler";
import * as CSSselect from "css-select";
import { profilerMetrics } from "@pages/shared/Profiler";
import { default as render } from "dom-serializer";

const renderText = (node: AnyNode | Element | Document): string => {
  return render(node as AnyNode).replace(/<.*?>/g, "");
};

const getMetadataByMetrics = (
  dom: Document
): { label: string; value: string }[] => {
  return CSSselect.selectAll(".metrics .metric", dom)
    .map((metric) => {
      try {
        return {
          label: renderText(CSSselect.selectOne(".label", metric)),
          value: renderText(CSSselect.selectOne(".value", metric)),
        };
      } catch (error) {
        console.log(error);
        return null;
      }
    })
    .filter((x) => x);
};
const getMetadataByTabs = (
  dom: Document
): { label: string; value: string }[] => {
  return CSSselect.selectAll(".sf-tabs .tab-title", dom)
    .map((tab) => {
      try {
        return {
          label: renderText(tab.children[0]),
          value: renderText(tab.children[1]),
        };
      } catch (error) {
        console.log(error);
        return null;
      }
    })
    .filter((x) => x);
};

const extractMetrics = async (metricTab: string, requestLog: RequestLog) => {
  if (!requestLog.xDebugData) {
    return;
  }
  const [metricExtractor, maximumItem] = profilerMetrics
    .filter(([value]) => value === metricTab)
    .map(([, , metricType, max]) => [metricType, max])
    .at(0);
  try {
    const profilerUrl = `${requestLog.xDebugData.link}?panel=${metricTab}`;
    const page = await fetch(profilerUrl);
    const content = await page.text();
    const dom = htmlparser2.parseDocument(content);
    if (metricExtractor === "metrics") {
      requestLog.xDebugData.metadata = getMetadataByMetrics(dom).splice(
        0,
        (maximumItem as number | null) ?? 100
      );
    }
    if (metricExtractor === "tabs") {
      requestLog.xDebugData.metadata = getMetadataByTabs(dom).splice(
        0,
        (maximumItem as number | null) ?? 100
      );
    }
  } catch (error) {
    console.log(error);
    requestLog.xDebugData.metadata = [];
  }
};
export { extractMetrics };
