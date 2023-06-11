import { render, screen } from "@testing-library/react";
import React, { Fragment } from "react";
import { ellipsisText } from "@pages/popup/Ellipsis";

describe("EllipsisTest", () => {
  test("render text", () => {
    const text1 = "Contrary to popular belief, Lorem";
    const text2 =
      "Contrary to popular belief, Lorem Ipsum is not simply random";
    const a = [];
    for (let max = 1; max <= 10; max++) {
      const newText = ellipsisText(text1.substring(0, max), 10, 10);
      a.push(newText + "  #" + max + "#" + newText.length);
    }
    for (let max = 1; max <= 70; max++) {
      const newText = ellipsisText(text2, max, 10);
      a.push(newText + "  #" + max + "#" + newText.length);
    }
    console.log(a);
    // then
    //screen.getByText("Contrary");
  });
});
