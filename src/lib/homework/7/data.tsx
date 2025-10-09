import type { ReactNode } from "react";

export interface HomeworkCard {
  title: string;
  contentBasic: ReactNode;
  contentAdvanced: ReactNode;
}

export const HWData: HomeworkCard = {
  title: "Todo Lists",
  contentBasic: (
    <>
      <ul>
        <li>add todo item (store in redux states)</li>
        <li>filter with all / active / completed</li>
      </ul>
    </>
  ),
  contentAdvanced: (
    <>
      <ul>
        <li>decorates UI with Scss/Sass</li>
      </ul>
    </>
  ),
};
